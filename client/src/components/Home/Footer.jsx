import { motion } from "framer-motion";
import { FaLinkedin, FaTwitter, FaInstagram, FaGithub } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext.jsx";

const socials = [
  { Icon: FaLinkedin, href: "#", label: "LinkedIn" },
  { Icon: FaTwitter, href: "#", label: "Twitter" },
  { Icon: FaInstagram, href: "#", label: "Instagram" },
  { Icon: FaGithub, href: "#", label: "GitHub" },
];

const cols = [
  { title: "Product", links: ["Features", "How it works", "Pricing", "FAQ"] },
  { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
  {
    title: "Legal",
    links: [
      "Privacy Policy",
      "Terms of Service",
      "Refund Policy",
      "Cookie Policy",
    ],
  },
];

export default function Footer() {
  const { dark } = useTheme();

  return (
    <footer
      className={`relative z-10 py-16 px-5 sm:px-8 border-t ${dark ? "border-white/[0.05]" : "border-slate-200"}`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 10px rgba(99,102,241,0.3)",
                    "0 0 20px rgba(139,92,246,0.5)",
                    "0 0 10px rgba(99,102,241,0.3)",
                  ],
                }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="w-9 h-9 rounded-[11px] flex items-center justify-center text-white font-extrabold text-sm"
                style={{
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                }}
              >
                C
              </motion.div>
              <span
                className={`font-extrabold text-lg ${dark ? "text-white" : "text-slate-900"}`}
              >
                Clevora
              </span>
            </div>

            <p
              className={`text-xs leading-relaxed mb-5 ${dark ? "text-slate-500" : "text-slate-500"}`}
            >
              India's #1 AI-powered interview coaching platform. Built for
              students, by a student.
            </p>

            <div className="flex gap-2.5">
              {socials.map(({ Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${
                    dark
                      ? "bg-white/[0.05] border border-white/[0.08] text-slate-500 hover:text-white hover:bg-white/[0.1]"
                      : "bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-200"
                  }`}
                >
                  <Icon size={14} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {cols.map((col) => (
            <div key={col.title}>
              <h4
                className={`text-xs font-bold uppercase tracking-[1.8px] mb-4 ${dark ? "text-slate-400" : "text-slate-700"}`}
              >
                {col.title}
              </h4>
              <div className="space-y-3">
                {col.links.map((l) => (
                  <a
                    key={l}
                    href="#"
                    className={`block text-sm transition-colors duration-200 ${
                      dark
                        ? "text-slate-600 hover:text-slate-300"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    {l}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t ${dark ? "border-white/[0.05]" : "border-slate-200"}`}
        >
          <p className="text-xs text-slate-700">
            © 2025 Clevora. Built with ❤️ in India. All rights reserved.
          </p>
          <p className="text-xs text-slate-700">
            🔒 SSL Secured · PCI DSS Compliant · 256-bit Encryption
          </p>
        </div>
      </div>
    </footer>
  );
}
