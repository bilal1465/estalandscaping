export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-brown text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl font-bold font-serif mb-4">STA Landscaping</div>
            <p className="text-gray-300 mb-4">
              Creating beautiful outdoor spaces that enhance your property and lifestyle.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                <span className="sr-only">Facebook</span>
                <div className="w-6 h-6 bg-gray-300 rounded"></div>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                <span className="sr-only">Instagram</span>
                <div className="w-6 h-6 bg-gray-300 rounded"></div>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                <span className="sr-only">Google</span>
                <div className="w-6 h-6 bg-gray-300 rounded"></div>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <button onClick={() => scrollToSection("services")} className="hover:text-white transition-colors duration-200">
                  Lawn Care
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("services")} className="hover:text-white transition-colors duration-200">
                  Garden Design
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("services")} className="hover:text-white transition-colors duration-200">
                  Sod Installation
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("services")} className="hover:text-white transition-colors duration-200">
                  Mulching
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("services")} className="hover:text-white transition-colors duration-200">
                  Seasonal Cleanup
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("services")} className="hover:text-white transition-colors duration-200">
                  Custom Landscaping
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <button onClick={() => scrollToSection("about")} className="hover:text-white transition-colors duration-200">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("gallery")} className="hover:text-white transition-colors duration-200">
                  Our Work
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("testimonials")} className="hover:text-white transition-colors duration-200">
                  Reviews
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("pricing")} className="hover:text-white transition-colors duration-200">
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
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center">
                <span className="mr-2">📞</span>(825)-733-2708
              </li>
              <li className="flex items-center">
                <span className="mr-2">📧</span>contact.estalandscaping@gmail.com
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-600 mt-8 pt-8 text-center text-gray-300">
          <p>
            &copy; 2024 STA Landscaping. All rights reserved. | 
            <a href="#" className="hover:text-white transition-colors duration-200 ml-1">Privacy Policy</a> | 
            <a href="#" className="hover:text-white transition-colors duration-200 ml-1">Terms of Service</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
