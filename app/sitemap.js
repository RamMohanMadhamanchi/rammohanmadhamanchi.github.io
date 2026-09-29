import { projects } from "@/content/projects";
import { site } from "@/content/site";

export const dynamic = "force-static";

export default function sitemap() {
  return [
    { url: `${site.url}/`, changeFrequency: "monthly", priority: 1 },
    ...projects.map((project) => ({
      url: `${site.url}/projects/${project.slug}/`,
      changeFrequency: "monthly",
      priority: 0.8,
    })),
  ];
}
