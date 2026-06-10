async function deleteSubject(subjectId) {
	const accept= confirm('¿Estás seguro de que quieres eliminar esta asignatura?');
	if (!accept) {
		return;
	}
	const response = await fetch(`/subject/${subjectId}/delete`);
	const result = await response.json();

	if (result.valid) {
		alert(result.message);
		window.location = '/'; //al index pq no hay ventana d subjects como tal 
	} else {
		alert(`Error: ${result.message}`);
	}
}