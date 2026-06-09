import { VirtualClass } from "./models/virtual_class.js";
import { User } from './models/user.js';
import { Subject } from './models/subject.js';

export function initVirtualClass(){
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
    const mates = new Subject('Matemáticas Avanzadas',"Son mates avanzadas como bien pone ahí");
    const prog = new Subject('Programación en JavaScript',"No lo hagáis nunca");
    VirtualClass.addSubject(mates);
    VirtualClass.addSubject(prog);
}