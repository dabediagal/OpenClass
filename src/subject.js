import { User } from './user.js';
import { VirtualClass } from './virtual_class.js';
export class Subject {
	static counter = 0;
	constructor(name) {
		Subject.counter++;
		this.id = Subject.counter;
		this.name = name;
		this.teachers = []; //RECIBE IDS SÓLO
		this.students = [];
	}
	getTeachers() {
		let teachersFullInfo = []; //AQUI GUARDARE LOS TEACHERS COMPLETOS, NOT ONLY IDS
		for (let teacher of this.teachers) {
			teachersFullInfo.push(VirtualClass.getUser(teacher));
		}
		return teachersFullInfo;
	}
	getStudents() {
		let studentsFullInfo = [];
		for (let student of this.students) {
			studentsFullInfo.push(VirtualClass.getUser(student));
		}
		return studentsFullInfo;
	}

	addUser(id) {
		//se une mediante el id interno que selecciona con un desplegable a la hora de añadir usuario
		let user = VirtualClass.getUser(id);
		if (user.type === 'teacher') {
			this.teachers.push(id);
		} else {
			this.students.push(id);
		}
	}

	//deleteUser
}
