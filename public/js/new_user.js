async function newUser(event){
    event.preventDefault();

    const formData = new FormData(event.target);
    const response = await fetch(`/user/new`, {
		method: 'POST',
		body: new URLSearchParams(formData),
	});

    if(response.ok){
        const accept = confirm('¡El usuario ha sido creado con exito! ¿Quieres seguir creando usuarios?');
        if(accept){
            document.getElementById('newUser').reset();
        }else{
            window.location = `/users`;
        }
            
    }else{
        alert('Ha ocurrido un error.');
    }
	
}