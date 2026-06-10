import express from 'express';
import mustacheExpress from 'mustache-express';
import bodyParser from 'body-parser';
import { initVirtualClass } from './init.js';
import router from './router.js';

const app = express();

app.use(express.static('./public'));

app.use('/uploads', express.static('./uploads'));

app.set('view engine', 'html');
app.engine('html', mustacheExpress('./views/partials', '.html'));
app.set('views', './views');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

initVirtualClass();

app.use('/', router);

app.listen(3000, () => console.log('Web ready in http://localhost:3000/'));


