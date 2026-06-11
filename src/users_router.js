import express from 'express';
import { User } from './models/user.js';
import { VirtualClass } from './models/virtual_class.js';

const users_router = express.Router();
export default users_router;

let autenticatedUser = undefined;

// Formulario Iniciar Sesion
users_router.post('/users/login', (req, res) => {
	let response = { valid: false, message: '' };
	const user = VirtualClass.getUserByEmail(req.body.email);

	if (!user) {
		response.message = 'El email no está registrado.';
		return res.json(response);
	}

	if (user.password === req.body.password) {
		response.valid = true;
		autenticatedUser = user;
	} else {
		response.message = 'Contraseña incorrecta.';
	}

	res.json(response);
});

// Verificar si un email ya existe
users_router.get('/users/check-email/:email', (req, res) => {
	const email = req.params.email;
	const existingUser = VirtualClass.getUserByEmail(email);
	res.json({ exists: !!existingUser });
});

// Crear nuevo usuario
users_router.post('/users/new', (req, res) => {
	const existingUser = VirtualClass.getUserByEmail(req.body.email);
	if (existingUser) {
		return res.status(400).json({
			valid: false,
			message: 'El email ya está registrado'
		});
	}

	const user = new User(req.body.name, req.body.type, req.body.email, req.body.password);
	VirtualClass.addUser(user);

	res.json({ valid: true, user });
});

// Cerrar sesión
users_router.get('/users/logout', (req, res) => {
	autenticatedUser = undefined;
	res.redirect('/login.html');
});

// Perfil del usuario autenticado
users_router.get('/users/profile', (req, res) => {
	if (!autenticatedUser) {
		return res.redirect('/login.html');
	} else {
		res.render('show_profile', { user: autenticatedUser });
	}
});

// Todos los usuarios
users_router.get('/users', (req, res) => {
	const students = VirtualClass.getAllStudents();
	const teachers = VirtualClass.getAllTeachers();
	const name = autenticatedUser.name;

	res.render('show_users', { students: students, teachers: teachers, userName: name });
});

// Obtener usuario por id
users_router.get('/users/:id/edit', (req, res) => {
	const user = VirtualClass.getUser(req.params.id);
	if (!user) return res.json({ valid: false });
	res.json(user);
});

// Editar usuario
users_router.post('/users/:id/edit', (req, res) => {
	const user = VirtualClass.getUser(req.params.id);
	if (!user) return res.json({ valid: false, message: 'Usuario no encontrado' });

	// Validar que el nuevo email no esté en uso por otro usuario
	if (req.body.email !== user.email) {
		const existingUser = VirtualClass.getUserByEmail(req.body.email);
		if (existingUser) {
			return res.json({
				valid: false,
				message: 'El email ya está registrado por otro usuario'
			});
		}
	}

	user.name = req.body.name;
	user.email = req.body.email;
	res.json({ valid: true });
});

// Eliminar usuario
users_router.get('/users/:id/delete', (req, res) => {
	let response = { valid: false, message: '' };
	const user = VirtualClass.deleteUser(req.params.id);

	if (user) {
		response.valid = true;
		response.message = 'El usuario ha sido eliminado correctamente';
	} else {
		response.message = 'Usuario no encontrado';
	}

	res.json(response);
});

// Verificar contraseña
users_router.post('/users/profile/password', (req, res) => {
	if (autenticatedUser.password !== req.body.currentPassword) {
		return res.json({ valid: false, message: 'Contraseña actual incorrecta' });
	}
	autenticatedUser.password = req.body.newPassword;
	res.json({ valid: true });
});
