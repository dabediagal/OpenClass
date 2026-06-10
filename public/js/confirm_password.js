const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm_password');
const messageSpan = document.getElementById('password-message');

function validarContrasenas() {
	const pass = passwordInput.value;
	const confirmPass = confirmPasswordInput.value;

	// Si algún campo está vacío, no mostramos nada
	if (pass === '' || confirmPass === '') {
		messageSpan.textContent = '';
		return;
	}

	// Comprobamos si coinciden
	if (pass === confirmPass) {
		messageSpan.textContent = '✓ Las contraseñas coinciden';
		messageSpan.style.color = '#10b981'; // Verde bonito
	} else {
		messageSpan.textContent = '✗ Las contraseñas no coinciden';
		messageSpan.style.color = '#ef4444'; // El mismo rojo de tus botones
	}
}

// Escuchamos el evento cuando el usuario escribe en cualquiera de los dos inputs
passwordInput.addEventListener('input', validarContrasenas);
confirmPasswordInput.addEventListener('input', validarContrasenas);
