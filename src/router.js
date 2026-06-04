import express from 'express';

import { Subject } from './subject.js';
import { User } from './user.js';
import { VirtualClass } from './virtual_class.js';

import multer from 'multer';
import fs from 'node:fs/promises';

const router = express.Router();

// ==========================================
// 🔥 SECCIÓN DE DATOS DE PRUEBA (MOCK DATA)
// ==========================================

// 1. Creamos Profesores de prueba
const profe1 = new User('Ada Lovelace', 'teacher');
const profe2 = new User('Alan Turing', 'teacher');

// 2. Creamos Alumnos de prueba
const alumno1 = new User('Carlos Pérez', 'student');
const alumno2 = new User('Lucía Fernández', 'student');
const alumno3 = new User('Mateo Gómez', 'student');

// 3. Los añadimos a la clase virtual
VirtualClass.addUser(profe1);
VirtualClass.addUser(profe2);
VirtualClass.addUser(alumno1);
VirtualClass.addUser(alumno2);
VirtualClass.addUser(alumno3);

// (Opcional) También puedes crear un par de asignaturas de prueba si quieres
const mates = new Subject('Matemáticas Avanzadas');
const prog = new Subject('Programación en JavaScript');
VirtualClass.addSubject(mates);
VirtualClass.addSubject(prog);

// ==========================================

export default router;

router.get('/', (req, res) => {
	const subjects = VirtualClass.getAllSubjects();
	res.render('index', { subjects: subjects });
});

router.post('/user/new', (req, res) => {
	const user = new User(req.body.name, req.body.type);
	VirtualClass.addUser(user);

	res.redirect('/new_user.html');
});

router.post('/subject/new', (req, res) => {
	const subject = new Subject(req.body.name);
	VirtualClass.addSubject(subject);
	res.redirect('/new_subject.html');
});

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

router.get('/users', (req, res) => {
	const students = VirtualClass.getAllStudents();
	const teachers = VirtualClass.getAllTeachers();

	res.render('show_users', { students: students, teachers: teachers });
});

router.post('/subject/:id/linkTeacher', (req, res) => {
	const subject = VirtualClass.getSubject(req.params.id);
	subject.addUser(req.body.teacher);
	res.redirect('/show_subject.html');
});