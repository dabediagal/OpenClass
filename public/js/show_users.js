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

async function editUser(userId) {
	const response = await fetch(`/user/${userId}/edit`);
	const user = await response.json();

	const card = document.querySelector(`[data-id="${userId}"]`);
	card.innerHTML = `
		<p><b>Id:</b> ${user.id}</p>
		<p><label><b>Nombre:</b> <input type="text" id="edit-name-${userId}" value="${user.name}"></label></p>
		<p><label><b>Email:</b> <input type="email" id="edit-email-${userId}" value="${user.email}"></label></p>
		<span id="email-message" style="font-size: 0.85rem; font-weight: 500; display: block; margin-top: 5px;"></span>
		<p>
			<button onclick="saveUser('${userId}')">Guardar</button>
			<button onclick="window.location.reload()">Cancelar</button>
		</p>
	`;
}

async function saveUser(userId) {
	const name = document.getElementById(`edit-name-${userId}`).value;
	const email = document.getElementById(`edit-email-${userId}`).value;

	const response = await fetch(`/user/${userId}/edit`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ name, email }),
	});
	const result = await response.json();

	if (result.valid) {
		window.location.reload();
	} else {
		alert(`Error: ${result.message}`);
	}
}
