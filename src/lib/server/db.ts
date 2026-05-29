import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { env } from '$env/dynamic/private';

const DATA_DIR = env.DATA_DIR || join(process.cwd(), 'data');

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;

function dateReviver(_key: string, value: unknown): unknown {
	if (typeof value === 'string' && ISO_DATE_RE.test(value)) {
		return new Date(value);
	}
	return value;
}

// Simple mutex per file path
const locks = new Map<string, Promise<void>>();
function withLock(path: string, fn: () => Promise<void>): Promise<void> {
	const prev = locks.get(path) ?? Promise.resolve();
	const next = prev.then(fn, fn);
	locks.set(path, next);
	next.finally(() => { if (locks.get(path) === next) locks.delete(path); });
	return next;
}

export class JsonStore<T extends { id: string }> {
	private filePath: string;

	constructor(filename: string) {
		if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
			throw new Error('Invalid store filename');
		}
		this.filePath = join(DATA_DIR, filename);
	}

	private async ensureDir(): Promise<void> {
		await mkdir(DATA_DIR, { recursive: true });
	}

	private async readRaw(): Promise<T[]> {
		try {
			const content = await readFile(this.filePath, 'utf-8');
			return JSON.parse(content, dateReviver) as T[];
		} catch (err: unknown) {
			if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
				return [];
			}
			throw err;
		}
	}

	private async writeRaw(items: T[]): Promise<void> {
		await this.ensureDir();
		await writeFile(this.filePath, JSON.stringify(items, null, 2), 'utf-8');
	}

	async readAll(): Promise<T[]> {
		return this.readRaw();
	}

	async findById(id: string): Promise<T | undefined> {
		const items = await this.readRaw();
		return items.find((item) => item.id === id);
	}

	async findBy(predicate: (item: T) => boolean): Promise<T[]> {
		const items = await this.readRaw();
		return items.filter(predicate);
	}

	async findOneBy(predicate: (item: T) => boolean): Promise<T | undefined> {
		const items = await this.readRaw();
		return items.find(predicate);
	}

	async create(item: T): Promise<T> {
		await withLock(this.filePath, async () => {
			const items = await this.readRaw();
			items.push(item);
			await this.writeRaw(items);
		});
		return item;
	}

	async update(id: string, partial: Partial<T>): Promise<T | undefined> {
		let updated: T | undefined;
		await withLock(this.filePath, async () => {
			const items = await this.readRaw();
			const index = items.findIndex((item) => item.id === id);
			if (index === -1) return;
			items[index] = { ...items[index], ...partial };
			updated = items[index];
			await this.writeRaw(items);
		});
		return updated;
	}

	async upsert(item: T): Promise<T> {
		await withLock(this.filePath, async () => {
			const items = await this.readRaw();
			const index = items.findIndex((i) => i.id === item.id);
			if (index === -1) {
				items.push(item);
			} else {
				items[index] = item;
			}
			await this.writeRaw(items);
		});
		return item;
	}

	async delete(id: string): Promise<boolean> {
		let deleted = false;
		await withLock(this.filePath, async () => {
			const items = await this.readRaw();
			const filtered = items.filter((item) => item.id !== id);
			deleted = filtered.length < items.length;
			if (deleted) {
				await this.writeRaw(filtered);
			}
		});
		return deleted;
	}

	async count(): Promise<number> {
		const items = await this.readRaw();
		return items.length;
	}
}
