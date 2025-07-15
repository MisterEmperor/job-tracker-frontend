import { FaUserCircle, FaTimes } from "react-icons/fa";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";

// Extracted motion variants
const headerVariants = {
  hidden: { y: -100 },
  visible: { y: 0 },
};

const menuItemVariants = {
  hidden: { x: 20, opacity: 0 },
  visible: { x: 0, opacity: 1 },
};

const menuVariants = {
  hidden: { opacity: 0, x: "100%" },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: "100%" },
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navItems = useMemo(() => ["Jobs", "Companies", "About", "Contact"], []);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  // Custom throttle implementation
  const handleScroll = useCallback(() => {
    lastScrollY.current = window.scrollY;
    if (!ticking.current) {
      window.requestAnimationFrame(() => {
        setScrolled(lastScrollY.current > 10);
        ticking.current = false;
      });
      ticking.current = true;
    }
  }, []);

  // Scroll handler
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  // Focus management for mobile menu
  useEffect(() => {
    if (isMenuOpen && menuRef.current) {
      const focusableElements =
        menuRef.current.querySelectorAll("button, [href]");
      (focusableElements[0] as HTMLElement)?.focus();
    }
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Skip to content link for accessibility */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:bg-white focus:p-2 focus:z-[999]"
      >
        Skip to content
      </a>

      <motion.header
        initial="hidden"
        animate="visible"
        variants={headerVariants}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 z-[100] w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between transition-all duration-300 ${
          scrolled
            ? "backdrop-blur-md bg-white/10 shadow-sm"
            : "backdrop-blur-sm bg-transparent"
        }`}
      >
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <motion.h1
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight"
          >
            JobFinder
          </motion.h1>

          {/* Navigation with User Icon */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* User Icon */}
            <motion.button
              aria-label="User account"
              className="p-1 sm:p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-red-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaUserCircle className="w-7 h-7 sm:w-8 sm:h-8 text-gray-600 hover:text-gray-900 transition-colors" />
            </motion.button>

            <DesktopNav items={navItems} />

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="sm:hidden p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              <HamburgerIcon isOpen={isMenuOpen} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <MobileMenu
          isOpen={isMenuOpen}
          items={navItems}
          onClose={closeMenu}
          ref={menuRef}
        />
      </motion.header>
    </>
  );
};

// Extracted Hamburger Icon Component
const HamburgerIcon = ({ isOpen }: { isOpen: boolean }) => (
  <div className="w-6 flex flex-col gap-1.5">
    <motion.span
      className="h-0.5 bg-gray-700 rounded-full"
      animate={{
        rotate: isOpen ? 45 : 0,
        y: isOpen ? 6 : 0,
        width: "100%",
      }}
    />
    <motion.span
      className="h-0.5 bg-gray-700 rounded-full"
      animate={{ opacity: isOpen ? 0 : 1 }}
    />
    <motion.span
      className="h-0.5 bg-gray-700 rounded-full"
      animate={{
        rotate: isOpen ? -45 : 0,
        y: isOpen ? -6 : 0,
        width: "100%",
      }}
    />
  </div>
);

// Extracted Desktop Navigation Component
const DesktopNav = ({ items }: { items: string[] }) => (
  <nav className="hidden sm:flex items-center gap-4 md:gap-6">
    {items.map((item) => (
      <motion.a
        key={item}
        href={`#${item.toLowerCase()}`}
        className="relative text-gray-700 text-base md:text-lg font-medium py-2"
        whileHover={{ color: "#000" }}
        transition={{ duration: 0.2 }}
      >
        {item}
        <motion.span
          className="absolute bottom-0 left-0 w-full h-0.5 bg-red-800"
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </motion.a>
    ))}
  </nav>
);

// Extracted Mobile Menu Component with forwarded ref
const MobileMenu = React.forwardRef<
  HTMLDivElement,
  {
    isOpen: boolean;
    items: string[];
    onClose: () => void;
  }
>(({ isOpen, items, onClose }, ref) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        ref={ref}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={menuVariants}
        transition={{ type: "spring", damping: 25 }}
        className="sm:hidden fixed inset-0 bg-red-50 z-50 pt-20 px-6"
        aria-modal="true"
        aria-hidden={!isOpen}
        style={{ touchAction: "none" }}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-red-300"
          aria-label="Close menu"
        >
          <FaTimes className="w-6 h-6 text-gray-600" />
        </button>

        <nav className="flex flex-col gap-6 mt-10">
          {items.map((item, index) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-xl font-medium text-gray-800 py-3 border-b border-gray-300 group"
              variants={menuItemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 * index }}
              onClick={onClose}
            >
              {item}
              <span className="block h-0.5 mt-1 bg-red-800 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </motion.a>
          ))}
        </nav>
      </motion.div>
    )}
  </AnimatePresence>
));

MobileMenu.displayName = "MobileMenu";

export default Header;
