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
          System Configuration & Profile
        </h1>
        <p className="text-xs text-on-surface-variant dark:text-white/70 font-medium">
          Manage Cerebellum AI user settings, directory indexes, and system parameters.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left profile card */}
        <div className="lg:col-span-5 neu-card rounded-3xl p-6 flex flex-col items-center gap-6">
          <div className="relative w-24 h-24 rounded-full p-1 neu-raised flex items-center justify-center">
            <div className="relative w-full h-full rounded-full neu-sunken flex items-center justify-center text-3xl font-bold">
              🏴‍☠️
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-sm font-bold text-text-rich dark:text-white">
              {profileName}
            </h3>
            <p className="text-[10px] text-primary dark:text-[#ffb4b4] font-bold uppercase tracking-wider mt-1">
              Minister of Unread Bookmarks
            </p>
          </div>

          <form onSubmit={handleSubmitProfile} className="w-full flex flex-col gap-3.5">
            <div>
              <label className="text-[9.5px] font-bold text-on-surface-variant dark:text-white/60 uppercase pl-1">
                Full Name
              </label>
              <div className="neu-sunken rounded-2xl px-3.5 py-1 mt-1">
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full h-9 bg-transparent text-xs font-bold text-text-rich dark:text-white outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-[9.5px] font-bold text-on-surface-variant dark:text-white/60 uppercase pl-1">
                Email Address
              </label>
              <div className="neu-sunken rounded-2xl px-3.5 py-1 mt-1">
                <input
                  type="email"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  className="w-full h-9 bg-transparent text-xs font-bold text-text-rich dark:text-white outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-10 rounded-2xl neu-button-primary text-white text-xs font-bold transition-all mt-2 cursor-pointer"
            >
              Save Profile Changes
            </button>

            {saveProfileSuccess && (
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 text-center">
                Profile metadata saved!
              </p>
            )}

            <button
              type="button"
              className="w-full h-10 rounded-2xl neu-button text-error text-xs font-bold transition-all mt-1 cursor-pointer"
            >
              Logout Session
            </button>
          </form>
        </div>

        {/* Right options cards */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Paths configuration */}
          <div className="neu-card rounded-3xl p-6 flex flex-col gap-4">
            <h3 className="text-xs font-bold text-text-rich dark:text-white uppercase tracking-wider">
              Local Directory Paths
            </h3>
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-[9.5px] font-bold text-on-surface-variant dark:text-white/60 uppercase pl-1">
                  Local Storage Cache
                </label>
                <div className="neu-sunken rounded-2xl px-3.5 py-1 mt-1">
                  <input
                    type="text"
                    value={profileCachePath}
                    onChange={(e) => setProfileCachePath(e.target.value)}
                    className="w-full h-9 bg-transparent text-xs font-mono font-bold text-text-rich dark:text-white outline-none"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-text-rich dark:text-white font-sans pt-2">
                <span>Max Cache Buffer</span>
                <span className="text-on-surface-variant dark:text-white/60 neu-raised-sm px-2.5 py-0.5 rounded-full">2.0 GB</span>
              </div>
            </div>
          </div>

          {/* Privacy configs */}
          <div className="neu-card rounded-3xl p-6 flex flex-col gap-4">
            <h3 className="text-xs font-bold text-text-rich dark:text-white uppercase tracking-wider">
              Privacy Parameters
            </h3>
            <div className="flex flex-col gap-3.5 divide-y divide-outline-variant/20 dark:divide-white/10">
              <div className="flex items-center justify-between text-xs font-bold text-text-rich dark:text-white pt-1">
                <span>Hardware Encrypted Backups</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold neu-raised-sm px-2.5 py-0.5 rounded-full">
                  Enabled (AES-256)
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-text-rich dark:text-white pt-3.5">
                <span>Third-party tracker scraping</span>
                <span className="text-error font-bold neu-raised-sm px-2.5 py-0.5 rounded-full">Blocked</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
