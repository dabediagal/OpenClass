async function newUser(event){
    event.preventDefault();

    const formData = new FormData(event.target);
    const response = await fetch(`/user/new`, {
		method: 'POST',
		body: new URLSearchParams(formData),
	});

    if(response.ok){
        const confirm = confirm('¡El usuario ha sido creado con exito! ¿Quieres seguir creando usuarios?');
        if(confirm){
            document.getElementById('newUser').reset();
        }else{
            window.location = `/users`;
        }
            
    }else{
        alert('Ha ocurrido un error.');
    }
	
}