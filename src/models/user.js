export class User {
    static counter = 0;
    constructor(name, type, email, password){
        User.counter++;
        this.id = String(User.counter);
        this.name = name;
        this.type = type;
        this.email = email;
        this.password = password;
    }
}