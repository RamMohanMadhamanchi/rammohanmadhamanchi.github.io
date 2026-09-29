/**
 * PROFESSIONAL IDENTITY
 * ------------------------------------------------------------------
 * Four phases of one career. `work` lists what each phase actually
 * involved, as documented on the résumés. `principle` is editorial framing —
 * the engineering thread carried from one phase to the next; edit freely. `story` is Ram's own voice —
 * left as a placeholder until Ram writes it.
 */

export const identity = {
  heading: "Four kinds of system. One way of thinking.",
  lede: "Excavator prototypes, student portals, healthcare data pipelines, multi-agent AI. The tools changed at every step; the work was always understanding a real system well enough to improve it.",

  phases: [
    {
      id: "physical",
      stage: "Physical systems",
      period: "2014 – 2021",
      title: "Mechanical Engineering",
      where: "IIITDM Kancheepuram · L&T Technology Services",
      summary:
        "A B.Tech in Mechanical Engineering, then three years as a Product Design Engineer on excavator prototype work.",
      principle: "Understand how a physical system behaves — then measure it.",
      work: [
        "Excavator prototype at a client location in Hiroshima, Japan",
        "Engineering test data analysis for prototype optimisation",
        "Employee dashboards and image detection",
      ],
      story: "[In your own words: what the mechanical work taught you.]",
    },
    {
      id: "software",
      stage: "Software systems",
      period: "2020 – 2023",
      title: "Full-Stack Development",
      where: "The 10x Academy",
      summary:
        "A full-stack bootcamp completed alongside the L&T role, then two years as a Software Development Engineer.",
      principle: "Turn repetitive work into tools people rely on.",
      work: [
        "Student portals and React applications",
        "Automated attendance and scheduling tools",
        "REST APIs and data processing",
      ],
      story: "[In your own words: what moving into software felt like.]",
    },
    {
      id: "data",
      stage: "Data systems",
      period: "2023 – 2024",
      title: "Data Engineering",
      where: "Techno-Comp, contracted to Carelon Global Solutions",
      summary: "Healthcare data engineering: transformation, ETL pipelines, integrations and data quality.",
      principle: "Data has tolerances too — validate it before anyone depends on it.",
      work: ["Healthcare data transformation", "ETL pipelines and integrations", "Data quality"],
      story: "[In your own words: what healthcare data engineering taught you.]",
    },
    {
      id: "intelligent",
      stage: "Intelligent systems",
      period: "[Start] – Present",
      title: "Data Engineering & AI",
      where: "Carelon Global Solutions",
      summary:
        "AI-powered SQL generation, agentic orchestration and production data pipelines.",
      principle: "Orchestrate agents like an assembly — every part with a defined job.",
      work: [
        "Multi-agent SQL generation with LangChain & LangGraph",
        "Natural-language SQL with Snowflake Cortex",
        "Observability with LangSmith",
      ],
      story: "[In your own words: what you're focused on now.]",
    },
  ],

  transition: {
    title: "The turn",
    fact: "In December 2020, while still a Product Design Engineer at L&T, I started a full-stack developer bootcamp at The 10x Academy — graduating in June 2021 with 96.6%, and joining the academy as a Software Development Engineer that September.",
    why: "[Why the move — what drew you from mechanical design toward software?]",
  },

  // Editorial analogies between the phases — framing, not claims.
  parallels: [
    { physical: "Test data analysis", digital: "Data validation & quality checks" },
    { physical: "Prototype iteration", digital: "Monitoring & observability" },
    { physical: "Mechanical assemblies", digital: "Pipelines & agent orchestration" },
    { physical: "Engineering automation", digital: "Workflow automation" },
  ],
};
