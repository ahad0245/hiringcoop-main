import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SignupRequest {
  action: "signup";
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userType: "candidate" | "employer";
  origin?: string;
}

interface ResetRequest {
  action: "reset";
  email: string;
  origin?: string;
}

type RequestBody = SignupRequest | ResetRequest;

function jsonResponse(body: Record<string, any>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function normalizeUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

function getBaseUrl(origin?: string): string {
  const siteUrl =
    Deno.env.get("PUBLIC_SITE_URL") ||
    Deno.env.get("SITE_URL") ||
    "https://www.nikfix.com";

  if (origin) {
    const safeOrigin = normalizeUrl(origin);
    if (
      safeOrigin.startsWith("https://www.nikfix.com") ||
      safeOrigin.startsWith("https://nikfix.com") ||
      safeOrigin.startsWith("http://localhost")
    ) {
      return safeOrigin;
    }
  }

  return normalizeUrl(siteUrl);
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY not configured");

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const body: RequestBody = await req.json();

    if (body.action === "signup") {
      return await handleSignup(body, adminClient, LOVABLE_API_KEY, RESEND_API_KEY);
    } else if (body.action === "reset") {
      return await handleReset(body, adminClient, LOVABLE_API_KEY, RESEND_API_KEY);
    }

    return jsonResponse({ error: "Invalid action" }, 400);
  } catch (error: any) {
    console.error("auth-email-actions error:", error);
    return jsonResponse({ error: error.message }, 500);
  }
};

async function handleSignup(
  body: SignupRequest,
  adminClient: any,
  lovableKey: string,
  resendKey: string
) {
  const { email, password, firstName, lastName, userType, origin } = body;

  if (!email || !password || !firstName || !lastName) {
    return jsonResponse({ error: "Missing required fields" }, 400);
  }

  if (password.length < 8) {
    return jsonResponse({ error: "Password must be at least 8 characters" }, 400);
  }

  const baseUrl = getBaseUrl(origin);

  // Try to create the user
  const { data: createData, error: createError } = await adminClient.auth.admin.createUser({
    email,
    password,
    user_metadata: {
      first_name: firstName,
      last_name: lastName,
      user_type: userType,
    },
    email_confirm: false,
  });

  if (createError) {
    const msg = createError.message?.toLowerCase() || "";

    // User already exists — check if confirmed
    if (msg.includes("already been registered") || msg.includes("email_exists") || msg.includes("already exists")) {
      // Look up user to check confirmation status
      const { data: listData } = await adminClient.auth.admin.listUsers();
      const existingUser = listData?.users?.find(
        (u: any) => u.email?.toLowerCase() === email.toLowerCase()
      );

      if (existingUser && existingUser.email_confirmed_at) {
        return jsonResponse({ error: "An account with this email already exists. Please sign in instead." }, 400);
      }

      // Unconfirmed user — resend confirmation
      if (existingUser) {
        // Update password and metadata in case they changed
        await adminClient.auth.admin.updateUserById(existingUser.id, {
          password,
          user_metadata: {
            first_name: firstName,
            last_name: lastName,
            user_type: userType,
          },
        });

        return await sendConfirmationEmail(adminClient, email, firstName, baseUrl, lovableKey, resendKey);
      }
    }

    console.error("Create user error:", createError);
    return jsonResponse({ error: createError.message }, 400);
  }

  // User created successfully — send confirmation email
  return await sendConfirmationEmail(adminClient, email, firstName, baseUrl, lovableKey, resendKey);
}

async function sendConfirmationEmail(
  adminClient: any,
  email: string,
  firstName: string,
  baseUrl: string,
  lovableKey: string,
  resendKey: string
) {
  const { data: linkData, error: linkError } =
    await adminClient.auth.admin.generateLink({
      type: "signup",
      email,
      options: {
        redirectTo: `${baseUrl}/login?confirmed=true`,
      },
    });

  if (linkError) {
    console.error("Generate link error:", linkError);
    return jsonResponse({ error: "Account created but failed to generate confirmation link. Please try again." }, 500);
  }

  const confirmUrl = linkData?.properties?.action_link;
  if (!confirmUrl) {
    return jsonResponse({ error: "Failed to generate confirmation URL" }, 500);
  }

  const html = `
    <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px 20px;">
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="color: #4f46e5; font-size: 28px; margin: 0;">HiringCoop</h1>
      </div>
      <h2 style="color: #1f2937; font-size: 22px; margin-bottom: 16px;">Welcome, ${firstName}!</h2>
      <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
        Thanks for signing up for HiringCoop. Please confirm your email address to get started.
      </p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${confirmUrl}" 
           style="background-color: #4f46e5; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block;">
          Confirm Email Address
        </a>
      </div>
      <p style="color: #9ca3af; font-size: 14px; line-height: 1.5;">
        If you didn't create an account on HiringCoop, you can safely ignore this email.
      </p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;" />
      <p style="color: #9ca3af; font-size: 12px; text-align: center;">
        &copy; ${new Date().getFullYear()} HiringCoop. All rights reserved.
      </p>
    </div>
  `;

  await sendViaResend(lovableKey, resendKey, email, "Confirm your HiringCoop account", html);

  return jsonResponse({ success: true, message: "Confirmation email sent" });
}

async function handleReset(
  body: ResetRequest,
  adminClient: any,
  lovableKey: string,
  resendKey: string
) {
  const { email, origin } = body;

  if (!email) {
    return jsonResponse({ error: "Email is required" }, 400);
  }

  const baseUrl = getBaseUrl(origin);

  const { data: linkData, error: linkError } =
    await adminClient.auth.admin.generateLink({
      type: "recovery",
      email,
      options: {
        redirectTo: `${baseUrl}/reset-password`,
      },
    });

  if (linkError) {
    console.error("Generate recovery link error:", linkError);
    return jsonResponse({ success: true, message: "If an account exists, a reset email has been sent" });
  }

  const resetUrl = linkData?.properties?.action_link;
  if (!resetUrl) {
    return jsonResponse({ success: true, message: "If an account exists, a reset email has been sent" });
  }

  const html = `
    <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px 20px;">
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="color: #4f46e5; font-size: 28px; margin: 0;">HiringCoop</h1>
      </div>
      <h2 style="color: #1f2937; font-size: 22px; margin-bottom: 16px;">Reset Your Password</h2>
      <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
        We received a request to reset your password. Click the button below to choose a new password.
      </p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${resetUrl}" 
           style="background-color: #4f46e5; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block;">
          Reset Password
        </a>
      </div>
      <p style="color: #9ca3af; font-size: 14px; line-height: 1.5;">
        If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
      </p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;" />
      <p style="color: #9ca3af; font-size: 12px; text-align: center;">
        &copy; ${new Date().getFullYear()} HiringCoop. All rights reserved.
      </p>
    </div>
  `;

  await sendViaResend(lovableKey, resendKey, email, "Reset your HiringCoop password", html);

  return jsonResponse({ success: true, message: "If an account exists, a reset email has been sent" });
}

async function sendViaResend(
  lovableKey: string,
  resendKey: string,
  to: string,
  subject: string,
  html: string
) {
  const response = await fetch(`${GATEWAY_URL}/emails`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": resendKey,
    },
    body: JSON.stringify({
      from: "HiringCoop <noreply@iiwis.com>",
      to: [to],
      subject,
      html,
    }),
  });

  const result = await response.json();
  if (!response.ok) {
    console.error("Resend error:", result);
    throw new Error(`Failed to send email: ${JSON.stringify(result)}`);
  }
  return result;
}

serve(handler);
