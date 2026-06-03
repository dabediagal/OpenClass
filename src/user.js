export class User {
    counter = 0;
    constructor(name, type){
        counter++;
        this.id = this.counter;
        this.name = name;
        this.type = type;
    }
}