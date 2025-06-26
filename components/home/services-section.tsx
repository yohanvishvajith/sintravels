'use client';

import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useInView } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Users, 
  GraduationCap, 
  Building, 
  Globe, 
  FileText,
  ArrowRight 
} from 'lucide-react';

const services = [
  {
    icon: Search,
    title: 'Job Placement',
    description: 'Connect with top employers across various industries and secure your dream job.',
    features: ['Personalized matching', 'Interview preparation', 'Salary negotiation'],
    color: 'blue',
  },
  {
    icon: Users,
    title: 'Recruitment Solutions',
    description: 'Comprehensive recruitment services for businesses seeking top talent.',
    features: ['Talent sourcing', 'Screening process', 'Onboarding support'],
    color: 'teal',
  },
  {
    icon: GraduationCap,
    title: 'Skills Training',
    description: 'Professional development programs to enhance your career prospects.',
    features: ['Technical skills', 'Soft skills', 'Industry certifications'],
    color: 'orange',
  },
  {
    icon: Globe,
    title: 'International Placement',
    description: 'Global job opportunities with visa and relocation assistance.',
    features: ['Visa processing', 'Relocation support', 'Cultural orientation'],
    color: 'purple',
  },
  {
    icon: FileText,
    title: 'Career Counseling',
    description: 'Expert guidance to help you make informed career decisions.',
    features: ['Career assessment', 'Goal setting', 'Action planning'],
    color: 'green',
  },
  {
    icon: Building,
    title: 'Corporate Solutions',
    description: 'Tailored workforce solutions for enterprises and organizations.',
    features: ['Bulk hiring', 'Contract staffing', 'Workforce planning'],
    color: 'red',
  },
];

const colorClasses = {
  blue: 'group-hover:bg-blue-50 group-hover:border-blue-200',
  teal: 'group-hover:bg-teal-50 group-hover:border-teal-200',
  orange: 'group-hover:bg-orange-50 group-hover:border-orange-200',
  purple: 'group-hover:bg-purple-50 group-hover:border-purple-200',
  green: 'group-hover:bg-green-50 group-hover:border-green-200',
  red: 'group-hover:bg-red-50 group-hover:border-red-200',
};

const iconColorClasses = {
  blue: 'text-blue-600',
  teal: 'text-teal-600',
  orange: 'text-orange-600',
  purple: 'text-purple-600',
  green: 'text-green-600',
  red: 'text-red-600',
};

export function ServicesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Comprehensive Career Solutions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From job placement to career development, we offer end-to-end services to help you 
            achieve your professional goals.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group"
            >
              <Card className={`h-full border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${colorClasses[service.color as keyof typeof colorClasses]}`}>
                <CardHeader>
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gray-50 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className={`h-6 w-6 ${iconColorClasses[service.color as keyof typeof iconColorClasses]}`} />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button variant="ghost" className="w-full group/btn">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}