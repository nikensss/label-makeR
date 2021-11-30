// TODO: this interface is copy-pasted from the frontend code!!!
export interface ICoffeeOrigin {
  label: string;
  id: string;
  weight: Weight;
  price: Price;
}

export interface Weight {
  amount: number;
  unit: string;
}

export interface Price {
  amount: number;
  unit: string;
  id: string;
}
