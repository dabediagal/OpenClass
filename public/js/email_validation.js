function setupEmailValidation(email, messageId, originalEmail) {
	const emailInput = document.getElementById(email);
	const messageSpan = document.getElementById(messageId);

	if (!emailInput || !messageSpan) return null;

	async function updateMessage() {
		const newEmail = emailInput.value;

		if (newEmail === '') {
			messageSpan.textContent = '';
			messageSpan.style.color = '';
			return;
		}

		// Si el email nuevo es igual al original, no mostrar error
		if (originalEmail && newEmail.toLowerCase() === originalEmail.toLowerCase()) {
			messageSpan.textContent = '';
			messageSpan.style.color = '';
			return;
		}

		try {
			const response = await fetch(`/users/check-email/${encodeURIComponent(newEmail)}`);
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
