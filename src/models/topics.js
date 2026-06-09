export class Topic{
    static counter=0;
    constructor(title,descripcion,order,attachment){
        this.title=title;
        this.descripcion=descripcion;
        this.order=order;
        this.attachment=attachment || null;
        Topic.counter++;
        this.id=String(Topic.counter);
    }
}