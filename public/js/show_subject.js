async function deleteTopic(topicId) {
	const accept = confirm('¿Estás seguro de que quieres eliminar este tema?');
	if (!accept) return;

	const response = await fetch(`/subject/${SUBJECT_ID}/topic/${topicId}/delete`);
	const result = await response.json();

	if (result.valid) {
		alert(result.message);
		window.location = `/subject/${SUBJECT_ID}`;
	} else {
		alert(`Error: ${result.message}`);
	}
}

async function newTopic(event) {
	event.preventDefault();

	const formData = new FormData(event.target);
	const response = await fetch(`/subject/${SUBJECT_ID}/topic/new`, {
		method: 'POST',
		body: formData,
	});

	const result = await response.json();

	if (result.valid) {
		alert('¡El tema ha sido creado con éxito!');
		window.location.reload();
	} else {
		alert(`Error: ${result.message}`);
	}
}

async function linkUser(event) {
	event.preventDefault();

	const formData = new FormData(event.target);
	const response = await fetch(`/subject/${SUBJECT_ID}/linkUser`, {
		method: 'POST',
		body: new URLSearchParams(formData),
	});

	const result = await response.json();

	if (result.valid) {
		window.location.reload();
	} else {
		alert(`Error: ${result.message}`);
	}
}
