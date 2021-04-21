import { IPriceExtractor } from "./IPriceExtractor";
import cheerio from 'cheerio';
import requestPromise from "request-promise";
import { Product } from "./Product";

export class KikoAndBeautyPriceExtractor implements IPriceExtractor {
    private url = "https://kikoandbeauty.com/search?type=product%2Carticle%2Cpage&q=";
    public ProgId = "KikoAndBeauty";

    public async extractPrice(searchString: string) : Promise<Product> {
        const responseHTML = await requestPromise({
            uri: this.url + searchString,
        });
        const $ = cheerio.load(responseHTML);

        var result = $(".grid--uniform .grid-product")
            .first()
            .find(".grid-product__price")
            .html();
        var productName = $(".grid--uniform .grid-product")
        .first()
        .find(".grid-product__title")
        .html() ?? "#N/A";
        var price:Number = result == null ? -1 : parseFloat(result.substring(1));
        return new Product(this.ProgId, productName.trim(), price);
    }

}