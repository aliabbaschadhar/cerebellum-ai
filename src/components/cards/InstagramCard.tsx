"use client";

import type { LinkData } from "@/types";
import GenericCard from "./GenericCard";

interface Props {
  link: LinkData;
}

export default function InstagramCard({ link }: Props) {
  let embedUrl = "";
  try {
    const urlObj = new URL(link.url);
    const match = urlObj.pathname.match(/\/(p|reel)\/([^\/]+)/);
    if (match) {
      embedUrl = `https://www.instagram.com/${match[1]}/${match[2]}/embed/`;
    }
  } catch {}
  return (
    <div className="flex flex-col h-full">
      {embedUrl ? (
        <div className="w-full bg-white rounded-t-2xl overflow-hidden flex justify-center h-[380px]">
          <iframe
            src={embedUrl}
            className="w-full h-full border-b border-[#ddc0be]/30"
            frameBorder="0"
            scrolling="no"
            allowTransparency={true}
          ></iframe>
        </div>
      ) : (
        <GenericCard link={link} />
      )}
    </div>
  );
}
