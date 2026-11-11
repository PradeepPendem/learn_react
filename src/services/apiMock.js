// Mock data stored in memory/localStorage
const DEFAULT_PRODUCTS = [
  { id: '1', name: 'MacBook Pro 16"', category: 'Electronics', price: 2499, stock: 12, rating: 4.8 },
  { id: '2', name: 'iPad Pro 11"', category: 'Electronics', price: 799, stock: 25, rating: 4.7 },
  { id: '3', name: 'Ergonomic Desk Chair', category: 'Furniture', price: 349, stock: 8, rating: 4.5 },
  { id: '4', name: 'Mechanical Keyboard', category: 'Electronics', price: 129, stock: 50, rating: 4.6 },
  { id: '5', name: 'Noise Cancelling Headphones', category: 'Audio', price: 299, stock: 18, rating: 4.4 },
  { id: '6', name: 'Smart Fitness Watch', category: 'Electronics', price: 199, stock: 30, rating: 4.2 },
  { id: '7', name: 'Adjustable Standing Desk', category: 'Furniture', price: 499, stock: 5, rating: 4.8 },
  { id: '8', name: 'Studio Monitor Speakers', category: 'Audio', price: 399, stock: 10, rating: 4.6 },
];

const getStoredProducts = () => {
  const stored = localStorage.getItem('react_masterclass_products');
  if (!stored) {
    localStorage.setItem('react_masterclass_products', JSON.stringify(DEFAULT_PRODUCTS));
    return DEFAULT_PRODUCTS;
  }
  return JSON.parse(stored);
};

const setStoredProducts = (products) => {
  localStorage.setItem('react_masterclass_products', JSON.stringify(products));
};

// Simulate network latency helper
const delay = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockApi = {
  // Fetch products with optional filtering/pagination
  fetchProducts: async ({ search = '', category = '' } = {}) => {
    await delay(1200); // 1.2s realistic delay
    let products = getStoredProducts();

    if (search) {
      products = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    }
    if (category) {
      products = products.filter(p => p.category === category);
    }

    return products;
  },

  // Add a product
  addProduct: async (newProduct) => {
    await delay(800);
    const products = getStoredProducts();
    const productWithId = {
      ...newProduct,
      id: Math.random().toString(36).substr(2, 9),
      price: Number(newProduct.price),
      stock: Number(newProduct.stock),
      rating: 5.0
    };
    products.unshift(productWithId); // add to top
    setStoredProducts(products);
    return productWithId;
  },

  // Delete a product
  deleteProduct: async (id) => {
    await delay(800);
    const products = getStoredProducts();
    const filtered = products.filter(p => p.id !== id);
    setStoredProducts(filtered);
    return id;
  },

  // Reset demo data
  resetDatabase: async () => {
    await delay(600);
    localStorage.setItem('react_masterclass_products', JSON.stringify(DEFAULT_PRODUCTS));
    return DEFAULT_PRODUCTS;
  }
};
