
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FiMail, FiPhone, FiMapPin, FiCheck } from "react-icons/fi";
import { useToast } from "@/hooks/use-toast";

const ContactPage = () => {
  const { toast } = useToast();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log("Form submitted:", formData);
    
    toast({
      title: "Message Sent",
      description: "We've received your message and will get back to you shortly.",
    });
    
    setFormSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
    
    // Reset the form submitted state after 5 seconds
    setTimeout(() => setFormSubmitted(false), 5000);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-muted/30">
        {/* Contact Header */}
        <div className="bg-primary text-white py-16">
          <div className="container-custom px-4">
            <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-lg opacity-90 max-w-2xl">
              Have questions or need assistance? Our team is here to help.
              Reach out to us using the form below or through our contact information.
            </p>
          </div>
        </div>

        <div className="container-custom px-4 py-16">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Contact Details */}
            <div className="md:col-span-1">
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Get in Touch</h3>
                  <p className="text-muted-foreground mb-6">
                    Our support team is available Monday through Friday, 9 AM to 6 PM EST.
                  </p>
                </div>

                <div className="flex items-start space-x-3">
                  <FiMail className="text-primary w-5 h-5 mt-1" />
                  <div>
                    <h4 className="font-medium">Email</h4>
                    <a href="mailto:support@hiringcoop.com" className="text-muted-foreground hover:text-primary">
                      support@hiringcoop.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <FiPhone className="text-primary w-5 h-5 mt-1" />
                  <div>
                    <h4 className="font-medium">Phone</h4>
                    <a href="tel:+18005551000" className="text-muted-foreground hover:text-primary">
                      +1 (800) 555-1000
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <FiMapPin className="text-primary w-5 h-5 mt-1" />
                  <div>
                    <h4 className="font-medium">Office</h4>
                    <address className="text-muted-foreground not-italic">
                      123 Innovation Drive<br />
                      Suite 400<br />
                      San Francisco, CA 94105
                    </address>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="md:col-span-2">
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-6">Send Us a Message</h3>
                
                {formSubmitted ? (
                  <div className="flex flex-col items-center py-8 text-center">
                    <div className="bg-primary/10 p-4 rounded-full mb-4">
                      <FiCheck className="text-primary w-8 h-8" />
                    </div>
                    <h4 className="text-xl font-medium mb-2">Message Sent!</h4>
                    <p className="text-muted-foreground max-w-md">
                      Thank you for reaching out. We've received your message and will get back to you within 24-48 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                          Name
                        </label>
                        <Input 
                          id="name" 
                          name="name"
                          placeholder="Your name" 
                          value={formData.name}
                          onChange={handleInputChange}
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                          Email
                        </label>
                        <Input 
                          id="email" 
                          name="email"
                          type="email" 
                          placeholder="Your email" 
                          value={formData.email}
                          onChange={handleInputChange}
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium">
                        Subject
                      </label>
                      <Input 
                        id="subject" 
                        name="subject"
                        placeholder="What is this regarding?" 
                        value={formData.subject}
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium">
                        Message
                      </label>
                      <Textarea 
                        id="message" 
                        name="message"
                        placeholder="How can we help you?" 
                        className="h-40"
                        value={formData.message}
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                    
                    <Button type="submit" className="w-full md:w-auto">
                      Send Message
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-muted/50 py-16">
          <div className="container-custom px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Find answers to common questions about HiringCoop.
            </p>
            
            <Button asChild variant="outline">
              <Link to="/faq">View All FAQs</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
