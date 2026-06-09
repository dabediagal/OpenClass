async function newTopic(event){
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