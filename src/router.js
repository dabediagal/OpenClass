import express from 'express';

import { Subject } from './subject.js';
import { User } from './user.js';
import { VirtualClass } from './virtual_class.js';

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
	VirtualClass.addUser(user.id, user);

	res.redirect('/new_user.html');
});

router.post('/subject/new', (req, res) => {
	const subject = new Subject(req.body.name);
	VirtualClass.addSubject(subject);
	res.redirect('/new_subject.html');
});

router.get('/subject/:id', (req, res) => {
	const subject = VirtualClass.getSubject(req.params.id);
	const teachers = subject.getTeachers();
	const students = subject.getStudents();

	res.render('show_subject', { subject, teachers, students });
});
