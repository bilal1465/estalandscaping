import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from '../../public/images/logo.jpg'

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const threshold = 100;
    const throttleMs = 180;
    let lastTime = 0;
    let rafId: number = 0;

    const updateScrolled = () => {
      const now = Date.now();
      if (now - lastTime < throttleMs) return;
      lastTime = now;
      const y = window.scrollY ?? document.documentElement.scrollTop;
      setScrolled(y > threshold);
    };

    const onScroll = () => {
      rafId = requestAnimationFrame(updateScrolled);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    updateScrolled();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className={`sticky top-0 z-50 transition-colors duration-200 ease-out ${scrolled ? "bg-off-white shadow-md" : "bg-off-white shadow-sm"}`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-2">
          <div className="flex items-center">
            <img src={logo} alt="ESTA Landscaping" className="h-[60px] w-auto object-contain" loading="eager" decoding="async" />
          </div>
          
          <div className="hidden md:flex items-center gap-5 text-sm">
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
            <a
              href="https://icehouseyyc.ca/"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 rounded-full border-2 border-sky-300 bg-white px-4 py-1.5 text-sm font-medium text-sky-600 transition-colors hover:border-sky-400 hover:bg-sky-50 hover:text-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2"
              aria-label="Switch to Snow Removal service (opens IceHouseYYC in new tab)"
            >
              ❄️ Snow Removal ⇄
            </a>
          </div>

          <div className="hidden md:block">
            <Button onClick={() => scrollToSection("contact")} size="sm" className="bg-forest text-white hover:bg-forest/90 text-sm h-8 px-4">
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
              <a
                href="https://icehouseyyc.ca/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border-2 border-sky-300 bg-white px-4 py-2.5 text-center text-sm font-medium text-sky-600 transition-colors hover:border-sky-400 hover:bg-sky-50 hover:text-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2"
                aria-label="Switch to Snow Removal service (opens IceHouseYYC in new tab)"
              >
                ❄️ Snow Removal ⇄
              </a>
              <Button onClick={() => scrollToSection("contact")} className="bg-forest text-white hover:bg-forest/90 w-full">
                Get Free Quote
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
