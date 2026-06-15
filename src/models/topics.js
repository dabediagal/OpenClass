export class Topic{
    static counter=0;
    constructor(title,description,order,attachment){
        this.title=title;
        this.description=description;
        this.order=order;
        this.attachment=attachment || null;
        Topic.counter++;
        this.id=String(Topic.counter);
    }
}