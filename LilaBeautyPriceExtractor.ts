import { IPriceExtractor } from "./IPriceExtractor";
import { Product } from "./Product";
const Nightmare = require('nightmare')
const nightmare = Nightmare({ show: false })

export class LilaBeautyPriceExtractor implements IPriceExtractor{    
    private url = "https://lilabeauty.com.au/pages/search-results-page?q=";
    public ProgId = "LilaBeauty";

    public async extractPrice (searchString: string) : Promise<Product>
    {
        const searchUrl = this.url + searchString;
        var product:Product = new Product(this.ProgId, "#NA", -1);
        try {
            await nightmare
                .goto(searchUrl)
                .wait('ul.snize-search-results-content .snize-price')
                .evaluate(() => {
                    const noProductsFound = document.querySelector(".snize-no-products-found-text");
                    if (noProductsFound){
                        return null;
                    }
                    var result = document.querySelector('ul.snize-search-results-content li:first-child .snize-price')?.textContent;
                    if (result == null) return result;
                    var price = parseFloat(result.substring(1));
                    var name = document.querySelector('ul.snize-search-results-content li:first-child .snize-title')?.textContent?.trim() ?? "#NA";
                    return {
                        name, 
                        price,
                    };
                })
                .end()
                .then((result: { name: string | undefined; price: number | Number; } | null) => {
                    if (result != null) {
                        product.name = result.name;
                        product.price = result.price;
                    }
                })
                .catch((error: any) => {
                    console.error('Search failed:', error)
                })
        } catch(err) {
            console.error(err);
        }
        return product;
    }
}