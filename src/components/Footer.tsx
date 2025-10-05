import { useState } from "react";
import { Facebook, Twitter, Instagram, Youtube, Shield, RotateCcw } from "lucide-react";

export function Footer() {
  const [isHeartFilled, setIsHeartFilled] = useState(false);

  const shopCategories = [
    "Men",
    "Women", 
    "Kids",
    "Home & Living",
    "Beauty"
  ];

  const customerPolicies = [
    "Contact Us",
    "FAQ",
    "Terms of Use", 
    "Track Orders",
    "Shipping",
    "Cancellation & Returns",
    "Privacy Policy"
  ];

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "#" },
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "Instagram", icon: Instagram, href: "#" },
    { name: "YouTube", icon: Youtube, href: "#" }
  ];

  const trustBadges = [
    { 
      icon: Shield, 
      text: "100% Original Products"
    },
    { 
      icon: RotateCcw, 
      text: "Easy Returns"
    }
  ];

  return (
    <footer className="bg-[#1C1C1C] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Shop Categories */}
          <div>
            <h3 className="mb-6 text-white">Shop</h3>
            <ul className="space-y-4">
              {shopCategories.map((category) => (
                <li key={category}>
                  <a 
                    href="#" 
                    className="text-white/70 hover:text-[#FF3F6C] transition-colors duration-200"
                  >
                    {category}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Policies */}
          <div>
            <h3 className="mb-6 text-white">Customer Policies</h3>
            <ul className="space-y-4">
              {customerPolicies.map((policy) => (
                <li key={policy}>
                  <a 
                    href="#" 
                    className="text-white/70 hover:text-[#FF3F6C] transition-colors duration-200"
                  >
                    {policy}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="mb-6 text-white">Follow Us</h3>
            <div className="flex gap-4 mb-8">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#FF3F6C] transition-all duration-300 hover:scale-105 group"
                    aria-label={social.name}
                  >
                    <IconComponent 
                      size={20} 
                      className="text-white/70 group-hover:text-white transition-colors duration-200"
                    />
                  </a>
                );
              })}
            </div>

            {/* Trust Badges */}
            <div>
              <h4 className="mb-4 text-white">Trust & Safety</h4>
              <div className="space-y-3">
                {trustBadges.map((badge) => {
                  const IconComponent = badge.icon;
                  return (
                    <div
                      key={badge.text}
                      className="flex items-center gap-3 bg-transparent border border-white/30 rounded-full px-4 py-2 hover:border-[#FF3F6C] transition-colors duration-300"
                    >
                      <IconComponent 
                        size={16} 
                        className="text-[#FF3F6C] flex-shrink-0"
                      />
                      <span className="text-white/90 text-sm">{badge.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="mb-6 text-white">Stay Connected</h3>
            <p className="text-white/70 mb-6 text-sm leading-relaxed">
              Get the latest updates on new arrivals, exclusive offers, and style tips.
            </p>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#FF3F6C] focus:border-transparent transition-colors"
              />
              <button className="w-full bg-[#FF3F6C] text-white py-3 rounded-lg hover:bg-[#FF3F6C]/90 transition-colors duration-200">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-white/20 pt-8">
          {/* Special Footer Line with Animated Heart */}
          <div className="text-center mb-4">
            <p className="text-white text-lg mb-2 flex items-center justify-center gap-2">
              Made with{" "}
              <button
                className={`heart-button transition-all duration-500 ease-in-out transform hover:scale-110 ${
                  isHeartFilled ? 'filled' : ''
                }`}
                onMouseEnter={() => setIsHeartFilled(true)}
                onMouseLeave={() => setIsHeartFilled(false)}
                onClick={() => setIsHeartFilled(!isHeartFilled)}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="heart-icon"
                >
                  <path
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                    fill={isHeartFilled ? "#FF3F6C" : "transparent"}
                    stroke="white"
                    strokeWidth="2"
                    className="transition-all duration-500 ease-in-out"
                  />
                </svg>
              </button>
              {" "}for all who lead with style
            </p>
            <p className="text-white/60 text-sm">
              © 2024 clothingram. All rights reserved.
            </p>
          </div>

          {/* Additional Links */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 text-white/50 text-sm">
            <a href="#" className="hover:text-[#FF3F6C] transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-[#FF3F6C] transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-[#FF3F6C] transition-colors">
              Sitemap
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        .heart-button {
          position: relative;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .heart-icon {
          filter: drop-shadow(0 0 4px rgba(255, 63, 108, 0.3));
        }

        .heart-button:hover .heart-icon {
          filter: drop-shadow(0 0 8px rgba(255, 63, 108, 0.6));
        }

        .heart-button.filled .heart-icon {
          filter: drop-shadow(0 0 12px rgba(255, 63, 108, 0.8));
        }
      `}</style>
    </footer>
  );
}