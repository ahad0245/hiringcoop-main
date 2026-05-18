import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const GATEWAY_URL = 'https://connector-gateway.lovable.dev/resend';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type EmailType = "verification" | "invitation";

interface AdminEmailRequest {
  email: string;
  type: EmailType;
  code: string;
  inviterName?: string;
}

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const { email, type, code, inviterName }: AdminEmailRequest = await req.json();

    if (type === "verification") {
      const { data, error } = await supabase
        .from('admin_verification_codes')
        .select('code, verified, expires_at')
        .eq('email', email)
        .eq('code', code)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error || !data) {
        return new Response(
          JSON.stringify({ error: "Invalid verification code" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (data.verified) {
        return new Response(
          JSON.stringify({ error: "Code already used" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (new Date(data.expires_at) < new Date()) {
        return new Response(
          JSON.stringify({ error: "Code expired" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    } else {
      const authHeader = req.headers.get("Authorization");
      if (!authHeader) {
        return new Response(
          JSON.stringify({ error: "Missing Authorization header" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const token = authHeader.replace("Bearer ", "");
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      if (authError || !user) {
        return new Response(
          JSON.stringify({ error: "Unauthorized" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    if (type === "verification" && email !== "contact@i8is.com") {
      return new Response(
        JSON.stringify({ error: "Unauthorized email for verification" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let subject: string;
    let html: string;

    if (type === "verification") {
      subject = "Your HiringCoop Admin Verification Code";
      html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4f46e5;">HiringCoop Admin Verification</h1>
          <p>You are receiving this email because someone is trying to set up the first admin account for HiringCoop.</p>
          <p>Your verification code is:</p>
          <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; text-align: center; font-size: 24px; letter-spacing: 4px; font-weight: bold;">
            ${code}
          </div>
          <p style="margin-top: 24px;">This code will expire in 1 hour.</p>
          <p style="color: #6b7280; margin-top: 32px;">If you did not request this code, please ignore this email.</p>
        </div>
      `;
    } else {
      subject = "You've Been Invited to HiringCoop Admin Panel";
      html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4f46e5;">HiringCoop Admin Invitation</h1>
          <p>Hello,</p>
          <p>You have been invited by ${inviterName || "a super admin"} to join the HiringCoop administrative team.</p>
          <p>Your invitation code is:</p>
          <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; text-align: center; font-size: 24px; letter-spacing: 4px; font-weight: bold;">
            ${code}
          </div>
          <p>To complete your registration, please go to the admin signup page and enter this code when prompted.</p>
          <p style="margin-top: 24px;">This invitation will expire in 7 days.</p>
          <p style="color: #6b7280; margin-top: 32px;">If you believe this invitation was sent in error, please ignore this email.</p>
        </div>
      `;
    }

    const response = await fetch(`${GATEWAY_URL}/emails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'X-Connection-Api-Key': RESEND_API_KEY,
      },
      body: JSON.stringify({
        from: 'HiringCoop <noreply@iiwis.com>',
        to: [email],
        subject,
        html,
      }),
    });

    const emailResponse = await response.json();

    if (!response.ok) {
      throw new Error(`Resend API error [${response.status}]: ${JSON.stringify(emailResponse)}`);
    }

    return new Response(
      JSON.stringify(emailResponse),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error sending admin email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
