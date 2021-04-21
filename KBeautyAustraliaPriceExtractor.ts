// #search_query

import { IPriceExtractor } from "./IPriceExtractor";
import { Product } from "./Product";
const Nightmare = require('nightmare')
const nightmare = Nightmare({ show: false })

export class KBeautyAustraliaPriceExtractor implements IPriceExtractor{    
    private url = "http://kbeautyaustralia.com.au/";
    public ProgId = "KBeautyAustralia";

    public async extractPrice (searchString: string) : Promise<Product>
    {
        var product:Product = new Product(this.ProgId, "#NA", -1);
        try {
            await nightmare
                .goto(this.url)
                .click(".navUser-action.navUser-action--quickSearch")
                .wait(".dropdown.dropdown--quickSearch.is-open.f-open-dropdown")
                .type('#search_query', searchString)
                .wait('#quickSearch .quickSearchResults ul.productGrid li.product:first-child .card-text')
                .wait(1000)
                .evaluate(() => {
                    const noProductsFound = document.querySelector("#quickSearch .quickSearchResults ul.productGrid");
                    if (!noProductsFound){
                        return null;
                    }
                    var result = document.querySelector('#quickSearch .quickSearchResults ul.productGrid > li.product:first-child .card-text .price.price--withTax')?.textContent;
                    if (result == null) return result;
                    var price = parseFloat(result.substring(1));
                    var name = document.querySelector('#quickSearch .quickSearchResults ul.productGrid li.product:first-child h4.card-title')?.textContent?.trim() ?? "#NA";
                    return {
                        name, 
                        price,
                    };
                })
                .end()
                .then((result: { name: string | undefined; price: number | Number; result: any} | null) => {

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