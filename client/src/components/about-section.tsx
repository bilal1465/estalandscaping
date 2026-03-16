import AnimateInView from "@/components/animate-in-view";

export default function AboutSection() {
  return (
    <section id="about" className="section-contain py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <AnimateInView className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-forest font-serif mb-6">
              About ESTA Landscaping
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Founded with a passion for creating beautiful outdoor spaces, ESTA Landscaping has been transforming properties across the region for over a decade. Our family-owned business combines traditional craftsmanship with modern design principles.
            </p>
            <p className="text-lg text-gray-700 mb-8">
              We believe that every property has potential, and our mission is to unlock that potential through thoughtful design, quality materials, and expert installation. From small garden beds to complete landscape transformations, we approach every project with the same level of care and attention to detail.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-forest font-serif">3+</div>
                <div className="text-gray-600">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-forest font-serif">150+</div>
                <div className="text-gray-600">Projects Completed</div>
              </div>
            </div>
          </AnimateInView>
          <AnimateInView stagger={2}>
            <div className="relative">
              <img 
                src="/images/image-29.jpg" 
                alt="STA Landscaping professional work - beautiful front yard with concrete walkway" 
                className="rounded-xl shadow-lg w-full h-auto"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute -bottom-6 -right-6 bg-forest text-white p-6 rounded-xl shadow-lg transition-transform duration-300 hover:scale-[1.02]">
                <div className="text-2xl font-bold font-serif">★ 4.9</div>
                <div className="text-sm opacity-90">Client Rating</div>
              </div>
            </div>
          </AnimateInView>
        </div>
      </div>
    </section>
  );
}
