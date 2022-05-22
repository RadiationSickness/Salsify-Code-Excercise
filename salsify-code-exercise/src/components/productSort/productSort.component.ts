import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductService } from 'src/services/productService/productService';
import { ComparisonOperator, OperatorEnum, Operators, ProductsType, Properties, PropertyValueType } from 'src/types/datastoreType';
import { Nullable } from '../../types/globalTypes';


@Component({
    selector: 'product-sort',
    templateUrl: './productSort.component.html',
    styleUrls: ['./productSort.component.scss']
})
export class ProductSortComponent {
    public products: ProductsType[] = [];
    public properties: Properties[] = [];
    public productsToDisplay: ProductsType[] = [];
    public validOperators: Operators[] = [];
    public sortForm: FormGroup;
    public additionInputRequired: Nullable<string> = null;
    public activePropertyEnums: string[] = []

    private activeProperty: Nullable<Properties> = null;
    public activeOperator: Nullable<OperatorEnum> = null;
    private operators: Operators[] = [];
    private comparisonOperators = {
        'equals': ((productValue: any, searchValue: any) => { return productValue === searchValue }),
        'greater_than': ((productValue: any, searchValue: any) => { return productValue > searchValue }),
        'less_than': ((productValue: any, searchValue: any) => { return productValue < searchValue }),
        'in': ((productValue: any, searchValue: any) => {
            const cleanedSearchValue = searchValue.replace(/\s/g, '');
            const searchValueArr = cleanedSearchValue.split(',');
            return searchValueArr.includes(productValue);
        }),
        'contains': ((productValue: any, searchValue: any) => {
            const cleanedSearchValue = searchValue.toLowerCase();
            const cleanedProductValue = productValue.toLowerCase();
            return cleanedProductValue.includes(cleanedSearchValue);
        }),
    };

    constructor(private productService: ProductService) {
        this.products = this.productService.getProducts();
        this.properties = this.productService.getProperties();
        this.operators = this.productService.getOperators();
        this.resetProducts();

        this.sortForm = new FormGroup({
            sortProperty: new FormControl('', Validators.required),
            sortOperator: new FormControl('', Validators.required),
            textSearch: new FormControl('', Validators.required),
            enumeratedSearch: new FormControl('', Validators.required),
        });
    }


    public setProperty(): void {
        const selectedPropertyId = this.sortForm.get('sortProperty')?.value;
        this.sortForm.get('sortOperator')?.setValue('');
        this.additionInputRequired = null;
        this.resetProducts();

        const selectedProperty = this.properties.find((property) => {
            return parseInt(selectedPropertyId) === property.id;
        });

        if (selectedProperty) {
            this.getValidOperators(selectedProperty?.type)
            this.activePropertyEnums = selectedProperty.values ?? [];
            this.activeProperty = selectedProperty;
        }
    }

    public setOperator(): void {
        this.resetProducts();
        if (!this.activeProperty) return;

        const noValueNeededOperators = [OperatorEnum.any, OperatorEnum.none];
        const selectedOperatorId = this.sortForm.get('sortOperator')?.value;
        this.activeOperator = selectedOperatorId;
        this.resetSearchFields();

        if (noValueNeededOperators.includes(selectedOperatorId)) {
            this.additionInputRequired = null;
            this.productsToDisplay = this.handleAnyOrNoneOperator(selectedOperatorId);
            return;
        }

        this.additionInputRequired = this.activeProperty.type;
    }

    public inputSearch(inputValue: string): void {
        if (!inputValue || !this.activeOperator) {
            this.resetProducts();
            return;
        };

        const comparisonOperators = [OperatorEnum.equals, OperatorEnum.greaterThan, OperatorEnum.lessThan, OperatorEnum.in, OperatorEnum.contains];
        const currentOperator: any = this.activeOperator;
        let searchValue: string | number = inputValue;

        if (!comparisonOperators.includes(currentOperator)) {
            return;
        }

        if (!Number.isNaN(Number(searchValue))) {
            searchValue = parseInt(searchValue, 10);
        }

        let newProductSet: ProductsType[] = []

        this.products.forEach((product: ProductsType) => {
            const productProperty = product.property_values.find((property: PropertyValueType) => {
                return property.property_id === this.activeProperty?.id;
            });

            if (productProperty) {
                if (this.comparisonOperators[currentOperator as ComparisonOperator](productProperty.value, searchValue)) {
                    newProductSet.push(product);
                }
            }
        });

        this.productsToDisplay = newProductSet;
    }

    public enumSearch(): void {
        const enumSearchValue = this.sortForm.get('enumeratedSearch')?.value;
        if (!enumSearchValue) return;

        this.inputSearch(enumSearchValue.join(','));
    }

    public clearSortForm(): void {
        this.sortForm.get('sortProperty')?.setValue('');
        this.sortForm.get('sortOperator')?.setValue('');
        this.validOperators = [];
        this.additionInputRequired = null;
        this.resetProducts();
    }

    private getValidOperators(propertyType: string): void {
        const commonOperators = ['equals', 'any', 'none', 'in'];
        let additionalProperties: string[] = [];

        // @NOTE: Could be 'if' statements but this looks cleaner with switch
        switch (propertyType) {
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

    private handleAnyOrNoneOperator(selectedOperatorId: OperatorEnum): ProductsType[] {
        let newProductSet: ProductsType[] = []

        this.products.forEach((product: ProductsType) => {
            const hasAttribute = !!product.property_values.find((property: PropertyValueType) => {
                return property.property_id === this.activeProperty?.id;
            });

            if (hasAttribute && selectedOperatorId === OperatorEnum.any) {
                newProductSet.push(product);
            }

            if (!hasAttribute && selectedOperatorId === OperatorEnum.none) {
                newProductSet.push(product);
            }
        });

        return newProductSet;
    }

    private resetProducts(): void {
        this.productsToDisplay = this.products;
    }

    private resetSearchFields(): void {
        this.sortForm.get('textSearch')?.setValue('');
    }
}
