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


