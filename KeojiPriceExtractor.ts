import { IPriceExtractor } from "./IPriceExtractor";
import { Product } from "./Product";
import requestPromise from "request-promise";
import cheerio from "cheerio";

export class KeojiPriceExtractor implements IPriceExtractor {
    public ProgId = "Keoji";
    public async extractPrice(searchString: string) : Promise<Product> {
        const product = new Product(this.ProgId, "N/A", -1 );
        const responseHTML = await requestPromise(`https://www.keoji.com.au/search?view=ajax&q=${searchString}&type=product`)
        const $ = cheerio.load(responseHTML);

        var priceStr = $(".Segment__Content .ProductItem__Price.Price")
            .first()
            .text();
        var name = $(".Segment__Content .ProductItem__Title").first().text().trim();
        product.name = name;
        product.price = parseFloat(priceStr?.substring(1));
        return product;
    }
}