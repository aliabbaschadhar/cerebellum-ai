"use client";

import { useState } from "react";

interface SettingsTabProps {
  profile: { name: string; email: string; cachePath: string };
  setProfile: React.Dispatch<
    React.SetStateAction<{ name: string; email: string; cachePath: string }>
  >;
}

export default function SettingsTab({ profile, setProfile }: SettingsTabProps) {
  const [profileName, setProfileName] = useState(profile.name);
  const [profileEmail, setProfileEmail] = useState(profile.email);
  const [profileCachePath, setProfileCachePath] = useState(profile.cachePath);
  const [saveProfileSuccess, setSaveProfileSuccess] = useState(false);

  function handleSubmitProfile(e: React.FormEvent) {
    e.preventDefault();
    localStorage.setItem("profile_name", profileName);
    localStorage.setItem("profile_email", profileEmail);
    localStorage.setItem("profile_cache", profileCachePath);
    setProfile({
      name: profileName,
      email: profileEmail,
      cachePath: profileCachePath,
    });
    setSaveProfileSuccess(true);
    setTimeout(() => setSaveProfileSuccess(false), 3000);
  }

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto text-left">
      <div>
        <h1 className="text-2xl font-bold font-display text-text-rich dark:text-white">
          System Configuration
        </h1>
        <p className="text-xs text-[#564241] dark:text-[#8a7170] font-medium">
          Manage Cerebellum AI indexes, databases, and general local system state.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left profile card */}
        <div className="lg:col-span-5 bg-white/60 dark:bg-[#1c1c16]/50 border border-[#ddc0be]/40 dark:border-white/10 rounded-2xl p-6 flex flex-col items-center gap-6 shadow-sm">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[#E36A6A] p-0.5">
            <div className="relative w-full h-full rounded-full overflow-hidden bg-gradient-to-tr from-[#E36A6A] to-[#FFB2B2] flex items-center justify-center text-3xl font-bold text-white shadow-inner">
              🏴‍☠️
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-sm font-bold text-text-rich dark:text-white">
              {profileName}
            </h3>
            <p className="text-[10px] text-[#8a7170] font-bold uppercase tracking-wider mt-1">
              Minister of Unread Bookmarks
            </p>
          </div>

          <form onSubmit={handleSubmitProfile} className="w-full flex flex-col gap-3">
            <div>
              <label className="text-[9.5px] font-bold text-[#8a7170] uppercase">
                Full Name
              </label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full h-9.5 rounded-lg px-3 border border-[#ddc0be]/30 dark:border-white/10 bg-[#FFF2D0]/20 dark:bg-white/5 text-xs font-medium focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[9.5px] font-bold text-[#8a7170] uppercase">
                Email Address
              </label>
              <input
                type="email"
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
                className="w-full h-9.5 rounded-lg px-3 border border-[#ddc0be]/30 dark:border-white/10 bg-[#FFF2D0]/20 dark:bg-white/5 text-xs font-medium focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full h-9.5 rounded-lg bg-[#E36A6A] hover:bg-[#a0383b] text-white text-xs font-bold transition-all shadow-md shadow-[#E36A6A]/10 mt-2"
            >
              Save Profile Changes
            </button>

            {saveProfileSuccess && (
              <p className="text-xs font-bold text-emerald-600 text-center">
                Profile metadata saved!
              </p>
            )}

            <button
              type="button"
              className="w-full h-9.5 rounded-lg border border-red-200 text-red-600 dark:border-red-900/30 dark:text-red-400 text-xs font-bold hover:bg-red-50 dark:hover:bg-red-950/20 transition-all mt-1"
            >
              Logout Session
            </button>
          </form>
        </div>

        {/* Right options cards */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Paths configuration */}
          <div className="bg-white/60 dark:bg-[#1c1c16]/50 border border-[#ddc0be]/40 dark:border-white/10 rounded-2xl p-6 flex flex-col gap-4 shadow-sm">
            <h3 className="text-xs font-bold text-[#8a7170] uppercase tracking-wider">
              Local Directory Paths
            </h3>
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-[9.5px] font-bold text-[#8a7170] uppercase">
                  Local Storage Cache
                </label>
                <input
                  type="text"
                  value={profileCachePath}
                  onChange={(e) => setProfileCachePath(e.target.value)}
                  className="w-full h-9.5 rounded-lg px-3 border border-[#ddc0be]/30 dark:border-white/10 bg-[#FFF2D0]/20 dark:bg-white/5 text-xs font-mono focus:outline-none text-[#564241] dark:text-[#dddad0]"
                />
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-text-rich dark:text-white font-sans">
                <span>Max Cache Buffer</span>
                <span className="text-[#8a7170]">2.0 GB</span>
              </div>
            </div>
          </div>

          {/* Privacy configs */}
          <div className="bg-white/60 dark:bg-[#1c1c16]/50 border border-[#ddc0be]/40 dark:border-white/10 rounded-2xl p-6 flex flex-col gap-4 shadow-sm">
            <h3 className="text-xs font-bold text-[#8a7170] uppercase tracking-wider">
              Privacy Parameters
            </h3>
            <div className="flex flex-col gap-3.5 divide-y divide-[#ddc0be]/20 dark:divide-white/10">
              <div className="flex items-center justify-between text-xs font-bold text-text-rich dark:text-white pt-1">
                <span>Hardware Encrypted Backups</span>
                <span className="text-emerald-600 dark:text-emerald-500 font-bold">
                  Enabled (AES-256-GCM)
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-text-rich dark:text-white pt-3.5">
                <span>Third-party tracker scraping</span>
                <span className="text-red-500 font-bold">Blocked</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
