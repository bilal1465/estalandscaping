export default function GallerySection() {
  const beforeAfterProjects = [
    {
      title: "Backyard transformation with professional lawn striping and retaining wall",
      before: "https://images.unsplash.com/photo-1544984243-ec57ea16fe25?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      after: "/images/IMG_3209_1753672543842.JPG"
    },
    {
      title: "Modern front yard sod installation with clean edges and design",
      before: "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      after: "/images/IMG_3465_1753672543843.JPG"
    }
  ];

  const galleryImages = [
    "/images/IMG_3628_1753672543845.JPG",
    "/images/IMG_3630_1753672543845.JPG", 
    "/images/IMG_3631_1753672543845.JPG",
    "/images/IMG_3868_1753672543846.JPG",
    "/images/IMG_3869_1753672543846.JPG",
    "/images/IMG_3209_1753672543842.JPG",
    "/images/IMG_3465_1753672543843.JPG",
    "/images/IMG_3754_1753672543846.JPG"
  ];

  return (
    <section id="gallery" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-forest font-serif mb-6">Our Work</h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            See the transformations we've created for our clients. Every project tells a story of vision, craftsmanship, and attention to detail.
          </p>
        </div>

        {/* Before/After Showcase */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {beforeAfterProjects.map((project, index) => (
            <div key={index} className="bg-beige rounded-xl p-6">
              <h3 className="text-2xl font-semibold text-forest font-serif mb-6 text-center">Before & After</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Before</h4>
                  <img 
                    src={project.before} 
                    alt="Before landscaping transformation" 
                    className="rounded-lg w-full h-40 object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">After</h4>
                  <img 
                    src={project.after} 
                    alt="After landscaping transformation" 
                    className="rounded-lg w-full h-40 object-cover"
                  />
                </div>
              </div>
              <p className="text-center text-gray-600 mt-4 italic">"{project.title}"</p>
            </div>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {galleryImages.map((image, index) => (
            <img 
              key={index}
              src={image} 
              alt={`Landscaping project ${index + 1}`} 
              className="rounded-lg shadow-lg w-full h-48 object-cover hover:shadow-xl transition-shadow duration-300"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
