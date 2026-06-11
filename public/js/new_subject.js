async function newSubject(event){
    event.preventDefault();

    const formData = new FormData(event.target);
    const response = await fetch(`/subjects/subject/new`, {
		method: 'POST',
		body: new URLSearchParams(formData),
	});

    if(response.ok){
        const accept = confirm('¡La asignatura ha sido creada con exito! ¿Quieres seguir creando asignaturas?');
        if(accept){
            document.getElementById('newSubject').reset();
        }else{
            window.location = `/`; //al index pq no hay ventana de subjects 
        }
            
    }else{
        alert('Ha ocurrido un error.');
    }
	
}