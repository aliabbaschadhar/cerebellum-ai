"use client";

import type { LinkData } from "@/app/page";
import LinkCard from "@/components/LinkCard";

interface VaultTabProps {
  links: LinkData[];
  onDeleted: (id: string) => void;
  isPending: boolean;
}

export default function VaultTab({
  links,
  onDeleted,
  isPending,
}: VaultTabProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#ddc0be]/25 dark:border-white/10 pb-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-text-rich dark:text-white">
            Memory Vault
          </h1>
          <p className="text-xs text-[#564241] dark:text-[#8a7170] font-medium">
            Browse, filter, and purge items stored inside your database.
          </p>
        </div>
      </div>

      {/* List Grid */}
      {links.length === 0 ? (
        <div className="text-center py-20 italic text-[#8a7170]">
          Your second brain is empty. Save links from the Home dashboard.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {links.map((link) => (
            <LinkCard
              key={link.id}
              link={link}
              onDeleted={onDeleted}
              disabled={isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
}
