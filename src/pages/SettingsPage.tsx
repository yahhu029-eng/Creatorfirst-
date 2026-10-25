
import { ChevronLeft, LogOut, Shield, UserRound } from "lucide-react";

interface SettingsPageProps {
  onBack: () => void;
  onLogout: () => void;
}

export function SettingsPage({ onBack, onLogout }: SettingsPageProps) {
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
        <section className="rounded-xl border border-white/10 p-4">
          <div className="flex items-center gap-3">
            <UserRound size={22} />
            <div>
              <h2 className="font-semibold">Account</h2>
              <p className="text-sm text-gray-400">
                Manage your CreatorFirst account
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-white/10 p-4">
          <div className="flex items-center gap-3">
            <Shield size={22} />
            <div>
              <h2 className="font-semibold">Privacy & Security</h2>
              <p className="text-sm text-gray-400">
                Account and privacy settings
              </p>
            </div>
          </div>
        </section>

        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-xl border border-rose-500/30 p-4 text-rose-400 hover:bg-rose-500/10"
        >
          <LogOut size={22} />
          <span className="font-semibold">Log Out</span>
        </button>
      </main>
    </div>
  );
}
