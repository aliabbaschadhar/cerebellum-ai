"use client";

import Image from "next/image";
import type { LinkData } from "@/app/page";

interface Props {
  link: LinkData;
}

export default function GenericCard({ link }: Props) {
  return (
    <div className="flex flex-col h-full">
      {link.image && (
        <div className="relative w-full h-44 bg-[#dddad0] dark:bg-white/5 overflow-hidden">
          <Image
            src={link.image}
            alt={link.title ?? "Preview"}
            fill
            className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
        </div>
      )}
      <div
        className={`p-5 flex flex-col flex-1 ${link.image ? "-mt-8 relative z-10" : ""}`}
      >
        {/* Site name & Favicon */}
        {(link.siteName || link.favicon) && (
          <div className="flex items-center gap-2 mb-3 bg-white/80 dark:bg-white/5 w-fit px-2.5 py-1.5 rounded-md border border-[#ddc0be]/30 dark:border-white/10 backdrop-blur-md shadow-sm">
            {link.favicon && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={link.favicon}
                alt=""
                className="w-4 h-4 rounded-sm object-contain"
                onError={(e) =>
                  ((e.target as HTMLImageElement).style.display = "none")
                }
              />
            )}
            <span className="text-[10px] font-bold text-[#8a7170] dark:text-white/60 tracking-wider uppercase">
              {link.siteName ?? new URL(link.url).hostname}
            </span>
          </div>
        )}
        <h3 className="font-bold text-base leading-snug text-text-rich dark:text-white line-clamp-2">
          {link.title ?? link.url}
        </h3>
        {link.description && (
          <p className="mt-2.5 text-sm text-[#564241] dark:text-[#c7c4ba] leading-relaxed line-clamp-3 font-medium">
            {link.description}
          </p>
        )}
      </div>
    </div>
  );
}
