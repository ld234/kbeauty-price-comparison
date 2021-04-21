import { IPriceExtractor } from "./IPriceExtractor";
import { Product } from "./Product";
const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: false });

export class HeartDropPriceExtractor implements IPriceExtractor {
    private url = "https://heartdrops.com.au/search?q="
    public ProgId = "HeartDrop";

    public async extractPrice(searchString: string) {
        const searchUrl = this.url + searchString;
        var product = new Product(this.ProgId, "#N/A", -1);
        try {
            await nightmare
                .goto(searchUrl)
                .wait(".collectionGrid-row.EndlessScroll > .collectionBlock:first-child .price ")
                .evaluate(() => {
                    const productsFound = document.querySelector(".collectionGrid-row.EndlessScroll > .collectionBlock:first-child .price ");
                    if (!productsFound){
                        return null;
                    }
                    var price = document.querySelector(".collectionGrid-row.EndlessScroll > .collectionBlock:first-child .price ")?.textContent ?? " -1";
                    var name = document.querySelector(".collectionGrid-row.EndlessScroll > .collectionBlock:first-child .collectionBlock__title")?.textContent?.trim() ?? "#N/A";
                    return {
                        name, 
                        price: parseFloat(price.substring(1))
                    };
                })
                .end()
                .then((result: { price: number | Number; name: string | undefined; } | null) => {
                    if (result == null) return;
                    product.price = result.price;
                    product.name = result.name;
                })
                .catch((error: any) => {
                    console.error('Search failed:', error)
                })
        } catch(err) {
            console.error(err);
        }
        return product;
    };

}