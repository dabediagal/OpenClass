import express from 'express';

import { Subject } from './models/subject.js';
import { User } from './models/user.js';
import { VirtualClass } from './models/virtual_class.js';
import { Topic } from './models/topics.js';

import multer from 'multer';
import fs from 'node:fs/promises';

const router = express.Router();

// Configurar multer con almacenamiento personalizado para PDFs
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads/');
	},
	filename: (req, file, cb) => {
		// Sanitizar el título para usar como nombre de archivo
		const title = req.body.title.replace(/[^a-zA-Z0-9_-]/g, '_');
		const order = req.body.order || '0';
		const filename = `${order}_${title}.pdf`;
		cb(null, filename);
	}
});

const upload = multer({
	storage: storage,
	fileFilter: (req, file, cb) => {
		// Validar por MIME type
		if (file.mimetype === 'application/pdf') {
			cb(null, true);
		} else {
			cb(new Error('Solo se permiten archivos PDF'));
		}
	}
});

const UPLOADS_FOLDER = 'uploads/';
let autenticatedUser = undefined;

export default router;

// Formulario Iniciar Sesion
router.post('/user/login', (req, res) => {
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

// Página principal
router.get('/', (req, res) => {
	if (!autenticatedUser) {
		return res.redirect('/login.html');
	}

	const allSubjects = VirtualClass.getAllSubjects();
	let mySubjects = allSubjects;

	const isAdmin = autenticatedUser.type === 'admin';
	if (!isAdmin) {
		mySubjects = allSubjects.filter((subject) => {
			if (autenticatedUser.type === 'teacher') {
				return subject.teachers.includes(autenticatedUser.id);
			}

			return subject.students.includes(autenticatedUser.id);
		});
	}

	const name = autenticatedUser.name;
	res.render('index', { subjects: mySubjects, userName: name, isAdmin: isAdmin });
});

// Crear nuevo usuario
router.post('/user/new', (req, res) => {
	const user = new User(req.body.name, req.body.type, req.body.email, req.body.password);
	VirtualClass.addUser(user);

	res.json(user);
});

// Crear nueva asignatura
router.post('/subject/new', async (req, res) => {
	const subjectName = req.body.name?.trim();
	const subjectDescription = req.body.description?.trim();

	if (!subjectName) {
		return res
			.status(400)
			.json({ valid: false, message: 'El nombre de la asignatura es obligatorio' });
	}

	try {
		const subject = await Subject.create(subjectName, subjectDescription);
		VirtualClass.addSubject(subject);

		res.json(subject);
	} catch (error) {
		console.error('Error creating subject room:', error);
		res.status(500).json({
			valid: false,
			message:
				error.message || 'No se pudo crear la sala de videoconferencia para la asignatura'
		});
	}
});

// Mostrar una asignatura
router.get('/subject/:id', (req, res) => {
	const subject = VirtualClass.getSubject(req.params.id);
	// los teachers y students de una asignatura en concreto
	const teachers = subject.getTeachers();
	const students = subject.getStudents();

	const name = autenticatedUser.name;
	const isAdmin = autenticatedUser.type === 'admin';
	const isAdminOrTeacher = autenticatedUser.type === 'teacher' || isAdmin;
	const isAdminOrStudent = autenticatedUser.type === 'student' || isAdmin;

	let nonTeachers = undefined;
	let nonStudents = undefined;
	if (isAdmin) {
		// todos los teachers y students que NO pertenecen a esa asignatura
		nonTeachers = subject.getNonTeachers();
		nonStudents = subject.getNonStudents();
	}

	res.render('show_subject', {
		subject,
		teachers,
		students,
		nonTeachers,
		nonStudents,
		topics: Array.from(subject.topics.values()),
		userName: name,
		isAdmin,
		isAdminOrTeacher,
		isAdminOrStudent
	});
});

// Cerrar sesión
router.get('/logout', (req, res) => {
	autenticatedUser = undefined;
	res.redirect('/login.html');
});

// Perfil del usuario autenticado
router.get('/profile', (req, res) => {
	if (!autenticatedUser) {
		return res.redirect('/login.html');
	} else {
		res.render('show_profile', { user: autenticatedUser });
	}
});

// Todos los usuarios
router.get('/users', (req, res) => {
	const students = VirtualClass.getAllStudents();
	const teachers = VirtualClass.getAllTeachers();
	const name = autenticatedUser.name;

	res.render('show_users', { students: students, teachers: teachers, userName: name });
});

// Asociar usuario a una asignatura
router.post('/subject/:id/linkUser', (req, res) => {
	const subject = VirtualClass.getSubject(req.params.id);
	subject.addUser(req.body.user);

	res.json({ valid: true });
});

// Obtener usuario por id
router.get('/user/:id/edit', (req, res) => {
	const user = VirtualClass.getUser(req.params.id);
	if (!user) return res.json({ valid: false });
	res.json(user);
});

// Editar usuario
router.post('/user/:id/edit', (req, res) => {
	const user = VirtualClass.getUser(req.params.id);
	if (!user) return res.json({ valid: false, message: 'Usuario no encontrado' });

	user.name = req.body.name;
	user.email = req.body.email;
	res.json({ valid: true });
});

// Eliminar usuario
router.get('/user/:id/delete', (req, res) => {
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

// Eliminar asignatura
router.get('/subject/:id/delete', async (req, res) => {
	let response = { valid: false, message: '' };
	const subject = await VirtualClass.deleteSubject(req.params.id);

	if (subject) {
		response.valid = true;
		response.message = 'La asignatura ha sido eliminada correctamente';
	} else {
		response.message = 'Asignatura no encontrada';
	}

	res.json(response);
});

//Eliminar usuario de una asignatura
router.get('/subject/:subjectId/user/:userId/delete', (req, res) => {
	const subject = VirtualClass.getSubject(req.params.subjectId);
	subject.deleteUser(req.params.userId);

	res.redirect(`/subject/${req.params.subjectId}`);
});

// Añadir topic a una asignatura con AJAX
router.post('/subject/:id/topic/new', upload.single('pdf'), (req, res) => {
	// Validar que si hay archivo, sea PDF
	if (req.file && req.file.mimetype !== 'application/pdf') {
		return res.json({ valid: false, message: 'Solo se permiten archivos PDF' });
	}

	const pdfName = req.file?.filename;
	const subject = VirtualClass.getSubject(req.params.id);
	try {
		subject.addTopic(req.body.title, req.body.descripcion, req.body.order, pdfName);
		res.json({ valid: true, message: 'Tema añadido correctamente' });
	} catch (e) {
		res.json({ valid: false, message: e.message });
	}
});

// Eliminar topic de una asignatura CON AJAX
router.get('/subject/:subjectId/topic/:topicId/delete', async (req, res) => {
	let response = { valid: false, message: '' };
	const subject = VirtualClass.getSubject(req.params.subjectId);
	const topic = subject.deleteTopic(req.params.topicId);
	if (topic) {
		if (topic.attachment) {
			await fs.rm(UPLOADS_FOLDER + topic.attachment);
		}

		response.valid = true;
		response.message = 'El topic ha sido borrado correctamente';
	} else {
		response.message = 'File not found!';
	}

	res.json(response);
});

router.post('/profile/password', (req, res) => {
	if (autenticatedUser.password !== req.body.currentPassword) {
		return res.json({ valid: false, message: 'Contraseña actual incorrecta' });
	}
	autenticatedUser.password = req.body.newPassword;
	res.json({ valid: true });
});
