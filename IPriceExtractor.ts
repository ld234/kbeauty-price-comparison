import { Product } from "./Product";

export interface IPriceExtractor {
    ProgId : string;
    extractPrice: (searchString: string) => Promise<Product>;
}