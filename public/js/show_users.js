async function loadMore(type) {
	const section = document.querySelector(type === 'teacher' ? '.teachers' : '.students');
	const button = document.getElementById(type === 'teacher' ? 'more-teachers' : 'more-students');

	// El offset es cuántas tarjetas hay ya en pantalla (así no hace falta repetir el tamaño de página)
	const offset = section.querySelectorAll(`.${type}`).length;

	const response = await fetch(`/users/list/${type}?offset=${offset}`);
	const data = await response.json();

	for (const user of data.users) {
		const card = document.createElement('div');
		card.className = type;
		card.dataset.id = user.id;
		card.innerHTML = `
			<p><b>Id: </b>${user.id}</p>
			<p><b>Nombre: </b>${user.name}</p>
			<p><b>Email:</b> ${user.email}</p>
			<p><button onclick="deleteUser('${user.id}')">Eliminar</button></p>
			<p><button onclick="editUser('${user.id}')">Editar</button></p>
		`;
		section.insertBefore(card, button);
	}

	if (!data.hasMore) {
		button.remove();
	}
}

async function deleteUser(userId) {
	const accept = confirm('¿Estás seguro de que quieres eliminar este usuario?');
	if (!accept) {
		return;
	}
	const response = await fetch(`/users/${userId}/delete`);
	const result = await response.json();

	if (result.valid) {
		alert(result.message);
		window.location = '/users';
	} else {
		alert(`Error: ${result.message}`);
	}
}

async function editUser(userId) {
	const response = await fetch(`/users/${userId}`);
	const user = await response.json();

	const card = document.querySelector(`[data-id="${userId}"]`);
	card.innerHTML = `
		<p><b>Id:</b> ${user.id}</p>
		<p><label><b>Nombre:</b> <input type="text" id="edit-name-${userId}" value="${user.name}"></label></p>
		<p><label><b>Email:</b> <input type="email" id="edit-email-${userId}" value="${user.email}"></label></p>
		<span id="email-message-${userId}" style="font-size: 0.85rem; font-weight: 500; display: block; margin-top: 5px;"></span>
		<p>
			<button onclick="saveUser('${userId}')">Guardar</button>
			<button onclick="window.location.reload()">Cancelar</button>
		</p>
	`;

	// Inicializar validación de email en vivo (pasar el email original)
	setupEmailValidation(`edit-email-${userId}`, `email-message-${userId}`, user.email);
}

async function saveUser(userId) {
	const name = document.getElementById(`edit-name-${userId}`).value;
	const email = document.getElementById(`edit-email-${userId}`).value;

	const response = await fetch(`/users/${userId}/edit`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ name, email })
	});
	const result = await response.json();

	if (result.valid) {
		window.location.reload();
	} else {
		alert(`Error: ${result.message}`);
	}
}
