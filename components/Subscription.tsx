"use client";

import { motion } from "framer-motion";

export default function Subscription() {
  return (
    <section id="access" className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-brand-900 mb-4">
            Library Access
          </h2>
          <p className="text-text-muted max-w-xl mx-auto">
            Access classical works freely, or support the preservation of rare manuscripts
            by contributing to the Digital Library.
          </p>
        </div>

        {/* Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">

          {/* Reader */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-gray-200 p-8 text-left bg-white"
          >
            <h3 className="text-xl font-semibold text-brand-900 mb-2">
              Reader Access
            </h3>
            <p className="text-text-muted mb-6">
              Free access to selected public works and basic reading features.
            </p>

            <ul className="space-y-3 text-sm text-brand-800 mb-8">
              <li>• Access to public domain books</li>
              <li>• Online reading experience</li>
              <li>• Basic search and navigation</li>
            </ul>

            <div className="mt-auto">
              <span className="block text-2xl font-semibold text-brand-900 mb-4">
                Free
              </span>
              <a href="#" className="btn-secondary w-full text-center">
                Start Reading
              </a>
            </div>
          </motion.div>

          {/* Scholar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-brand-200 bg-brand-50 p-8 text-left shadow-sm"
          >
            <h3 className="text-xl font-semibold text-brand-900 mb-2">
              Scholar Access
            </h3>
            <p className="text-text-muted mb-6">
              Full library access for researchers and supporters of the Academy.
            </p>

            <ul className="space-y-3 text-sm text-brand-800 mb-8">
              <li>• Full digital archive access</li>
              <li>• Rare and restricted manuscripts</li>
              <li>• Advanced search & study tools</li>
              <li>• Support ongoing digitization efforts</li>
            </ul>

            <div className="mt-auto">
              <span className="block text-2xl font-semibold text-brand-900 mb-1">
                PKR 500
              </span>
              <span className="block text-xs text-text-muted mb-4">
                Monthly contribution
              </span>

              <a href="#" className="btn-primary w-full text-center">
                Support the Library
              </a>
            </div>
          </motion.div>
        </div>

        {/* Trust Note */}
        <p className="text-center text-sm text-text-muted mt-12 max-w-2xl mx-auto">
          All contributions directly support manuscript digitization, scholarly research,
          and long-term preservation of classical knowledge.
        </p>
      </div>
    </section>
  );
}
