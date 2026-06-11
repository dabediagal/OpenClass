import express from 'express';

import { Subject } from './models/subject.js';
import { User } from './models/user.js';
import { VirtualClass } from './models/virtual_class.js';
import { Topic } from './models/topics.js';

import multer from 'multer';
import fs from 'node:fs/promises';

const subjects_router = express.Router();
export default subjects_router;

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


// Página principal
subjects_router.get('/', (req, res) => {
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

// Crear nueva asignatura
subjects_router.post('/subjects/subject/new', async (req, res) => {
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
subjects_router.get('/subjects/subject/:id', (req, res) => {
    if (!autenticatedUser) {
        return res.redirect('/login.html');
    }

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

// Asociar usuario a una asignatura
subjects_router.post('/subjects/subject/:id/linkUser', (req, res) => {
    const subject = VirtualClass.getSubject(req.params.id);
    subject.addUser(req.body.user);

    res.json({ valid: true });
});

// Eliminar asignatura
subjects_router.get('/subjects/subject/:id/delete', async (req, res) => {
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
subjects_router.get('/subjects/subject/:subjectId/user/:userId/delete', (req, res) => {
	const subject = VirtualClass.getSubject(req.params.subjectId);
	subject.deleteUser(req.params.userId);

	res.redirect(`/subject/${req.params.subjectId}`);
});

// Añadir topic a una asignatura con AJAX
subjects_router.post('/subjects/subject/:id/topic/new', upload.single('pdf'), (req, res) => {
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
subjects_router.get('/subjects/subject/:subjectId/topic/:topicId/delete', async (req, res) => {
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