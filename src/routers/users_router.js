import express from 'express';
import { User } from '../models/user.js';
import { VirtualClass } from '../models/virtual_class.js';
import { getAuthenticatedUser, setAuthenticatedUser, clearAuthenticatedUser } from '../auth.js';

const usersRouter = express.Router();
export default usersRouter;

// Formulario Iniciar Sesion
usersRouter.post('/login', (req, res) => {
	let response = { valid: false, message: '' };
	const user = VirtualClass.getUserByEmail(req.body.email);

	if (!user) {
		response.message = 'El email no está registrado.';
		return res.json(response);
	}

	if (user.password === req.body.password) {
		response.valid = true;
		setAuthenticatedUser(user);
	} else {
		response.message = 'Contraseña incorrecta.';
	}

	res.json(response);
});

// Cerrar sesión
usersRouter.get('/logout', (req, res) => {
	clearAuthenticatedUser();
	res.redirect('/login.html');
});

// Verificar si un email ya existe
usersRouter.get('/check-email/:email', (req, res) => {
	const email = req.params.email;
	const existingUser = VirtualClass.getUserByEmail(email);
	res.json({ exists: !!existingUser });
});

// Todos los usuarios
usersRouter.get('/', (req, res) => {
	const students = VirtualClass.getAllStudents();
	const teachers = VirtualClass.getAllTeachers();
	const autenticatedUser = getAuthenticatedUser();
	const name = autenticatedUser.name;

	res.render('show_users', { students: students, teachers: teachers, userName: name });
});

// Crear nuevo usuario
usersRouter.post('/new', (req, res) => {
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

// Perfil del usuario autenticado
usersRouter.get('/profile', (req, res) => {
	const autenticatedUser = getAuthenticatedUser();
	if (!autenticatedUser) {
		return res.redirect('/login.html');
	} else {
		res.render('show_profile', { user: autenticatedUser });
	}
});

// Verificar contraseña
usersRouter.post('/profile/password', (req, res) => {
	const autenticatedUser = getAuthenticatedUser();
	if (autenticatedUser.password !== req.body.currentPassword) {
		return res.json({ valid: false, message: 'Contraseña actual incorrecta' });
	}
	autenticatedUser.password = req.body.newPassword;
	res.json({ valid: true });
});

// Obtener usuario por id
usersRouter.get('/:userId', (req, res) => {
	const user = VirtualClass.getUser(req.params.userId);
	if (!user) return res.json({ valid: false });
	res.json(user);
});

// Editar usuario
usersRouter.post('/:userId/edit', (req, res) => {
	const user = VirtualClass.getUser(req.params.userId);
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
usersRouter.get('/:userId/delete', (req, res) => {
	let response = { valid: false, message: '' };
	const user = VirtualClass.deleteUser(req.params.userId);

	if (user) {
		response.valid = true;
		response.message = 'El usuario ha sido eliminado correctamente';
	} else {
		response.message = 'Usuario no encontrado';
	}

	res.json(response);
});
