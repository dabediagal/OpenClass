async function deleteTopic(topicId) {
	const accept = confirm('¿Estás seguro de que quieres eliminar este tema?');
	if (!accept) return;

	const response = await fetch(`/subjects/${SUBJECT_ID}/topic/${topicId}/delete`);
	const result = await response.json();

	if (result.valid) {
		alert(result.message);
		window.location = `/subjects/${SUBJECT_ID}`;
	} else {
		alert(`Error: ${result.message}`);
	}
}

async function newTopic(event) {
	event.preventDefault();

	const formData = new FormData(event.target);
	const response = await fetch(`/subjects/${SUBJECT_ID}/topic/new`, {
		method: 'POST',
		body: formData
	});

	const result = await response.json();

	if (result.valid) {
		alert('¡El tema ha sido creado con éxito!');
		window.location.reload();
	} else {
		alert(`Error: ${result.message}`);
	}
}

function toggleEditSubjectForm(cancel = false) {
	const form = document.getElementById('editSubjectForm');
	const button = document.getElementById('editSubjectButton');
	const header = document.getElementById('subjectHeader');
	if (!form || !button || !header) return;

	if (cancel) {
		form.style.display = 'none';
		button.style.display = 'inline-flex';
		header.style.display = 'block';
	} else {
		form.style.display = 'block';
		button.style.display = 'none';
		header.style.display = 'none';
	}
}

async function editSubject(event) {
	event.preventDefault();

	const formData = new FormData(event.target);
	const payload = {
		name: formData.get('name'),
		description: formData.get('description')
	};

	const response = await fetch(`/subjects/${SUBJECT_ID}/edit`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(payload)
	});

	const result = await response.json();
	if (result.valid) {
		alert('Asignatura actualizada correctamente');
		window.location.reload();
	} else {
		alert(`Error: ${result.message}`);
	}
}

async function editTopic(topicId) {
	const response = await fetch(`/subjects/${SUBJECT_ID}/topic/${topicId}`);
	const topic = await response.json();

	const li = document.querySelector(`[data-topic-id="${topicId}"]`);
	li.innerHTML = `
		<p><label><b>Título:</b> <input type="text" id="edit-title-${topicId}" value="${topic.title}" required></label></p>
		<p><label><b>Descripción:</b> <input type="text" id="edit-desc-${topicId}" value="${topic.descripcion || ''}"></label></p>
		<p><label><b>Orden:</b> <input type="number" id="edit-order-${topicId}" value="${topic.order}" min="1"></label></p>
		<p><label><b>PDF:</b> <input type="file" id="edit-pdf-${topicId}" accept="application/pdf"></label>
		${topic.attachment ? `<small>PDF actual: <a href="/uploads/${topic.attachment}" target="_blank">${topic.attachment}</a></small>` : ''}</p>
		<p>
			<button onclick="saveTopic('${topicId}')">Guardar</button>
			<button onclick="window.location.reload()">Cancelar</button>
		</p>
	`;
}

async function saveTopic(topicId) {
	const title = document.getElementById(`edit-title-${topicId}`).value;
	const descripcion = document.getElementById(`edit-desc-${topicId}`).value;
	const order = document.getElementById(`edit-order-${topicId}`).value;
	const pdfInput = document.getElementById(`edit-pdf-${topicId}`);

	const formData = new FormData();
	formData.append('title', title);
	formData.append('descripcion', descripcion);
	formData.append('order', order);
	if (pdfInput.files[0]) {
		formData.append('pdf', pdfInput.files[0]);
	}

	const response = await fetch(`/subjects/${SUBJECT_ID}/topic/${topicId}/edit`, {
		method: 'POST',
		body: formData,
	});
	const result = await response.json();

	if (result.valid) {
		window.location.reload();
	} else {
		alert(`Error: ${result.message}`);
	}
}

async function linkUser(event) {
	event.preventDefault();

	const formData = new FormData(event.target);
	const response = await fetch(`/subjects/${SUBJECT_ID}/linkUser`, {
		method: 'POST',
		body: new URLSearchParams(formData)
	});

	const result = await response.json();

	if (result.valid) {
		window.location.reload();
	} else {
		alert(`Error: ${result.message}`);
	}
}
