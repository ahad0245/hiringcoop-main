
// Admin dashboard types
export interface AdminAnalytics {
  id: string;
  date: string;
  new_users: number;
  new_jobs: number;
  new_applications: number;
  new_verifications: number;
}

export interface PendingCounts {
  jobs: number;
  verifications: number;
}

// Job approval types
export interface JobApproval {
  id: string;
  job_id: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  updated_at: string;
  reviewed_at: string | null;
  rejection_reason: string | null;
  jobs: {
    id: string;
    title: string;
    description: string;
    location: string | null;
    job_type: string | null;
    salary_range: string | null;
    is_active: boolean;
    skills: string[] | null;
    companies: {
      name: string;
      industry: string | null;
      size: string | null;
    }
  }
}

// Verification types
export interface Verification {
  id: string;
  user_id: string;
  status: "pending" | "approved" | "rejected";
  document_url: string | null;
  created_at: string;
  updated_at: string;
  verified_at: string | null;
  rejection_reason: string | null;
  reviewer_id: string | null;
  user: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
    user_type: string | null;
  }
}
