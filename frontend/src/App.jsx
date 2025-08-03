import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
  Link,
} from "react-router-dom";
import { Button } from "./components/ui/button.jsx";
import {
  BookOpen,
  FileText,
  MessageCircle,
  Building,
  Heart,
  HandHeart,
  Menu,
  X,
  Globe,
  Facebook,
  Instagram,
  Youtube,
} from "lucide-react";

// Import components
import DynamicContentList from "./components/DynamicContentList.jsx";
import DynamicContentDetail from "./components/DynamicContentDetail.jsx";
import PrayerRequestForm from "./components/PrayerRequestForm.jsx";
import SubscriptionForm from "./components/SubscriptionForm.jsx";
import ContactForm from "./components/ContactForm.jsx";

// Import page components
import Blog from "./pages/Blog.jsx";
import Books from "./pages/Books.jsx";
import Articles from "./pages/Articles.jsx";
import AboutUsPage from "./pages/AboutUs.jsx";
import ChurchPage from "./pages/Church.jsx";
import SurrenderPage from "./pages/Surrender.jsx";
import Prayer from "./pages/Prayer.jsx";
import Subscribe from "./pages/Subscribe.jsx";
import Contact from "./pages/Contact.jsx";

// Import content loader functions
import {
  loadArticles,
  loadBlogPosts,
  loadBooks,
  getArticleById,
  getBlogPostById,
  getBookById,
} from "@/utils/contentLoader.js";

import "./App.css";
import "./animations.css";
import "./fonts.css";

// Language context - Export for use in other components
export const LanguageContext = React.createContext();

// Translation data
const translations = {
  en: {
    title: "ChatAT",
    subtitle: "A place for those who have wandered... but are not lost.",
    description:
      "A safe and welcoming space for Christians in diaspora—and anyone seeking hope, grace, and connection.",
    nav: {
      books: "Books",
      articles: "Articles",
      blog: "Blog",
      about: "About Us",
      church: "Church",
      surrender: "Surrender",
      prayer: "Need a Prayer?",
      subscribe: "Subscribe",
      contact: "Contact",
    },
    cards: {
      books: {
        title: "Books",
        description:
          "Discover spiritual readings and resources for your faith journey",
      },
      articles: {
        title: "Articles",
        description:
          "Thoughtful pieces on faith, life, and finding your place in the world",
      },
      blog: {
        title: "Blog",
        description: "Stories, reflections, and updates from our community",
      },
      church: {
        title: "Church",
        description: "Find local communities and connect with fellow believers",
      },
      surrender: {
        title: "Surrender",
        description:
          "Resources for spiritual growth and surrendering to God's will",
      },
      prayer: {
        title: "Prayer Requests",
        description:
          "Share your prayer needs and pray for others in our community",
      },
    },
    cta: {
      title: "Join Our Community Today",
      description:
        "Start your journey of faith and connection with a community that understands you",
      button: "Get Started",
    },
    footer: {
      copyright: "© 2024 ChatAT. All rights reserved.",
      followUs: "Follow Us",
      quickLinks: "Quick Links",
    },
  },
  ar: {
    title: "شتات",
    subtitle: "مكان لمن تاهوا... لكنهم ليسوا ضائعين.",
    description:
      "مساحة آمنة ومرحبة للمسيحيين في الشتات - ولكل من يبحث عن الأمل والنعمة والتواصل.",
    nav: {
      books: "الكتب",
      articles: "المقالات",
      blog: "المدونة",
      about: "من نحن",
      church: "الكنيسة",
      surrender: "الاستسلام",
      prayer: "تحتاج صلاة؟",
      subscribe: "اشترك معنا",
      contact: "اتصل بنا",
    },
    cards: {
      books: {
        title: "الكتب",
        description: "اكتشف القراءات الروحية والموارد لرحلة إيمانك",
      },
      articles: {
        title: "المقالات",
        description: "مقالات مدروسة حول الإيمان والحياة وإيجاد مكانك في العالم",
      },
      blog: {
        title: "المدونة",
        description: "قصص وتأملات وتحديثات من مجتمعنا",
      },
      church: {
        title: "الكنيسة",
        description: "ابحث عن المجتمعات المحلية وتواصل مع المؤمنين الآخرين",
      },
      surrender: {
        title: "الاستسلام",
        description: "موارد للنمو الروحي والاستسلام لإرادة الله",
      },
      prayer: {
        title: "طلبات الصلاة",
        description: "شارك احتياجاتك للصلاة وصل من أجل الآخرين في مجتمعنا",
      },
    },
    cta: {
      title: "انضم إلى مجتمعنا اليوم",
      description: "ابدأ رحلتك في الإيمان والتواصل مع مجتمع يفهمك",
      button: "ابدأ الآن",
    },
    footer: {
      copyright: "© 2024 شتات. جميع الحقوق محفوظة.",
      followUs: "تابعنا",
      quickLinks: "روابط سريعة",
    },
  },
};

// Header Component
function Header({ language, setLanguage, t }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: t.nav.books, href: "/books" },
    { name: t.nav.articles, href: "/articles" },
    { name: t.nav.blog, href: "/blog" },
    { name: t.nav.about, href: "/about" },
  ];

  // Reverse navigation order for Arabic (RTL)
  const displayNavigation =
    language === "ar" ? [...navigation].reverse() : navigation;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-sky-teal/20 shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={`flex h-16 justify-between items-center ${
            language === "ar" ? "flex-row-reverse" : ""
          }`}
        >
          {/* Logo - Always on the left for LTR, right for RTL */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="flex items-center space-x-2 text-2xl font-bold text-gray-900 hover:text-serene-blue transition-colors font-heading"
            >
              <img
                src="/logo.png"
                alt="ChatAT Logo"
                className="h-8 w-auto animate-icon-pop"
              />
              <span className="text-spiritual-gradient">{t.title}</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div
              className={`ml-10 flex items-baseline space-x-8 ${
                language === "ar" ? "space-x-reverse mr-10 ml-0" : ""
              }`}
            >
              {displayNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-gray-700 hover:text-serene-blue px-3 py-2 text-sm font-medium transition-colors font-primary relative group"
                >
                  {item.name}
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-spiritual-gradient transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </Link>
              ))}
            </div>
          </div>

          {/* Language Toggle & Mobile menu button */}
          <div
            className={`flex items-center space-x-4 ${
              language === "ar" ? "space-x-reverse" : ""
            }`}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLanguage(language === "en" ? "ar" : "en")}
              className="flex items-center space-x-2 border-sky-teal/30 text-serene-blue hover:bg-sky-teal/10 hover:border-sky-teal/50 transition-all duration-300 font-primary"
            >
              <Globe className="h-4 w-4" />
              <span>{language === "en" ? "العربية" : "English"}</span>
            </Button>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/95 backdrop-blur-sm border-t border-sky-teal/20">
              {displayNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-gray-700 hover:text-serene-blue block px-3 py-2 text-base font-medium transition-colors font-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

// Footer Component
function Footer({ t, language }) {
  const footerNavigation = [
    { name: t.nav.church, href: "/church", icon: Building },
    { name: t.nav.surrender, href: "/surrender", icon: Heart },
    { name: t.nav.prayer, href: "/prayer", icon: HandHeart },
    { name: t.nav.subscribe, href: "/subscribe", icon: MessageCircle },
    { name: t.nav.contact, href: "/contact", icon: FileText },
  ];

  // Reverse footer navigation order for Arabic (RTL)
  const displayFooterNavigation =
    language === "ar" ? [...footerNavigation].reverse() : footerNavigation;

  const socialLinks = [
    {
      name: "Facebook",
      href: "#",
      icon: Facebook,
      color: "text-blue-600 hover:text-blue-700",
    },
    {
      name: "Instagram",
      href: "#",
      icon: Instagram,
      color: "text-pink-600 hover:text-pink-700",
    },
    {
      name: "YouTube",
      href: "#",
      icon: Youtube,
      color: "text-red-600 hover:text-red-700",
    },
    {
      name: "X (Twitter)",
      href: "#",
      icon: X,
      color: "text-gray-900 hover:text-gray-700",
    },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-deep-plum to-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gold-amber rounded-full animate-parallax-float"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-sky-teal rounded-full animate-cross-rotate"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4 animate-slide-in-left">
            <h3 className="text-2xl font-bold font-hero text-divine-gradient">
              {t.title}
            </h3>
            <p className="text-gray-300 text-sm font-primary leading-relaxed">
              {t.description}
            </p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4 animate-fade-in-up">
            <h4 className="text-lg font-semibold font-heading text-sky-teal">
              {t.footer.quickLinks}
            </h4>
            <ul
              className={`space-y-2 ${
                language === "ar" ? "text-right" : "text-left"
              }`}
            >
              {displayFooterNavigation.map((item) => {
                const IconComponent = item.icon;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={`flex items-center ${
                        language === "ar" ? "space-x-reverse" : "space-x-2"
                      } space-x-2 text-gray-300 hover:text-gold-amber transition-colors duration-300 font-primary group`}
                    >
                      <IconComponent className="h-4 w-4 group-hover:animate-icon-pop" />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Social Media */}
          <div className="space-y-4 animate-slide-in-right">
            <h4 className="text-lg font-semibold font-heading text-sky-teal">
              {t.footer.followUs}
            </h4>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className={`p-3 rounded-full bg-gray-800/50 backdrop-blur-sm ${social.color} hover:bg-gray-700/50 transition-all duration-300 hover:scale-110 animate-spiritual-glow hover-glassmorphism`}
                    aria-label={social.name}
                  >
                    <IconComponent className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-700/50 text-center">
          <p className="text-gray-400 text-sm font-primary">
            {t.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}

// Homepage Component
function HomePage({ t }) {
  const cards = [
    {
      title: t.cards.books.title,
      description: t.cards.books.description,
      href: "/books",
      icon: BookOpen,
      color: "from-serene-blue to-sky-teal",
    },
    {
      title: t.cards.articles.title,
      description: t.cards.articles.description,
      href: "/articles",
      icon: FileText,
      color: "from-forest-green to-sky-teal",
    },
    {
      title: t.cards.blog.title,
      description: t.cards.blog.description,
      href: "/blog",
      icon: MessageCircle,
      color: "from-soft-rose to-gold-amber",
    },
    {
      title: t.cards.church.title,
      description: t.cards.church.description,
      href: "/church",
      icon: Building,
      color: "from-gold-amber to-warm-sand",
    },
    {
      title: t.cards.surrender.title,
      description: t.cards.surrender.description,
      href: "/surrender",
      icon: Heart,
      color: "from-deep-plum to-soft-rose",
    },
    {
      title: t.cards.prayer.title,
      description: t.cards.prayer.description,
      href: "/prayer",
      icon: HandHeart,
      color: "from-serene-blue to-deep-plum",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-divine-gradient py-12 lg:py-20 overflow-hidden">
        {/* Background Image with Parallax Effect */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-image.jpg"
            alt="Community gathering"
            className="w-full h-full object-cover opacity-30 animate-parallax-float"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-ivory-white/60 via-warm-sand/40 to-sky-teal/20"></div>
        </div>

        {/* Floating Spiritual Elements */}
        <div className="absolute top-20 left-10 w-16 h-16 opacity-20 animate-cross-rotate">
          <div className="w-full h-full bg-gold-amber rounded-full"></div>
        </div>
        <div className="absolute bottom-20 right-10 w-12 h-12 opacity-20 animate-parallax-float">
          <div className="w-full h-full bg-soft-rose rounded-full"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-deep-plum">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-hero animate-fade-in-down">
            {t.title}
          </h1>
          <p className="mt-4 text-xl sm:text-2xl font-semibold font-heading animate-fade-in-up">
            {t.subtitle}
          </p>
          <p className="mt-6 text-lg max-w-2xl mx-auto font-primary animate-fade-in-up delay-1">
            {t.description}
          </p>
          <Link
            to="/subscribe"
            className="mt-8 inline-block px-8 py-3 bg-serene-blue text-white font-bold rounded-full shadow-lg hover:bg-gold-amber transform transition-transform hover:scale-105 animate-pop-in"
          >
            {t.cta.button}
          </Link>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-12 lg:py-20 bg-ivory-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-deep-plum font-heading">
              Our Compassionate Spaces
            </h2>
            <p className="mt-2 text-gray-600 font-primary">
              Where faith and community intersect.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cards.map((card) => {
              const IconComponent = card.icon;
              return (
                <Link
                  key={card.title}
                  to={card.href}
                  className="block bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transform transition-transform hover:scale-105 group"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-3 rounded-full text-white bg-gradient-to-br ${card.color} transition-all duration-300 transform group-hover:scale-110`}
                    >
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold text-deep-plum font-heading group-hover:text-serene-blue transition-colors">
                      {card.title}
                    </h3>
                  </div>
                  <p className="mt-4 text-gray-700 font-primary">
                    {card.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-spiritual-gradient py-12 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white font-heading animate-fade-in-down">
            {t.cta.title}
          </h2>
          <p className="mt-4 text-lg text-gray-200 max-w-3xl mx-auto font-primary animate-fade-in-up">
            {t.cta.description}
          </p>
          <Link
            to="/subscribe"
            className="mt-8 inline-block px-8 py-3 bg-white text-serene-blue font-bold rounded-full shadow-lg hover:bg-ivory-white transform transition-transform hover:scale-105 animate-pop-in delay-1"
          >
            {t.cta.button}
          </Link>
        </div>
      </section>
    </div>
  );
}

// Main App Component
function App() {
  const [language, setLanguage] = useState("en");
  const t = translations[language];

  // Wrapper component to handle data fetching for dynamic content detail pages
  const DynamicContentDetailWrapper = ({ type, getFunction }) => {
    const { id } = useParams();
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      setLoading(true);
      const data = getFunction(id);
      setContent({ ...data, type });
      setLoading(false);
    }, [id, getFunction, type]);

    if (loading) {
      return (
        <div className="min-h-screen bg-ivory-white py-12 text-center">
          <p>Loading...</p>
        </div>
      );
    }

    if (!content) {
      return (
        <div className="min-h-screen bg-ivory-white py-12 text-center">
          <p>Content not found.</p>
        </div>
      );
    }

    return <DynamicContentDetail content={content} language={language} />;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <Router>
        <Header language={language} setLanguage={setLanguage} t={t} />

        <Routes>
          <Route path="/" element={<HomePage t={t} />} />

          {/* Dynamic content routes */}
          <Route path="/books" element={<Books />} />
          <Route
            path="/books/:id"
            element={
              <DynamicContentDetailWrapper
                type="Books"
                getFunction={getBookById}
              />
            }
          />

          <Route path="/articles" element={<Articles />} />
          <Route
            path="/articles/:id"
            element={
              <DynamicContentDetailWrapper
                type="Articles"
                getFunction={getArticleById}
              />
            }
          />

          <Route path="/blog" element={<Blog />} />
          <Route
            path="/blog/:id"
            element={
              <DynamicContentDetailWrapper
                type="Blog"
                getFunction={getBlogPostById}
              />
            }
          />

          {/* Static page components */}
          <Route path="/church" element={<ChurchPage language={language} />} />
          <Route
            path="/surrender"
            element={<SurrenderPage language={language} />}
          />
          <Route path="/about" element={<AboutUsPage language={language} />} />

          {/* Form components */}
          <Route path="/prayer" element={<Prayer />} />
          <Route path="/subscribe" element={<Subscribe />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>

        <Footer t={t} language={language} />
      </Router>
    </LanguageContext.Provider>
  );
}

export default App;
