async function changePassword(event){
    event.preventDefault();

    const formData = new FormData(event.target);
    const response = await fetch(`/profile/password`, { //no se si la ruta será esta
		method: 'POST',
		body: new URLSearchParams(formData), //no queremos un new, queremos cambiar algo q ya se habia establecido antes 
	});

     const result = await response.json();

    if (result.valid) {
        alert('¡La contraseña ha sido cambiada con éxito!');
        window.location.reload();
    } else {
        alert(`Error: ${result.message}`);
    }
}

