"use client";

import React from "react";
import { useTranslations } from "next-intl";

export default function TermsPage() {
  const t = useTranslations("Terms");

  return (
    <main className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{t("title")}</h1>
      <p className="mb-4 text-gray-700">{t("intro")}</p>

      <section className="prose prose-sm">
        <h2>{t("usageTitle")}</h2>
        <p>{t("usage")}</p>

        <h2>{t("limitationTitle")}</h2>
        <p>{t("limitation")}</p>

        <h2>{t("contactTitle")}</h2>
        <p>{t("contact")}</p>
      </section>
    </main>
  );
}
