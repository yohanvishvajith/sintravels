"use client";
import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useInView } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  { icon: Calendar, value: "5+", labelKey: "yearsOfExperience", color: "blue" },
  { icon: Globe, value: "6+", labelKey: "partnerCountries", color: "teal" },
  {
    icon: Users,
    value: "700+",
    labelKey: "successfulPlacements",
    color: "orange",
  },
  {
    icon: TrendingUp,
    value: "98%",
    labelKey: "clientSatisfaction",
    color: "purple",
  },
];

const values = [
  {
    icon: Award,
    title: "INTEGRITY AND TRANSPARENCY",
    description:
      "Commitment to honesty, ethical behavior, and openness in all business practices, ensuring trust with foreign workers, employers, and partners.",
    color: "blue",
  },
  {
    icon: Target,
    title: "ACCOUNTABILITY",
    description:
      "Upholding responsibility for the safety, welfare, and rights of all individuals placed in overseas employment, ensuring strict adherence to local and international labor laws.",
    color: "teal",
  },
  {
    icon: TrendingUp,
    title: "EXCELLENCE IN SERVICE",
    description:
      "Striving for excellence in providing efficient, effective, and responsive services to both job seekers and foreign employers, ensuring high standards in recruitment and placement processes.",
    color: "orange",
  },
  {
    icon: Users,
    title: "FAIRNESS AND EQUALITY",
    description:
      "Ensuring equal opportunity for all Sri Lankan workers regardless of their background and promoting non-discriminatory practices in foreign employment.",
    color: "purple",
  },
  {
    icon: Heart,
    title: "WORKER EMPOWERMENT AND WELFARE",
    description:
      "Focusing on the welfare, safety, and development of migrant workers through training, education, and continuous support, ensuring they are well-prepared and protected while employed abroad.",
    color: "red",
  },
  {
    icon: Globe,
    title: "PARTNERSHIP AND COLLABORATION",
    description:
      "Building strong relationships with foreign employers, governments, and international agencies to promote safe and ethical employment opportunities for Sri Lankan workers.",
    color: "green",
  },
  {
    icon: Calendar,
    title: "INNOVATION AND CONTINUOUS IMPROVEMENT",
    description:
      "Embracing innovation in recruitment processes, using technology to ensure the efficient matching of skills with employer needs, and continuously improving services for stakeholders.",
    color: "blue",
  },
  {
    icon: Briefcase,
    title: "COMPLIANCE WITH INTERNATIONAL STANDARDS",
    description:
      "Committing to adhere to international labor standards and best practices, ensuring the rights and dignity of migrant workers are protected across all destinations.",
    color: "teal",
  },
];

const milestones = [
  {
    year: "2021",
    title: "Launched Air Ticketing & Tourist Visa Services",
    description:
      "We launched air ticketing and tourist visa services and expanded partnerships across countries",
  },
  {
    year: "2023",
    title: "Registered with the Sri Lanka Bureau of Foreign Employment",
    description: "The company was officially registered with the Sri Lanka Bureau of Foreign Employment (SLBFE)",
  },
    {
    year: "2023",
    title: "Changed to Sin Travels and Manpower",
    description: "The business rebranded as Sin Travels and Manpower to reflect its expanded services and strategic direction under the new director.",
  },
];

export default function AboutPage() {
  const t = useTranslations("AboutPage");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  // Team slideshow state and data
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);

  const team = [
    {
      name: "Mr. Nalinda Sampath",
      role: "Director",
      img: "/images/team/team1.jpg",
    },
    {
      name: "Mr. Gayan Fernando",
      role: "Director (Licen)",
      img: "/images/team/team2.jpg",
    },
    { name: "Ms.Anjali ", role: "Marketing", img: "/images/team/team3.jpg" },
    {
      name: "Ms.Kalani Hansika",
      role: "Marketing",
      img: "/images/team/team4.jpg",
    },
    {
      name: "Ms.Swetha Abesinghe",
      role: "Marketing",
      img: "/images/team/team5.jpg",
    },
    {
      name: "Ms.Sugandi Navarathne",
      role: "Marketing",
      img: "/images/team/team6.jpg",
    },
    {
      name: "Mr.Sheron fernando",
      role: "Marketing",
      img: "/images/team/team7.jpg",
    },
    {
      name: "Mr.Chamila",
      role: "Manager",
      img: "/images/team/team8.jpg",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTeamIndex((p) => (p + 1) % team.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [team.length]);

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
            <h1 className="text-3xl font-bold text-gray-900">
              {t("aboutTitle")}
            </h1>
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
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                {t("heroTitle")}
              </h2>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                {t("heroParagraph1")}
              </p>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                {t("heroParagraph2")}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-white text-blue-500 hover:bg-gray-100 hover:text-blue-700"
                  asChild
                >
                  <Link href="/contact">
                    <Phone className="mr-2 h-5 w-5" />
                    {t("getInTouch")}
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-blue-500 hover:bg-white hover:text-blue-700"
                  asChild
                >
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
                  <div className="text-blue-100 text-sm">
                    {t(stat.labelKey)}
                  </div>
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t("missionHeader")}
            </h2>
         
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
                    <CardTitle className="text-2xl">
                      {t("missionTitle")}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {t("missionText")}
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
                    <CardTitle className="text-2xl">
                      {t("visionTitle")}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {t("visionText")}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t("valuesTitle")}
            </h2>
    
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
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-full mx-auto mb-4`}
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

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t("ourJourneyTitle")}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t("ourJourneySubtitle")}
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

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Our Team
            </h2>
            <p className="text-gray-600">
              Meet the people behind SIN Travels & Manpower
            </p>
          </div>

          
          <div className="relative max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="mx-auto mb-6 w-72 h-72 md:w-96 md:h-96 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={team[currentTeamIndex].img}
                  alt={team[currentTeamIndex].name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-semibold">
                {team[currentTeamIndex].name}
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                {team[currentTeamIndex].role}
              </p>
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() =>
                    setCurrentTeamIndex(
                      (currentTeamIndex - 1 + team.length) % team.length
                    )
                  }
                  className="px-4 py-2 bg-gray-200 rounded-md"
                >
                  Prev
                </button>
                <div className="flex gap-3 items-center">
                  {team.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentTeamIndex(i)}
                      className={`w-3 h-3 md:w-4 md:h-4 rounded-full ${
                        i === currentTeamIndex ? "bg-blue-600" : "bg-gray-300"
                      }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
                <button
                  onClick={() =>
                    setCurrentTeamIndex((currentTeamIndex + 1) % team.length)
                  }
                  className="px-4 py-2 bg-gray-200 rounded-md"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              FOUNDER'S MESSAGE
            </h2>
          </div>

          <div className="max-w-4xl mx-auto text-gray-700 space-y-6">
            <p>
              As the founder of the SIN Travels & Manpower Agency, I take
              immense pride in the role our agency has playing in shaping the
              future of Sri Lankan's overseas employment. From our inception,
              our primary goal has been to safeguard the rights and welfare of
              our workforce while creating opportunities for growth and
              development across the global job market.
            </p>

            <p>
              We recognize the immense contributions made by Sri Lankan workers
              abroad, not only in supporting their families but also in
              strengthening our national economy through remittances. Our
              mission, therefore, has always been to ensure that these
              individuals are well-prepared, well-protected, and equipped with
              the skills needed to thrive in foreign employment.
            </p>

            <p>
              Over the years, we have established rigorous standards and built
              strong relationships with international recruitment agencies,
              ensuring fair and ethical treatment for our workforce. Our
              commitment extends beyond just providing job opportunities, we
              focus on comprehensive support, from pre-departure training to
              welfare services while working abroad and reintegration programs
              for those returning home.
            </p>

            <p>
              As we look towards the future, we are committed to innovation and
              improvement. We will continue to strengthen our systems, introduce
              technology-driven solutions, and expand our global network to
              create more secure and diverse opportunities for Sri Lankans
              across the world. Together with our partners, stakeholders, and
              most importantly, the workers themselves, we remain dedicated to
              fostering a brighter, more prosperous future.
            </p>

            <p className="mt-4 font-semibold">
              Thank you for your trust and support in our shared vision.
            </p>
            <p className="text-sm text-gray-600">
              P. C. GAYAN FERNANDO
              <br />
              Founder & Chairman
              <br />
              SIN Travels & Manpower Agency
            </p>
          </div>
        </div>
      </section>

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
                className="bg-white text-blue-500 hover:text-blue-800 hover:bg-white"
                asChild
              >
                <Link href="/jobs">
                  <Briefcase className="mr-2 h-5 w-5" />
                  {t("browseJobs")}
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-blue-500 hover:bg-white hover:text-blue-800"
                asChild
              >
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
