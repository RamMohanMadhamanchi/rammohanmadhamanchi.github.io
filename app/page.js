import { Hero } from "@/components/hero/Hero";
import { Identity } from "@/components/sections/Identity";
import { Work } from "@/components/sections/Work";
import { Capabilities } from "@/components/sections/Capabilities";
import { Timeline } from "@/components/sections/Timeline";
import { Beyond } from "@/components/sections/Beyond";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Identity />
      <Work />
      <Capabilities />
      <Timeline />
      <Beyond />
      <Contact />
    </>
  );
}
