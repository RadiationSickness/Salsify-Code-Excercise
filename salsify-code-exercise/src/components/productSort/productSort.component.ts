import { Component } from '@angular/core';
import { ProductService } from 'src/services/productService/productService';
import { Operators, ProductsType, Properties, PropertyValueType } from 'src/types/datastoreType';
import { Nullable } from '../../types/globalTypes';

@Component({
  selector: 'product-sort',
  templateUrl: './productSort.component.html',
  styleUrls: ['./productSort.component.scss']
})
export class ProductSortComponent {
    public products:  ProductsType[] = [];
    public properties: Properties[] = [];
    public productsToDisplay: ProductsType[] = [];
    public validOperators: Operators[] = [];

    private activeProperty: Nullable<Properties> = null;
    private operators: Operators[] = [];
    
    constructor(private productService: ProductService) {
        this.products = this.productService.getProducts();
        this.properties = this.productService.getProperties();
        this.operators = this.productService.getOperators();
        this.productsToDisplay = this.products;
    }

    public setProperty(propertyId: string): void {
        this.productsToDisplay = this.products;
        const selectedProperty = this.properties.find((property) => {
            return parseInt(propertyId) === property.id;
        });

        if (selectedProperty) {
            this.getValidOperators(selectedProperty?.type)
            this.activeProperty = selectedProperty;
        }
    }

    public setOperator(operatorId: string): void {
        console.log(this.activeProperty);

        let newProductSet: ProductsType[] = []

        this.products.forEach((product: ProductsType) => {
            if (operatorId === 'any') {
                const hasAttribute = !!product.property_values.find((property: PropertyValueType) => {
                    return property.property_id === this.activeProperty?.id;
                });

                if (hasAttribute) {
                    newProductSet.push(product);
                }
            }
        });

        this.productsToDisplay = newProductSet;
    }

    private getValidOperators(propertyType: string): void {
        const commonOperators = ['equals', 'any', 'none', 'in'];
        let additionalProperties: string[] = [];

        switch(propertyType) {
            case 'string':
                additionalProperties = ['contains'];
                break;
            case 'number':
                additionalProperties = ['greater_than', 'less_than'];
                break;
        }

        const validOperators = commonOperators.concat(additionalProperties);

        this.validOperators = this.operators.filter((operator) => {
            return validOperators.includes(operator.id);
        });
    }
}
