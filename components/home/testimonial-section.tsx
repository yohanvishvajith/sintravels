"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Software Engineer",
    company: "Tech Corp",
    location: "Singapore",
    image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
    rating: 5,
    testimonial:
      "SIN Manpower helped me secure my dream job in Singapore. Their team was incredibly supportive throughout the entire process, from initial consultation to final placement.",
  },
  {
    name: "Michael Chen",
    role: "Project Manager",
    company: "Global Solutions",
    location: "Canada",
    image: "https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg",
    rating: 5,
    testimonial:
      "Outstanding service! They not only found me a great position but also helped with visa processing and relocation. Truly professional and reliable.",
  },
  {
    name: "Emily Rodriguez",
    role: "Marketing Director",
    company: "Innovation Ltd",
    location: "Australia",
    image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
    rating: 5,
    testimonial:
      "The international placement service exceeded my expectations. From the first interview to settling in Australia, they were with me every step of the way.",
  },
  {
    name: "David Kumar",
    role: "Data Scientist",
    company: "Analytics Pro",
    location: "UAE",
    image: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg",
    rating: 5,
    testimonial:
      "Professional, efficient, and results-driven. SIN Manpower transformed my career by connecting me with opportunities I never thought possible.",
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
                        <p className="text-gray-300">
                          {testimonials[currentIndex].role} at{" "}
                          {testimonials[currentIndex].company}
                        </p>
                        <p className="text-blue-400 text-sm">
                          📍 {testimonials[currentIndex].location}
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
