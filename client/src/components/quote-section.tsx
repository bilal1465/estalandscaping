import { CalendarCheck, Ruler, FileText, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function QuoteSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="quote" className="py-20 bg-forest text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold font-serif mb-6">Ready to Get Started?</h2>
        <p className="text-xl mb-8 opacity-90">
          Get your free, no-obligation quote today. We'll assess your property and provide a detailed estimate for your landscaping project.
        </p>
        
        <div className="bg-white bg-opacity-10 rounded-xl p-8 backdrop-blur-sm">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="text-center">
              <CalendarCheck className="text-4xl mb-4 mx-auto h-12 w-12" />
              <h3 className="text-xl font-semibold mb-2">Schedule Consultation</h3>
              <p className="opacity-80">We'll visit your property at your convenience</p>
            </div>
            <div className="text-center">
              <Ruler className="text-4xl mb-4 mx-auto h-12 w-12" />
              <h3 className="text-xl font-semibold mb-2">Property Assessment</h3>
              <p className="opacity-80">Detailed evaluation and design recommendations</p>
            </div>
            <div className="text-center">
              <FileText className="text-4xl mb-4 mx-auto h-12 w-12" />
              <h3 className="text-xl font-semibold mb-2">Custom Quote</h3>
              <p className="opacity-80">Transparent pricing with no hidden costs</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-white text-forest hover:bg-white/90">
              <a href="tel:555-123-4567">
                <Phone className="mr-2 h-4 w-4" />
                Call Now: (555) 123-4567
              </a>
            </Button>
            <Button 
              onClick={() => scrollToSection("contact")} 
              variant="outline"
              className="border-2 border-white text-forest hover:bg-white hover:text-forest"
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
