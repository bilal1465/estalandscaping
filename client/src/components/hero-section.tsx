import { Calculator, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLenisRef } from "@/contexts/lenis-context";

export default function HeroSection() {
  const lenisRef = useLenisRef();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      if (lenisRef?.current) {
        lenisRef.current.scrollTo(element, { offset: -80 });
      } else {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/images/image-36.JPG')`
        }}
        role="img"
        aria-label="Landscaping background"
      >
        <div className="absolute inset-0 bg-black bg-opacity-40" />
      </div>
      
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-bold font-serif mb-6">
          Transform Your <span className="text-beige">Outdoor Space</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 opacity-90">
          Professional landscaping services that bring your vision to life. From design to maintenance, we create beautiful spaces you'll love.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => scrollToSection("contact")} 
            className="bg-forest text-white hover:bg-forest/90 hover:scale-[1.02] active:scale-[0.98] text-lg px-8 py-6 transition-transform duration-200 ease-out"
          >
            <Calculator className="mr-2 h-5 w-5" />
            Get Free Quote
          </Button>
          <Button 
            onClick={() => scrollToSection("services")} 
            variant="outline"
            className="border-2 border-white text-forest hover:bg-white hover:text-forest hover:scale-[1.02] active:scale-[0.98] text-lg px-8 py-6 transition-transform duration-200 ease-out"
          >
            <Leaf className="mr-2 h-5 w-5" />
            View Services
          </Button>
        </div>
      </div>
    </section>
  );
}
