"use client";

import React from "react";
import Link from "next/link";
import { Github, Linkedin, Mail, FileText, Shield } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* About Section */}
          <div className="col-span-2">
            <h3 className="text-white font-semibold mb-4">About Partial</h3>
            <p className="text-sm text-gray-400 mb-4">
              Built by a hardware systems engineer frustrated with molding software tools to track physical products.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://www.linkedin.com/in/fruder/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
                <span className="text-sm">LinkedIn</span>
              </a>
              <a
                href="https://github.com/FionnRuder/partial"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-gray-200 transition-colors"
              >
                <Github className="w-5 h-5" />
                <span className="text-sm">GitHub</span>
              </a>
            </div>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <a
              href="mailto:fionn.ruder@partialsystems.com"
              className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors mb-2"
            >
              <Mail className="w-4 h-4" />
              <span className="text-sm">fionn.ruder@partialsystems.com</span>
            </a>
          </div>

          {/* Legal Section - Commented out for now */}
          {/* <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <div className="space-y-2">
              <Link
                href="/privacy"
                className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors"
              >
                <Shield className="w-4 h-4" />
                <span className="text-sm">Privacy Policy</span>
              </Link>
              <Link
                href="/terms"
                className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span className="text-sm">Terms of Service</span>
              </Link>
            </div>
          </div> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;

