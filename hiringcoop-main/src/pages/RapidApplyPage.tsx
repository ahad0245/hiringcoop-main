
import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FiVideo, FiCheckCircle, FiArrowRight, FiUser, FiMail } from 'react-icons/fi';
import { useToast } from '@/hooks/use-toast';

const RapidApplyPage = () => {
  const { toast } = useToast();
  const [step, setStep] = useState<'info' | 'video' | 'done'>('info');
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '' });

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast({ title: 'Please fill in all fields', variant: 'destructive' });
      return;
    }
    setStep('video');
  };

  const handleSubmitApplication = () => {
    toast({ title: 'Application Submitted!', description: 'We\'ll be in touch at ' + formData.email });
    setStep('done');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="flex-1 py-12 bg-gradient-to-b from-blue-50 to-white">
        <div className="container-custom max-w-2xl mx-auto">

          {/* Progress */}
          <div className="flex items-center justify-center gap-4 mb-10">
            {['Your Info', 'Video Response', 'Done'].map((label, i) => {
              const stepIndex = i;
              const currentIndex = step === 'info' ? 0 : step === 'video' ? 1 : 2;
              return (
                <div key={label} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    stepIndex <= currentIndex ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    {stepIndex < currentIndex ? <FiCheckCircle className="h-4 w-4" /> : i + 1}
                  </div>
                  <span className={`text-sm hidden sm:inline ${stepIndex <= currentIndex ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                    {label}
                  </span>
                  {i < 2 && <div className="w-8 h-px bg-border" />}
                </div>
              );
            })}
          </div>

          {step === 'info' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Quick Apply — No Account Needed</CardTitle>
                <CardDescription>
                  Tell us who you are and we'll guide you through a short video introduction. It only takes a few minutes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleInfoSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <div className="relative">
                        <FiUser className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="firstName"
                          className="pl-9"
                          placeholder="Jane"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        className="pl-9"
                        placeholder="jane@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <Button type="submit" size="lg" className="w-full">
                    Continue to Video <FiArrowRight className="ml-2" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {step === 'video' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Record Your Video Introduction</CardTitle>
                <CardDescription>
                  Answer the prompt below in a short video. You can re-record as many times as you like.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-xl bg-muted p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <FiVideo className="h-8 w-8 text-primary" />
                  </div>
                  <p className="font-medium text-lg">Tell us about yourself and what kind of role you're looking for.</p>
                  <p className="text-sm text-muted-foreground mt-2">Up to 2 minutes</p>
                </div>

                <div className="aspect-video rounded-lg bg-black/5 border-2 border-dashed border-border flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <FiVideo className="h-10 w-10 mx-auto mb-2" />
                    <p className="text-sm">Camera preview will appear here</p>
                    <Button variant="outline" className="mt-4">
                      Start Recording
                    </Button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setStep('info')}>
                    Back
                  </Button>
                  <Button className="flex-1" onClick={handleSubmitApplication}>
                    Submit Application <FiCheckCircle className="ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 'done' && (
            <Card className="text-center">
              <CardContent className="pt-10 pb-10 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                  <FiCheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold">Application Submitted!</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Thanks, {formData.firstName}! We've received your application and will reach out to <strong>{formData.email}</strong> with next steps.
                </p>
                <p className="text-sm text-muted-foreground">
                  Want to track your applications and get matched with more jobs?
                </p>
                <Button asChild>
                  <a href="/signup">Create a Free Account</a>
                </Button>
              </CardContent>
            </Card>
          )}

        </div>
      </section>

      <Footer />
    </div>
  );
};

export default RapidApplyPage;
