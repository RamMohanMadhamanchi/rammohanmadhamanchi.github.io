import { site } from "@/content/site";
import { Text } from "@/components/system/Text";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line">
      {/* Drawing title block */}
      <div className="container-x grid grid-cols-2 gap-px py-8 text-steel-400 md:grid-cols-4">
        <Cell label="Drawn by" value={site.name} />
        <Cell label="Discipline" value={`${site.formerRole} → ${site.role}`} />
        <Cell label="Location" value={site.location} />
        <Cell label="Sheet" value={`© ${year} · Rev. A`} />
      </div>
    </footer>
  );
}

function Cell({ label, value }) {
  return (
    <div className="border-l border-line py-1 pl-4">
      <div className="label text-steel-500">{label}</div>
      <Text value={value} className="mt-1 block text-sm text-steel-300" />
    </div>
  );
}
