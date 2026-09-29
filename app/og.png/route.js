import { ImageResponse } from "next/og";
import { site } from "@/content/site";

// Rendered once at build time to out/og.png (a real .png so static hosts
// serve it with an image content type).
export const dynamic = "force-static";

const size = { width: 1200, height: 630 };

const grid =
  "linear-gradient(rgba(235,232,223,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(235,232,223,0.07) 1px, transparent 1px)";

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#0b0c0c",
          backgroundImage: grid,
          backgroundSize: "60px 60px",
          color: "#ebe8df",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, letterSpacing: 4, color: "#8d9490" }}>
          <span style={{ color: "#62b487" }}>ENGINEERED TO EVOLVE</span>
          <span>{site.url.replace("https://", "").toUpperCase()}</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
          <div style={{ width: 120, height: 2, background: "#ebe8df", opacity: 0.6 }} />
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ width: 90, height: 56, border: "2px solid #ebe8df", background: "#111313" }} />
              <div style={{ width: 90, height: 2, background: "#62b487" }} />
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 92, fontWeight: 700, letterSpacing: -3, lineHeight: 1 }}>{site.name}</div>
          <div style={{ display: "flex", marginTop: 24, fontSize: 32, color: "#aeb4b0" }}>
            {site.formerRole}
            <span style={{ color: "#62b487", margin: "0 16px" }}>→</span>
            <span style={{ color: "#ebe8df" }}>{site.role}</span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
