"use client";

import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { useInView } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Globe,
  User,
  Building,
  FileText,
  CheckCircle,
} from "lucide-react";
import { useTranslations } from "next-intl";

const contactInfo = [
  {
    icon: Phone,
    title: "Phone",
    details: ["+94 334 200 240", "+94 761 418 949"],
    description: "Call us during business hours",
    color: "blue",
    action: "tel:+94334200240",
  },
  {
    icon: Mail,
    title: "Email",
    details: ["sintravelsandmanpower@gmail.com"],
    description: "Send us an email anytime",
    color: "green",
    action: "mailto:sintravelsandmanpower@gmail.com",
  },
  {
    icon: MapPin,
    title: "Address",
    details: ["162/6 Chilaw Road", "Kochchikade, Sri Lanka"],
    description: "Visit our office",
    color: "orange",
    action: null,
  },
  {
    icon: Clock,
    title: "Business Hours",
    details: ["Mon - Fri: 9:00 AM - 6:00 PM", "Sat: 9:00 AM - 1:00 PM"],
    description: "We are available during these hours",
    color: "purple",
    action: null,
  },
];

const services = [
  "Job Placement Services",
  "Career Counseling",
  "Skills Training",
  "Visa Assistance",
  "Corporate Solutions",
  "Other",
];

const colorClasses = {
  blue: "text-blue-600 bg-blue-50 border-blue-200",
  green: "text-green-600 bg-green-50 border-green-200",
  orange: "text-orange-600 bg-orange-50 border-orange-200",
  purple: "text-purple-600 bg-purple-50 border-purple-200",
};

export default function ContactPage() {
  const t = useTranslations("ContactPage");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("email", formData.email);
      payload.append("phone", formData.phone);
      payload.append("company", formData.company);
      payload.append("service", formData.service);
      payload.append("message", formData.message);

      const res = await fetch(`/api/contact`, {
        method: "POST",
        body: payload,
      });

      const json = await res.json().catch(() => null);

      if (!res.ok || !(json && json.ok)) {
        const msg = (json && json.error) || `Server returned ${res.status}`;
        setError(String(msg));
        setIsSubmitted(false);
      } else {
        setIsSubmitted(true);

        // Reset form after 3 seconds
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({
            name: "",
            email: "",
            phone: "",
            company: "",
            service: "",
            message: "",
          });
        }, 3000);
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setIsSubmitting(false);
    }
  };

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
                <BreadcrumbPage>Contact</BreadcrumbPage>
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
            <div className="flex items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                <span>{t("quickResponse")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                <span>{t("globalExpertise")}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>{t("provenResults")}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Information */}
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
              {t("contactSectionTitle")}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t("contactSectionSubtitle")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card
                  className={`h-full text-center hover:shadow-lg transition-all duration-300 cursor-pointer ${
                    info.action ? "hover:-translate-y-1" : ""
                  }`}
                  onClick={() =>
                    info.action && window.open(info.action, "_self")
                  }
                >
                  <CardHeader>
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mx-auto mb-4 ${
                        colorClasses[info.color as keyof typeof colorClasses]
                      }`}
                    >
                      <info.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">
                      {t(info.title.toLowerCase() + "Title") ?? info.title}
                    </CardTitle>
                    <CardDescription>
                      {t(info.title.toLowerCase() + "Description") ??
                        info.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {info.details.map((detail, detailIndex) => (
                      <p
                        key={detailIndex}
                        className="font-medium text-gray-900 mb-1"
                      >
                        {detail}
                      </p>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Send className="h-6 w-6 text-blue-600" />
                    {t("form.title")}
                  </CardTitle>
                  <CardDescription>{t("form.description")}</CardDescription>
                </CardHeader>
                <CardContent>
                  {isSubmitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8"
                    >
                      <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Message Sent Successfully!
                      </h3>
                      <p className="text-gray-600">
                        Thank you for contacting us. We&apos;ll respond within
                        24 hours.
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {error ? (
                        <div className="p-3 bg-red-50 text-red-800 rounded-md">
                          <strong>Error:</strong> {error}
                        </div>
                      ) : null}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">
                            <User className="h-4 w-4 inline mr-1" />
                            {t("form.nameLabel")}
                          </Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) =>
                              handleInputChange("name", e.target.value)
                            }
                            placeholder={t("form.namePlaceholder")}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">
                            <Mail className="h-4 w-4 inline mr-1" />
                            {t("form.emailLabel")}
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                              handleInputChange("email", e.target.value)
                            }
                            placeholder={t("form.emailPlaceholder")}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">
                            <Phone className="h-4 w-4 inline mr-1" />
                            {t("form.phoneLabel")}
                          </Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) =>
                              handleInputChange("phone", e.target.value)
                            }
                            placeholder={t("form.phonePlaceholder")}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="company">
                            <Building className="h-4 w-4 inline mr-1" />
                            {t("form.companyLabel")}
                          </Label>
                          <Input
                            id="company"
                            value={formData.company}
                            onChange={(e) =>
                              handleInputChange("company", e.target.value)
                            }
                            placeholder={t("form.companyPlaceholder")}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="service">
                          <FileText className="h-4 w-4 inline mr-1" />
                          {t("form.serviceLabel")}
                        </Label>
                        <Select
                          value={formData.service}
                          onValueChange={(value) =>
                            handleInputChange("service", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t("form.servicePlaceholder")}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {services.map((service) => (
                              <SelectItem key={service} value={service}>
                                {service}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">
                          <MessageCircle className="h-4 w-4 inline mr-1" />
                          {t("form.messageLabel")}
                        </Label>
                        <Textarea
                          id="message"
                          value={formData.message}
                          onChange={(e) =>
                            handleInputChange("message", e.target.value)
                          }
                          placeholder={t("form.messagePlaceholder")}
                          rows={5}
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            {t("form.sending")}
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            {t("form.sendMessage")}
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="shadow-lg h-full">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <MapPin className="h-6 w-6 text-blue-600" />
                    {t("mapTitle")}
                  </CardTitle>
                  <CardDescription>{t("mapDescription")}</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="aspect-square bg-gray-100 rounded-b-lg overflow-hidden">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126648.16814890831!2d79.71021589726561!3d7.268668500000008!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2e9ce44ff29f5%3A0x8a4d9aa5522b98aa!2sSIN%20Travels%20%26%20Manpower%20(PVT)%20LTD!5e0!3m2!1sen!2slk!4v1755592598242!5m2!1sen!2slk"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen={true}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="w-full h-full"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t("faq.title")}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t("faq.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {t("faq.q1.question")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{t("faq.q1.answer")}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {t("faq.q2.question")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{t("faq.q2.answer")}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {t("faq.q3.question")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{t("faq.q3.answer")}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {t("faq.q4.question")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{t("faq.q4.answer")}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
