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
		let allTeachers = [];
	
		for (let i = 0; i < VirtualClass.users.size; i++) {
			let id = String(i + 1);
			let user = VirtualClass.users.get(id);
			
			if (user.type === 'teacher') {
				allTeachers.push(user);
			}
		}
		return allTeachers;
	}

	static getAllStudents() {
		let allStudents = [];

		for (let i = 0; i < VirtualClass.users.size; i++) {
			let id = String(i + 1);
			let user = VirtualClass.users.get(id);

			if (user.type === 'student') {
				allStudents.push(user);
			}
		}
		return allStudents;
	}

	static deleteUser(id) {
		VirtualClass.users.delete(id);
	}

	static deleteSubject(id) {
		VirtualClass.subjects.delete(id);
	}
}
