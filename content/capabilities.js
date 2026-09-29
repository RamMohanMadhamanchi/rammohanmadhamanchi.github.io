/**
 * CAPABILITIES — an evidence map, not a skill rating.
 * ------------------------------------------------------------------
 * Every technology is listed against the context where the résumés
 * document it being used. No proficiency levels are claimed.
 *
 * uses: { [contextId]: "production" | "work" | "training" | "project" }
 *   production — part of production systems named on the résumé
 *   work       — used in a professional role
 *   training   — full-stack bootcamp
 *   project    — Hel-Mate / Texas Instruments competition project
 *
 * To add a technology, add it to the right group with the contexts
 * where you actually used it.
 */

export const contexts = [
  { id: "lt", label: "L&T Technology Services", short: "L&T", period: "2018–21" },
  { id: "tenx", label: "The 10x Academy", short: "10x", period: "2020–23" },
  { id: "carelon", label: "Carelon Global Solutions", short: "Carelon", period: "2023–", note: "Includes the Techno-Comp contract role" },
  { id: "projects", label: "Projects", short: "Projects", period: "", note: "Hel-Mate · TI competition" },
];

export const usage = {
  production: { label: "Production systems" },
  work: { label: "Professional work" },
  training: { label: "Bootcamp" },
  project: { label: "Project" },
};

export const capabilityGroups = [
  {
    code: "AI",
    title: "AI & LLM systems",
    description: "Agentic workflows and natural-language interfaces that generate and validate SQL.",
    items: [
      { name: "LangChain", uses: { carelon: "work" }, projects: ["autonomous-sql-generation"] },
      { name: "LangGraph", uses: { carelon: "work" }, projects: ["autonomous-sql-generation"] },
      { name: "LangSmith", uses: { carelon: "work" }, projects: ["autonomous-sql-generation"] },
      { name: "Agent SDKs", uses: { carelon: "work" }, projects: ["autonomous-sql-generation"] },
      { name: "Snowflake Cortex", uses: { carelon: "work" }, projects: ["driver-query-generation"] },
      { name: "Prompt engineering", uses: { carelon: "work" }, projects: ["driver-query-generation"] },
    ],
  },
  {
    code: "DE",
    title: "Data engineering",
    description: "Pipelines, transformation and data quality for healthcare data at scale.",
    items: [
      { name: "SQL", uses: { carelon: "work" }, projects: ["autonomous-sql-generation", "driver-query-generation"] },
      { name: "Python", uses: { carelon: "production", projects: "project" }, projects: ["healthcare-etl", "hel-mate"] },
      { name: "AWS Lambda", uses: { carelon: "production" }, projects: ["healthcare-etl"] },
      { name: "AWS Glue", uses: { carelon: "production" }, projects: ["healthcare-etl"] },
      { name: "Amazon S3", uses: { carelon: "production" }, projects: ["healthcare-etl"] },
      { name: "ETL & data quality", uses: { carelon: "production" }, projects: ["healthcare-etl"] },
      { name: "Data processing", uses: { tenx: "work" }, projects: [] },
    ],
  },
  {
    code: "SW",
    title: "Software development",
    description: "Dashboards at L&T, then portals, React applications, APIs and automation for an education platform.",
    items: [
      { name: "Full-stack web development", uses: { tenx: "training" }, projects: [] },
      { name: "React", uses: { tenx: "work" }, projects: [] },
      { name: "REST APIs", uses: { tenx: "work" }, projects: [] },
      { name: "Google Apps Script", uses: { tenx: "work" }, projects: [] },
      { name: "Workflow automation (attendance, scheduling)", uses: { tenx: "work" }, projects: [] },
      { name: "Dashboards", uses: { lt: "work" }, projects: ["excavator-prototype-engineering"] },
    ],
  },
  {
    code: "ME",
    title: "Mechanical engineering",
    description: "Product design and prototype engineering for heavy equipment.",
    items: [
      { name: "Product design", uses: { lt: "work" }, projects: ["excavator-prototype-engineering"] },
      { name: "Prototype engineering", uses: { lt: "work" }, projects: ["excavator-prototype-engineering"] },
      { name: "Engineering test data analysis", uses: { lt: "work" }, projects: ["excavator-prototype-engineering"] },
      { name: "[CAD platform]", uses: { lt: "work" }, projects: [] },
    ],
  },
  {
    code: "EV",
    title: "Vision & vehicle systems",
    description: "Projects where software meets physical machines.",
    items: [
      { name: "Image detection", uses: { lt: "work", projects: "project" }, projects: ["excavator-prototype-engineering", "hel-mate"] },
      { name: "OpenCV", uses: { projects: "project" }, projects: ["hel-mate"] },
      { name: "DSRC / V2V communication", uses: { projects: "project" }, projects: ["collision-prediction"] },
      { name: "Team leadership", uses: { projects: "project" }, projects: ["collision-prediction"] },
    ],
  },
];
