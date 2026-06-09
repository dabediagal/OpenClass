async function login(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
	const response = await fetch(`/user/new`, {
		method: 'POST',
		body: new URLSearchParams(formData),
	});
    const result = await response.json();

    if(result.valid){
        window.location = '/';
    } else {
        alert(`Error: ${result.message}`);
    }
}