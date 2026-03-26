import { useState } from "react";
import { BeforeAfterCard } from "@/components/before-after-card";
import { ImageLightbox } from "@/components/image-lightbox";

export default function GallerySection() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const beforeAfterProjects = [
    {
      title: "Lawn transformation",
      subtitle: "From patchy to lush — premium fertilization for deep, lasting green.",
      before: "/images/image-39.jpg",
      after: "/images/image-40.jpg",
    },
    {
      title: "Backyard transformation",
      subtitle:
        "Decorative rock landscaping with structured pathway and defined borders, creating a clean, functional, and low-maintenance outdoor space.",
      before: "/images/image-34.jpg",
      after: "/images/image-35.jpg",
    },
  ];

  const galleryImages = [
    "/images/image-12.JPG",
    "/images/image-03.JPG",
    "/images/image-17.jpg",
    "/images/image-07.JPG",
    "/images/image-09.JPG",
    "/images/image-33.jpg",
    "/images/image-05.JPG",
    "/images/image-18.jpg",
  ];

  const galleryAlts = galleryImages.map((_, i) => `Landscaping project ${i + 1}`);

  return (
    <section id="gallery" className="section-contain py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-forest font-serif mb-6">Our Work</h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            See the transformations we've created for our clients. Every project tells a story of vision, craftsmanship, and attention to detail.
          </p>
        </div>

        <div className="mb-10">
          <h3 className="text-2xl font-semibold text-forest font-serif text-center mb-2">Before & After</h3>
          <p className="text-center text-gray-500 max-w-xl mx-auto text-sm">See the difference our work makes.</p>
        </div>
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-12 mb-16">
          {beforeAfterProjects.map((project, index) => (
            <BeforeAfterCard
              key={index}
              before={project.before}
              after={project.after}
              title={project.title}
              subtitle={project.subtitle}
            />
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {galleryImages.map((image, index) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                setLightboxIndex(index);
                setLightboxOpen(true);
              }}
              className="group relative block w-full cursor-pointer overflow-hidden rounded-lg shadow-md transition-transform duration-200 ease-out hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-forest focus:ring-offset-2"
              aria-label={`View full size: ${galleryAlts[index]}`}
            >
              <img
                src={image}
                alt={galleryAlts[index]}
                width={400}
                height={192}
                className="h-48 w-full object-cover transition-transform duration-200 ease-out group-hover:scale-[1.04]"
                loading="lazy"
                decoding="async"
              />
              <span
                className="absolute inset-0 bg-black/30 opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100"
                aria-hidden
              />
            </button>
          ))}
        </div>

        <ImageLightbox
          images={galleryImages}
          currentIndex={lightboxIndex}
          open={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          onIndexChange={setLightboxIndex}
          altTexts={galleryAlts}
        />
      </div>
    </section>
  );
}
