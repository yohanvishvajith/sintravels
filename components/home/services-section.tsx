"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Search,
  Users,
  GraduationCap,
  Building,
  Globe,
  FileText,

} from "lucide-react";

const services = [
  {
    icon: Search,
    titleKey: "jobPlacementTitle",
    descriptionKey: "jobPlacementDescription",
    featuresKey: "jobPlacementFeatures",
    color: "blue",
  },
  {
    icon: Users,
    titleKey: "recruitmentTitle",
    descriptionKey: "recruitmentDescription",
    featuresKey: "recruitmentFeatures",
    color: "teal",
  },
  {
    icon: GraduationCap,
    titleKey: "skillsTrainingTitle",
    descriptionKey: "skillsTrainingDescription",
    featuresKey: "skillsTrainingFeatures",
    color: "orange",
  },
  {
    icon: Globe,
    titleKey: "internationalPlacementTitle",
    descriptionKey: "internationalPlacementDescription",
    featuresKey: "internationalPlacementFeatures",
    color: "purple",
  },
  {
    icon: FileText,
    titleKey: "careerCounselingTitle",
    descriptionKey: "careerCounselingDescription",
    featuresKey: "careerCounselingFeatures",
    color: "green",
  },
  {
    icon: Building,
    titleKey: "corporateSolutionsTitle",
    descriptionKey: "corporateSolutionsDescription",
    featuresKey: "corporateSolutionsFeatures",
    color: "red",
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

export function ServicesSection() {
  const t = useTranslations("ServicesSection");
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
            {t("title")}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t("subtitle")}
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
                  <CardTitle className="text-xl">
                    {t(service.titleKey)}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {t(service.descriptionKey)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {Array.isArray(t.raw(service.featuresKey)) &&
                      t
                        .raw(service.featuresKey)
                        .map((feature: string, featureIndex: number) => (
                          <li
                            key={featureIndex}
                            className="flex items-center text-sm text-gray-600"
                          >
                            <div className="w-2 h-2 bg-blue-600 rounded-full mr-3" />
                            {feature}
                          </li>
                        ))}
                  </ul>
           
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
