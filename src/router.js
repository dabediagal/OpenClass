import express from 'express';
import { Board, Post, Comment } from './board.js';
import multer from 'multer';
import fs from 'node:fs/promises';

const router = express.Router();
export default router;
