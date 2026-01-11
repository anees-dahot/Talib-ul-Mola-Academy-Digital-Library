"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link"; // Import Link for client-side navigation

const books = [
  {
    id: 1,
    image: "/books/book1.jpg",
    title: "Anta Mahboobi",
    author: "Makhdoom Jameel Zaman",
    category: "Islamic Studies",
    pdfPath: "https://www.africau.edu/images/default/sample.pdf", // Added pdfPath
  },
  {
    id: 2,
    image: "/books/book2.jpg",
    title: "The Genealogies",
    author: "Makhdoom Jameel Zaman",
    category: "History",
    pdfPath: "https://www.africau.edu/images/default/sample.pdf", // Added pdfPath
  },
  {
    id: 3,
    image: "/books/book3.jpg",
    title: "The Days & Dates",
    author: "Makhdoom Jamil Zaman",
    category: "Reference",
    pdfPath: "https://www.africau.edu/images/default/sample.pdf", // Added pdfPath
  },
  {
    id: 4,
    image: "/books/book4.jpg",
    title: "Tazkirah Hazrat Abu Najeeb",
    author: "Moulana Hussain Miyan",
    category: "Biography",
    pdfPath: "https://www.africau.edu/images/default/sample.pdf", // Added pdfPath
  },
  {
    id: 5,
    image: "/books/book5.jpg",
    title: "Hazar Siddiq Akbar",
    author: "Makhdoom Jameel Zaman",
    category: "Islamic Studies",
    pdfPath: "https://www.africau.edu/images/default/sample.pdf", // Added pdfPath
  },
  {
    id: 6,
    image: "/books/book6.jpg",
    title: "Chaudahween Sadi",
    author: "Mufti Abdul Wahab",
    category: "Sindhi Lit",
    pdfPath: "https://www.africau.edu/images/default/sample.pdf", // Added pdfPath
  },
];

const categories = [
  "All",
  "Islamic Studies",
  "History",
  "Biography",
  "Reference",
  "Sindhi Lit",
];

export default function BooksCollection() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredBooks =
    activeCategory === "All"
      ? books
      : books.filter((book) => book.category === activeCategory);

  return (
    <section id="collection" className="py-28 bg-surface-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-brand-900 mb-4">
            Explore the Digital Library {/* Updated title */}
          </h2>
          <p className="text-text-muted max-w-2xl mx-auto">
            Carefully curated scholarly works, digitized for research and study. {/* New subtext */}
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2 rounded-full text-sm font-normal transition-colors ${ /* Reduced font weight */
                activeCategory === category
                  ? "bg-brand text-white shadow-sm" /* Active state in primary green */
                  : "bg-white text-text-muted hover:bg-gray-100" /* Muted color for inactive */
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBooks.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="relative bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                {/* Book Cover with Frame */}
                <div className="relative p-4 bg-gray-50">
                    <div className="aspect-[3/4] relative overflow-hidden rounded-lg">
                        <Image
                            src={book.image}
                            alt={book.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" /* Added sizes prop */
                        />
                    </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <div className="mb-2">
                      <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-2 py-1 rounded-md uppercase tracking-wide">
                          {book.category}
                      </span>
                  </div>
                  <h3 className="font-heading font-bold text-brand-900 text-lg mb-1 leading-tight group-hover:text-brand-600 transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-sm text-text-muted mb-4">{book.author}</p>
                  
                  <Link href={`/reader/${book.id}`} className="text-sm font-medium text-brand-600 hover:text-brand-800 transition-colors inline-flex items-center gap-1"> {/* Updated href */}
                      Read Book
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-16">
            <button className="btn-secondary">
                View All Collection
            </button>
        </div>
      </div>
    </section>
  );
}