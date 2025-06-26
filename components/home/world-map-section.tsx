'use client';

import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useInView } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

const countries = [
  { name: 'United States', jobs: 2500, flag: '🇺🇸' },
  { name: 'Canada', jobs: 1800, flag: '🇨🇦' },
  { name: 'United Kingdom', jobs: 1500, flag: '🇬🇧' },
  { name: 'Australia', jobs: 1200, flag: '🇦🇺' },
  { name: 'Germany', jobs: 1100, flag: '🇩🇪' },
  { name: 'Singapore', jobs: 950, flag: '🇸🇬' },
  { name: 'UAE', jobs: 900, flag: '🇦🇪' },
  { name: 'Japan', jobs: 800, flag: '🇯🇵' },
];

export function WorldMapSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-teal-50">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Global Opportunities Await
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore job opportunities across 25+ countries. Our international network 
            connects you with employers worldwide.
          </p>
        </motion.div>

        <div className="relative">
          {/* World Map Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-8 mb-12"
          >
            <div className="aspect-video bg-gradient-to-br from-blue-100 to-teal-100 rounded-xl flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/335393/pexels-photo-335393.jpeg')] bg-cover bg-center opacity-20" />
              <div className="relative z-10 text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Interactive World Map</h3>
                <p className="text-gray-600">Click on countries to explore opportunities</p>
              </div>
              
              {/* Animated Dots */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 bg-blue-500 rounded-full"
                  style={{
                    left: `${20 + (i * 10)}%`,
                    top: `${30 + (i % 3) * 20}%`,
                  }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.2,
                    repeat: Infinity,
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Country Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {countries.map((country, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                className="bg-white rounded-lg p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{country.flag}</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {country.jobs} jobs
                  </Badge>
                </div>
                <h4 className="font-semibold text-gray-900">{country.name}</h4>
                <p className="text-sm text-gray-600">Active opportunities</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}