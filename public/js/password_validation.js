function setupPasswordMatchValidation(passwordId, confirmPasswordId, messageId) {
	const passwordInput = document.getElementById(passwordId);
	const confirmPasswordInput = document.getElementById(confirmPasswordId);
	const messageSpan = document.getElementById(messageId);

	if (!passwordInput || !confirmPasswordInput || !messageSpan) return null;

	function updateMessage() {
		const pass = passwordInput.value;
		const confirmPass = confirmPasswordInput.value;

		if (pass === '' || confirmPass === '') {
			messageSpan.textContent = '';
			messageSpan.style.color = '';
			return;
		}

		if (pass === confirmPass) {
			messageSpan.textContent = '✓ Las contraseñas coinciden';
			messageSpan.style.color = '#10b981';
		} else {
			messageSpan.textContent = '✗ Las contraseñas no coinciden';
			messageSpan.style.color = '#ef4444';
		}
	}

	passwordInput.addEventListener('input', updateMessage);
	confirmPasswordInput.addEventListener('input', updateMessage);

	return {
		clearPasswordMessage() {
			messageSpan.textContent = '';
			messageSpan.style.color = '';
		}
	};
}
