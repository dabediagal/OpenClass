export class VirtualClass {
	static subjects = new Map();
	static users = new Map();

	static addUser(user) {
		VirtualClass.users.set(user.id, user);
	}

	static addSubject(subject) {
		VirtualClass.subjects.set(subject.id, subject);
	}

	static getUser(id) {
		return VirtualClass.users.get(id);
	}

	static getSubject(id) {
		return VirtualClass.subjects.get(id);
	}

	static getAllSubjects() {
		return Array.from(VirtualClass.subjects.values());
	}

	static getAllTeachers() {
		return Array.from(VirtualClass.users.values()).filter((user) => user.type === 'teacher');
	}

	static getAllStudents() {
		return Array.from(VirtualClass.users.values()).filter((user) => user.type === 'student');
	}

	static deleteUser(id) {
		const user = VirtualClass.getUser(id);
		if (!user) {
			return undefined;
		}

		VirtualClass.users.delete(id);
		//ahora se borra tambien de la asignatura a la que pertenece:
		for (let subject of VirtualClass.subjects.values()) {
			subject.students = subject.students.filter((studentId) => studentId !== id);
			subject.teachers = subject.teachers.filter((teacherId) => teacherId !== id);
		}
		return user;
	}

	static deleteSubject(id) {
		VirtualClass.subjects.delete(id);
	}
}
