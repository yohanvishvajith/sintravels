'use client';


import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, Globe, Award, TrendingUp } from 'lucide-react';
import { useTranslations } from 'next-intl';

const stats = [
  {
    icon: Users,
    value: 15000,
    labelKey: 'jobPlacements',
    suffix: '+',
    color: 'text-blue-600',
  },
  {
    icon: Globe,
    value: 25,
    labelKey: 'countries',
    suffix: '+',
    color: 'text-teal-600',
  },
  {
    icon: Award,
    value: 98,
    labelKey: 'successRate',
    suffix: '%',
    color: 'text-orange-600',
  },
  {
    icon: TrendingUp,
    value: 15,
    labelKey: 'yearsExperience',
    suffix: '+',
    color: 'text-purple-600',
  },
];

function AnimatedCounter({ value, duration = 2000 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref);

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    const startValue = 0;
    const endValue = value;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(startValue + (endValue - startValue) * easeOutCubic);
      
      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, value, duration]);

  return <span ref={ref}>{count}</span>;
}

export function StatsSection() {
  const t = useTranslations('StatsSection');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="text-center group"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                
                <div className={`text-4xl md:text-5xl font-bold mb-2 ${stat.color}`}>
                  <AnimatedCounter value={stat.value} />
                  {stat.suffix}
                </div>
                
                <p className="text-gray-600 font-medium text-lg">
                  {t(stat.labelKey)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}