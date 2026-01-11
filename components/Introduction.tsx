"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Introduction() {
  return (
    <section id="about" className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative h-full"
          >
            <div className="relative aspect-[4/5] md:h-full rounded-2xl overflow-hidden shadow-md border border-gray-200">
                <div className="absolute inset-0 bg-brand-50/50" />
                <Image
                  src="/assets/scholar.jpeg"
                  alt="Makhdoom Jameel Zaman"
                  fill
                  className="object-cover"
                />
            </div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative flex flex-col justify-between h-full"
          >
            {/* Scholar Profile Label and Divider */}
            <div>
              <div className="flex items-center mb-4">
                <span className="text-sm uppercase tracking-wider font-medium text-text-muted mr-4">Scholar Profile</span>
                <div className="flex-grow h-px bg-gray-200" />
              </div>

              <h2 className="text-4xl md:text-5xl font-heading font-bold text-brand-900 mb-6">
                Makhdoom Jameel Zaman
              </h2>

              <div className="space-y-6 text-lg text-text-muted leading-relaxed font-sans">
                <p>
                  An enthusiastic reader, writer, and custodian of knowledge, belonging to a renowned legacy of an educationist family.
                </p>
                <p>
                  Deeply inspired by scholarly traditions, he is committed to preserving intellectual heritage and making authentic literary works accessible for future generations.
                </p>
                <p>
                  Through the Talib ul Mola Academy Digital Library, his vision is to bridge classical scholarship with modern technology, ensuring knowledge remains alive and relevant.
                </p>
              </div>
            </div>

            <div className="mt-10 flex gap-4">
               <button className="btn-secondary">
                  View Works
               </button>
               <a
                  href="#" /* Assuming this links to a scholar profile page */
                  className="btn-secondary" /* Changed to btn-secondary for consistency */
               >
                  About the Scholar
               </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
