"use client";

import Image from "next/image";
import type { LinkData } from "@/app/page";

interface Props {
  link: LinkData;
}

export default function TwitterCard({ link }: Props) {
  const extras = link.extras as Record<string, string | null> | null;
  return (
    <div className="flex flex-col h-full justify-between">
      <div className="p-5 flex flex-col gap-4 flex-1">
        {/* Author row */}
        {extras?.authorName && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#E36A6A] to-[#FFB2B2] flex items-center justify-center text-sm font-bold text-white shrink-0 shadow-sm ring-2 ring-white/40 dark:ring-white/10">
              {extras.authorName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#2D2926] dark:text-white truncate">
                {extras.authorName}
              </p>
              <p className="text-xs text-[#8a7170] dark:text-white/60 font-medium truncate">
                @{extras.authorName.toLowerCase().replace(/\s+/g, "")}
              </p>
            </div>
            {/* X logo */}
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 fill-current text-[#8a7170]/40 dark:text-white/40 shrink-0"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </div>
        )}
        {/* Tweet text */}
        <p className="text-sm leading-relaxed text-[#564241] dark:text-[#c7c4ba] line-clamp-4 font-medium">
          {link.description ?? link.title}
        </p>
      </div>
      {link.image && (
        <div className="relative w-full h-40 bg-[#dddad0] dark:bg-white/5 border-t border-[#ddc0be]/30 dark:border-white/10 overflow-hidden">
          <Image
            src={link.image}
            alt="Tweet media"
            fill
            className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
            unoptimized
          />
        </div>
      )}
    </div>
  );
}
