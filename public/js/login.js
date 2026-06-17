async function login(event) {
	event.preventDefault();

	const formData = new FormData(event.target);
	const response = await fetch(`/users/login`, {
		method: 'POST',
		body: new URLSearchParams(formData)
	});
	const result = await response.json();

	if (result.valid) {
		window.location = '/subjects';
	} else {
		alert(`Error: ${result.message}`);
	}
}
