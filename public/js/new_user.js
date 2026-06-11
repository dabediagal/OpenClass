let clearPasswordMessage = null;

async function newUser(event) {
	event.preventDefault();

	//confirmacion de contraseña
	const pass = document.getElementById('password').value;
	const confirmPass = document.getElementById('confirm_password').value;
	const email = document.getElementById('email').value;

	if (pass === '' || pass !== confirmPass) {
		event.preventDefault();
		alert('Por favor, asegúrate de que las contraseñas coinciden antes de continuar.');

		return;
	}

	if (email === '') {
		event.preventDefault();
		alert('Por favor, asegúrate de poner un email antes de continuar.');

		return;
	}

	// Verificar si el email ya existe
	try {
		const response = await fetch(`/user/check-email/${encodeURIComponent(email)}`);
		const data = await response.json();

		if (data.exists) {
			alert('El email ya está registrado. Por favor, usa otro email.');
			return;
		}
	} catch (error) {
		console.error('Error checking email:', error);
		alert('Error al verificar el email. Intenta de nuevo.');
		return;
	}

	//seguimos
	const formData = new FormData(event.target);
	const createResponse = await fetch(`/user/new`, {
		method: 'POST',
		body: new URLSearchParams(formData)
	});

	if (createResponse.ok) {
		const result = await createResponse.json();
		if (result.valid) {
			const accept = confirm(
				'¡El usuario ha sido creado con exito! ¿Quieres seguir creando usuarios?'
			);
			if (accept) {
				document.getElementById('newUser').reset();
				clearPasswordMessage?.();
			} else {
				window.location = `/users`;
			}
		} else {
			alert(result.message || 'Error al crear el usuario.');
		}
	} else {
		alert('Ha ocurrido un error.');
	}
}

document.addEventListener('DOMContentLoaded', () => {
	clearPasswordMessage = setupPasswordMatchValidation(
		'password',
		'confirm_password',
		'password-message'
	)?.clearPasswordMessage;
});

document.addEventListener('DOMContentLoaded', () => {
	clearEmailMessage = setupEmailValidation('email', 'email-message')?.clearEmailMessage;
});
