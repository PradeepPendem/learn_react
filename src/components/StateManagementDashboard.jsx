import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { mockApi } from '../services/apiMock';
import {
  addToCart,
  removeFromCart,
  clearCart,
  selectCart,
  selectCartTotal,
  selectCartItemCount,
  selectLogs,
  addLog
} from '../store/uiSlice';
import {
  Database,
  ShoppingCart,
  Trash2,
  Plus,
  RefreshCw,
  Info,
  Terminal,
  Activity
} from 'lucide-react';

export default function StateManagementDashboard() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  // Redux Selectors
  const cart = useSelector(selectCart);
  const cartTotal = useSelector(selectCartTotal);
  const cartItemCount = useSelector(selectCartItemCount);
  const devLogs = useSelector(selectLogs);

  // Filter States
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  // Add Product Form State
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('Electronics');
  const [newProductPrice, setNewProductPrice] = useState('99');
  const [newProductStock, setNewProductStock] = useState('10');

  // ==========================================
  // 1. TANSTACK REACT QUERY: FETCH PRODUCTS
  // ==========================================
  const {
    data: products = [],
    isLoading,
    isFetching,
    error,
    refetch
  } = useQuery({
    queryKey: ['products', { search, category }],
    queryFn: () => {
      dispatch(addLog({ type: 'QUERY_FETCH_START', message: `React Query: Fetching products (search: "${search}", category: "${category}")` }));
      return mockApi.fetchProducts({ search, category });
    },
    // Triggers logs when the query completes successfully
    onSuccess: (data) => {
      dispatch(addLog({ type: 'QUERY_FETCH_SUCCESS', message: `React Query: Received ${data.length} products (Cached in store)` }));
    },
    // We can also track when query updates happen using staleTime
    staleTime: 5000, // consider data fresh for 5 seconds
  });

  // Log on success/fetching changes via useEffect
  React.useEffect(() => {
    if (!isLoading && !isFetching && products.length > 0) {
      dispatch(addLog({ type: 'QUERY_CACHE_HIT', message: `React Query: Rendered ${products.length} products from cache/server` }));
    }
  }, [products, isFetching, isLoading, dispatch]);


  // ==========================================
  // 2. MUTATION: DELETE PRODUCT (OPTIMISTIC UPDATES EXAMPLE)
  // ==========================================
  const deleteMutation = useMutation({
    mutationFn: mockApi.deleteProduct,
    
    // OPTIMISTIC UPDATE IMPLEMENTATION
    onMutate: async (productId) => {
      dispatch(addLog({ type: 'MUTATION_START', message: `Optimistic Update: Deleting product id ${productId} immediately from local cache` }));
      
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ['products'] });

      // Snapshot the previous value
      const previousProducts = queryClient.getQueryData(['products', { search, category }]);

      // Optimistically update to the new value
      queryClient.setQueryData(
        ['products', { search, category }],
        (old) => old ? old.filter(p => p.id !== productId) : []
      );

      // Return context object with snapshotted value
      return { previousProducts };
    },
    
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, productId, context) => {
      dispatch(addLog({ type: 'MUTATION_ERROR', message: `Mutation Failed! Rolling back changes for id ${productId}` }));
      queryClient.setQueryData(
        ['products', { search, category }],
        context.previousProducts
      );
    },
    
    // Always refetch or invalidate queries after success or error to sync state
    onSuccess: (data) => {
      dispatch(addLog({ type: 'MUTATION_SUCCESS', message: `Mutation Success: Deleted product id ${data}` }));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });


  // ==========================================
  // 3. MUTATION: ADD PRODUCT
  // ==========================================
  const addMutation = useMutation({
    mutationFn: mockApi.addProduct,
    onMutate: (newProduct) => {
      dispatch(addLog({ type: 'MUTATION_START', message: `Adding product: "${newProduct.name}"...` }));
    },
    onSuccess: (createdProduct) => {
      dispatch(addLog({ type: 'MUTATION_SUCCESS', message: `Mutation Success: Created product "${createdProduct.name}" with ID: ${createdProduct.id}` }));
      queryClient.invalidateQueries({ queryKey: ['products'] });
      // Reset form
      setNewProductName('');
    }
  });

  const handleAddProductSubmit = (e) => {
    e.preventDefault();
    if (!newProductName.trim()) return;

    addMutation.mutate({
      name: newProductName,
      category: newProductCategory,
      price: Number(newProductPrice) || 0,
      stock: Number(newProductStock) || 0
    });
  };

  const handleResetDb = async () => {
    dispatch(addLog({ type: 'DB_RESET', message: 'Resetting mock database to defaults...' }));
    await mockApi.resetDatabase();
    queryClient.invalidateQueries({ queryKey: ['products'] });
  };

  return (
    <div className="module-container">
      <div className="module-header">
        <div className="header-icon animate-pulse">
          <Database className="icon-blue" />
        </div>
        <div>
          <h2>Client & Server State Dashboard</h2>
          <p className="subtitle">
            Experience the combination of <strong>Redux Toolkit (Client UI State)</strong> and <strong>TanStack React Query (Async Server State)</strong>. Inspect caching, mutations, and optimistic updates.
          </p>
        </div>
      </div>

      <div className="grid-2col">
        {/* Left Column: Server State (React Query) */}
        <div className="flex flex-col gap-4">
          <div className="card">
            <div className="card-header justify-between">
              <div className="flex items-center gap-2">
                <Activity className="text-blue-400" />
                <h3>Inventory Manager (Server State)</h3>
                {isFetching && <span className="loader-dots">fetching...</span>}
              </div>
              <button
                className="btn-icon"
                onClick={() => refetch()}
                title="Force Query Refetch"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {/* Filter Row */}
            <div className="filters-row p-4 flex gap-2">
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-text flex-1"
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input-select"
              >
                <option value="">All Categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Audio">Audio</option>
                <option value="Furniture">Furniture</option>
              </select>
            </div>

            {/* Products List */}
            <div className="products-list-container p-4">
              {isLoading ? (
                <div className="loading-spinner">
                  <RefreshCw className="animate-spin text-blue-500 mx-auto w-8 h-8" />
                  <p className="mt-2 text-sm text-secondary">Loading products from mock API...</p>
                </div>
              ) : error ? (
                <div className="error-message">Error fetching products: {error.message}</div>
              ) : products.length === 0 ? (
                <div className="p-4 text-center text-secondary text-sm">No products found matching filters.</div>
              ) : (
                <div className="products-grid">
                  {products.map((product) => (
                    <div key={product.id} className="product-card flex items-center justify-between border-b border-border py-2.5">
                      <div>
                        <span className="product-name font-medium">{product.name}</span>
                        <div className="product-meta text-xs text-secondary mt-0.5">
                          <span className="badge-cat">{product.category}</span>
                          <span className="ml-2">Stock: {product.stock}</span>
                          <span className="ml-2 text-yellow-500 font-semibold">★ {product.rating}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="product-price font-mono font-bold">${product.price}</span>
                        <button
                          className="btn-sm btn-primary"
                          onClick={() => {
                            dispatch(addToCart({ id: product.id, name: product.name, price: product.price }));
                          }}
                        >
                          <Plus className="w-3.5 h-3.5 mr-0.5" /> Cart
                        </button>
                        <button
                          className="btn-sm btn-danger-icon"
                          onClick={() => deleteMutation.mutate(product.id)}
                          title="Delete Product (Optimistic Update)"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add Product Inline Form */}
            <form onSubmit={handleAddProductSubmit} className="add-product-form border-t border-border p-4 bg-card-dark">
              <span className="text-xs font-semibold block mb-2">Create New Product (React Query Mutation)</span>
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Product Name..."
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="input-text"
                  required
                />
                <div className="flex gap-2">
                  <select
                    value={newProductCategory}
                    onChange={(e) => setNewProductCategory(e.target.value)}
                    className="input-select flex-1"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Audio">Audio</option>
                    <option value="Furniture">Furniture</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Price ($)"
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(e.target.value)}
                    className="input-text w-20"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Stock"
                    value={newProductStock}
                    onChange={(e) => setNewProductStock(e.target.value)}
                    className="input-text w-16"
                    required
                  />
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={addMutation.isPending}
                  >
                    {addMutation.isPending ? 'Saving...' : 'Add'}
                  </button>
                </div>
              </div>
            </form>
            <div className="p-3 bg-secondary-dark flex justify-between items-center text-xs">
              <span className="text-secondary">Simulated REST API latency: 1.2 seconds</span>
              <button className="btn-sm btn-outline text-2xs" onClick={handleResetDb}>Reset Mock Database</button>
            </div>
          </div>
        </div>

        {/* Right Column: Client State (Redux Toolkit) + Dev Logs Console */}
        <div className="flex flex-col gap-4">
          {/* Shopping Cart Card */}
          <div className="card">
            <div className="card-header">
              <ShoppingCart className="text-purple-400 mr-2" />
              <h3>Shopping Cart (Redux Client State)</h3>
              <span className="badge badge-purple ml-auto">{cartItemCount} items</span>
            </div>
            
            <div className="p-4">
              {cart.length === 0 ? (
                <p className="text-sm text-center text-secondary py-6">Your shopping cart is empty. Add products from inventory.</p>
              ) : (
                <div className="cart-list flex flex-col gap-2">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center bg-card-dark p-2 rounded text-sm">
                      <div>
                        <span className="font-semibold">{item.name}</span>
                        <div className="text-xs text-secondary">
                          ${item.price} x {item.quantity}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          className="btn-sm btn-outline px-2 py-0.5"
                          onClick={() => dispatch(removeFromCart(item.id))}
                        >
                          -
                        </button>
                        <span className="font-mono">{item.quantity}</span>
                        <button
                          className="btn-sm btn-outline px-2 py-0.5"
                          onClick={() => dispatch(addToCart({ id: item.id, name: item.name, price: item.price }))}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="border-t border-border mt-3 pt-3 flex justify-between items-center">
                    <span className="font-semibold">Total Price:</span>
                    <span className="font-mono text-lg font-bold text-purple-400">${cartTotal}</span>
                  </div>
                  
                  <button className="btn btn-outline-danger mt-2 w-full" onClick={() => dispatch(clearCart())}>
                    Clear Shopping Cart
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Dev Logs / Event Console */}
          <div className="card dev-logs-card">
            <div className="card-header">
              <Terminal className="text-green-400 mr-2" />
              <h3>Dev Event Logger (Console)</h3>
            </div>
            <div className="p-4 bg-dark text-xs font-mono max-h-56 overflow-y-auto">
              {devLogs.length === 0 ? (
                <p className="text-secondary">Ready. Interact with React Query list or Redux cart to trigger events...</p>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {devLogs.map((log) => (
                    <div key={log.id} className="log-line">
                      <span className="log-time text-secondary mr-2">[{log.timestamp}]</span>
                      <span className={`log-badge badge-${log.type.toLowerCase().substring(0, 5)} mr-2`}>
                        {log.type}
                      </span>
                      <span className="log-msg text-white">{log.message}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
