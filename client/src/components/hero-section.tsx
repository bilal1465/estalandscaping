import { Calculator, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="relative h-screen flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/images/IMG_3628_1753672543845.JPG')`
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
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
            onClick={() => scrollToSection("quote")} 
            className="bg-forest text-white hover:bg-forest/90 text-lg px-8 py-6"
          >
            <Calculator className="mr-2 h-5 w-5" />
            Get Free Quote
          </Button>
          <Button 
            onClick={() => scrollToSection("services")} 
            variant="outline"
            className="border-2 border-white text-forest hover:bg-white hover:text-forest text-lg px-8 py-6"
          >
            <Leaf className="mr-2 h-5 w-5" />
            View Services
          </Button>
        </div>
      </div>
    </section>
  );
}
