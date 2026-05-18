
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import NotFound from "./pages/NotFound";
import { AuthProvider, PrivateRoute, AdminRoute } from "./context/AuthContext";
import AdminShortcut from "./components/admin/AdminShortcut";

const JobsPage = lazy(() => import("./pages/JobsPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const CandidateProfilePage = lazy(() => import("./pages/CandidateProfilePage"));
const ApplicationHistoryPage = lazy(() => import("./pages/ApplicationHistoryPage"));
const InterviewPrepPage = lazy(() => import("./pages/InterviewPrepPage"));
const ApplyPage = lazy(() => import("./pages/ApplyPage"));
const VideoApplication = lazy(() => import("./pages/VideoApplication"));
const VideoLibraryPage = lazy(() => import("./pages/VideoLibraryPage"));
const DashboardRouter = lazy(() => import("./pages/DashboardRouter"));
const EmployerDashboard = lazy(() => import("./pages/EmployerDashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const CompanyProfilePage = lazy(() => import("./pages/CompanyProfilePage"));
const JobPostingPage = lazy(() => import("./pages/JobPostingPage"));
const CandidateReviewPage = lazy(() => import("./pages/CandidateReviewPage"));
const JobDetailPage = lazy(() => import("./pages/JobDetailPage"));
const CandidateListPage = lazy(() => import("./pages/CandidateListPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const FAQPage = lazy(() => import("./pages/FAQPage"));
const HowItWorksPage = lazy(() => import("./pages/HowItWorksPage"));
const InterviewTipsPage = lazy(() => import("./pages/InterviewTipsPage"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));
const TermsOfServicePage = lazy(() => import("./pages/TermsOfServicePage"));
const WhyHiringCoopPage = lazy(() => import("./pages/WhyHiringCoopPage"));
const ForEmployersPage = lazy(() => import("./pages/ForEmployersPage"));
const RapidApplyPage = lazy(() => import("./pages/RapidApplyPage"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"));
const JobApprovalPage = lazy(() => import("./pages/admin/JobApprovalPage"));
const VideoQuestionManagement = lazy(() => import("./pages/admin/VideoQuestionManagement"));
const VerificationPage = lazy(() => import("./pages/admin/VerificationPage"));
const UserManagement = lazy(() => import("./pages/admin/UserManagement"));
const AdminLoginPage = lazy(() => import("./pages/admin/AdminLoginPage"));
const AdminSignupPage = lazy(() => import("./pages/admin/AdminSignupPage"));
const FirstAdminSetupPage = lazy(() => import("./pages/admin/FirstAdminSetupPage"));
const AdminInvitePage = lazy(() => import("./pages/admin/AdminInvitePage"));
const EmployerJobsPage = lazy(() => import("./pages/employer/EmployerJobsPage"));
const CandidatePipelinePage = lazy(() => import("./pages/employer/CandidatePipelinePage"));
const PublicProfilePage = lazy(() => import("./pages/PublicProfilePage"));
const DashboardJobDetailPage = lazy(() => import("./pages/DashboardJobDetailPage"));
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <AdminShortcut />
          <Toaster />
          <Sonner />
          <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-muted-foreground">Loading…</div>}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/jobs/:jobId" element={<JobDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/interview-tips" element={<InterviewTipsPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsOfServicePage />} />
            <Route path="/why-hiringcoop" element={<WhyHiringCoopPage />} />
            <Route path="/for-employers" element={<ForEmployersPage />} />
            <Route path="/rapid-apply" element={<RapidApplyPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/hcadmin2025" element={<AdminLoginPage />} />
            <Route path="/admin/setup" element={<FirstAdminSetupPage />} />
            <Route path="/admin/create-admin" element={<AdminSignupPage />} />
            <Route path="/admin/invite" element={<AdminRoute><AdminInvitePage /></AdminRoute>} />
            <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
            <Route path="/candidate/profile" element={<PrivateRoute><CandidateProfilePage /></PrivateRoute>} />
            <Route path="/candidate/applications" element={<PrivateRoute><ApplicationHistoryPage /></PrivateRoute>} />
            <Route path="/candidate/interview-prep" element={<PrivateRoute><InterviewPrepPage /></PrivateRoute>} />
            <Route path="/apply/:jobId" element={<PrivateRoute><ApplyPage /></PrivateRoute>} />
            <Route path="/apply-now" element={<PrivateRoute><VideoApplication /></PrivateRoute>} />
            <Route path="/dashboard" element={<PrivateRoute><DashboardRouter /></PrivateRoute>} />
            <Route path="/dashboard/videos" element={<PrivateRoute><VideoLibraryPage /></PrivateRoute>} />
            <Route path="/dashboard/jobs" element={<PrivateRoute><EmployerJobsPage /></PrivateRoute>} />
            <Route path="/dashboard/jobs/:jobId" element={<PrivateRoute><DashboardJobDetailPage /></PrivateRoute>} />
            <Route path="/dashboard/jobs/:jobId/applicants" element={<PrivateRoute><CandidatePipelinePage /></PrivateRoute>} />
            <Route path="/dashboard/candidates" element={<PrivateRoute><CandidateListPage /></PrivateRoute>} />
            <Route path="/employer" element={<PrivateRoute><EmployerDashboard /></PrivateRoute>} />
            <Route path="/employers" element={<PrivateRoute><EmployerDashboard /></PrivateRoute>} />
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/jobs" element={<AdminRoute><JobApprovalPage /></AdminRoute>} />
            <Route path="/admin/questions" element={<AdminRoute><VideoQuestionManagement /></AdminRoute>} />
            <Route path="/admin/verifications" element={<AdminRoute><VerificationPage /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><UserManagement /></AdminRoute>} />
            <Route path="/dashboard/company" element={<PrivateRoute><CompanyProfilePage /></PrivateRoute>} />
            <Route path="/dashboard/jobs/create" element={<PrivateRoute><JobPostingPage /></PrivateRoute>} />
            <Route path="/dashboard/candidates/:candidateId" element={<PrivateRoute><CandidateReviewPage /></PrivateRoute>} />
            <Route path="/candidates/:userId" element={<PublicProfilePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
