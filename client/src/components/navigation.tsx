import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  return (
    <header className={`sticky top-0 z-50 bg-off-white transition-shadow duration-200 ${scrolled ? "shadow-lg" : "shadow-sm"}`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <div className="text-2xl font-bold text-forest font-serif">STA Landscaping</div>
          </div>
          
          <div className="hidden md:flex space-x-8">
            <button onClick={() => scrollToSection("home")} className="text-gray-700 hover:text-forest transition-colors duration-200">
              Home
            </button>
            <button onClick={() => scrollToSection("about")} className="text-gray-700 hover:text-forest transition-colors duration-200">
              About
            </button>
            <button onClick={() => scrollToSection("services")} className="text-gray-700 hover:text-forest transition-colors duration-200">
              Services
            </button>
            <button onClick={() => scrollToSection("gallery")} className="text-gray-700 hover:text-forest transition-colors duration-200">
              Gallery
            </button>
            <button onClick={() => scrollToSection("pricing")} className="text-gray-700 hover:text-forest transition-colors duration-200">
              Pricing
            </button>
            <button onClick={() => scrollToSection("testimonials")} className="text-gray-700 hover:text-forest transition-colors duration-200">
              Reviews
            </button>
            <button onClick={() => scrollToSection("contact")} className="text-gray-700 hover:text-forest transition-colors duration-200">
              Contact
            </button>
          </div>
          
          <div className="hidden md:block">
            <Button onClick={() => scrollToSection("quote")} className="bg-forest text-white hover:bg-forest/90">
              Get Free Quote
            </Button>
          </div>
          
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-forest"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-3">
              <button onClick={() => scrollToSection("home")} className="text-gray-700 hover:text-forest transition-colors duration-200 text-left">
                Home
              </button>
              <button onClick={() => scrollToSection("about")} className="text-gray-700 hover:text-forest transition-colors duration-200 text-left">
                About
              </button>
              <button onClick={() => scrollToSection("services")} className="text-gray-700 hover:text-forest transition-colors duration-200 text-left">
                Services
              </button>
              <button onClick={() => scrollToSection("gallery")} className="text-gray-700 hover:text-forest transition-colors duration-200 text-left">
                Gallery
              </button>
              <button onClick={() => scrollToSection("pricing")} className="text-gray-700 hover:text-forest transition-colors duration-200 text-left">
                Pricing
              </button>
              <button onClick={() => scrollToSection("testimonials")} className="text-gray-700 hover:text-forest transition-colors duration-200 text-left">
                Reviews
              </button>
              <button onClick={() => scrollToSection("contact")} className="text-gray-700 hover:text-forest transition-colors duration-200 text-left">
                Contact
              </button>
              <Button onClick={() => scrollToSection("quote")} className="bg-forest text-white hover:bg-forest/90 w-full">
                Get Free Quote
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
