"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center bg-surface-background pt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-brand-900 leading-tight mb-4">
              Talib ul Mola <br />
              <span className="text-brand-500">Academy Digital Library</span>
            </h1>
            <p className="text-lg text-text-muted mb-8 leading-relaxed max-w-md"> {/* Reduced max-w for subtitle */}
              Preserving Sindhi and Islamic scholarly heritage for future generations.
            </p>

            <div className="flex flex-wrap gap-3 items-center"> {/* Reduced gap for buttons */}
              <a
                href="#collection"
                className="btn-primary"
              >
                Explore Library
              </a>
              <a
                href="#about"
                className="btn-secondary"
              >
                View Collections
              </a>
            </div>
            <p className="mt-4 text-sm text-text-muted">Free access to selected public works</p> {/* Micro-copy added */}


            {/* Stats */}
            <div className="mt-16 flex gap-8 md:gap-16 pt-8 border-t border-gray-200">
              <div>
                <p className="text-3xl font-bold text-gold-muted">500+</p>
                <p className="text-sm text-text-muted">Books Digitized</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gold-muted">50+</p>
                <p className="text-sm text-text-muted">Scholars</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gold-muted">10+</p>
                <p className="text-sm text-text-muted">Categories</p>
              </div>
            </div>
          </motion.div>

          {/* Right Side Visual */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block h-[600px] w-full"
          >
             {/* Abstract Composition / Image Placeholder */}
             <div className="absolute inset-0 bg-brand-50 rounded-2xl overflow-hidden shadow-soft">
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-white shadow-lg rounded-lg overflow-hidden transform rotate-[-3deg] hover:rotate-0 transition-transform duration-500">
                    <Image
                        src="/books/book1.jpg"
                        alt="Featured Manuscript"
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 33vw" /* Added sizes prop */
                    />
                 </div>
                 {/* Decorative floaty elements (minimal) */}
                 <div className="absolute top-20 right-20 w-20 h-20 bg-brand-200 rounded-full blur-3xl opacity-50" />
                 <div className="absolute bottom-20 left-20 w-32 h-32 bg-gold-muted/30 rounded-full blur-3xl opacity-50" />
             </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
