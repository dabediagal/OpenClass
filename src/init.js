import { VirtualClass } from "./models/virtual_class.js";
import { User } from './models/user.js';
import { Subject } from './models/subject.js';

export function initVirtualClass(){
    // Creamos Profesores de prueba
    const profe1 = new User('Ada Lovelace', 'teacher');
    const profe2 = new User('Alan Turing', 'teacher');
    
    // Creamos Alumnos de prueba
    const alumno1 = new User('Carlos Pérez', 'student');
    const alumno2 = new User('Lucía Fernández', 'student');
    const alumno3 = new User('Mateo Gómez', 'student');
    
    // Los añadimos a la clase virtual
    VirtualClass.addUser(profe1);
    VirtualClass.addUser(profe2);
    VirtualClass.addUser(alumno1);
    VirtualClass.addUser(alumno2);
    VirtualClass.addUser(alumno3);
    
    // También creamos un par de asignaturas de prueba
    const mates = new Subject('Matemáticas Avanzadas');
    const prog = new Subject('Programación en JavaScript');
    VirtualClass.addSubject(mates);
    VirtualClass.addSubject(prog);
}