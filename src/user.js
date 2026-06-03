export class User {
    static counter = 0;
    constructor(name, type){
        counter++;
        this.id = User.counter;
        this.name = name;
        this.type = type;
    }
}