'use client';

import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useInView } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { 
  Search, 
  Users, 
  GraduationCap, 
  Building, 
  Globe, 
  FileText,
  ArrowRight,
  CheckCircle,
  Star,
  Phone,
  Mail
} from 'lucide-react';
import Link from 'next/link';

const services = [
  {
    icon: Search,
    title: 'Job Placement Services',
    description: 'Connect with top employers across various industries and secure your dream job with our personalized matching system.',
    features: [
      'Personalized job matching based on skills and preferences',
      'Interview preparation and coaching sessions',
      'Salary negotiation support and guidance',
      'Career transition assistance',
      'Industry-specific expertise and insights'
    ],
    pricing: 'Free for job seekers',
    color: 'blue',
  },
  {
    icon: Users,
    title: 'Recruitment Solutions',
    description: 'Comprehensive recruitment services for businesses seeking top talent across all levels and industries.',
    features: [
      'Executive search and headhunting services',
      'Bulk hiring and mass recruitment campaigns',
      'Talent sourcing and candidate screening',
      'Background verification and reference checks',
      'Onboarding support and integration assistance'
    ],
    pricing: 'Custom packages available',
    color: 'teal',
  },
  {
    icon: GraduationCap,
    title: 'Skills Training & Development',
    description: 'Professional development programs designed to enhance your career prospects and marketability.',
    features: [
      'Technical skills training in high-demand areas',
      'Soft skills development workshops',
      'Industry certifications and credentials',
      'Leadership and management training',
      'Digital literacy and technology skills'
    ],
    pricing: 'Starting from $299',
    color: 'orange',
  },
  {
    icon: Globe,
    title: 'International Placement',
    description: 'Global job opportunities with comprehensive visa and relocation assistance for international careers.',
    features: [
      'Visa processing and documentation support',
      'Relocation assistance and logistics',
      'Cultural orientation and adaptation programs',
      'International job market insights',
      'Post-placement support and follow-up'
    ],
    pricing: 'Consultation required',
    color: 'purple',
  },
  {
    icon: FileText,
    title: 'Career Counseling',
    description: 'Expert guidance to help you make informed career decisions and achieve your professional goals.',
    features: [
      'Comprehensive career assessment and analysis',
      'Goal setting and action planning',
      'Resume and LinkedIn profile optimization',
      'Personal branding and professional image',
      'Career change strategy and planning'
    ],
    pricing: 'Starting from $149',
    color: 'green',
  },
  {
    icon: Building,
    title: 'Corporate Solutions',
    description: 'Tailored workforce solutions for enterprises and organizations of all sizes.',
    features: [
      'Workforce planning and strategy consulting',
      'Contract staffing and temporary placements',
      'HR consulting and process optimization',
      'Talent management and retention strategies',
      'Organizational development and restructuring'
    ],
    pricing: 'Enterprise pricing',
    color: 'red',
  },
];

const processSteps = [
  {
    step: '01',
    title: 'Initial Consultation',
    description: 'We start with a comprehensive consultation to understand your needs, goals, and preferences.',
  },
  {
    step: '02',
    title: 'Strategy Development',
    description: 'Our experts develop a customized strategy tailored to your specific requirements and objectives.',
  },
  {
    step: '03',
    title: 'Implementation',
    description: 'We execute the plan with precision, keeping you informed throughout the entire process.',
  },
  {
    step: '04',
    title: 'Follow-up & Support',
    description: 'Continuous support and follow-up to ensure successful outcomes and long-term satisfaction.',
  },
];

const testimonials = [
  {
    name: 'Jennifer Martinez',
    role: 'HR Director',
    company: 'Global Tech Solutions',
    testimonial: 'SIN Manpower transformed our recruitment process. Their expertise in finding the right talent has been invaluable to our growth.',
    rating: 5,
  },
  {
    name: 'Robert Chen',
    role: 'Software Engineer',
    company: 'Innovation Labs',
    testimonial: 'The career counseling service helped me transition from finance to tech. The guidance was professional and results-oriented.',
    rating: 5,
  },
  {
    name: 'Sarah Johnson',
    role: 'Marketing Manager',
    company: 'Creative Agency',
    testimonial: 'International placement service was exceptional. They handled everything from visa processing to relocation support.',
    rating: 5,
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

export default function ServicesPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Services</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <div className="mt-4">
            <h1 className="text-3xl font-bold text-gray-900">Our Services</h1>
            <p className="text-gray-600 mt-2">
              Comprehensive career and recruitment solutions tailored to your needs
            </p>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-teal-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Empowering Careers, Enabling Success
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              From job placement to career development, we offer comprehensive solutions 
              to help individuals and organizations achieve their goals.
            </p>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Phone className="mr-2 h-5 w-5" />
              Schedule Consultation
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
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
              Comprehensive Service Portfolio
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide end-to-end solutions for all your career and recruitment needs
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
                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between mb-4">
                        <Badge variant="outline" className="text-sm">
                          {service.pricing}
                        </Badge>
                      </div>
                      <Button variant="outline" className="w-full group/btn">
                        Learn More
                        <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A systematic approach to delivering exceptional results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto">
                    {step.step}
                  </div>
                  {index < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gray-300 -translate-x-8" />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Client Success Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from our satisfied clients about their experience with our services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <blockquote className="text-gray-600 mb-4">
                      "{testimonial.testimonial}"
                    </blockquote>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">
                        {testimonial.role} at {testimonial.company}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-teal-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Contact us today to discuss how our services can help you achieve your goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <Phone className="mr-2 h-5 w-5" />
                Schedule Consultation
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                <Mail className="mr-2 h-5 w-5" />
                Contact Us
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}