"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Send } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";

import { useTranslations } from "next-intl";

export function CTASection() {
  const t = useTranslations("CTASection");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-white"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">{t("title")}</h2>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed">
            {t("subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6 min-w-[200px]"
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
              className="border-white text-zinc-700 hover:bg-white hover:text-blue-600 text-lg px-8 py-6 min-w-[200px]"
              asChild
            >
              <Link href="/contact">
                <Send className="mr-2 h-5 w-5" />
                {t("getInTouch")}
              </Link>
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-blue-100"
          >
            <p className="text-sm">{t("footer")}</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
