"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

const DEFAULT_AVATAR = "/images/default-avatar-profile-icon-social.webp";

const testimonials = [
  {
    name: "Shasheen Rathnayaka",
    location: "Rumeniya",
    countryCode: "ro",
    image: DEFAULT_AVATAR,
    rating: 5,
    testimonial:
      "SIN Manpower guided me from application to arrival. I appreciated their attention to detail and timely communication.",
  },
  {
    name: "Sameera Madushanka",
    location: "Dubai",
    countryCode: "ae",
    image: DEFAULT_AVATAR,
    rating: 5,
    testimonial:
      "Great support throughout the visa and placement process. I now have a stable job in Dubai thanks to their team.",
  },
  {
    name: "J Priya",
    location: "Kuwet",
    countryCode: "kw",
    image: DEFAULT_AVATAR,
    rating: 5,
    testimonial:
      "Professional agency that helped me find a role quickly. The staff were very supportive and responsive.",
  },
  {
    name: "Indika Roshan",
    location: "Moldius",
    countryCode: "md",
    image: DEFAULT_AVATAR,
    rating: 5,
    testimonial:
      "Excellent placement service and helpful guidance on paperwork and travel arrangements.",
  },
  {
    name: "Dinesh Bandara",
    location: "Japan",
    countryCode: "jp",
    image: DEFAULT_AVATAR,
    rating: 5,
    testimonial:
      "They matched me to a role that fit my skills and helped me settle in quickly. Highly recommended.",
  },
  {
    name: "Prabashani Subashingha",
    location: "Oman",
    countryCode: "om",
    image: DEFAULT_AVATAR,
    rating: 5,
    testimonial:
      "I received excellent support from start to finish. The team made the relocation process smooth and stress-free.",
  },
];

export function TestimonialSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
    setIsAutoPlaying(false);
  };

  return (
    <>
      <section className="py-20 bg-gradient-to-br from-gray-900 to-blue-900 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Success Stories from Our Clients
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Hear from professionals who transformed their careers with our
              help
            </p>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                onMouseEnter={() => setIsAutoPlaying(false)}
                onMouseLeave={() => setIsAutoPlaying(true)}
              >
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                  <CardContent className="p-8 md:p-12">
                    <Quote className="h-12 w-12 text-blue-400 mb-6" />

                    <blockquote className="text-lg md:text-xl leading-relaxed mb-8">
                      &quot;{testimonials[currentIndex].testimonial}&quot;
                    </blockquote>

                    <div className="flex items-center space-x-4">
                      <Avatar className="h-16 w-16 border-2 border-white/20">
                        <AvatarImage src={testimonials[currentIndex].image} />
                        <AvatarFallback>
                          {testimonials[currentIndex].name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">
                          {testimonials[currentIndex].name}
                        </h4>
                        <p className="text-gray-300 flex items-center gap-2">
                          <Image
                            src={`https://flagcdn.com/24x18/${testimonials[currentIndex].countryCode}.png`}
                            alt={testimonials[currentIndex].location}
                            width={24}
                            height={18}
                            className="rounded-sm"
                          />
                          <span className="text-blue-400 text-sm">
                            {testimonials[currentIndex].location}
                          </span>
                        </p>
                      </div>

                      <div className="flex items-center space-x-1">
                        {[...Array(testimonials[currentIndex].rating)].map(
                          (_, i) => (
                            <Star
                              key={i}
                              className="h-5 w-5 fill-yellow-400 text-yellow-400"
                            />
                          )
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-center items-center mt-8 space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={prevTestimonial}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentIndex(index);
                      setIsAutoPlaying(false);
                    }}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentIndex ? "bg-blue-400" : "bg-white/30"
                    }`}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={nextTestimonial}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div
          className="elfsight-app-593aeb78-8a47-488c-b6ca-4762c0bf12e1"
          data-elfsight-app-lazy
        ></div>
      </section>
    </>
  );
}
