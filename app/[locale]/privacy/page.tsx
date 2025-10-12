"use client";

import React from "react";
import { useTranslations } from "next-intl";

export default function PrivacyPage() {
  const t = useTranslations("Privacy");

  return (
    <main className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{t("title")}</h1>
      <p className="mb-4 text-gray-700">{t("intro")}</p>

      <section className="prose prose-sm">
        <h2>{t("dataCollectionTitle")}</h2>
        <p>{t("dataCollection")}</p>

        <h2>{t("cookiesTitle")}</h2>
        <p>{t("cookies")}</p>

        <h2>{t("contactTitle")}</h2>
        <p>{t("contact")}</p>
      </section>
    </main>
  );
}
