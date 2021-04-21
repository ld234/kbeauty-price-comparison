import { IPriceExtractor } from "./IPriceExtractor";
import { Product } from "./Product";
import requestPromise from "request-promise";
import cheerio from "cheerio";

export class LaCosmetiquePriceExtractor implements IPriceExtractor {
    public ProgId = "LaCosmetique";
    public async extractPrice(searchString: string) : Promise<Product> {
        const product = new Product(this.ProgId, "N/A", -1 );
        const responseHTML = await requestPromise(`https://www.lacosmetique.com.au/?s=${searchString}`);
        var $ = cheerio.load(responseHTML);
        var name = $("h2.entry_title a").first().text().trim();
        var url = $("h2.entry_title a")
            .first()
            .attr("href");
        if (!url) 
            return product;
        const responseHTML2 = await requestPromise(url);
        $ = cheerio.load(responseHTML2);
    
        var priceStr = $("p.price .woocommerce-Price-amount.amount")
            .first()
            .text();
        product.name = name;
        product.price = parseFloat(priceStr?.substr(1));
        return product;
    }
}