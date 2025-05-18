export type User = {
  id: string;
  email: string;
  username: string;
  avatarUrl?: string;
};

export type ProductCategory = 'Electronics' | 'Furniture' | 'Clothing' | 'Books' | 'Home Goods' | 'Other';

export const productCategories: ProductCategory[] = ['Electronics', 'Furniture', 'Clothing', 'Books', 'Home Goods', 'Other'];

export type Product = {
  id: string;
  title: string;
  description: string;
  category: ProductCategory;
  price: number;
  imageUrl: string; // Placeholder URL
  sellerId: string;
  sellerName: string;
  createdAt: string;
};

export type CartItem = {
  id: string;
  product: Product;
  quantity: number;
};

export type OrderItem = {
  id: string;
  product: Product;
  quantity: number;
  purchaseDate: string;
};
