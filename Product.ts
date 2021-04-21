export class Product {
    public website : string | undefined;
    public price : Number | -1;
    public name : string | undefined;
    
    constructor(website : string, name : string, price: Number) {
        this.website = website;
        this.price = price;
        this.name = name;
    }
}