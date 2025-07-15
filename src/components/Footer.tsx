import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const scaleTap = {
  whileTap: { scale: 0.98 },
};

const Footer = () => {
  return (
    <motion.footer
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      transition={{ duration: 0.3 }}
      role="contentinfo"
      aria-label="Site footer"
      className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-8 px-4 sm:px-6"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Logo/Brand */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            {...scaleTap}
            className="text-xl font-bold text-gray-900 dark:text-gray-100"
            data-testid="footer-brand"
          >
            JobFinder
          </motion.div>

          {/* Links */}
          <motion.div
            className="flex flex-wrap justify-center gap-4 sm:gap-6"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
          >
            <FooterLink href="#help" testId="help-center-link">
              Help Center
            </FooterLink>
            <FooterLink href="#privacy" testId="privacy-policy-link">
              Privacy Policy
            </FooterLink>
            <FooterLink href="#terms" testId="terms-link">
              Terms of Service
            </FooterLink>
          </motion.div>

          {/* Copyright */}
          <motion.p
            className="text-gray-500 dark:text-gray-400 text-sm"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            © {new Date().getFullYear()} JobFinder. All rights reserved.
          </motion.p>
        </div>
      </div>
    </motion.footer>
  );
};

const FooterLink = ({
  href,
  children,
  testId,
}: {
  href: string;
  children: React.ReactNode;
  testId?: string;
}) => (
  <motion.a
    href={href}
    {...scaleTap}
    className="text-gray-600 dark:text-gray-300 hover:text-red-800 dark:hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 rounded-sm text-sm transition-colors px-2 py-1"
    data-testid={testId}
  >
    {children}
  </motion.a>
);

export default Footer;
