"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Gallery() {
  const images = [
    "/images/gallery/gallery02.jpg",
    "/images/gallery/gallery03.jpg",
    "/images/gallery/gallery04.jpg",
    "/images/gallery/gallery05.jpg",
    "/images/gallery/gallery06.jpg",
    "/images/gallery/gallery07.jpg",
    "/images/gallery/gallery08.jpg",
    "/images/gallery/gallery09.jpg",
    "/images/gallery/gallery10.jpg",
    "/images/gallery/gallery11.jpg",
    "/images/gallery/gallery12.jpg",
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setIndex((i) => (i + 1) % images.length),
      3500
    );
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold">Gallery</h2>
          <p className="text-gray-600">A showcase of our recent activities</p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="relative bg-gray-100 rounded-lg overflow-clip h-[520px] md:h-[720px]">
            <Image
              src={images[index]}
              alt={`gallery-${index}`}
              fill
              className="object-contain"
              priority
            />

            <button
              onClick={() =>
                setIndex((index - 1 + images.length) % images.length)
              }
              className="absolute left-6 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg"
              aria-label="Previous image"
            >
              ◀
            </button>
            <button
              onClick={() => setIndex((index + 1) % images.length)}
              className="absolute right-6 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg"
              aria-label="Next image"
            >
              ▶
            </button>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
              {images.map((_, i) => (
                <button
                  key={i}
                  className={`w-3 h-3 rounded-full ${
                    i === index ? "bg-blue-600" : "bg-white/80"
                  }`}
                  onClick={() => setIndex(i)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
