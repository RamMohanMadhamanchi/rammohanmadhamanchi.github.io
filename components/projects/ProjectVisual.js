import Image from "next/image";
import { ProjectFigure } from "./ProjectFigure";

/**
 * The lead visual for a project: Ram's real primary asset (e.g. a CAD render)
 * when one has been added to `media.primary`, otherwise the line illustration.
 */
export function ProjectVisual({ project, className, sizes = "(min-width: 768px) 60vw, 100vw", priority = false }) {
  const asset = project.media?.primary;
  if (asset?.src) {
    return (
      <Image
        src={asset.src}
        alt={asset.alt}
        width={asset.width}
        height={asset.height}
        sizes={sizes}
        priority={priority}
        className="block h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] card-on:scale-[1.03]"
      />
    );
  }
  return <ProjectFigure kind={project.figure} className={className} />;
}
