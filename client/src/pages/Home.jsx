import { useState, useEffect, useCallback } from "react";
import { useTheme } from "../context/ThemeContext.jsx";
import { NeuralBg, CursorGlow } from "../components/ui/NeuralBg.jsx";
import Auth from "./Auth.jsx";

// Home sections
import Navbar from "../components/Home/Navbar.jsx";
import HeroSection from "../components/Home/HeroSection.jsx";
import TrustedCompanies from "../components/Home/TrustedCompanies.jsx";
import StatsSection from "../components/Home/StatsSection.jsx";
import FeaturesSection from "../components/Home/FeaturesSection.jsx";
import HowItWorks from "../components/Home/HowItWorks.jsx";
import AntiCheatSection from "../components/Home/AntiCheatSection.jsx";
import TestimonialsSection from "../components/Home/TestimonialsSection.jsx";
import PricingSection from "../components/Home/PricingSection.jsx";
import FAQSection from "../components/Home/FAQSection.jsx";
import CTASection from "../components/Home/CTASection.jsx";
import Footer from "../components/Home/Footer.jsx";

export default function Home() {
  const { dark } = useTheme();

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalView, setModalView] = useState("login");

  // Open modal with specific view
  const open = useCallback((view) => {
    setModalView(view);
    setModalOpen(true);
  }, []);

  // Close + clear reset-password URL params
  const handleClose = useCallback(() => {
    setModalOpen(false);
    const params = new URLSearchParams(window.location.search);
    if (params.get("token") || params.get("email")) {
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  // Auto-open modal if reset-password link
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("token") && params.get("email")) {
      setModalView("reset");
      setModalOpen(true);
    }
  }, []);

  return (
    <div
      className={`min-h-screen overflow-x-hidden transition-colors duration-300 ${dark ? "bg-[#030712] text-white" : "bg-slate-50 text-slate-900"}`}
    >
      {/* Fixed background effects */}
      <NeuralBg />
      <CursorGlow />

      {/* Sticky navbar */}
      <Navbar
        onLogin={() => open("login")}
        onSignup={() => open("register")}
        variant="landing"
      />

      {/* Page sections — in order */}
      <HeroSection
        onLogin={() => open("login")}
        onSignup={() => open("register")}
      />
      <TrustedCompanies />
      <StatsSection />
      <FeaturesSection />
      <HowItWorks />
      <AntiCheatSection />
      <TestimonialsSection />
      <PricingSection onSignup={() => open("register")} />
      <FAQSection />
      <CTASection onSignup={() => open("register")} />
      <Footer />

      {/* Auth Modal — shared across all CTAs */}
      <Auth isOpen={modalOpen} onClose={handleClose} defaultView={modalView} />
    </div>
  );
}
