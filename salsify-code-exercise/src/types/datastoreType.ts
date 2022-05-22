enum ColorsEnum {
    brown = 'brown',
    silver = 'silver',
    white = 'white',
    grey = 'grey',
    black = 'black'
}

export type DataStoreType = {
    products: ProductsType[],
    properties: Properties[],
    operators: Operators[],
}

export type ProductsType = {
    id: number,
    property_values: PropertyValueType[],
}

export type Properties = {
    id: number,
    name: string,
    type: string,
    values?: string[],
}

export type Operators = {
    text: string,
    id: string,
}

export type PropertyValueType = {
    property_id: number,
    value: string | number | boolean | ColorsEnum,
}
