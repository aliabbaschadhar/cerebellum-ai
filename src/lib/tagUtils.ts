import type { LinkData } from "@/app/page";

export const AVAILABLE_TAGS = [
  "Neuroscience",
  "Productivity",
  "Startups",
  "Strategy",
  "Habits",
  "Mindset",
  "Marketing",
  "B2B",
  "Design",
  "Essays",
  "Career",
] as const;

export type FolderType = "All" | "Inbox" | (typeof AVAILABLE_TAGS)[number];

export function getLinkTags(link: LinkData): string[] {
  const text =
    `${link.title ?? ""} ${link.description ?? ""} ${link.aiContext ?? ""} ${link.platform ?? ""}`.toLowerCase();
  const tags: string[] = [];

  if (text.includes("neuro") || text.includes("brain") || text.includes("huberman"))
    tags.push("Neuroscience");
  if (
    text.includes("productiv") ||
    text.includes("focus") ||
    text.includes("deep work") ||
    text.includes("routine")
  )
    tags.push("Productivity");
  if (
    text.includes("startup") ||
    text.includes("execute") ||
    text.includes("execution") ||
    text.includes("pre-seed") ||
    text.includes("andreessen") ||
    text.includes("funding")
  )
    tags.push("Startups");
  if (text.includes("strateg")) tags.push("Strategy");
  if (
    text.includes("habit") ||
    text.includes("sleep") ||
    text.includes("morning") ||
    text.includes("routine")
  )
    tags.push("Habits");
  if (
    text.includes("mindset") ||
    text.includes("meditation") ||
    text.includes("psychology") ||
    text.includes("dopamine")
  )
    tags.push("Mindset");
  if (
    text.includes("market") ||
    text.includes("seo") ||
    text.includes("growth") ||
    text.includes("b2b")
  )
    tags.push("Marketing");
  if (text.includes("b2b") || text.includes("saas") || text.includes("enterprise"))
    tags.push("B2B");
  if (
    text.includes("design") ||
    text.includes("figma") ||
    text.includes("visual") ||
    text.includes("aesthetic") ||
    text.includes("typography")
  )
    tags.push("Design");
  if (
    text.includes("essay") ||
    text.includes("write") ||
    text.includes("article") ||
    text.includes("medium") ||
    text.includes("obsidian")
  )
    tags.push("Essays");
  if (
    text.includes("career") ||
    text.includes("job") ||
    text.includes("hire") ||
    text.includes("resume")
  )
    tags.push("Career");

  if (tags.length === 0) {
    if (link.platform === "youtube") tags.push("Productivity");
    else if (link.platform === "twitter") tags.push("Startups");
    else tags.push("Inbox");
  }

  return tags;
}
