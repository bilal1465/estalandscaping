import { CalendarCheck, Ruler, FileText, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimateInView from "@/components/animate-in-view";
import { useLenisRef } from "@/contexts/lenis-context";

export default function QuoteSection() {
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
    <section id="quote" className="py-20 bg-forest text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <AnimateInView>
          <h2 className="text-4xl md:text-5xl font-bold font-serif mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Get your free, no-obligation quote today. We'll assess your property and provide a detailed estimate for your landscaping project.
          </p>
        </AnimateInView>
        
        <div className="bg-white bg-opacity-10 rounded-xl p-8 backdrop-blur-sm">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <AnimateInView stagger={1}>
              <div className="text-center transition-transform duration-300 hover:scale-[1.02]">
                <CalendarCheck className="text-4xl mb-4 mx-auto h-12 w-12" />
                <h3 className="text-xl font-semibold mb-2">Schedule Consultation</h3>
                <p className="opacity-80">We'll visit your property at your convenience</p>
              </div>
            </AnimateInView>
            <AnimateInView stagger={2}>
              <div className="text-center transition-transform duration-300 hover:scale-[1.02]">
                <Ruler className="text-4xl mb-4 mx-auto h-12 w-12" />
                <h3 className="text-xl font-semibold mb-2">Property Assessment</h3>
                <p className="opacity-80">Detailed evaluation and design recommendations</p>
              </div>
            </AnimateInView>
            <AnimateInView stagger={3}>
              <div className="text-center transition-transform duration-300 hover:scale-[1.02]">
                <FileText className="text-4xl mb-4 mx-auto h-12 w-12" />
                <h3 className="text-xl font-semibold mb-2">Custom Quote</h3>
                <p className="opacity-80">Transparent pricing with no hidden costs</p>
              </div>
            </AnimateInView>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-white text-forest hover:bg-white/90 transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]">
              <a href="tel:(825)-733-2708">
                <Phone className="mr-2 h-4 w-4" />
                Call Now: (825)-733-2708
              </a>
            </Button>
            <Button 
              onClick={() => scrollToSection("contact")} 
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-forest transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Mail className="mr-2 h-4 w-4" />
              Request Quote Online
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
