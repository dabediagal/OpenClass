import { VirtualClass } from './models/virtual_class.js';
import { User } from './models/user.js';
import { Subject } from './models/subject.js';

export function initVirtualClass() {
	// Creamos al admin
	const admin = new User('Admin', 'admin', 'admin', '1234');

	// Creamos Profesores de prueba
	const profe1 = new User('Ada Lovelace', 'teacher', 'adalovelace@email.com', '1234');
	const profe2 = new User('Alan Turing', 'teacher', 'alanturing@email.com', '1234');
	const profe3 = new User('Dennis Ritchie', 'teacher', 'dennis.ritchie@email.com', '1234');
	const profe4 = new User('Linus Torvalds', 'teacher', 'linus.torvalds@email.com', '1234');
	const profe5 = new User('Tim Berners-Lee', 'teacher', 'tim.berners@email.com', '1234');

	// Creamos Alumnos de prueba
	const alumno1 = new User('Carlos Pérez', 'student', 'carlosperez@email.com', '1234');
	const alumno2 = new User('Lucía Fernández', 'student', 'luciafernandez@email.com', '1234');
	const alumno3 = new User('Mateo Gómez', 'student', 'mateogomez@email.com', '1234');
	const alumno4 = new User('Elena Rodríguez', 'student', 'elena.rod@email.com', '1234');
	const alumno5 = new User('Alejandro Muñoz', 'student', 'ale.munoz@email.com', '1234');
	const alumno6 = new User('Sofía Benítez', 'student', 'sofia.b@email.com', '1234');
	const alumno7 = new User('Diego Martínez', 'student', 'diego.mtnz@email.com', '1234');
	const alumno8 = new User('Alba Serrano', 'student', 'alba.serrano@email.com', '1234');
	const alumno9 = new User('Javier López', 'student', 'javi.lopez@email.com', '1234');
	const alumno10 = new User('Martina Sanz', 'student', 'martina.sanz@email.com', '1234');

	// Los añadimos a la clase virtual
	VirtualClass.addUser(admin);

	VirtualClass.addUser(profe1);
	VirtualClass.addUser(profe2);
	VirtualClass.addUser(profe3);
	VirtualClass.addUser(profe4);
	VirtualClass.addUser(profe5);

	VirtualClass.addUser(alumno1);
	VirtualClass.addUser(alumno2);
	VirtualClass.addUser(alumno3);
	VirtualClass.addUser(alumno4);
	VirtualClass.addUser(alumno5);
	VirtualClass.addUser(alumno6);
	VirtualClass.addUser(alumno7);
	VirtualClass.addUser(alumno8);
	VirtualClass.addUser(alumno9);
	VirtualClass.addUser(alumno10);

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

	// Programación en JavaScript
	prog.addUser(profe2.id); // Alan Turing
	prog.addUser(alumno1.id); // Carlos
	prog.addUser(alumno2.id); // Lucía
	prog.addUser(alumno3.id); // Mateo

	// Desarrollo Web en Entorno Servidor
	servidor.addUser(profe4.id); // Linus Torvalds
	servidor.addUser(alumno1.id); // Carlos
	servidor.addUser(alumno4.id); // Elena
	servidor.addUser(alumno6.id); // Sofía

	// Desarrollo Web en Entorno Cliente
	cliente.addUser(profe2.id); // Alan Turing
	cliente.addUser(alumno2.id); // Lucía
	cliente.addUser(alumno5.id); // Alejandro
	cliente.addUser(alumno7.id); // Diego

	// Bases de Datos
	bases.addUser(profe3.id); // Dennis Ritchie
	bases.addUser(alumno3.id); // Mateo
	bases.addUser(alumno8.id); // Alba
	bases.addUser(alumno10.id); // Martina

	// Lenguajes de Marcas
	marcas.addUser(profe5.id); // Tim Berners-Lee
	marcas.addUser(alumno1.id); // Carlos
	marcas.addUser(alumno2.id); // Lucía
	marcas.addUser(alumno9.id); // Javier

	// Matemáticas Avanzadas
	mates.addUser(profe1.id); // Ada Lovelace
	mates.addUser(alumno4.id); // Elena
	mates.addUser(alumno5.id); // Alejandro

	// Entornos de Desarrollo
	entornos.addUser(profe4.id); // Linus Torvalds
	entornos.addUser(alumno6.id); // Sofía
	entornos.addUser(alumno7.id); // Diego

	// Sistemas Informáticos
	sistemas.addUser(profe3.id); // Dennis Ritchie
	sistemas.addUser(alumno8.id); // Alba
	sistemas.addUser(alumno9.id); // Javier

	// Despliegue de Aplicaciones Web
	despliegue.addUser(profe5.id); // Tim Berners-Lee
	despliegue.addUser(alumno10.id); // Martina

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
