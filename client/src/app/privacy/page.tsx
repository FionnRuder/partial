"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";

export default function PrivacyPolicyPage() {
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
          Privacy Policy
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">1. Introduction</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Partial Systems ("we," "our," or "us") operates the Partial work management platform (the "Service"). 
              This Privacy Policy informs you of our policies regarding the collection, use, and disclosure of personal 
              data when you use our Service.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              By using the Service, you agree to the collection and use of information in accordance with this policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">2. Information We Collect</h2>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">2.1 Personal Information</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
              <li>Name and email address</li>
              <li>Phone number</li>
              <li>Organization name and details</li>
              <li>Profile information and preferences</li>
              <li>Work items, parts, programs, and other content you create or manage</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">2.2 Usage Data</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We automatically collect certain information about how you access and use the Service, including:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
              <li>IP address and browser type</li>
              <li>Device information and operating system</li>
              <li>Pages visited and actions taken</li>
              <li>Date and time of access</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We use the collected information for various purposes:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
              <li>To provide and maintain our Service</li>
              <li>To notify you about changes to our Service</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information to improve the Service</li>
              <li>To monitor the usage of the Service</li>
              <li>To detect, prevent and address technical issues</li>
              <li>To send you notifications and updates about your work items and programs</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">4. Data Storage and Security</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              The security of your data is important to us. We implement appropriate technical and organizational 
              measures to protect your personal information. However, no method of transmission over the Internet 
              or electronic storage is 100% secure.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Your data is stored securely and is only accessible to authorized personnel and, within your organization, 
              to users you have granted access.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">5. Data Sharing</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We do not sell your personal information. We may share your information only in the following circumstances:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
              <li>With other users in your organization who have been granted access</li>
              <li>With service providers who assist us in operating the Service (under strict confidentiality agreements)</li>
              <li>If required by law or to respond to legal process</li>
              <li>To protect the rights, property, or safety of Partial Systems, our users, or others</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">6. Your Rights</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate or incomplete data</li>
              <li>Request deletion of your personal information</li>
              <li>Object to processing of your personal information</li>
              <li>Request restriction of processing</li>
              <li>Data portability</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300">
              To exercise these rights, please contact us at{" "}
              <a href="mailto:fionn.ruder@partialsystems.com" className="text-blue-600 dark:text-blue-400 hover:underline">
                fionn.ruder@partialsystems.com
              </a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">7. Cookies and Tracking</h2>
            <p className="text-gray-700 dark:text-gray-300">
              We use cookies and similar tracking technologies to track activity on our Service and hold certain information. 
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">8. Open Source</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Partial is an open-source application. The source code is available on GitHub. 
              If you are self-hosting the application, you have full control over your data and its storage.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">9. Changes to This Privacy Policy</h2>
            <p className="text-gray-700 dark:text-gray-300">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting 
              the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">10. Contact Us</h2>
            <p className="text-gray-700 dark:text-gray-300">
              If you have any questions about this Privacy Policy, please contact us at{" "}
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

