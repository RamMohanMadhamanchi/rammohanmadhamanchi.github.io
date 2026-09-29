import { ActionLink } from "@/components/system/ActionLink";

export const metadata = { title: "Not found" };

export default function NotFound() {
  return (
    <section className="flex min-h-dvh items-center bg-grid pt-[var(--header-h)]">
      <div className="container-x">
        <p className="label text-signal">Error 404 · Part not found</p>
        <h1 className="display mt-6 max-w-[14ch] text-display">This part isn&apos;t in the assembly.</h1>
        <p className="mt-6 max-w-md text-lg text-steel-300">
          The page you were looking for doesn&apos;t exist or has moved.
        </p>
        <div className="mt-10">
          <ActionLink href="/">Back to the start</ActionLink>
        </div>
      </div>
    </section>
  );
}
