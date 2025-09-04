"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Play, X } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

import { useTranslations } from "next-intl";
import { useState } from "react";

export function HeroSection() {
  const t = useTranslations("HeroSection");
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const openVideo = () => {
    setIsVideoOpen(true);
  };

  const closeVideo = () => {
    setIsVideoOpen(false);
  };

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Video Placeholder */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-teal-700">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg')] bg-cover bg-center opacity-20" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              {t("connect")}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
                {" "}
                {t("career")}{" "}
              </span>
              {t("withGlobalOpportunities")}
            </h1>

            <p className="text-xl md:text-2xl mb-8 text-gray-200 leading-relaxed">
              {t("description")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6"
                asChild
              >
                <Link href="/jobs">
                  {t("browseJobs")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 border-white text-neutral-600 hover:bg-white hover:text-blue-900"
                onClick={openVideo}
              >
                <Play className="mr-2 h-5 w-5" />
                {t("watchOurStory")}
              </Button>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
            >
              <div>
                <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">
                  {t("placementsCount")}
                </div>
                <div className="text-gray-300">{t("successfulPlacements")}</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-teal-400 mb-2">
                  {t("countriesCount")}
                </div>
                <div className="text-gray-300">{t("countriesWorldwide")}</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-orange-400 mb-2">
                  {t("successRate")}
                </div>
                <div className="text-gray-300">{t("successRateLabel")}</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Video Modal */}
      {isVideoOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden">
            <button
              onClick={closeVideo}
              className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full p-2 transition-all"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="w-full h-full flex items-center justify-center">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/AEefKl7huzc?si=xJYyfDNbGFVc2eC0"
                title="Our Story"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
              <p className="text-gray-300">
                {t("videoCaption")}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
