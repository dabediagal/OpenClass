async function deleteUser(userId) {
	const confirm = confirm('¿Estás seguro de que quieres eliminar este usuario?');
	if (!confirm) {
		return;
	}
	const response = await fetch(`/user/${userId}/delete`);
	const result = await response.json();

	if (result.valid) {
		alert(result.message);
		window.location = '/users';
	} else {
		alert(`Error: ${result.message}`);
	}
}
