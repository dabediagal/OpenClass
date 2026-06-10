let clearPasswordMessage = null;

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
		clearPasswordMessage?.();
	} else {
		alert(`Error: ${result.message}`);
	}
}

document.addEventListener('DOMContentLoaded', () => {
	clearPasswordMessage = setupPasswordMatchValidation(
		'password',
		'confirm_password',
		'password-message'
	)?.clearPasswordMessage;
});
