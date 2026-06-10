import { VirtualClass } from './src/models/virtual_class.js';

async function deleteUser(userId) {
	const accept = confirm('¿Estás seguro de que quieres eliminar este usuario?');
	if (!accept) {
		return;
	}
	const response = await fetch(`/user/${userId}/delete`);
	const result = await response.json();

	if (result.valid) {
		alert(result.message);
		window.location = '/users';
	} else {
		alert(`Error: ${result.message}`);
	}
}

async function editUser(userId){
	const teacher=document.getElementById('teacher');
	const student=document.getElementById('student');

	const user=VirtualClass.getUser(userId);
	if(user.type==='teacher'){
		teacher.innerHTML='';
	}else{
		student.innerHTML='';
	}
}
