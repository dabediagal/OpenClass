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

    static getAllSubjects(){
        return Array.from(VirtualClass.subjects.values());
    }

	static deleteUser(id) {
		VirtualClass.users.delete(id);
	}

	static deleteSubject(id) {
		VirtualClass.subjects.delete(id);
	}
}