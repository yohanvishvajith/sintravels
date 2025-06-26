import React, { useState } from "react";

const videos = [
    "https://www.youtube.com/embed/TxEC3D8FoTI?si=qbSp46tvhyk8iJI0&autoplay=1&mute=1",
    "https://www.youtube.com/embed/ZRscOPbErFo?si=zHcrJaXNDWS-TmUa",
];

const YoutubeTravelSection: React.FC = () => {
    const [current, setCurrent] = useState(0);

    const prevSlide = () => setCurrent((prev) => (prev === 0 ? videos.length - 1 : prev - 1));
    const nextSlide = () => setCurrent((prev) => (prev === videos.length - 1 ? 0 : prev + 1));

    return (
        <section id="travel" className="container mx-auto px-4 py-12">
            <h2 className="mb-8 text-center text-3xl font-bold">Travel & Relocation Support</h2>
            <div className="flex justify-center">
                <div className="w-full max-w-4xl relative">
                    <div className="card shadow-lg rounded-lg overflow-hidden">
                        <div className="aspect-video">
                            <iframe
                                key={videos[current]}
                                src={videos[current]}
                                title="YouTube video player"
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                    {/* Previous Button */}
                    <button
                        className="absolute top-1/2 -translate-y-1/2 w-12 h-12 -left-16 lg:-left-16 md:left-2 sm:left-2 opacity-100 z-10 bg-transparent border-none transition-transform duration-200 hover:scale-105 focus:scale-105 group"
                        type="button"
                        onClick={prevSlide}
                        aria-label="Previous"
                    >
                        <span className="custom-arrow">
                            <svg
                                width="32"
                                height="32"
                                viewBox="0 0 32 32"
                                fill="none"
                                className="transition-all duration-200 shadow-md group-hover:shadow-lg group-focus:shadow-lg drop-shadow-sm"
                            >
                                <circle cx="16" cy="16" r="16" fill="#fff" stroke="#0d6efd" strokeWidth="2" />
                                <polyline points="18,10 12,16 18,22" fill="none" stroke="#0d6efd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </span>
                        <span className="sr-only">Previous</span>
                    </button>
                    {/* Next Button */}
                    <button
                        className="absolute top-1/2 -translate-y-1/2 w-12 h-12 -right-16 lg:-right-16 md:right-2 sm:right-2 opacity-100 z-10 bg-transparent border-none transition-transform duration-200 hover:scale-105 focus:scale-105 group"
                        type="button"
                        onClick={nextSlide}
                        aria-label="Next"
                    >
                        <span className="custom-arrow">
                            <svg
                                width="32"
                                height="32"
                                viewBox="0 0 32 32"
                                fill="none"
                                className="transition-all duration-200 shadow-md group-hover:shadow-lg group-focus:shadow-lg drop-shadow-sm"
                            >
                                <circle cx="16" cy="16" r="16" fill="#fff" stroke="#0d6efd" strokeWidth="2" />
                                <polyline points="14,10 20,16 14,22" fill="none" stroke="#0d6efd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </span>
                        <span className="sr-only">Next</span>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default YoutubeTravelSection;
