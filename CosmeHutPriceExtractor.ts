import { IPriceExtractor } from "./IPriceExtractor";
import { Product } from "./Product";
import requestPromise from "request-promise";
import cheerio from "cheerio";

export class CosmeHutPriceExtractor implements IPriceExtractor {
    public ProgId = "CosmeHut";
    public async extractPrice(searchString: string) : Promise<Product> {
        const product = new Product(this.ProgId, "N/A", -1 );
        const responseHTML = await requestPromise(`https://www.cosmehut.com.au/search?q=${searchString}`)
        const $ = cheerio.load(responseHTML);

        var priceStr = $(".price-item.price-item--sale")
            .first()
            .text();
        var name = $(".product-card__title").first().text().trim();
        product.name = name;
        product.price = parseFloat(priceStr?.substring(1));
        return product;
    }
}