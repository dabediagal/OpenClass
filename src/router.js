import express from 'express';

import { Subject } from './models/subject.js';
import { User } from './models/user.js';
import { VirtualClass } from './models/virtual_class.js';
import { Topic } from './models/topics.js';

import multer from 'multer';
import fs from 'node:fs/promises';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });
const UPLOADS_FOLDER = 'uploads/';

export default router;

// Página principal
router.get('/', (req, res) => {
	const subjects = VirtualClass.getAllSubjects();
	res.render('index', { subjects: subjects });
});

// Crear nuevo usuario
router.post('/user/new', (req, res) => {
	const user = new User(req.body.name, req.body.type, req.body.email, req.body.password);
	VirtualClass.addUser(user);

	res.json(user);
});

// Crear nueva asignatura
router.post('/subject/new', (req, res) => {
	const subject = new Subject(req.body.name, req.body.description);
	VirtualClass.addSubject(subject);

	res.json(subject);
});

// Mostrar una asignatura
router.get('/subject/:id', (req, res) => {
	const subject = VirtualClass.getSubject(req.params.id);
	// los teachers y students de una asignatura en concreto
	const teachers = subject.getTeachers();
	const students = subject.getStudents();
	// todos los teachers y students que NO pertenecen a esa asignatura
	const nonTeachers = subject.getNonTeachers();
	const nonStudents = subject.getNonStudents();

	res.render('show_subject', { subject, teachers, students, nonTeachers, nonStudents });
});

// Todos los usuarios
router.get('/users', (req, res) => {
	const students = VirtualClass.getAllStudents();
	const teachers = VirtualClass.getAllTeachers();

	res.render('show_users', { students: students, teachers: teachers });
});

// Asociar usuario a una asignatura
router.post('/subject/:id/linkUser', (req, res) => {
	const subject = VirtualClass.getSubject(req.params.id);
	subject.addUser(req.body.user);

	res.redirect(`/subject/${req.params.id}`);
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
router.get('/subject/:id/delete', (req, res) => {
	let response = { valid: false, message: '' };
	const subject = VirtualClass.deleteSubject(req.params.id);

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

// Iniciar Sesion
router.post('/user/login', (req, res) => {
	const user = VirtualClass.getUser();
	VirtualClass.addUser(user);

	res.json(user);
});
