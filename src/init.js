import { VirtualClass } from './models/virtual_class.js';
import { User } from './models/user.js';
import { Subject } from './models/subject.js';

export function initVirtualClass() {
	// Creamos al admin
	const admin = new User('Admin', 'admin', 'admin@email.com', '1234');

	// Creamos Profesores de prueba
	const profe1 = new User('Ada Lovelace', 'teacher', 'adalovelace@email.com', '1234');
	const profe2 = new User('Alan Turing', 'teacher', 'alanturing@email.com', '1234');

	// Creamos Alumnos de prueba
	const alumno1 = new User('Carlos Pérez', 'student', 'carlosperez@email.com', '1234');
	const alumno2 = new User('Lucía Fernández', 'student', 'luciafernandez@email.com', '1234');
	const alumno3 = new User('Mateo Gómez', 'student', 'mateogomez@email.com', '1234');

	// Los añadimos a la clase virtual
	VirtualClass.addUser(admin);
	VirtualClass.addUser(profe1);
	VirtualClass.addUser(profe2);
	VirtualClass.addUser(alumno1);
	VirtualClass.addUser(alumno2);
	VirtualClass.addUser(alumno3);

	// También creamos un par de asignaturas de prueba
	const mates = new Subject('Matemáticas Avanzadas', 'Son mates avanzadas como bien pone ahí');
	const prog = new Subject('Programación en JavaScript', 'No lo hagáis nunca');
	const entornos = new Subject(
		'Entornos de Desarrollo',
		'Donde aprendes a usar Git antes de que un conflicto de ramas te arruine la existencia',
	);
	const bases = new Subject(
		'Bases de Datos',
		'Mucho SELECT, mucho JOIN, pero al final siempre se te olvida poner el WHERE en el DELETE',
	);
	const marcas = new Subject(
		'Lenguajes de Marcas',
		'Hacer cajitas de colores con CSS Grid hasta que todo se rompa por 1 píxel',
	);
	const sistemas = new Subject(
		'Sistemas Informáticos',
		'Aprender comandos de Linux de memoria para acabar usando la interfaz gráfica',
	);
	const servidor = new Subject(
		'Desarrollo Web en Entorno Servidor',
		'Donde Node.js y Express se convierten en tus mejores amigos (o en tus peores pesadillas)',
	);
	const cliente = new Subject(
		'Desarrollo Web en Entorno Cliente',
		'JavaScript otra vez, porque una sola asignatura no era suficiente castigo',
	);
	const despliegue = new Subject(
		'Despliegue de Aplicaciones Web',
		'Subir tu proyecto a producción rezando para que funcione a la primera (nunca pasa)',
	);

	VirtualClass.addSubject(mates);
	VirtualClass.addSubject(prog);
    VirtualClass.addSubject(entornos);
    VirtualClass.addSubject(bases);
    VirtualClass.addSubject(marcas);
    VirtualClass.addSubject(sistemas);
    VirtualClass.addSubject(servidor);
    VirtualClass.addSubject(cliente);
    VirtualClass.addSubject(despliegue);
}
