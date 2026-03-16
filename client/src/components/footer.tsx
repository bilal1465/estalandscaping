import { Linkedin, Instagram } from "lucide-react";

const SOCIAL_LINKS = [
  {
    href: "https://www.linkedin.com/company/esta-landscaping/",
    label: "ESTA Landscaping on LinkedIn",
    icon: Linkedin,
  },
  {
    href: "https://www.instagram.com/esta_landscaping?igsh=MXU2MDY3NTJ0dXc3MQ%3D%3D&utm_source=qr",
    label: "ESTA Landscaping on Instagram",
    icon: Instagram,
  },
  {
    href: "https://www.instagram.com/icehouseyyc?igsh=MWs1N3I3dzltajRhdg%3D%3D&utm_source=qr",
    label: "Ice House YYC on Instagram",
    icon: Instagram,
  },
] as const;

export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <footer className="bg-brown text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="text-xl font-bold font-serif tracking-tight mb-3">ESTA Landscaping</div>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              Creating beautiful outdoor spaces that enhance your property and lifestyle.
            </p>
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-gray-300 transition-colors duration-200 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-brown"
                >
                  <Icon className="h-4 w-4" strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90 mb-4">Services</h3>
            <ul className="space-y-2.5 text-sm text-gray-300">
              {["Lawn Care", "Garden Design", "Sod Installation", "Mulching", "Seasonal Cleanup", "Custom Landscaping"].map((label) => (
                <li key={label}>
                  <button
                    type="button"
                    onClick={() => scrollToSection("services")}
                    className="text-left hover:text-white transition-colors duration-200"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90 mb-4">Company</h3>
            <ul className="space-y-2.5 text-sm text-gray-300">
              <li>
                <button type="button" onClick={() => scrollToSection("about")} className="text-left hover:text-white transition-colors duration-200">
                  About Us
                </button>
              </li>
              <li>
                <button type="button" onClick={() => scrollToSection("gallery")} className="text-left hover:text-white transition-colors duration-200">
                  Our Work
                </button>
              </li>
              <li>
                <button type="button" onClick={() => scrollToSection("testimonials")} className="text-left hover:text-white transition-colors duration-200">
                  Reviews
                </button>
              </li>
              <li>
                <button type="button" onClick={() => scrollToSection("pricing")} className="text-left hover:text-white transition-colors duration-200">
                  Pricing
                </button>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors duration-200">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors duration-200">
                  Careers
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90 mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li>
                <a href="tel:8257332708" className="flex items-center gap-2 hover:text-white transition-colors duration-200">
                  <span aria-hidden>(825) 733-2708</span>
                </a>
              </li>
              <li>
                <a href="mailto:info@estalandscaping.com" className="break-all hover:text-white transition-colors duration-200">
                  info@estalandscaping.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/15">
          <p className="text-center text-sm text-gray-400">
            © 2026 ESTA Landscaping. All rights reserved.
            <span className="mx-2">·</span>
            <a href="#" className="hover:text-white transition-colors duration-200">
              Privacy Policy
            </a>
            <span className="mx-2">·</span>
            <a href="#" className="hover:text-white transition-colors duration-200">
              Terms of Service
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
