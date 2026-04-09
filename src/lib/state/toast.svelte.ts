type ToastType = 'success' | 'error' | 'info';

interface Toast {
	id: string;
	message: string;
	type: ToastType;
}

class ToastState {
	toasts = $state<Toast[]>([]);

	show(message: string, type: ToastType = 'info') {
		const id = crypto.randomUUID();
		this.toasts = [...this.toasts, { id, message, type }];
		setTimeout(() => this.dismiss(id), 4000);
	}

	success(message: string) { this.show(message, 'success'); }
	error(message: string) { this.show(message, 'error'); }
	info(message: string) { this.show(message, 'info'); }

	dismiss(id: string) {
		this.toasts = this.toasts.filter(t => t.id !== id);
	}
}

export const toastState = new ToastState();
