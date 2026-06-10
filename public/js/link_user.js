async function linkUser(event){
    event.preventDefault();

    const formData = new FormData(event.target);
    const response = await fetch(`/subject/${SUBJECT_ID}/linkUser`, {
        method: 'POST',
        body: new URLSearchParams(formData),
    });

    const result = await response.json();

    if (result.valid) {
        window.location.reload();
    } else {
        alert(`Error: ${result.message}`);
    }
}