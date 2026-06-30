"use client";

import Image from "next/image";
import type { LinkData } from "@/app/page";

interface Props {
  link: LinkData;
}

export default function YouTubeCard({ link }: Props) {
  const extras = link.extras as Record<string, string | null> | null;
  return (
    <>
      {link.image && (
        <div className="relative w-full aspect-video bg-[#dddad0] dark:bg-white/5 overflow-hidden group-hover:scale-[1.02] transition-transform duration-500 ease-out">
          <Image
            src={link.image}
            alt={link.title ?? "YouTube thumbnail"}
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-60" />
          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-white/40 dark:bg-white/10 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/60 dark:border-white/20 group-hover:bg-[#E36A6A] group-hover:border-[#E36A6A] group-hover:scale-110 transition-all duration-300">
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 fill-white translate-x-0.5 group-hover:fill-white"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
      )}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-bold text-sm leading-snug text-text-rich dark:text-white line-clamp-2 transition-colors">
          {link.title}
        </h3>
        {extras?.channelName && (
          <p className="mt-2 text-xs text-[#8a7170] dark:text-white/60 font-bold tracking-wide">
            {extras.channelName}
          </p>
        )}
      </div>
    </>
  );
}
