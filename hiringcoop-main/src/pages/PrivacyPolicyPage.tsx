
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";

const PrivacyPolicyPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-muted/30">
        <div className="container-custom py-12 px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
            <div className="text-sm text-muted-foreground mb-8">
              Last Updated: April 9, 2025
            </div>

            <div className="prose max-w-none">
              <p>
                At HiringCoop, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our platform.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4">Information We Collect</h2>
              
              <h3 className="text-lg font-semibold mt-6 mb-2">Personal Data</h3>
              <p>
                We may collect personal information that you voluntarily provide to us when you:
              </p>
              <ul className="list-disc pl-6 space-y-2 my-4">
                <li>Register for an account</li>
                <li>Express interest in obtaining information about our services</li>
                <li>Participate in activities on our platform (e.g., posting content, applying for jobs)</li>
                <li>Contact us</li>
              </ul>
              <p>
                Personal information may include your name, email address, phone number, resume information, employment history, educational background, profile information, and video recordings submitted through our platform.
              </p>

              <h3 className="text-lg font-semibold mt-6 mb-2">Identity Verification</h3>
              <p>
                As part of our identity verification process, we may collect government-issued identification documents and biometric data such as facial recognition data. This information is used solely for the purpose of verifying your identity and is handled with the highest level of security.
              </p>

              <h3 className="text-lg font-semibold mt-6 mb-2">Automatically Collected Information</h3>
              <p>
                When you access our platform, we automatically collect certain information about your device and usage patterns. This may include:
              </p>
              <ul className="list-disc pl-6 space-y-2 my-4">
                <li>Device information (e.g., IP address, browser type, operating system)</li>
                <li>Usage data (e.g., page views, time spent on pages)</li>
                <li>Location data</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>

              <h2 className="text-xl font-bold mt-8 mb-4">How We Use Your Information</h2>
              <p>
                We use the information we collect for various purposes, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 my-4">
                <li>Providing, operating, and maintaining our platform</li>
                <li>Facilitating the job application and hiring process</li>
                <li>Verifying your identity</li>
                <li>Improving our platform and user experience</li>
                <li>Communicating with you about our services</li>
                <li>Protecting our platform from abuse and illegal activities</li>
                <li>Complying with legal obligations</li>
              </ul>

              <h2 className="text-xl font-bold mt-8 mb-4">Sharing Your Information</h2>
              <p>
                We may share your information with third parties in the following situations:
              </p>
              <ul className="list-disc pl-6 space-y-2 my-4">
                <li><strong>Employers:</strong> When you apply for jobs, your profile, resume, and video interviews will be shared with the employers offering those positions.</li>
                <li><strong>Service Providers:</strong> We may engage third-party companies to perform services on our behalf, such as hosting, data analysis, and customer service.</li>
                <li><strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities.</li>
                <li><strong>Business Transfers:</strong> In connection with any merger, acquisition, or sale of company assets, your information may be transferred as a business asset.</li>
                <li><strong>With Your Consent:</strong> We may share your information for any other purpose disclosed to you with your consent.</li>
              </ul>

              <h2 className="text-xl font-bold mt-8 mb-4">Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, disclosure, alteration, and destruction. These measures include encryption, access controls, and regular security assessments.
              </p>
              <p>
                However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee its absolute security.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4">Your Rights</h2>
              <p>
                Depending on your location, you may have certain rights regarding your personal information, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 my-4">
                <li>The right to access the personal information we hold about you</li>
                <li>The right to request correction of inaccurate information</li>
                <li>The right to request deletion of your data</li>
                <li>The right to restrict or object to processing</li>
                <li>The right to data portability</li>
                <li>The right to withdraw consent</li>
              </ul>
              <p>
                To exercise these rights, please contact us using the information provided at the end of this policy.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4">Data Retention</h2>
              <p>
                We will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your information to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our policies.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4">Cookies Policy</h2>
              <p>
                We use cookies and similar tracking technologies to track activity on our platform and hold certain information. Cookies are files with small amounts of data which may include an anonymous unique identifier.
              </p>
              <p>
                You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our platform.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4">Children's Privacy</h2>
              <p>
                Our platform is not intended for individuals under the age of 18. We do not knowingly collect personal information from children under 18. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4">Changes to This Privacy Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
              </p>
              <p>
                You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4">Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <p className="mt-4">
                <strong>Email:</strong> privacy@hiringcoop.com<br />
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

export default PrivacyPolicyPage;
