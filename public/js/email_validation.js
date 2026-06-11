function setupEmailValidation(email, messageId) {
    const emailInput = document.getElementById(email);
    const messageSpan = document.getElementById(messageId);

	if (!emailInput || !messageSpan) return null;

	async function updateMessage() {
		const email = emailInput.value;

		if (email === '') {
			messageSpan.textContent = '';
			messageSpan.style.color = '';
			return;
		}

		try {
			const response = await fetch(`/user/check-email/${encodeURIComponent(email)}`);
			const data = await response.json();

			if (!data.exists) {
				messageSpan.textContent = '✓ Email disponible';
				messageSpan.style.color = '#10b981';
			} else {
				messageSpan.textContent = '✗ Email no disponible';
				messageSpan.style.color = '#ef4444';
			}
		} catch (error) {
			console.error('Error checking email:', error);
			messageSpan.textContent = 'Error al verificar el email';
			messageSpan.style.color = '#ef4444';
		}
	}

	emailInput.addEventListener('input', updateMessage);

	return {
		clearEmailMessage() {
			messageSpan.textContent = '';
			messageSpan.style.color = '';
		}
	};
}
