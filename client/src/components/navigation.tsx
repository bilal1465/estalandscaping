import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from '../../public/images/logo.jpg'
import { useLenisRef } from "@/contexts/lenis-context";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lenisRef = useLenisRef();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 100);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      if (lenisRef?.current) {
        lenisRef.current.scrollTo(element, { offset: -80 });
      } else {
        element.scrollIntoView({ behavior: "smooth" });
      }
      setIsMenuOpen(false);
    }
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ease-out ${scrolled ? "bg-off-white/95 shadow-lg backdrop-blur-sm" : "bg-off-white shadow-sm"}`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-2">
          <div className="flex items-center">
            <img src={logo} alt="Company Logo" className="h-8 w-auto max-h-[32px]" loading="eager" decoding="async" />
          </div>
          
          <div className="hidden md:flex items-center space-x-5 text-sm">
            <button onClick={() => scrollToSection("home")} className="nav-link-underline py-1.5 pb-0.5">
              Home
            </button>
            <button onClick={() => scrollToSection("about")} className="nav-link-underline py-1.5 pb-0.5">
              About
            </button>
            <button onClick={() => scrollToSection("services")} className="nav-link-underline py-1.5 pb-0.5">
              Services
            </button>
            <button onClick={() => scrollToSection("gallery")} className="nav-link-underline py-1.5 pb-0.5">
              Gallery
            </button>
            <button onClick={() => scrollToSection("pricing")} className="nav-link-underline py-1.5 pb-0.5">
              Pricing
            </button>
            <button onClick={() => scrollToSection("testimonials")} className="nav-link-underline py-1.5 pb-0.5">
              Reviews
            </button>
            <button onClick={() => scrollToSection("contact")} className="nav-link-underline py-1.5 pb-0.5">
              Contact
            </button>
          </div>
          
          <div className="hidden md:block">
            <Button onClick={() => scrollToSection("quote")} size="sm" className="bg-forest text-white hover:bg-forest/90 text-sm h-8 px-4">
              Get Free Quote
            </Button>
          </div>
          
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-forest h-8 w-8"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-3">
            <div className="flex flex-col space-y-3">
              <button onClick={() => scrollToSection("home")} className="nav-link-underline text-left py-2">
                Home
              </button>
              <button onClick={() => scrollToSection("about")} className="nav-link-underline text-left py-2">
                About
              </button>
              <button onClick={() => scrollToSection("services")} className="nav-link-underline text-left py-2">
                Services
              </button>
              <button onClick={() => scrollToSection("gallery")} className="nav-link-underline text-left py-2">
                Gallery
              </button>
              <button onClick={() => scrollToSection("pricing")} className="nav-link-underline text-left py-2">
                Pricing
              </button>
              <button onClick={() => scrollToSection("testimonials")} className="nav-link-underline text-left py-2">
                Reviews
              </button>
              <button onClick={() => scrollToSection("contact")} className="nav-link-underline text-left py-2">
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
