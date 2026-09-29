/**
 * SITE & IDENTITY
 * ------------------------------------------------------------------
 * Source of truth: Ram's two résumés (consolidated).
 *
 * Anything wrapped in [square brackets] is a placeholder that still needs
 * confirmation. The UI renders placeholders in a dashed "unfilled slot"
 * style and never links them.
 */

export const site = {
  name: "Ram Mohan Madhamanchi",
  shortName: "Ram",
  initials: "RM",

  // Discipline line — documented on both résumés, safe to publish.
  formerRole: "Mechanical Engineer",
  role: "Data Engineering & AI",

  // Confirmed designation (latest résumé).
  currentTitle: "Senior Software Engineer III (Data Engineering & AI)",
  currentOrg: "Carelon Global Solutions",

  location: "Hyderabad, Telangana, India",

  // The career path, in the order it happened.
  path: ["Mechanical Engineering", "Full-stack development", "Data engineering", "AI & agentic systems"],

  tagline: "From physical systems to intelligent systems.",

  intro:
    "I began as a product design engineer at L&T Technology Services, working on an excavator prototype at a client location in Hiroshima, Japan. From there I moved into full-stack development, then healthcare data engineering, and now build AI systems that generate and validate SQL through multi-agent orchestration.",

  url: "https://rammohanmadhamanchi.github.io",
  description:
    "Ram Mohan Madhamanchi — Senior Software Engineer III (Data Engineering & AI) at Carelon Global Solutions, Hyderabad. A mechanical engineer turned data and AI engineer: case studies in multi-agent SQL generation, healthcare ETL and mechanical prototype engineering.",

  // Personal Gmail address from the older résumé (not the Carelon address).
  email: "[personal Gmail address from the older résumé]",

  links: [
    // Derived from this repository's owner.
    { label: "GitHub", href: "https://github.com/rammohanmadhamanchi" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/rammohanmadhamanchi" },
    { label: "Résumé", href: "[/resume.pdf]" },
  ],
};

export const education = {
  degree: "B.Tech, Mechanical Engineering",
  institution: "IIITDM Kancheepuram",
  period: "2014 – 2018",
  grade: "GPA 8.55 / 10",
};

export const navigation = [
  { id: "identity", label: "Identity", index: "01" },
  { id: "work", label: "Work", index: "02" },
  { id: "capabilities", label: "Capabilities", index: "03" },
  { id: "timeline", label: "Timeline", index: "04" },
  { id: "beyond", label: "Beyond", index: "05" },
  { id: "contact", label: "Contact", index: "06" },
];
