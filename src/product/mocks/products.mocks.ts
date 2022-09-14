export const products = [
  { id: 1, name: "Milk", cost: 20, amountAvailable: 10, sellerId: 1 },
  { id: 2, name: "Cheese", cost: 20, amountAvailable: 10, sellerId: 1 },
  { id: 3, name: "Bread", cost: 20, amountAvailable: 10, sellerId: 1 },
];

export const postProductDto = {
  name: "Cheese",
  cost: 20,
  amountAvailable: 10,
};

export const putProductDto = {
  name: "Bread",
  cost: 20,
  amountAvailable: 10,
};

export const jwtDto = { user: { id: 1 } };
