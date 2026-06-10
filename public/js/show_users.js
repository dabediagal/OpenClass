async function deleteUser(userId) {
	const accept = confirm('¿Estás seguro de que quieres eliminar este usuario?');
	if (!accept) {
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
