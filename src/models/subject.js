import { User } from './user.js';
import { VirtualClass } from './virtual_class.js';
import { Topic } from './topics.js';
export class Subject {
	static counter = 0;
	constructor(name, description) {
		Subject.counter++;
		this.id = String(Subject.counter);
		this.name = name;
		this.teachers = []; //RECIBE IDS SÓLO
		this.students = [];
		this.topics=[]; //empiezan en 0 estos topics y luego se van añadiendo 
		this.description=description;
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

	getNonTeachers() {
		let allTeachers = VirtualClass.getAllTeachers();
		let teachers = this.getTeachers();
		let nonTeachers = allTeachers.filter((x) => !teachers.some((y) => y.id === x.id));
		return nonTeachers;
	}

	getNonStudents() {
		let allStudents = VirtualClass.getAllStudents();
		let students = this.getStudents();
		let nonStudents = allStudents.filter((x) => !students.some((y) => y.id === x.id));
		return nonStudents;
	}

	deleteUser(id){
		let user = VirtualClass.getUser(id);
		if (user.type === 'teacher') {
			this.teachers = this.teachers.filter(teacherId => teacherId !== id);
		} else {
			this.students = this.students.filter(studentId => studentId !== id);
		}
	}

	addTopic(title, descripcion, order) {
		const topic = new Topic(title, descripcion, order);
		this.topics.push(topic);
		return topic;
	}

	deleteTopic(id) {
		const topic = this.topics.find(t => t.id === id);
		this.topics = this.topics.filter(t => t.id !== id);
		return topic;
	}
}
