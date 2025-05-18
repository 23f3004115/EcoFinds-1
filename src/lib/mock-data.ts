import type { User, Product, CartItem, OrderItem, ProductCategory } from '@/types';

export const mockUsers: User[] = [
  { id: 'user1', email: 'testuser@example.com', username: 'SustainableSally', avatarUrl: 'https://placehold.co/100x100.png' },
];

export const mockProducts: Product[] = [
  {
    id: 'prod1',
    title: 'Vintage Leather Jacket',
    description: 'A stylish vintage leather jacket, barely worn. Great condition.',
    category: 'Clothing',
    price: 75.00,
    imageUrl: 'https://placehold.co/600x400.png',
    sellerId: 'user1',
    sellerName: 'SustainableSally',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    id: 'prod2',
    title: 'Ergonomic Office Chair',
    description: 'Comfortable ergonomic office chair, perfect for home office setups.',
    category: 'Furniture',
    price: 120.00,
    imageUrl: 'https://placehold.co/600x400.png',
    sellerId: 'user2',
    sellerName: 'EcoEthan',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    id: 'prod3',
    title: 'Classic Novel Set',
    description: 'A collection of 5 classic novels in hardcover.',
    category: 'Books',
    price: 30.00,
    imageUrl: 'https://placehold.co/600x400.png',
    sellerId: 'user1',
    sellerName: 'SustainableSally',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
  },
  {
    id: 'prod4',
    title: 'Wireless Bluetooth Headphones',
    description: 'Noise-cancelling wireless headphones with great battery life.',
    category: 'Electronics',
    price: 50.00,
    imageUrl: 'https://placehold.co/600x400.png',
    sellerId: 'user3',
    sellerName: 'RecycleRita',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
  },
  {
    id: 'prod5',
    title: 'Handmade Ceramic Mug Set',
    description: 'Set of 4 beautiful handmade ceramic mugs.',
    category: 'Home Goods',
    price: 40.00,
    imageUrl: 'https://placehold.co/600x400.png',
    sellerId: 'user1',
    sellerName: 'SustainableSally',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
  },
];

export const mockCartItems: CartItem[] = [
  { id: 'cart1', product: mockProducts[1], quantity: 1 },
  { id: 'cart2', product: mockProducts[3], quantity: 2 },
];

export const mockPurchases: OrderItem[] = [
  { id: 'order1', product: mockProducts[0], quantity: 1, purchaseDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() }, // 1 week ago
  { id: 'order2', product: mockProducts[2], quantity: 1, purchaseDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString() }, // 2 weeks ago
];

// Mock API functions (these would interact with a real backend)
export const getCurrentUser = async (): Promise<User | null> => {
  // Simulate auth check
  // In a real app, this would check a session or token
  // For now, let's assume user1 is logged in. Set to null to test unauthenticated state.
  // await new Promise(resolve => setTimeout(resolve, 50)); // Simulate network delay
  const isAuthenticated = typeof window !== 'undefined' ? localStorage.getItem('isLoggedIn') === 'true' : false;
  return isAuthenticated ? mockUsers[0] : null;
};

export const loginUser = async (email: string, password_unused: string): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const user = mockUsers.find(u => u.email === email);
  if (user) {
    if (typeof window !== 'undefined') localStorage.setItem('isLoggedIn', 'true');
    return user;
  }
  throw new Error('Invalid credentials');
};

export const signupUser = async (email: string, username: string, password_unused: string): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const newUser: User = { id: `user${mockUsers.length + 1}`, email, username };
  mockUsers.push(newUser);
   if (typeof window !== 'undefined') localStorage.setItem('isLoggedIn', 'true');
  return newUser;
};

export const logoutUser = async (): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  if (typeof window !== 'undefined') localStorage.removeItem('isLoggedIn');
};


export const getProducts = async (filters?: { category?: ProductCategory, searchTerm?: string }): Promise<Product[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  let products = [...mockProducts];
  if (filters?.category) {
    products = products.filter(p => p.category === filters.category);
  }
  if (filters?.searchTerm) {
    products = products.filter(p => p.title.toLowerCase().includes(filters.searchTerm!.toLowerCase()));
  }
  return products.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const getProductById = async (id: string): Promise<Product | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockProducts.find(p => p.id === id);
};

export const createProduct = async (productData: Omit<Product, 'id' | 'sellerName' | 'createdAt'>): Promise<Product> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error("User not authenticated");
  const newProduct: Product = {
    ...productData,
    id: `prod${mockProducts.length + 1}`,
    sellerName: currentUser.username,
    createdAt: new Date().toISOString(),
  };
  mockProducts.unshift(newProduct);
  return newProduct;
};

export const updateProduct = async (productId: string, productData: Partial<Product>): Promise<Product> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const productIndex = mockProducts.findIndex(p => p.id === productId);
  if (productIndex === -1) throw new Error("Product not found");
  mockProducts[productIndex] = { ...mockProducts[productIndex], ...productData };
  return mockProducts[productIndex];
}

export const deleteProduct = async (productId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const productIndex = mockProducts.findIndex(p => p.id === productId);
  if (productIndex === -1) throw new Error("Product not found");
  mockProducts.splice(productIndex, 1);
}


export const getUserListings = async (userId: string): Promise<Product[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockProducts.filter(p => p.sellerId === userId)
    .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const updateUserProfile = async (userId: string, data: Partial<User>): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const userIndex = mockUsers.findIndex(u => u.id === userId);
  if (userIndex === -1) throw new Error('User not found');
  mockUsers[userIndex] = { ...mockUsers[userIndex], ...data };
  return mockUsers[userIndex];
};

export const getCartItems = async (userId_unused: string): Promise<CartItem[]> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return [...mockCartItems];
};

export const addToCart = async (userId_unused: string, productId: string, quantity: number): Promise<CartItem> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  const product = await getProductById(productId);
  if (!product) throw new Error('Product not found');
  
  const existingItemIndex = mockCartItems.findIndex(item => item.product.id === productId);
  if (existingItemIndex > -1) {
    mockCartItems[existingItemIndex].quantity += quantity;
    return mockCartItems[existingItemIndex];
  } else {
    const newItem: CartItem = { id: `cart${mockCartItems.length + 1}`, product, quantity };
    mockCartItems.push(newItem);
    return newItem;
  }
};

export const removeFromCart = async (userId_unused: string, cartItemId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  const itemIndex = mockCartItems.findIndex(item => item.id === cartItemId);
  if (itemIndex > -1) {
    mockCartItems.splice(itemIndex, 1);
  } else {
    throw new Error('Item not found in cart');
  }
};

export const updateCartItemQuantity = async (userId_unused: string, cartItemId: string, quantity: number): Promise<CartItem> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  const itemIndex = mockCartItems.findIndex(item => item.id === cartItemId);
  if (itemIndex > -1) {
    if (quantity <= 0) {
      mockCartItems.splice(itemIndex, 1);
      throw new Error('Quantity must be positive. Item removed if zero or less.'); // Or handle as remove
    }
    mockCartItems[itemIndex].quantity = quantity;
    return mockCartItems[itemIndex];
  } else {
    throw new Error('Item not found in cart');
  }
}

export const getPreviousPurchases = async (userId_unused: string): Promise<OrderItem[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return [...mockPurchases];
};
