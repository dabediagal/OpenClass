import express from 'express';

import { Subject } from './models/subject.js';
import { User } from './models/user.js';
import { VirtualClass } from './models/virtual_class.js';

import multer from 'multer';
import fs from 'node:fs/promises';

const router = express.Router();

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

router.post('/subject/:id/linkUser', (req, res) => {
	const subject = VirtualClass.getSubject(req.params.id);
	subject.addUser(req.body.user);

	res.redirect(`/subject/${req.params.id}`);
});