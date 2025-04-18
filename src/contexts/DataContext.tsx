import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

// Product interface
export interface Product {
  id: number;
  sku_id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

export interface Predictions {
  name: string;
  stock: number;
}

// OrderItem interface
export interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  price: number;
}

// Order interface
export interface Order {
  id: number;
  date: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  items: OrderItem[];
  customer: string;
}

// Customer interface
export interface Customer {
  id: number;
  name: string;
}

interface StockPredictionPayload { // Renamed for clarity
  product_id: number;
  week_number: number; // Corrected from 'week'
  month: number; // Added month
  store_id: string;
  total_price: number;
  base_price: number;
  is_featured_sku: boolean;
  is_display_sku: boolean;
}

// Define an interface for the structure returned by the backend create endpoint
interface StockPredictionResponse extends StockPredictionPayload {
    id: number;
    product: { // Assuming nested product data is returned
        id: number;
        name: string;
    };
    predicted_stock: number;
    created_at: string; // Or Date if you parse it
}


interface DataContextType {
  products: Product[];
  orders: Order[];
  predictions: Predictions[]; // This seems for the list view
  customers: Customer[];
  cart: OrderItem[];
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: number) => void;
  addToCart: (productId: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  checkout: () => void;
  cancelOrder: (orderId: number) => void;
  updateOrderStatus: (orderId: number, status: string) => void;
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
  // --- FIX: Update the signature to match actual payload ---
  submitPrediction: (formData: StockPredictionPayload) => Promise<StockPredictionResponse>; // Use the specific payload and response types
  // ---------------------------------------------------------
}
const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [predictions, setPredictions] = useState<Predictions[]>([]);

  const apiClient = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: { 'Content-Type': 'application/json' },
  });

  // Add auth token if available
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      apiClient.defaults.headers.common["Authorization"] = `Token ${token}`;
    }
  }, []);

  // Fetch predictions with detailed logging
  // Fetch predictions with detailed logging


  // Fetch predictions
  useEffect(() => {
    const fetchPredictions = async () => {
      console.log("Starting fetchPredictions for /predictions/predictions/list/");
      try {
        console.log("Sending GET request to http://localhost:8000/api/predictions/predictions/list/");
        const response = await axios.get('http://localhost:8000/api/predictions/predictions/list/', {
          headers: { 'Content-Type': 'application/json' },
        });
        console.log("Fetch predictions response:", {
          status: response.status,
          data: response.data,
        });

        if (!response.data.results || !Array.isArray(response.data.results)) {
          console.warn("Response data.results is not an array:", response.data.results);
          setPredictions([]);
          return;
        }

        const mappedPredictions = response.data.results
          .map((pred: any, index: number) => {
            console.log(`Processing prediction ${index + 1}:`, pred);
            if (!pred.product || !pred.product.name || pred.predicted_stock == null) {
              console.warn(`Invalid prediction data at index ${index}:`, pred);
              return null;
            }
            return {
              name: pred.product.name,
              stock: pred.predicted_stock,
            };
          })
          .filter((pred: Predictions | null) => pred !== null) as Predictions[];

        console.log("Mapped predictions:", mappedPredictions);
        setPredictions(mappedPredictions);
        console.log("Predictions state updated:", mappedPredictions);
      } catch (error: any) {
        console.error("Couldn't get predictions:", {
          message: error.message,
          response: error.response
            ? {
                status: error.response.status,
                data: error.response.data,
              }
            : null,
        });
        setPredictions([]);
      }
    };
    fetchPredictions();
  }, []);

  // Fetch products
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/products/")
      .then((response) => {
        const updatedProducts = response.data.results.map((product: any) => ({
          id: product.id,
          sku_id: product.sku_id,
          name: product.name,
          description: product.description,
          price: product.price || 0,
          imageUrl: `http://127.0.0.1:8000${product.imageUrl || ''}`,
        }));
        setProducts(updatedProducts);
        console.log("Fetched products:", updatedProducts);
      })
      .catch((err) => {
        console.error("Failed to fetch products", err);
      });
  }, []);

  // Fetch orders
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      axios
        .get("http://127.0.0.1:8000/api/orders/orders", {
          headers: { Authorization: `Token ${token}` },
        })
        .then((response) => {
          const mappedOrders = response.data.results.map((order: any) => ({
            id: order.id,
            date: new Date(order.created_at).toLocaleDateString(),
            status: order.status,
            total: parseFloat(order.total_cost),
            items: order.items.map((item: any) => ({
              id: item.id,
              price: parseFloat(item.price),
              quantity: item.quantity,
              productId: item.product.id,
            })),
            customer: `${order.first_name} ${order.last_name}`,
          }));
          setOrders(mappedOrders);
          console.log("Mapped orders:", mappedOrders);
          updateCustomerData(mappedOrders);
        })
        .catch((err) => {
          console.error("Failed to fetch orders", err);
        });
    } else {
      console.log("No authentication token found");
    }
  }, []);

  // Submit prediction
  // Inside your DataProvider component
  const submitPrediction = async (formData: PredictionFormPayload): Promise<StockPredictionResponse> => { // Ensure correct types
    const url = '/predictions/predictions/'; // Or your correct endpoint
    console.log(`Submitting prediction POST to ${url}`, formData);
    try {
      const response = await apiClient.post<StockPredictionResponse>(url, formData); // Use the correct Response Type
      console.log("API POST success response data:", response.data);

      // ---> CRITICAL: Make sure you return the data directly <---
      return response.data;

    } catch (error: any) {
      console.error(`submitPrediction POST to ${url} failed:`, error.response?.data || error.message);
      // Rethrow for the component to handle
      throw error;
    }
  };

  // Update customer data
  const updateCustomerData = (orders: Order[]) => {
    const customerData: { [key: string]: Customer } = {};
    orders.forEach((order) => {
      if (!customerData[order.customer]) {
        customerData[order.customer] = {
          id: Object.keys(customerData).length + 1,
          name: order.customer,
        };
      }
    });
    setCustomers(Object.values(customerData));
    console.log("Updated customers:", Object.values(customerData));
  };

  // Product functions
  const addProduct = (product: Omit<Product, "id">) => {
    const newProduct: Product = {
      ...product,
      id: products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1,
    };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(
      products.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
  };

  const deleteProduct = (id: number) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  // Cart functions
  const addToCart = (productId: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    const existingItem = cart.find((item) => item.productId === productId);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      const newItem: OrderItem = {
        id: cart.length > 0 ? Math.max(...cart.map((item) => item.id)) + 1 : 1,
        productId,
        quantity: 1,
        price: product.price,
      };
      setCart([...cart, newItem]);
    }
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter((item) => item.productId !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Order functions
  const checkout = () => {
    if (cart.length === 0) return;
    const newOrder: Order = {
      id: orders.length > 0 ? Math.max(...orders.map((order) => order.id)) + 1 : 1,
      date: new Date().toISOString().split("T")[0],
      status: "pending",
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      customer: "Current User",
      items: [...cart],
    };
    setOrders([...orders, newOrder]);
    clearCart();
  };

  const cancelOrder = (orderId: number) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: "cancelled" } : order
      )
    );
  };

  const updateOrderStatus = (orderId: number, status: string) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: status as Order["status"] } : order
      )
    );
  };

  return (
    <DataContext.Provider
      value={{
        products,
        orders,
        predictions,
        customers,
        cart,
        addProduct,
        updateProduct,
        deleteProduct,
        addToCart,
        removeFromCart,
        clearCart,
        checkout,
        cancelOrder,
        updateOrderStatus,
        isAdmin,
        setIsAdmin,
        submitPrediction,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

// Auth context (unchanged from your provided code)
export interface NestedProfile {
  phone: string;
  address: string;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  is_admin: boolean;
  profile_pic: string;
}

export interface UserMe {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  profile: NestedProfile;
}

interface AuthContextProps {
  isAuthenticated: boolean;
  token: string | null;
  profile: UserMe | null;
  setToken: (token: string | null) => void;
  setIsAuthenticated: (value: boolean) => void;
  setProfile: (user: UserMe | null) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserMe | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        console.log("No token available. Skipping profile fetch.");
        setProfile(null);
        return;
      }

      try {
        console.log("Fetching profile data in AuthContext...");
        const response = await axios.get("http://127.0.0.1:8000/api/accounts/me/", {
          headers: { Authorization: `Token ${token}` },
        });
        console.log("Profile fetched in AuthContext:", response.data);
        setProfile(response.data as UserMe);
      } catch (error: unknown) {
        console.error("Error fetching profile in AuthContext:", error);
      }
    };

    if (isAuthenticated && token) {
      fetchProfile();
    }
  }, [isAuthenticated, token]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        token,
        profile,
        setToken,
        setIsAuthenticated,
        setProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { AuthContext };