async function newUser(event) {
	event.preventDefault();

	//confirmacion de contraseña
	const pass = document.getElementById('password').value;
	const confirmPass = document.getElementById('confirm_password').value;

	if (pass === '' || pass !== confirmPass) {
		event.preventDefault();
		alert('Por favor, asegúrate de que las contraseñas coinciden antes de continuar.');

		return;
	}

	//seguimos
	const formData = new FormData(event.target);
	const response = await fetch(`/user/new`, {
		method: 'POST',
		body: new URLSearchParams(formData),
	});

	if (response.ok) {
		const accept = confirm(
			'¡El usuario ha sido creado con exito! ¿Quieres seguir creando usuarios?',
		);
		if (accept) {
			document.getElementById('newUser').reset();
		} else {
			window.location = `/users`;
		}
	} else {
		alert('Ha ocurrido un error.');
	}
}
