import { Injectable } from '@angular/core';
import { DataStoreType, Operators, ProductsType, Properties } from 'src/types/datastoreType';
import { products } from './productData';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private productsData: DataStoreType = products;

    constructor() { }

    public getProducts(): ProductsType[] {
        return this.productsData.products;
    }

    public getProperties(): Properties[] {
       return this.productsData.properties;
    }

    public getOperators(): Operators[] {
        return this.productsData.operators;
    }
}