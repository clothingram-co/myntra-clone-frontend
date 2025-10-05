import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import { CategoryPage } from "./pages/CategoryPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { ProfilePage } from "./pages/ProfilePage";
import { CartItem } from "./data/mockData";
import { toast } from "sonner";
import { useAuthContext } from "./context/AuthContext";

type Page = 'home' | 'category' | 'product' | 'cart' | 'checkout' | 'profile';

interface NavigationData {
  productId?: string;
  category?: string;
}

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.3
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [navigationData, setNavigationData] = useState<NavigationData>({});
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistedItems, setWishlistedItems] = useState<string[]>([]);
  const { isAuthenticated } = useAuthContext();

  const handleNavigate = (page: Page, data?: NavigationData) => {
    if (page === 'profile' && !isAuthenticated) {
      toast.error('Please login to access your profile');
      return;
    }
    setCurrentPage(page);
    if (data) {
      setNavigationData(data);
    }
  };

  const handleProductClick = (productId: string) => {
    handleNavigate('product', { productId });
  };

  const handleAddToCart = (productId: string, size: string, color: string) => {
    const existingItem = cartItems.find(
      item => item.productId === productId && item.selectedSize === size && item.selectedColor === color
    );

    if (existingItem) {
      setCartItems(prev =>
        prev.map(item =>
          item.id === existingItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random()}`,
        productId,
        quantity: 1,
        selectedSize: size,
        selectedColor: color
      };
      setCartItems(prev => [...prev, newItem]);
    }
    

    toast.success("Item added to cart!");
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(itemId);
      return;
    }

    setCartItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
    toast.success("Item removed from cart");
  };

  const handleWishlistClick = (productId: string) => {
    setWishlistedItems(prev => {
      const isWishlisted = prev.includes(productId);
      if (isWishlisted) {
        toast.success("Removed from wishlist");
        return prev.filter(id => id !== productId);
      } else {
        toast.success("Added to wishlist");
        return [...prev, productId];
      }
    });
  };

  const handlePlaceOrder = () => {
    setCartItems([]);
    toast.success("Order placed successfully!");
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage
            onNavigate={handleNavigate}
            onProductClick={handleProductClick}
            onWishlistClick={handleWishlistClick}
            wishlistedItems={wishlistedItems}
          />
        );
      
      case 'category':
        return (
          <CategoryPage
            onProductClick={handleProductClick}
            onWishlistClick={handleWishlistClick}
            wishlistedItems={wishlistedItems}
            categoryFilter={navigationData.category}
          />
        );
      
      case 'product':
        return navigationData.productId ? (
          <ProductDetailPage
            productId={navigationData.productId}
            onNavigate={handleNavigate}
            onAddToCart={handleAddToCart}
            onWishlistClick={handleWishlistClick}
            wishlistedItems={wishlistedItems}
          />
        ) : null;
      
      case 'cart':
        return (
          <CartPage
            cartItems={cartItems}
            onNavigate={handleNavigate}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
          />
        );
      
      case 'checkout':
        return (
          <CheckoutPage
            cartItems={cartItems}
            onNavigate={handleNavigate}
            onPlaceOrder={handlePlaceOrder}
          />
        );
      
      case 'profile':
        return (
          <ProfilePage
            onNavigate={handleNavigate}
            onProductClick={handleProductClick}
            wishlistedItems={wishlistedItems}
            onWishlistClick={handleWishlistClick}
          />
        );
      
      default:
        return (
          <HomePage
            onNavigate={handleNavigate}
            onProductClick={handleProductClick}
            onWishlistClick={handleWishlistClick}
            wishlistedItems={wishlistedItems}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col transition-colors">
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        cartItemsCount={cartItems.reduce((total, item) => total + item.quantity, 0)}
      />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={pageTransition}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}