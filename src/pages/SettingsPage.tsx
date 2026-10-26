import { useEffect, useState } from "react";
import { ChevronLeft, LogOut, Shield, UserRound } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface SettingsPageProps {
  onBack: () => void;
  onLogout: () => void;
}

export function SettingsPage({ onBack, onLogout }: SettingsPageProps) {
  const [showAccountDetails, setShowAccountDetails] = useState(false);
  const [showPrivacySecurity, setShowPrivacySecurity] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [userEmail, setUserEmail] = useState("");

useEffect(() => {
  supabase.auth.getUser().then(({ data }) => {
    setUserEmail(data.user?.email ?? "Email unavailable");
  });
}, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="flex items-center gap-3 border-b border-white/10 p-4">
        <button
          onClick={onBack}
          aria-label="Go back"
          className="rounded-full p-2 hover:bg-white/10"
        >
          <ChevronLeft size={22} />
        </button>
        <h1 className="text-xl font-bold">Settings</h1>
      </header>

      <main className="mx-auto max-w-md space-y-4 p-4">
        <button
          onClick={() => setShowAccountDetails(true)}
          className="flex w-full items-center gap-3 rounded-xl border border-white/10 p-4 text-left hover:bg-white/5"
        >
          <UserRound size={22} />
          <div>
            <h2 className="font-semibold">Account Management</h2>
            <p className="text-sm text-gray-400">
              Manage your CreatorFirst account
            </p>
          </div>
        </button>

        <button
          onClick={() => setShowPrivacySecurity(true)}
          className="flex w-full items-center gap-3 rounded-xl border border-white/10 p-4 text-left hover:bg-white/5"
        >
          <Shield size={22} />
          <div>
            <h2 className="font-semibold">Privacy & Security</h2>
            <p className="text-sm text-gray-400">
              Account and privacy settings
            </p>
          </div>
        </button>

        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="flex w-full items-center gap-3 rounded-xl border border-rose-500/30 p-4 text-rose-400 hover:bg-rose-500/10"
        >
          <LogOut size={22} />
          <span className="font-semibold">Log Out</span>
        </button>
      </main>

      {showPrivacySecurity && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
    <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#15151d] p-5">
      <h2 className="text-lg font-bold">Privacy & Security</h2>

      <p className="mt-4 text-sm text-gray-300">
        Password reset ke liye tumhare registered email par reset link bheja ja sakta hai.
      </p>

      <button
        onClick={async () => {
          const { data } = await supabase.auth.getUser();
          const email = data.user?.email;

          if (!email) {
            alert("Login email nahi mila. Dobara login karo.");
            return;
          }

          const { error } = await supabase.auth.resetPasswordForEmail(email);

          if (error) {
            alert(error.message);
          } else {
            alert("Password reset link ke liye apna email check karo.");
          }
        }}
        className="mt-5 w-full rounded-lg bg-indigo-600 px-4 py-2 font-semibold hover:bg-indigo-500"
      >
        Send Password Reset Link
      </button>

      <button
        onClick={() => setShowPrivacySecurity(false)}
        className="mt-3 w-full rounded-lg bg-white/10 px-4 py-2 hover:bg-white/20"
      >
        Close
      </button>
    </div>
  </div>
)}

      {showAccountDetails && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
    <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#15151d] p-5">
      <h2 className="text-lg font-bold">Account Management</h2>

      <p className="mt-4 text-sm text-gray-400">Login Email</p>
      <p className="mt-1 break-all text-white">{userEmail || "Loading..."}</p>

      <button
        onClick={() => setShowAccountDetails(false)}
        className="mt-6 w-full rounded-lg bg-white/10 px-4 py-2 hover:bg-white/20"
      >
        Close
      </button>
    </div>
  </div>
)}

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-title"
            className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#15151d] p-5 shadow-xl"
          >
            <h2 id="logout-title" className="text-lg font-bold">
              Log Out?
            </h2>
            <p className="mt-2 text-sm text-gray-300">
              Are you sure you want to log out of CreatorFirst?
            </p>

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="rounded-lg px-4 py-2 text-sm hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={onLogout}
                className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold hover:bg-rose-500"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
