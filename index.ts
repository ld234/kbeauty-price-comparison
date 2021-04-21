import program from 'commander';
import { LilaBeautyPriceExtractor } from './LilaBeautyPriceExtractor';
import { KikoAndBeautyPriceExtractor } from './KikoAndBeautyPriceExtractor';
import { HeartDropPriceExtractor } from './HeartDropPriceExtractor';
import { Product } from './Product';
import { KeojiPriceExtractor } from './KeojiPriceExtractor';
import { KBeautyAustraliaPriceExtractor } from './KBeautyAustraliaPriceExtractor';
import { CosmeHutPriceExtractor } from './CosmeHutPriceExtractor';
import { LaCosmetiquePriceExtractor } from './LaCosmetiquePriceExtractor';

program
    .requiredOption('-s, --search-string <string>', 'string to search for')
    .option('-c, --num-chapters <number>', 'Number of chapters');

program.parse(process.argv);

const lilaBeauty = new LilaBeautyPriceExtractor();
const kikoAndBeauty = new KikoAndBeautyPriceExtractor();
const heartDrop = new HeartDropPriceExtractor();
const keoji = new KeojiPriceExtractor();
const kBeautyAus = new KBeautyAustraliaPriceExtractor();
const cosmeHut = new CosmeHutPriceExtractor();
const laCosmetique = new LaCosmetiquePriceExtractor();


const allWebsites = [ lilaBeauty, kikoAndBeauty, heartDrop, keoji, kBeautyAus, cosmeHut, laCosmetique ];
(async () => {
    const promises:Promise<Product>[] = [];
    allWebsites.forEach(async extractor => {
        promises.push(extractor.extractPrice(program.searchString));
    });
    console.log(`Searching on ${allWebsites.length} websites...`);
    Promise.all(promises)
        .then((products) => {
            let i = 1;
            const tempArray:string[] = [];
            products
                .filter(p => p != undefined)
                .sort((p1: Product, p2: Product) => {
                    if (p1.price == p2.price ) return 0;
                    return p1.price < p2.price ? -1 : 1;
                })
                .forEach((product) => {
                    var website = `[${product.website}]`.padEnd(20);
                    if (product.price > 0)
                        console.log(`${(i++).toString().padEnd(3)}${website} ${product.name?.padEnd(70)} $${product.price.toFixed(2)}`);
                    else {
                        tempArray.push(product.website ?? "N/A");
                    }
                });
            if(tempArray.length > 0)
                console.log (`Cannot find "${program.searchString}" on ${tempArray.join(', ')}.`);
        })
        .catch(err => console.error(err))
})();