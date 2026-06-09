import express from 'express';

import { Subject } from './models/subject.js';
import { User } from './models/user.js';
import { VirtualClass } from './models/virtual_class.js';

import multer from 'multer';
import fs from 'node:fs/promises';

const router = express.Router();
const upload=multer({dest:'uploads/'}); //este upload se usa para subir el pdf d topics

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

// Añadir topic a una asignatura
router.post('/subject/:id/topic/new', upload.single('pdf'), (req, res) => {
	const pdfName=req.file?.filename;
	const subject = VirtualClass.getSubject(req.params.id);
	subject.addTopic(req.body.title, req.body.descripcion, req.body.order,pdfName);

	res.redirect(`/subject/${req.params.id}`);
});

// Eliminar topic de una asignatura
router.get('/subject/:subjectId/topic/:topicId/delete', (req, res) => {
	const subject = VirtualClass.getSubject(req.params.subjectId);
	subject.deleteTopic(req.params.topicId);

	res.redirect(`/subject/${req.params.subjectId}`);
});	