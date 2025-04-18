import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

// Product interface
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
}

// OrderItem interface
export interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  price: number;
}

// Order interface (only the fields we care about)
export interface Order {
  id: number;
  date: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  items: OrderItem[];
  customer: string;
}

// Simplified Customer interface: only id and name.
export interface Customer {
  id: number;
  name: string;
}

interface DataContextType {
  products: Product[];
  orders: Order[];
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
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  // Fetch products from API
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/products/") // API URL for products
      .then((response) => {
        // Assuming response.data.results contains the products array
        const updatedProducts = response.data.results.map((product: Product) => ({
          ...product,
          imageUrl: `http://127.0.0.1:8000${product.imageUrl}`,
        }));
        setProducts(updatedProducts);
        console.log("Fetched products:", updatedProducts);
      })
      .catch((err) => {
        console.error("Failed to fetch products", err);
      });
  }, []);
  

  // Fetch orders from API with authentication
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      axios
        .get("http://127.0.0.1:8000/api/orders/orders", {
          headers: { Authorization: `Token ${token}` },
        })
        .then((response) => {
          // Map the response to match our Order interface
          const mappedOrders = response.data.results.map((order) => ({
            id: order.id,
            // Convert created_at to a readable date ƒstring
            date: new Date(order.created_at).toLocaleDateString(),
            status: order.status,
            total: parseFloat(order.total_cost),
            items: order.items.map((item) => ({
              id: item.id,
              price: parseFloat(item.price),
              quantity: item.quantity,
              productId: item.product.id,
            })),
            // Combine first_name and last_name into customer name
            customer: `${order.first_name} ${order.last_name}`,
          }));

          setOrders(mappedOrders);
          console.log("Mapped orders:", mappedOrders);
          // Update customers based on the mapped orders
          updateCustomerData(mappedOrders);
        })
        .catch((err) => {
          console.error("Failed to fetch orders", err);
        });
    } else {
      console.log("No authentication token found");
    }
  }, []);

  // Simplified updateCustomerData: only store unique customer names
  const updateCustomerData = (orders: Order[]) => {
    const customerData: { [key: string]: Customer } = {};

    orders.forEach((order) => {
      // Use the customer's full name as the key
      if (!customerData[order.customer]) {
        customerData[order.customer] = {
          id: Object.keys(customerData).length + 1, // auto-increment id
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
      customer: "Current User", // Replace with actual user data when available
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
        cart,
        customers,
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


// For example, in src/types/Profile.ts
// src/types/User.ts (or wherever you keep your types)
export interface NestedProfile {
  phone: string;
  address: string;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  is_admin: boolean;
  profile_pic: string;  // The actual path to the image
}

export interface UserMe {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  profile: NestedProfile;
}

  // Add any additional fields expected from your API

 // adjust the import path
  
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
  
    // The profile that includes the nested "profile" object
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
  
          // Cast or assert to the UserMe type
          setProfile(response.data as UserMe);
        } catch (error: unknown) {
          console.error("Error fetching profile in AuthContext:", error);
          // For a 401 or invalid token scenario, handle it here
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
  