import {
	Toast,
	ToastClose,
	ToastDescription,
	ToastProvider,
	ToastTitle,
	ToastViewport,
} from '@/components/ui/toast';
import React from 'react';

export function Toaster() {
	// 🛡️ Système de toast sécurisé - pas de toasts React pour éviter les erreurs
	// Le système utilise window.safeGlobalToast pour les notifications
	
	return (
		<ToastProvider>
			<ToastViewport />
		</ToastProvider>
	);
}
