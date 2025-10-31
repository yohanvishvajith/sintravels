import Link from "next/link";
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
} from "lucide-react";

import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("Footer");
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">{t("companyName")}</span>
            </div>
            <p className="text-gray-300 leading-relaxed">{t("description")}</p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
              <Linkedin className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t("quickLinks")}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t("home")}
                </Link>
              </li>
              <li>
                <Link
                  href="/jobs"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t("browseJobs")}
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t("ourServices")}
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t("aboutUs")}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t("contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t("services")}</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-gray-300">
                  {t("recruitmentSolutions")}
                </span>
              </li>
              <li>
                <span className="text-gray-300">{t("careerCounseling")}</span>
              </li>
              <li>
                <span className="text-gray-300">{t("skillsTraining")}</span>
              </li>
              <li>
                <span className="text-gray-300">
                  {t("internationalPlacements")}
                </span>
              </li>
              <li>
                <span className="text-gray-300">{t("corporateSolutions")}</span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t("contactInfo")}</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                <span className="text-gray-300">{t("address")}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-400" />
                <a
                  href="tel:+94334200240"
                  className="text-gray-300 hover:text-blue-400 transition-colors cursor-pointer"
                >
                  {t("phone")}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400" />
                <a
                  href="mailto:sintravelsandmanpower@gmail.com"
                  className="text-gray-300 hover:text-blue-400 transition-colors cursor-pointer"
                >
                  {t("email")}
                </a>
              </div>
            </div>
          </div>

          {/* Google Maps */}
          <div className="space-y-4 lg:ml-12">
            <h3 className="text-lg font-semibold">{t("findUs")}</h3>
            <div className="w-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126648.16814890831!2d79.71021589726561!3d7.268668500000008!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2e9ce44ff29f5%3A0x8a4d9aa5522b98aa!2sSIN%20Travels%20%26%20Manpower%20(PVT)%20LTD!5e0!3m2!1sen!2slk!4v1755592598242!5m2!1sen!2slk"
                width="100%"
                height="200"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">{t("copyright")}</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
               <Link
                href="/registernumber"
                className="text-gray-300 hover:text-white text-sm transition-colors"
              >
             reg123456
              </Link>
              <Link
                href="/privacy"
                className="text-gray-300 hover:text-white text-sm transition-colors"
              >
                {t("privacyPolicy")}
              </Link>
              <Link
                href="/terms"
                className="text-gray-300 hover:text-white text-sm transition-colors"
              >
                {t("termsOfService")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
