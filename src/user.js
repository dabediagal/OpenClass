export class User {
    static counter = 0;
    constructor(name, type){
        User.counter++;
        this.id = User.counter;
        this.name = name;
        this.type = type;
    }
}