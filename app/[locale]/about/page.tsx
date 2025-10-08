"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";
import {
  Card,
  CardContent,
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
  Calendar,
  Globe,
  Users,
  TrendingUp,
  Award,
  Heart,
  Target,
  Briefcase,
  Phone,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

const stats = [
  { icon: Calendar, value: "12+", labelKey: "yearsOfExperience", color: "blue" },
  { icon: Globe, value: "6+", labelKey: "partnerCountries", color: "teal" },
  { icon: Users, value: "5K+", labelKey: "successfulPlacements", color: "orange" },
  { icon: TrendingUp, value: "98%", labelKey: "clientSatisfaction", color: "purple" },
];

const values = [
  { icon: Award, titleKey: "valueProfessionalExcellence", descriptionKey: "valueProfessionalExcellenceDesc", color: "blue" },
  { icon: Heart, titleKey: "valueIntegrityTransparency", descriptionKey: "valueIntegrityTransparencyDesc", color: "red" },
  { icon: Users, titleKey: "valueClientCentric", descriptionKey: "valueClientCentricDesc", color: "green" },
  { icon: Globe, titleKey: "valueGlobalPerspective", descriptionKey: "valueGlobalPerspectiveDesc", color: "purple" },
];

const milestones = [
  { year: "2009", title: "Company Founded", description: "SIN Manpower was established with a vision to transform international recruitment." },
  { year: "2014", title: "Regional Expansion", description: "Expanded operations to partner countries across the Middle East and Asia" },
  { year: "2019", title: "5,000 Placements", description: "Surpassed 5,000 successful placements globally" },
];

export default function AboutPage() {
  const t = useTranslations("AboutPage");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">{t("home")}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{t("aboutTitle")}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="mt-4">
            <h1 className="text-3xl font-bold text-gray-900">{t("aboutTitle")}</h1>
            <p className="text-gray-600 mt-2">{t("aboutSubtitle")}</p>
          </div>
        </div>
      </div>

      <section className="py-16 bg-gradient-to-br from-blue-600 to-teal-600 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">{t("heroTitle")}</h2>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">{t("heroParagraph1")}</p>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">{t("heroParagraph2")}</p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
                  <Link href="/contact">
                    <Phone className="mr-2 h-5 w-5" />
                    {t("getInTouch")}
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600" asChild>
                  <Link href="/services">
                    <Briefcase className="mr-2 h-5 w-5" />
                    {t("browseJobs")}
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
                  <div className="text-blue-100 text-sm">{t(stat.labelKey)}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t("missionTitle")}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t("missionText")}</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8 }}>
              <Card className="h-full bg-gradient-to-br from-blue-50 to-teal-50 border-blue-200">
                <CardHeader>
                  <div className="flex items-center mb-4">
                    <Target className="h-8 w-8 text-blue-600 mr-3" />
                    <CardTitle className="text-2xl">{t("missionTitle")}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-lg leading-relaxed">{t("missionText")}</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, delay: 0.2 }}>
              <Card className="h-full bg-gradient-to-br from-teal-50 to-blue-50 border-teal-200">
                <CardHeader>
                  <div className="flex items-center mb-4">
                    <Globe className="h-8 w-8 text-teal-600 mr-3" />
                    <CardTitle className="text-2xl">{t("visionTitle")}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-lg leading-relaxed">{t("visionText")}</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t("valuesTitle")}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t("valuesTitle")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: index * 0.1 }}>
                <Card className="h-full text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mx-auto mb-4`}>
                      <value.icon className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-xl">{t(value.titleKey)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{t(value.descriptionKey)}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t("ourJourneyTitle")}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t("ourJourneySubtitle")}</p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-blue-200"></div>

            {milestones.map((milestone, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: index * 0.1 }} className={`relative flex items-center mb-12 ${index % 2 === 0 ? "justify-start" : "justify-end"}`}>
                <div className={`w-5/12 ${index % 2 === 0 ? "pr-8 text-right" : "pl-8"}`}>
                  <Card className="shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader>
                      <Badge className="w-fit bg-blue-100 text-blue-800 mb-2">{milestone.year}</Badge>
                      <CardTitle className="text-lg">{milestone.title}</CardTitle>
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

      <section className="py-20 bg-gradient-to-r from-blue-600 to-teal-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{t("ctaTitle")}</h2>
            <p className="text-xl text-blue-100 mb-8">{t("ctaSubtitle")}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
                <Link href="/jobs">
                  <Briefcase className="mr-2 h-5 w-5" />
                  {t("browseJobs")}
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600" asChild>
                <Link href="/contact">
                  <Phone className="mr-2 h-5 w-5" />
                  {t("getInTouch")}
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
