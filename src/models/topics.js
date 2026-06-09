export class Topic{
    static counter=0;
    constructor(title,descripcion,order){
        this.title=title;
        this.descripcion=descripcion;
        this.order=order;
        Topic.counter++;
        this.id=String(Topic.counter);
        //this.attachment=attachment
    } //ahora le añado lo d attachment
    
}