export interface LinkData {
  id: string;
  url: string;
  platform: string;
  title: string | null;
  description: string | null;
  image: string | null;
  favicon: string | null;
  siteName: string | null;
  extras: Record<string, string | null> | null;
  aiContext: string | null;
  createdAt: string;
}
