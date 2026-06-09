async function newTopic(event){
    event.preventDefault();

    const formData = new FormData(event.target);
    const response = await fetch(`/subject/${SUBJECT_ID}/topic/new`, {
		method: 'POST',
		body: formData,
	});

    if(response.ok){
        const accept = confirm('¡El tema ha sido creado con exito! ¿Quieres seguir creando temas?');
        if(accept){
            document.getElementById('newTopic').reset();
        }else{
            window.location = `/subject/${SUBJECT_ID}`; //al index pq no hay ventana de subjects 
        }
            
    }else{
        alert('Ha ocurrido un error.');
    }
	
}