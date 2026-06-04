export class User {
    static counter = 0;
    constructor(name, type){
        User.counter++;
        this.id = String(User.counter);
        this.name = name;
        this.type = type;
    }
}