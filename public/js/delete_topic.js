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
