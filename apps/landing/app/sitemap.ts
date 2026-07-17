import type { MetadataRoute } from "next";
import { SITE_URL } from "../lib/env";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, priority: 1 },
    { url: `${SITE_URL}/v2`, priority: 0.9 },
    { url: `${SITE_URL}/v3`, priority: 0.9 },
    { url: `${SITE_URL}/politica-de-privacidade`, priority: 0.3 },
    { url: `${SITE_URL}/termos-de-uso`, priority: 0.3 },
  ];
}
