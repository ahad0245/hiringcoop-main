
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";

const TermsOfServicePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-muted/30">
        <div className="container-custom py-12 px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
            <div className="text-sm text-muted-foreground mb-8">
              Last Updated: April 9, 2025
            </div>

            <div className="prose max-w-none">
              <p>
                Welcome to HiringCoop. These Terms of Service ("Terms") govern your access to and use of the HiringCoop platform, including our website, services, and applications (collectively, the "Service").
              </p>
              <p>
                Please read these Terms carefully before using our Service. By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the Terms, you may not access the Service.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4">1. Accounts</h2>
              <p>
                When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
              </p>
              <p>
                You are responsible for safeguarding the password used to access the Service and for any activities or actions under your password. We encourage you to use "strong" passwords (passwords that use a combination of uppercase and lowercase letters, numbers, and symbols) with your account.
              </p>
              <p>
                You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4">2. User Conduct</h2>
              <p>
                You may not use the Service for any purpose that is illegal or prohibited by these Terms. You agree not to:
              </p>
              <ul className="list-disc pl-6 space-y-2 my-4">
                <li>Use the Service in any way that could disable, overburden, damage, or impair the Service</li>
                <li>Use any robot, spider, or other automated device, process, or means to access the Service for any purpose</li>
                <li>Introduce any viruses, Trojan horses, worms, logic bombs, or other harmful material</li>
                <li>Attempt to gain unauthorized access to, interfere with, damage, or disrupt any parts of the Service</li>
                <li>Use the Service to impersonate another person or entity</li>
                <li>Provide false, misleading, or inaccurate information</li>
                <li>Use the Service to advertise or offer to sell goods and services</li>
                <li>Engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Service</li>
              </ul>

              <h2 className="text-xl font-bold mt-8 mb-4">3. Content</h2>
              <p>
                Our Service allows you to post, link, store, share, and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post on or through the Service, including its legality, reliability, and appropriateness.
              </p>
              <p>
                By posting Content on or through the Service, you represent and warrant that:
              </p>
              <ul className="list-disc pl-6 space-y-2 my-4">
                <li>The Content is yours (you own it) or you have the right to use it and grant us the rights and license as provided in these Terms</li>
                <li>The Content does not infringe on the intellectual property rights of any third party</li>
                <li>The Content does not contain any defamatory, discriminatory, threatening, offensive, or otherwise unlawful material</li>
              </ul>
              <p>
                We reserve the right to remove any Content that violates these Terms or that we find objectionable for any reason, without prior notice.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4">4. License</h2>
              <p>
                When you upload or post Content to the Service, you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, and display such Content in connection with providing and promoting the Service.
              </p>
              <p>
                This license continues even if you stop using our Service, solely with respect to the Content that was shared during your use of the Service.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4">5. Identity Verification</h2>
              <p>
                As part of our Service, we may require identity verification through document submission and biometric data collection. By using our Service, you consent to:
              </p>
              <ul className="list-disc pl-6 space-y-2 my-4">
                <li>Providing government-issued identification documents</li>
                <li>Collection of biometric data for identity verification purposes</li>
                <li>Storage of this information in accordance with our Privacy Policy</li>
              </ul>
              <p>
                We take the security of this sensitive information seriously and implement appropriate measures to protect it.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4">6. Video Applications</h2>
              <p>
                Our Service allows candidates to submit video recordings as part of job applications. By submitting video content, you:
              </p>
              <ul className="list-disc pl-6 space-y-2 my-4">
                <li>Grant employers the right to view and evaluate your video submissions</li>
                <li>Understand that these videos may be stored on our platform for the duration of the hiring process</li>
                <li>Agree not to include any inappropriate, offensive, or discriminatory content in your videos</li>
              </ul>

              <h2 className="text-xl font-bold mt-8 mb-4">7. Termination</h2>
              <p>
                We may terminate or suspend your account immediately, without prior notice or liability, for any reason, including without limitation if you breach the Terms.
              </p>
              <p>
                Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service or contact us to request account deletion.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4">8. Limitation of Liability</h2>
              <p>
                In no event shall HiringCoop, its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
              </p>
              <ul className="list-disc pl-6 space-y-2 my-4">
                <li>Your access to or use of or inability to access or use the Service</li>
                <li>Any conduct or content of any third party on the Service</li>
                <li>Any unauthorized access to or use of our servers and/or any personal information stored therein</li>
                <li>Any interruption or cessation of transmission to or from the Service</li>
              </ul>

              <h2 className="text-xl font-bold mt-8 mb-4">9. Disclaimer</h2>
              <p>
                Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied.
              </p>
              <p>
                HiringCoop does not guarantee that:
              </p>
              <ul className="list-disc pl-6 space-y-2 my-4">
                <li>The Service will meet your specific requirements</li>
                <li>The Service will be uninterrupted, timely, secure, or error-free</li>
                <li>The results that may be obtained from the use of the Service will be accurate or reliable</li>
                <li>Any errors in the Service will be corrected</li>
              </ul>

              <h2 className="text-xl font-bold mt-8 mb-4">10. Governing Law</h2>
              <p>
                These Terms shall be governed and construed in accordance with the laws of the United States of America, without regard to its conflict of law provisions.
              </p>
              <p>
                Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4">11. Changes</h2>
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect.
              </p>
              <p>
                By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the Service.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4">12. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at:
              </p>
              <p className="mt-4">
                <strong>Email:</strong> legal@hiringcoop.com<br />
                <strong>Address:</strong> 123 Innovation Drive, Suite 400, San Francisco, CA 94105<br />
                <strong>Phone:</strong> +1 (800) 555-1000
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfServicePage;
