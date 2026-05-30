import { createHmac } from 'node:crypto';
import { env } from '$env/dynamic/private';

const SECRET = env.COOKIE_SECRET || 'devpath-os-dev-secret-change-in-production';

export function signUserId(userId: string): string {
	const sig = createHmac('sha256', SECRET).update(userId).digest('hex').slice(0, 16);
	return `${userId}.${sig}`;
}

export function verifyUserId(signed: string): string | null {
	const dotIdx = signed.lastIndexOf('.');
	if (dotIdx === -1) return null;
	const userId = signed.slice(0, dotIdx);
	const sig = signed.slice(dotIdx + 1);
	const expected = createHmac('sha256', SECRET).update(userId).digest('hex').slice(0, 16);
	if (sig !== expected) return null;
	return userId;
}
