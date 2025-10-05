import { useState, useEffect, useRef } from "react";
import { Search, ShoppingBag, User, Heart, Menu, Moon, Sun, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { productsApi } from "../services/api/products";
import { Product } from "../types/product";
import { useTheme } from "../context/ThemeContext";
import { useAuthContext } from "../context/AuthContext";
import { toast } from "sonner";

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  cartItemsCount: number;
}

export function Navbar({ currentPage, onNavigate, cartItemsCount }: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, login, register, logout, isLoading } = useAuthContext();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const searchProducts = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      setIsSearching(true);
      try {
        const results = await productsApi.searchProducts(searchQuery);
        setSearchResults(results.slice(0, 5));
        setShowResults(true);
      } catch (error) {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSearchResultClick = (productId: string) => {
    onNavigate('product');
    setShowResults(false);
    setSearchQuery("");
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLoginMode) {
        await login({ email, password });
      } else {
        await register({ email, password, name });
      }
      setShowLoginDialog(false);
      setEmail("");
      setPassword("");
      setName("");
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <button
              onClick={() => onNavigate('home')}
              className="text-2xl text-[#FF3F6C] cursor-pointer hover:opacity-80 font-normal"
            >
              clothingram
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => onNavigate('category')}
              className="text-gray-900 dark:text-gray-100 hover:text-[#FF3F6C] transition-colors"
            >
              Men
            </button>
            <button
              onClick={() => onNavigate('category')}
              className="text-gray-900 dark:text-gray-100 hover:text-[#FF3F6C] transition-colors"
            >
              Women
            </button>
            <button
              onClick={() => onNavigate('category')}
              className="text-gray-900 dark:text-gray-100 hover:text-[#FF3F6C] transition-colors"
            >
              Kids
            </button>
            <button
              onClick={() => onNavigate('category')}
              className="text-gray-900 dark:text-gray-100 hover:text-[#FF3F6C] transition-colors"
            >
              Home & Living
            </button>
            <button
              onClick={() => onNavigate('category')}
              className="text-gray-900 dark:text-gray-100 hover:text-[#FF3F6C] transition-colors"
            >
              Beauty
            </button>
          </div>

          <div className="flex-1 max-w-lg mx-8 hidden md:block" ref={searchRef}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search for products, brands and more"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
                className="pl-10 bg-gray-50 dark:bg-gray-800 border-0 focus:bg-white dark:focus:bg-gray-700 focus:ring-1 focus:ring-[#FF3F6C]"
              />
              {showResults && searchResults.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                  {searchResults.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleSearchResultClick(product.id)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                    >
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {product.brand}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {product.title}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        ₹{product.price}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="hidden md:flex items-center text-gray-900 dark:text-gray-100 hover:text-[#FF3F6C]"
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>

            {isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigate('profile')}
                  className="hidden md:flex items-center space-x-1 text-gray-900 dark:text-gray-100 hover:text-[#FF3F6C]"
                >
                  <Heart className="h-4 w-4" />
                  <span>Wishlist</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigate('profile')}
                  className="hidden md:flex items-center space-x-1 text-gray-900 dark:text-gray-100 hover:text-[#FF3F6C]"
                >
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="hidden md:flex items-center space-x-1 text-gray-900 dark:text-gray-100 hover:text-[#FF3F6C]"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden md:flex items-center space-x-1 text-gray-900 dark:text-gray-100 hover:text-[#FF3F6C]"
                  >
                    <User className="h-4 w-4" />
                    <span>Login</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>{isLoginMode ? 'Login' : 'Register'}</DialogTitle>
                    <DialogDescription>
                      {isLoginMode
                        ? 'Enter your credentials to access your account'
                        : 'Create a new account to get started'}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAuth} className="space-y-4">
                    {!isLoginMode && (
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Enter your name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required={!isLoginMode}
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-[#FF3F6C] hover:bg-[#FF3F6C]/90 text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Please wait...' : isLoginMode ? 'Login' : 'Register'}
                    </Button>
                    <Button
                      type="button"
                      variant="link"
                      className="w-full"
                      onClick={() => setIsLoginMode(!isLoginMode)}
                    >
                      {isLoginMode
                        ? "Don't have an account? Register"
                        : 'Already have an account? Login'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('cart')}
              className="relative flex items-center space-x-1 text-gray-900 dark:text-gray-100 hover:text-[#FF3F6C]"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden md:inline">Bag</span>
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF3F6C] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="md:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search for products, brands and more"
              className="pl-10 bg-gray-50 dark:bg-gray-800 border-0 focus:bg-white dark:focus:bg-gray-700 focus:ring-1 focus:ring-[#FF3F6C]"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}