"use client";
import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
  Mail,
} from "lucide-react";
import Link from "next/link";

const services = [
  {
    icon: Users,
    title: "RECRUITMENT AND PLACEMENT",
    features: [
      "Sourcing candidates for various industries.",
      "Screening, interviewing, and shortlisting candidates.",
      "Matching candidates with suitable job openings abroad.",
    ],
    color: "blue",
  },
  {
    icon: FileText,
    title: "VISA PROCESSING ASSISTANCE",
    features: [
      "Guiding candidates through the visa application process.",
      "Assistance with documentation and embassy appointments.",
      "Updates on visa status and timelines.",
    ],
    color: "teal",
  },
  {
    icon: GraduationCap,
    title: "TRAINING AND SKILL DEVELOPMENT",
    features: [
      "Pre-departure training (language, culture, and work ethics specific to the destination country).",
      "Professional certifications and vocational training to meet foreign employer requirements.",
    ],
    color: "orange",
  },
  {
    icon: FileText,
    title: "COMPLIANCE AND DOCUMENTATION",
    features: [
      "Assistance with legal paperwork and contracts.",
      "Ensuring compliance with both local and international labor laws.",
      "Verification of candidate qualifications and experience.",
    ],
    color: "purple",
  },
  {
    icon: Building,
    title: "EMPLOYER SERVICES",
    features: [
      "Partnering with foreign employers to fulfill staffing needs.",
      "Tailoring recruitment solutions based on specific job requirements.",
      "Ongoing support for employers, such as performance tracking and workforce management.",
    ],
    color: "green",
  },
];

const processSteps = [
  {
    step: "01",
    title: "Initial Consultation",
    description:
      "We begin with a one-on-one consultation to understand your career goals, skills, and preferred countries for employment.",
  },
  {
    step: "02",
    title: "Career Strategy & Job Matching",
    description:
      "Our experts create a personalized job search strategy, matching your qualifications with the best opportunities abroad.",
  },
  {
    step: "03",
    title: "Application & Visa Assistance",
    description:
      "We guide you through every step of the application process, including CV preparation, interview support, and visa documentation.",
  },
  {
    step: "04",
    title: "Placement & Ongoing Support",
    description:
      "Once placed, we continue to provide guidance and support to help you settle into your new role or change careers and adapt to life overseas.",
  },
];

const testimonials = [
  {
    name: "Jennifer Martinez",
    role: "HR Director",
    company: "Global Tech Solutions",
    testimonial:
      "SIN Manpower transformed our recruitment process. Their expertise in finding the right talent has been invaluable to our growth.",
    rating: 5,
  },
  {
    name: "Robert Chen",
    role: "Software Engineer",
    company: "Innovation Labs",
    testimonial:
      "The career counseling service helped me transition from finance to tech. The guidance was professional and results-oriented.",
    rating: 5,
  },
  {
    name: "Sarah Johnson",
    role: "Marketing Manager",
    company: "Creative Agency",
    testimonial:
      "International placement service was exceptional. They handled everything from visa processing to relocation support.",
    rating: 5,
  },
];

const colorClasses = {
  blue: "group-hover:bg-blue-50 group-hover:border-blue-200",
  teal: "group-hover:bg-teal-50 group-hover:border-teal-200",
  orange: "group-hover:bg-orange-50 group-hover:border-orange-200",
  purple: "group-hover:bg-purple-50 group-hover:border-purple-200",
  green: "group-hover:bg-green-50 group-hover:border-green-200",
  red: "group-hover:bg-red-50 group-hover:border-red-200",
};

const iconColorClasses = {
  blue: "text-blue-600",
  teal: "text-teal-600",
  orange: "text-orange-600",
  purple: "text-purple-600",
  green: "text-green-600",
  red: "text-red-600",
};

export default function ServicesPage() {
  const t = useTranslations("ServicesPage");
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
                <BreadcrumbLink href="/">{t("home")}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{t("services")}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="mt-4">
            <h1 className="text-3xl font-bold text-gray-900">
              {t("headerTitle")}
            </h1>
            <p className="text-gray-600 mt-2">{t("headerSubtitle")}</p>
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
              {t("heroTitle")}
            </h2>
            <p className="text-xl text-blue-100 mb-8">{t("heroSubtitle")}</p>
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100"
              asChild
            >
              <Link href="/contact">
                <Phone className="mr-2 h-5 w-5" />
                {t("scheduleConsultation")}
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      

      {/* Services Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t("servicesPortfolioTitle")}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t("servicesPortfolioSubtitle")}
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
                <Card
                  className={`h-full border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                    colorClasses[service.color as keyof typeof colorClasses]
                  }`}
                >
                  <CardHeader>
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gray-50 mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <service.icon
                        className={`h-6 w-6 ${
                          iconColorClasses[
                            service.color as keyof typeof iconColorClasses
                          ]
                        }`}
                      />
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="flex items-start text-sm text-gray-600"
                        >
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="pt-4 border-t">
                  
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
              {t("processTitle")}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t("processSubtitle")}
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
                <p className="text-gray-600">{step.description}</p>
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
              {t("ctaTitle")}
            </h2>
            <p className="text-xl text-blue-100 mb-8">{t("ctaSubtitle")}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100"
                asChild
              >
                <Link href="/contact">
                  <Phone className="mr-2 h-5 w-5" />
                  {t("scheduleConsultation")}
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-blue-600 bg-white hover:bg-gray-100 hover:text-blue-600 transition-colors"
                asChild
              >
                <Link href="/contact">
                  <Mail className="mr-2 h-5 w-5" />
                  {t("contactUs")}
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
