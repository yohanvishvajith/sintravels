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
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Users,
  Globe,
  Award,
  Target,
  Heart,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Calendar,
  TrendingUp,
  Briefcase,
} from "lucide-react";
import Link from "next/link";

const stats = [
  {
    icon: Calendar,
    value: "15+",
    label: "Years of Experience",
    color: "blue",
  },
  {
    icon: Globe,
    value: "25+",
    label: "Partner Countries",
    color: "teal",
  },
  {
    icon: Users,
    value: "15K+",
    label: "Successful Placements",
    color: "orange",
  },
  {
    icon: TrendingUp,
    value: "98%",
    label: "Client Satisfaction",
    color: "purple",
  },
];

const values = [
  {
    icon: Award,
    title: "Professional Excellence",
    description:
      "We maintain the highest standards in all our services, ensuring quality outcomes for every client.",
    color: "blue",
  },
  {
    icon: Heart,
    title: "Integrity & Transparency",
    description:
      "Honest communication and ethical practices form the foundation of all our relationships.",
    color: "red",
  },
  {
    icon: Users,
    title: "Client-Centric Approach",
    description:
      "Your success is our priority. We tailor our services to meet your unique needs and goals.",
    color: "green",
  },
  {
    icon: Globe,
    title: "Global Perspective",
    description:
      "With international expertise, we connect talent across borders and cultures seamlessly.",
    color: "purple",
  },
];

const milestones = [
  {
    year: "2009",
    title: "Company Founded",
    description:
      "SIN Manpower was established with a vision to transform international recruitment.",
  },
  {
    year: "2012",
    title: "Regional Expansion",
    description:
      "Extended operations to 10+ countries across Asia and the Middle East.",
  },
  {
    year: "2016",
    title: "5,000 Placements",
    description:
      "Reached milestone of 5,000 successful job placements globally.",
  },
  {
    year: "2019",
    title: "Global Network",
    description:
      "Established partnerships in 20+ countries across 4 continents.",
  },
  {
    year: "2022",
    title: "10,000+ Placements",
    description:
      "Doubled our placement success with 10,000+ professionals placed.",
  },
  {
    year: "2024",
    title: "Digital Innovation",
    description:
      "Launched advanced digital platforms for enhanced client experience.",
  },
];

const colorClasses = {
  blue: "text-blue-600 bg-blue-50",
  teal: "text-teal-600 bg-teal-50",
  orange: "text-orange-600 bg-orange-50",
  purple: "text-purple-600 bg-purple-50",
  red: "text-red-600 bg-red-50",
  green: "text-green-600 bg-green-50",
};

export default function AboutPage() {
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
                <BreadcrumbPage>About Us</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="mt-4">
            <h1 className="text-3xl font-bold text-gray-900">
              About SIN Manpower
            </h1>
            <p className="text-gray-600 mt-2">
              Your trusted partner in international recruitment and career
              development
            </p>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-teal-600 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Connecting Talent with Global Opportunities
              </h2>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Since 2009, SIN Manpower has been at the forefront of
                international recruitment, helping thousands of professionals
                find their dream careers while assisting organizations in
                building world-class teams.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100"
                  asChild
                >
                  <Link href="/contact">
                    <Phone className="mr-2 h-5 w-5" />
                    Contact Us
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-blue-600"
                  asChild
                >
                  <Link href="/services">
                    <Briefcase className="mr-2 h-5 w-5" />
                    Our Services
                  </Link>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center"
                >
                  <stat.icon className="h-8 w-8 mx-auto mb-3 text-white" />
                  <div className="text-3xl font-bold mb-2">{stat.value}</div>
                  <div className="text-blue-100 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
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
              Our Mission & Vision
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Driving excellence in international recruitment with clear purpose
              and vision
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <Card className="h-full bg-gradient-to-br from-blue-50 to-teal-50 border-blue-200">
                <CardHeader>
                  <div className="flex items-center mb-4">
                    <Target className="h-8 w-8 text-blue-600 mr-3" />
                    <CardTitle className="text-2xl">Our Mission</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    To bridge the gap between talent and opportunity by
                    providing world-class recruitment services that transform
                    careers and businesses globally. We are committed to
                    excellence, integrity, and creating lasting value for all
                    stakeholders in the recruitment ecosystem.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="h-full bg-gradient-to-br from-teal-50 to-blue-50 border-teal-200">
                <CardHeader>
                  <div className="flex items-center mb-4">
                    <Globe className="h-8 w-8 text-teal-600 mr-3" />
                    <CardTitle className="text-2xl">Our Vision</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    To be the leading international manpower solution provider,
                    recognized for our excellence, innovation, and commitment to
                    client success. We envision a world where geographical
                    boundaries don't limit career aspirations and business
                    growth.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className="h-full text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-full mx-auto mb-4 ${
                        colorClasses[value.color as keyof typeof colorClasses]
                      }`}
                    >
                      <value.icon className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Timeline */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Key milestones in our growth and evolution
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-blue-200"></div>

            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={`relative flex items-center mb-12 ${
                  index % 2 === 0 ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`w-5/12 ${
                    index % 2 === 0 ? "pr-8 text-right" : "pl-8"
                  }`}
                >
                  <Card className="shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader>
                      <Badge className="w-fit bg-blue-100 text-blue-800 mb-2">
                        {milestone.year}
                      </Badge>
                      <CardTitle className="text-lg">
                        {milestone.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{milestone.description}</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg"></div>
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
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of professionals who have trusted us with their
              career aspirations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100"
                asChild
              >
                <Link href="/jobs">
                  <Briefcase className="mr-2 h-5 w-5" />
                  Browse Jobs
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600"
                asChild
              >
                <Link href="/contact">
                  <Phone className="mr-2 h-5 w-5" />
                  Get In Touch
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
