import express from 'express';

import Subject from './subject.js';
import User from './user.js';
import VirtualClass from './virtual_class.js';

import multer from 'multer';
import fs from 'node:fs/promises';

const router = express.Router();
export default router;

router.get('/', (req, res) => {
	const subjects = VirtualClass.getAllSubjects();
	res.render('index', { subjects: subjects });
});

router.get('/user/new', (req, res) => {
    const user = new User(req.body.name, req.body.type);
	VirtualClass.addUser(user.id, user);

    res.redirect('/user/new');
});

router.get('/subject/new', (req, res) => {
    const subject = new Subject(req.body.name);
	VirtualClass.addSubject(subject.id, subject);
    res.redirect('/subject/new');
});

