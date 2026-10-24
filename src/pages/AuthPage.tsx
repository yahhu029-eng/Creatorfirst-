import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface AuthPageProps {
  onLogin: () => void;
  isRecovery?: boolean;
}

export default function AuthPage({ onLogin }: AuthPageProps) {
  const [isSignup, setIsSignup] = useState(true);
  const [isRecovery, setIsRecovery] = useState(false);
const [newPassword, setNewPassword] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (isRecovery) {
        const { error } = await supabase.auth.updateUser({
          password: newPassword,
        });

        if (error) throw error;

        setMessage("Password reset successful! Ab Sign In karo.");
        setIsRecovery(false);
        setNewPassword("");
        await supabase.auth.signOut();
        return;
      }
      
      if (isSignup) {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: window.location.origin + "/Creatorfirst-/",
          },
        });

        if (error) throw error;

        if (data.session) {
          onLogin();
        } else {
          setMessage(
            "Account request successful! Email check karo aur confirmation link par tap karo."
          );
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) throw error;
        onLogin();
      }
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Kuch galat hua. Dobara try karo."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12 text-white">
      <h1 className="mb-2 text-3xl font-bold">CreatorFirst</h1>
      <p className="mb-8 text-sm text-gray-400">
        {isSignup
          ? "Create your account and share your videos."
          : "Welcome back! Sign in to continue."}
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="mb-2 block text-sm">
            Email address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white"
          />
        </div>

        <div>
  <label htmlFor="password" className="mb-2 block text-sm">
    {isRecovery ? "New Password" : "Password (minimum 6 characters)"}
  </label>
  <input
    id="password"
    type="password"
    autoComplete={isRecovery || isSignup ? "new-password" : "current-password"}
    minLength={6}
    required
    value={isRecovery ? newPassword : password}
    onChange={(e) =>
      isRecovery
        ? setNewPassword(e.target.value)
        : setPassword(e.target.value)
    }
    placeholder={isRecovery ? "Enter new password" : "Enter password"}
    className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white"
  />
</div>

        {message && (
          <p role="status" className="break-words text-sm text-amber-300">
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold disabled:opacity-50"
        >

          {loading
  ? "Please wait..."
  : isRecovery
    ? "Reset Password"
    : isSignup
      ? "Create Account"
      : "Sign In"}
          
        </button>
      </form>
      {!isRecovery && (
  <button
    type="button"
    onClick={async () => {
      if (!email.trim()) {
        setMessage("Pehle apna email address enter karo.");
        return;
      }

      setLoading(true);
      setMessage("");

      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: window.location.origin + "/Creatorfirst-/",
        }
      );

      setLoading(false);
      setMessage(
        error
          ? error.message
          : "Password reset email bhej di gayi hai. Inbox aur Spam check karo."
      );
    }}
    className="mt-4 w-full text-sm text-blue-400"
  >
    Forgot password?
  </button>
)}

      <p className="mt-6 text-center text-sm text-gray-400">
        {isSignup ? "Already have an account?" : "New to CreatorFirst?"}{" "}
        <button
          type="button"
          onClick={() => {
            setIsSignup(!isSignup);
            setMessage("");
          }}
          className="font-semibold text-blue-400"
        >
          {isSignup ? "Sign In" : "Create Account"}
        </button>
      </p>
    </div>
  );
}
