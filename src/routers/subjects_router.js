import express from 'express';
import multer from 'multer';
import fs from 'node:fs/promises';
import { Subject } from '../models/subject.js';
import { User } from '../models/user.js';
import { VirtualClass } from '../models/virtual_class.js';
import { Topic } from '../models/topics.js';
import { getAuthenticatedUser, requireAuth } from '../auth.js';

const subjectsRouter = express.Router();
subjectsRouter.use(requireAuth);
export default subjectsRouter;

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

// Página principal
subjectsRouter.get('/', (req, res) => {
	const authenticatedUser = getAuthenticatedUser(req);

	const allSubjects = VirtualClass.getAllSubjects();
	let mySubjects = allSubjects;

	const isAdmin = authenticatedUser.type === 'admin';
	if (!isAdmin) {
		mySubjects = allSubjects.filter((subject) => {
			if (authenticatedUser.type === 'teacher') {
				return subject.teachers.includes(authenticatedUser.id);
			}

			return subject.students.includes(authenticatedUser.id);
		});
	}

	const name = authenticatedUser.name;
	res.render('index', { subjects: mySubjects, userName: name, isAdmin: isAdmin });
});

// Crear nueva asignatura
subjectsRouter.post('/new', async (req, res) => {
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
subjectsRouter.get('/:subjectId', (req, res) => {
	const authenticatedUser = getAuthenticatedUser(req);

	const subject = VirtualClass.getSubject(req.params.subjectId);
	// los teachers y students de una asignatura en concreto
	const teachers = subject.getTeachers();
	const students = subject.getStudents();

	const name = authenticatedUser.name;
	const isAdmin = authenticatedUser.type === 'admin';
	const isAdminOrTeacher = authenticatedUser.type === 'teacher' || isAdmin;
	const isAdminOrStudent = authenticatedUser.type === 'student' || isAdmin;

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

subjectsRouter.post('/:subjectId/edit', (req, res) => {
	const authenticatedUser = req.authenticatedUser;
	if (!authenticatedUser || authenticatedUser.type !== 'admin') {
		return res.status(403).json({ valid: false, message: 'Acceso denegado' });
	}

	const subject = VirtualClass.getSubject(req.params.subjectId);
	if (!subject) {
		return res.status(404).json({ valid: false, message: 'Asignatura no encontrada' });
	}

	const name = req.body.name?.trim();
	const description = req.body.description?.trim();
	if (!name) {
		return res.status(400).json({ valid: false, message: 'El nombre es obligatorio' });
	}

	if (name !== subject.name) {
		const existingSubject = VirtualClass.getAllSubjects().find(
			(s) => s.name.toLowerCase() === name.toLowerCase() && s.id !== subject.id
		);
		if (existingSubject) {
			return res.status(400).json({
				valid: false,
				message: 'Ya existe otra asignatura con este nombre'
			});
		}
	}

	subject.name = name;
	subject.description = description;
	res.json({ valid: true });
});

// Eliminar asignatura
subjectsRouter.get('/:subjectId/delete', async (req, res) => {
	let response = { valid: false, message: '' };
	const subject = await VirtualClass.deleteSubject(req.params.subjectId);

	if (subject) {
		response.valid = true;
		response.message = 'La asignatura ha sido eliminada correctamente';
	} else {
		response.message = 'Asignatura no encontrada';
	}

	res.json(response);
});

// Asociar usuario a una asignatura
subjectsRouter.post('/:subjectId/linkUser', (req, res) => {
	const subject = VirtualClass.getSubject(req.params.subjectId);
	subject.addUser(req.body.user);

	res.json({ valid: true });
});

//Eliminar usuario de una asignatura
subjectsRouter.get('/:subjectId/user/:userId/delete', (req, res) => {
	const subject = VirtualClass.getSubject(req.params.subjectId);
	subject.deleteUser(req.params.userId);

	res.redirect(`/subjects/${req.params.subjectId}`);
});

// Añadir topic a una asignatura con AJAX
subjectsRouter.post('/:subjectId/topic/new', upload.single('pdf'), (req, res) => {
	// Validar que si hay archivo, sea PDF
	if (req.file && req.file.mimetype !== 'application/pdf') {
		return res.json({ valid: false, message: 'Solo se permiten archivos PDF' });
	}

	const pdfName = req.file?.filename;
	const subject = VirtualClass.getSubject(req.params.subjectId);
	try {
		subject.addTopic(req.body.title, req.body.descripcion, req.body.order, pdfName);
		res.json({ valid: true, message: 'Tema añadido correctamente' });
	} catch (e) {
		res.json({ valid: false, message: e.message });
	}
});

// Obtener topic por id
subjectsRouter.get('/:subjectId/topic/:topicId', (req, res) => {
	const subject = VirtualClass.getSubject(req.params.subjectId);
	const topic = subject.getTopic(req.params.topicId);
	if (!topic) return res.json({ valid: false, message: 'Tema no encontrado' });
	res.json(topic);
});

// Editar topic de una asignatura CON AJAX
subjectsRouter.post('/:subjectId/topic/:topicId/edit', upload.single('pdf'), async (req, res) => {
	const subject = VirtualClass.getSubject(req.params.subjectId);
	const topic = subject.getTopic(req.params.topicId);
	if (!topic) return res.json({ valid: false, message: 'Tema no encontrado' });

	const newOrder = req.body.order;
	for (const t of subject.topics.values()) {
		if (t.id !== req.params.topicId && t.order === newOrder) {
			return res.json({ valid: false, message: `Ya existe un tema en la posición ${newOrder}` });
		}
	}

	if (req.file) {
		if (topic.attachment) {
			await fs.rm(UPLOADS_FOLDER + topic.attachment).catch(() => {});
		}
		topic.attachment = req.file.filename;
	}

	topic.title = req.body.title;
	topic.descripcion = req.body.descripcion;
	topic.order = newOrder;

	res.json({ valid: true, message: 'Tema actualizado correctamente' });
});

// Eliminar topic de una asignatura CON AJAX
subjectsRouter.get('/:subjectId/topic/:topicId/delete', async (req, res) => {
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
