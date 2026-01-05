"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link
          href="/onboarding"
          className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Terms of Service
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              By accessing and using the Partial work management platform ("Service"), you accept and agree to be bound 
              by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">2. Description of Service</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Partial is a work management platform designed specifically for hardware development teams. The Service allows 
              users to track work items, manage parts hierarchically, monitor program progress, and collaborate with team members.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">3. User Accounts</h2>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">3.1 Account Creation</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              To use the Service, you must create an account. You are responsible for maintaining the confidentiality 
              of your account credentials and for all activities that occur under your account.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">3.2 Account Security</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              You agree to:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Maintain and update your information to keep it accurate</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">4. Use of Service</h2>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">4.1 Permitted Use</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              You may use the Service for lawful business purposes only, in accordance with these Terms and all applicable 
              laws and regulations.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">4.2 Prohibited Activities</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              You agree not to:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
              <li>Use the Service for any illegal purpose or in violation of any laws</li>
              <li>Interfere with or disrupt the Service or servers connected to the Service</li>
              <li>Attempt to gain unauthorized access to any portion of the Service</li>
              <li>Upload or transmit any viruses, malware, or other harmful code</li>
              <li>Reverse engineer, decompile, or disassemble any part of the Service</li>
              <li>Use automated systems to access the Service without permission</li>
              <li>Share your account credentials with others</li>
              <li>Violate the intellectual property rights of others</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">5. Content and Intellectual Property</h2>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">5.1 Your Content</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              You retain ownership of all content you create, upload, or store in the Service ("Your Content"). 
              By using the Service, you grant us a license to store, process, and display Your Content solely for 
              the purpose of providing the Service to you.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">5.2 Our Intellectual Property</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              The Service, including its original content, features, and functionality, is owned by Partial Systems and 
              is protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Partial is released under the MIT License. The source code is available on GitHub at{" "}
              <a href="https://github.com/FionnRuder/partial" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                https://github.com/FionnRuder/partial
              </a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">6. Organization and User Roles</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              The Service is organized into organizations. Users within an organization may have different roles 
              (Admin, Manager, Program Manager, Engineer, Viewer) with varying levels of access. Organization admins 
              are responsible for managing user access and ensuring compliance with these Terms within their organization.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">7. Service Availability</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We strive to maintain the Service availability but do not guarantee uninterrupted or error-free operation. 
              The Service may be temporarily unavailable due to maintenance, updates, or circumstances beyond our control.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">8. Data Backup and Retention</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              While we implement reasonable data backup procedures, you are responsible for maintaining backups of 
              your important data. We are not liable for any loss of data due to system failures, user error, or other causes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">9. Termination</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We reserve the right to terminate or suspend your account and access to the Service immediately, 
              without prior notice, for any violation of these Terms or for any other reason at our sole discretion.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              You may terminate your account at any time by contacting us. Upon termination, your right to use 
              the Service will immediately cease.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">10. Disclaimer of Warranties</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, 
              INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, 
              OR NON-INFRINGEMENT.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">11. Limitation of Liability</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, PARTIAL SYSTEMS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, 
              SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY 
              OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">12. Indemnification</h2>
            <p className="text-gray-700 dark:text-gray-300">
              You agree to indemnify and hold harmless Partial Systems, its officers, directors, employees, and agents 
              from any claims, damages, losses, liabilities, and expenses (including legal fees) arising out of your use 
              of the Service, Your Content, or any violation of these Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">13. Changes to Terms</h2>
            <p className="text-gray-700 dark:text-gray-300">
              We reserve the right to modify these Terms at any time. We will notify users of any material changes 
              by posting the updated Terms on this page and updating the "Last updated" date. Your continued use of 
              the Service after such modifications constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">14. Governing Law</h2>
            <p className="text-gray-700 dark:text-gray-300">
              These Terms shall be governed by and construed in accordance with applicable laws, without regard to 
              conflict of law provisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">15. Contact Information</h2>
            <p className="text-gray-700 dark:text-gray-300">
              If you have any questions about these Terms of Service, please contact us at{" "}
              <a href="mailto:fionn.ruder@partialsystems.com" className="text-blue-600 dark:text-blue-400 hover:underline">
                fionn.ruder@partialsystems.com
              </a>
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}

