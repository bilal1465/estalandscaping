import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import AboutSection from "@/components/about-section";
import ServicesSection from "@/components/services-section";
import GallerySection from "@/components/gallery-section";
import PricingSection from "@/components/pricing-section";
import TestimonialsSection from "@/components/testimonials-section";
import ContactSection from "@/components/contact-section";
import QuoteSection from "@/components/quote-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="bg-off-white">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <GallerySection />
      <PricingSection />
      <TestimonialsSection />
      <ContactSection />
      <QuoteSection />
      <Footer />
    </div>
  );
}
