import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useScrollReveal() {
  useEffect(() => {
    const images = document.querySelectorAll("section img");
    const headings = document.querySelectorAll("section h2, section h3");

    const ctx = gsap.context(() => {
      images.forEach((img) => {
        gsap.fromTo(
          img,
          { opacity: 0, scale: 0.96 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: img,
              start: "top 92%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      headings.forEach((h) => {
        gsap.fromTo(
          h,
          { opacity: 0, filter: "blur(6px)" },
          {
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: h,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);
}
