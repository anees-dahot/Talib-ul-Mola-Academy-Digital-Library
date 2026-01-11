"use client";

import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-dark text-gray-300 py-16 border-t border-brand-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <Image
                src="/logo-cropped.png"
                alt="Talib ul Mola Academy"
                width={40}
                height={40}
                className="h-10 w-auto opacity-90"
              />
              <div>
                <h3 className="text-white font-heading font-bold text-lg">
                  Talib ul Mola
                </h3>
                <p className="text-gray-200 text-xs tracking-wider uppercase">
                  Academy Hala
                </p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed max-w-sm">
              Preserving and sharing scholarly works, rare manuscripts, and
              intellectual heritage through modern digital technology for
              future generations.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Library</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#collection" className="hover:text-white transition-colors">Collections</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">Scholars</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Manuscripts</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Search</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Connect</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Donate</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-brand-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <p>&copy; {currentYear} Talib ul Mola Academy. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
