async function changePassword(event) {
	event.preventDefault();

	const formData = new FormData(event.target);
	if (formData.get('newPassword') !== formData.get('confirm_password')) return;
	const response = await fetch(`/profile/password`, {
		method: 'POST',
		body: new URLSearchParams(formData)
	});

	const result = await response.json();

	if (result.valid) {
		alert('¡La contraseña ha sido cambiada con éxito!');
		document.getElementById('change_password').reset();
		messageSpan.textContent = '';
	} else {
		alert(`Error: ${result.message}`);
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const passwordInput = document.getElementById('password');
	const confirmPasswordInput = document.getElementById('confirm_password');
	const messageSpan = document.getElementById('password-message');

	function validarContrasenas() {
		const pass = passwordInput.value;
		const confirmPass = confirmPasswordInput.value;

		if (pass === '' || confirmPass === '') {
			messageSpan.textContent = '';
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

	passwordInput.addEventListener('input', validarContrasenas);
	confirmPasswordInput.addEventListener('input', validarContrasenas);
});
