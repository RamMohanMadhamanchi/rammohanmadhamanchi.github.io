/**
 * CAREER TIMELINE — consolidated from both résumés, oldest → newest.
 * ------------------------------------------------------------------
 * phase drives the evolving drawing beside the timeline:
 *   "mechanical" → part drawing
 *   "software"   → (drawing begins to become a pipeline)
 *   "data"       → data pipeline
 *   "ai"         → agent orchestration
 *
 * kind: "education" | "role" | "training"
 */

export const timeline = [
  {
    phase: "mechanical",
    kind: "education",
    period: "2014 – 2018",
    title: "B.Tech, Mechanical Engineering",
    org: "IIITDM Kancheepuram",
    body: "Graduated with a GPA of 8.55 / 10.",
    points: [],
  },
  {
    phase: "mechanical",
    kind: "role",
    period: "Aug 2018 – Sep 2021",
    title: "Product Design Engineer",
    org: "L&T Technology Services",
    body: "Product design and prototype engineering, with software work alongside it.",
    points: [
      "Excavator prototype work at a client location in Hiroshima, Japan",
      "Engineering test data analysis for prototype optimisation",
      "Employee dashboards",
      "Image detection",
    ],
    project: "excavator-prototype-engineering",
  },
  {
    phase: "software",
    kind: "training",
    period: "Dec 2020 – Jun 2021",
    title: "Full-Stack Developer Bootcamp",
    org: "The 10x Academy",
    body: "Completed alongside the role at L&T. Graduated with 96.6%.",
    points: [],
  },
  {
    phase: "software",
    kind: "role",
    period: "Sep 2021 – Jul 2023",
    title: "Software Development Engineer",
    org: "The 10x Academy",
    body: "Built and automated the systems behind an education platform.",
    points: [
      "Student portals and React applications",
      "Automated attendance and scheduling tools",
      "REST APIs and data processing",
      "Google Apps Script automation",
    ],
  },
  {
    phase: "data",
    kind: "role",
    period: "Jul 2023 – Jun 2024",
    title: "Senior Analyst — Data Engineering",
    org: "Techno-Comp Computer Services · contracted to Carelon Global Solutions",
    body: "Healthcare data engineering.",
    points: ["Healthcare data transformation and ETL pipelines", "Integrations", "Data quality"],
  },
  {
    phase: "ai",
    kind: "role",
    // Confirm the start date before publishing.
    period: "[Start date] – Present",
    title: "Senior Software Engineer III (Data Engineering & AI)",
    org: "Carelon Global Solutions",
    body: "AI and data engineering.",
    points: [
      "AI-powered SQL generation",
      "Agentic orchestration",
      "Production data pipelines",
    ],
    project: "autonomous-sql-generation",
  },
];
