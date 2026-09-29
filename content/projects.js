/**
 * PROJECTS & CASE STUDIES
 * ------------------------------------------------------------------
 * Source of truth: Ram's two résumés (consolidated). Each entry renders
 * a showcase on the home page and a case study at /projects/[slug]/.
 *
 * Keep these kinds of content apart — the UI labels them differently:
 *   contributions — what Ram did (from the résumés)
 *   howItWorks    — descriptive explanation of the system (not a claim)
 *   results       — documented results only, each with where it was reported
 *
 * era      "intelligent" | "data" | "physical" — drives grouping and visuals
 * tier     "principal" (large showcase) | "supporting" | "foundation"
 * figure   illustration kind, see components/projects/ProjectFigure.js
 * exhibits interactive pieces for the case study: "system" renders the
 *          `system` diagram below; "exploded" and "blueprint" are the
 *          mechanical demonstrations.
 * confirm  open questions to resolve before publishing
 *
 * System diagrams are simplified views built only from documented
 * components. Node coordinates are in a 960-unit-wide canvas.
 */

export const projects = [
  // ─── Intelligent systems ────────────────────────────────────────
  {
    slug: "autonomous-sql-generation",
    index: "01",
    era: "intelligent",
    tier: "principal",
    title: "Autonomous SQL Generation Pipeline",
    subtitle: "Multi-agent orchestration for client data delivery",
    org: "Carelon Global Solutions",
    period: "[Dates]",
    role: "[Your role on the project]",
    summary:
      "A multi-agent workflow that parses mapping documents, generates SQL, validates the output and supports client data delivery.",
    context:
      "Client data requests were delivered through SQL written by hand from mapping documents — a slow, repetitive path. This pipeline automates it end to end: agents analyse and parse the mapping documents, generate the SQL and validate it before it supports client data delivery, with every stage observable.",
    contributions: [
      "Built the multi-agent workflow using LangChain, LangGraph and Agent SDKs.",
      "Automated the path from mapping document analysis to validated SQL.",
      "Added LangSmith monitoring and observability to measure and improve generation accuracy.",
      "[Add specifics: which parts you designed, owned or led.]",
    ],
    howItWorks: [
      { title: "Analyse", body: "Mapping documents are analysed to understand what each client data request needs." },
      { title: "Parse", body: "The documents are parsed into the structured details the SQL depends on." },
      { title: "Generate", body: "Agents generate the SQL, coordinated through LangGraph and Agent SDKs." },
      { title: "Validate", body: "Generated SQL is validated before it is used." },
      { title: "Deliver", body: "Validated output supports client data delivery." },
      { title: "Observe", body: "LangSmith traces the pipeline so generation accuracy can be measured and improved." },
    ],
    results: [
      { value: "15+ hrs", label: "of manual SQL development eliminated per client request", source: "Résumé" },
      { value: "30%", label: "improvement in generation accuracy through monitoring and observability", source: "Résumé" },
    ],
    stack: ["LangChain", "LangGraph", "Agent SDKs", "LangSmith", "SQL"],
    figure: "agents",
    exhibits: ["system"],
    system: {
      title: "SQL generation pipeline",
      note: "Simplified view of the documented stages. Agent boundaries and exact topology to be confirmed.",
      height: 440,
      initial: "generate",
      nodes: [
        { id: "analyse", label: "Mapping analysis", sub: "Stage 1", kind: "input", x: 100, y: 220, detail: "Reads each mapping document to understand what the client's data request requires." },
        { id: "parse", label: "Document parsing", sub: "Stage 2", x: 290, y: 220, detail: "Extracts the structured details the SQL depends on from the mapping documents." },
        { id: "generate", label: "SQL generation", sub: "Stage 3 · Agents", kind: "model", x: 480, y: 220, detail: "Agents turn the parsed requirements into SQL." },
        { id: "validate", label: "Validation", sub: "Stage 4", x: 670, y: 220, detail: "Checks the generated SQL before it is used, so problems are caught before delivery." },
        { id: "deliver", label: "Client delivery", sub: "Stage 5 · Output", kind: "output", x: 860, y: 220, detail: "Validated SQL supports delivery of the client's data." },
        { id: "orchestrate", label: "Agent orchestration", sub: "LangChain · LangGraph · Agent SDKs", kind: "control", x: 480, y: 70, w: 250, detail: "Coordinates the agents and hands work from one stage to the next." },
        { id: "observe", label: "Observability", sub: "LangSmith", kind: "control", x: 480, y: 370, detail: "Traces and monitors each stage so generation accuracy can be measured and improved — credited on the résumé with a 30% accuracy improvement." },
      ],
      edges: [
        { id: "a", from: "analyse", to: "parse" },
        { id: "b", from: "parse", to: "generate" },
        { id: "c", from: "generate", to: "validate" },
        { id: "d", from: "validate", to: "deliver" },
        { id: "o0", from: "orchestrate", to: "analyse", route: "v", kind: "control" },
        { id: "o1", from: "orchestrate", to: "parse", route: "v", kind: "control" },
        { id: "o2", from: "orchestrate", to: "generate", route: "v", kind: "control" },
        { id: "o3", from: "orchestrate", to: "validate", route: "v", kind: "control" },
        { id: "m1", from: "observe", to: "parse", route: "v", kind: "observe" },
        { id: "m2", from: "observe", to: "generate", route: "v", kind: "observe" },
        { id: "m3", from: "observe", to: "validate", route: "v", kind: "observe" },
      ],
      flows: [
        { id: "path", label: "Request path", edges: ["a", "b", "c", "d"], note: "From mapping document analysis to validated SQL and client delivery." },
        { id: "orchestration", label: "Orchestration", edges: ["o0", "o1", "o2", "o3"], note: "LangChain, LangGraph and Agent SDKs coordinate the agents at each stage." },
        { id: "observability", label: "Observability", edges: ["m1", "m2", "m3"], note: "LangSmith traces each stage so accuracy can be measured and improved." },
      ],
    },
    confirm: ["Project dates", "Your exact role and scope", "Project imagery (screenshots or diagrams you can share)"],
  },
  {
    slug: "driver-query-generation",
    index: "02",
    era: "intelligent",
    tier: "principal",
    title: "Intelligent Driver Query Generation",
    subtitle: "Natural-language requirements to SQL with Snowflake Cortex",
    org: "Carelon Global Solutions",
    period: "[Dates]",
    role: "[Your role on the project]",
    summary:
      "Automated SQL generation that turns natural-language requirements into driver queries, using Snowflake Cortex and prompt engineering.",
    context:
      "In healthcare analytics, analysts turn business questions into driver queries — SQL written by hand from a natural-language requirement. This system generates that SQL directly from the requirement, inside Snowflake, using Snowflake Cortex and engineered prompts.",
    contributions: [
      "Built automated SQL generation from natural-language requirements on Snowflake Cortex.",
      "Engineered the prompts that turn a requirement into a driver query.",
      "[Add specifics: evaluation approach, users, rollout.]",
    ],
    howItWorks: [
      { title: "Requirement", body: "An analyst describes the query they need in natural language." },
      { title: "Prompt", body: "Prompt engineering frames the requirement for the model." },
      { title: "Generate", body: "Snowflake Cortex generates the driver query as SQL." },
    ],
    // Two figures reported in different sections of the résumé — keep them
    // attached to their own descriptions.
    results: [
      { value: "95%", label: "accuracy for automated query creation", source: "Résumé — work experience" },
      { value: "60%", label: "reduction in analyst query development time", source: "Résumé — project description" },
    ],
    stack: ["Snowflake Cortex", "Prompt engineering", "SQL"],
    figure: "nl2sql",
    exhibits: ["system"],
    system: {
      title: "Driver query generation",
      note: "Simplified view of the documented components.",
      height: 300,
      initial: "cortex",
      nodes: [
        { id: "req", label: "Requirement", sub: "Natural language", kind: "input", x: 120, y: 150, detail: "What the analyst needs, written in plain language." },
        { id: "prompt", label: "Prompt engineering", sub: "Framing", x: 360, y: 150, detail: "Prompts that turn a requirement into a precise instruction for the model." },
        { id: "cortex", label: "Snowflake Cortex", sub: "LLM in Snowflake", kind: "model", x: 600, y: 150, detail: "Generates the SQL inside Snowflake." },
        { id: "sql", label: "Driver query", sub: "Generated SQL", kind: "output", x: 840, y: 150, detail: "The generated driver query, ready for the analyst." },
      ],
      edges: [
        { id: "a", from: "req", to: "prompt" },
        { id: "b", from: "prompt", to: "cortex" },
        { id: "c", from: "cortex", to: "sql" },
      ],
      flows: [{ id: "path", label: "Generation path", edges: ["a", "b", "c"], note: "From a natural-language requirement to a driver query." }],
    },
    confirm: ["Project dates", "Your exact role and scope", "What 95% accuracy was measured against"],
  },

  // ─── Data systems ───────────────────────────────────────────────
  {
    slug: "healthcare-etl",
    index: "03",
    era: "data",
    tier: "principal",
    title: "Healthcare ETL & Data Orchestration",
    subtitle: "On-premises EHR data to AWS, in production",
    org: "Carelon Global Solutions",
    period: "[Dates]",
    role: "[Your role on the project]",
    summary:
      "Production ETL pipelines moving 10M+ healthcare records a month from on-premises EHR systems to AWS, with validation and quality checks built in.",
    context:
      "Healthcare records held in on-premises EHR systems needed to reach AWS reliably and accurately, every month, at a scale of more than ten million records.",
    contributions: [
      "Built production ETL pipelines from on-premises EHR systems to AWS.",
      "Orchestrated the pipelines with AWS Lambda, Glue, S3 and Python.",
      "Added validation and data quality checks.",
      "[Add specifics: which parts you designed, owned or led.]",
    ],
    howItWorks: [
      { title: "Extract", body: "Records are pulled from on-premises EHR systems." },
      { title: "Orchestrate & transform", body: "AWS Lambda, Glue, S3 and Python move and transform the data." },
      { title: "Validate", body: "Validation and quality checks catch data errors before they propagate." },
    ],
    results: [
      { value: "10M+", label: "healthcare records processed monthly", source: "Résumé" },
      { value: "99.8%", label: "data accuracy", source: "Résumé" },
      { value: "40%", label: "improvement in processing efficiency", source: "Résumé" },
      { value: "45%", label: "fewer data errors through validation and quality checks", source: "Résumé" },
    ],
    stack: ["Python", "AWS Lambda", "AWS Glue", "Amazon S3"],
    figure: "pipeline",
    exhibits: ["system"],
    system: {
      title: "EHR to AWS pipeline",
      note: "Documented components grouped by role. Exact AWS topology to be confirmed.",
      height: 300,
      initial: "etl",
      nodes: [
        { id: "ehr", label: "EHR systems", sub: "On-premises", kind: "input", x: 120, y: 150, detail: "Source healthcare records — more than 10M a month." },
        { id: "etl", label: "ETL orchestration", sub: "Lambda · Glue · S3 · Python", kind: "model", x: 360, y: 150, w: 210, detail: "AWS Lambda, Glue, S3 and Python orchestrate extraction and transformation." },
        { id: "qc", label: "Quality checks", sub: "Validation", x: 600, y: 150, detail: "Validation and quality checks — credited on the résumé with 45% fewer data errors." },
        { id: "aws", label: "AWS", sub: "Cloud destination", kind: "output", x: 840, y: 150, detail: "Validated records land in AWS, at a reported 99.8% data accuracy." },
      ],
      edges: [
        { id: "a", from: "ehr", to: "etl", label: "10M+ / mo" },
        { id: "b", from: "etl", to: "qc" },
        { id: "c", from: "qc", to: "aws", label: "99.8%" },
      ],
      flows: [{ id: "path", label: "Record path", edges: ["a", "b", "c"], note: "From on-premises EHR systems to AWS, validated on the way." }],
    },
    confirm: ["Project dates", "Whether this was under Techno-Comp, Carelon, or both", "Target systems inside AWS"],
  },

  // ─── Physical systems & foundations ─────────────────────────────
  {
    slug: "excavator-prototype-engineering",
    index: "04",
    era: "physical",
    tier: "principal",
    title: "Mechanical Design & Prototype Engineering",
    subtitle: "Excavator prototype, client location in Hiroshima, Japan",
    org: "L&T Technology Services",
    period: "Aug 2018 – Sep 2021",
    role: "Product Design Engineer",
    summary:
      "Product design on an excavator prototype at a client location in Hiroshima, Japan, with engineering test data analysis driving prototype optimisation.",
    context:
      "My first role after my mechanical engineering degree: three years as a Product Design Engineer at L&T Technology Services. The core of it was an excavator prototype — including work at the client's location in Hiroshima, Japan — and analysing engineering test data to optimise that prototype. Alongside it, I built employee dashboards and worked on image detection.",
    contributions: [
      "Worked on an excavator prototype at a client location in Hiroshima, Japan.",
      "Analysed engineering test data for prototype optimisation.",
      "Built employee dashboards and worked on image detection.",
      "[Add specifics: the subsystems or components you designed, and the CAD tools you used.]",
    ],
    howItWorks: [
      { title: "Design", body: "Product design on the excavator prototype." },
      { title: "Test", body: "Engineering test data is collected from the prototype." },
      { title: "Optimise", body: "Analysis of the test data feeds back into the prototype design." },
    ],
    results: [],
    stack: ["Product design", "Prototype engineering", "Test data analysis", "[CAD platform]"],
    figure: "excavator",
    exhibits: ["media", "blueprint", "exploded"],
    /**
     * Ram's real CAD models and engineering assets. Put files in
     * /public/work/mechanical/ and set `src` (plus width/height). Empty
     * slots render as labelled frames, never as stand-in imagery.
     * Only publish material cleared for sharing — client work may be confidential.
     *
     * annotations: [{ x: 0–100, y: 0–100 (percent of the image), label, note }]
     */
    media: {
      primary: {
        src: null,
        width: 1920,
        height: 1080,
        kind: "CAD render",
        alt: "[Describe the model shown]",
        caption: "[Primary CAD render — the model you most want to show]",
        annotations: [],
      },
      views: [
        { src: null, width: 1600, height: 1131, kind: "Drawing", alt: "", caption: "[Engineering drawing — e.g. general arrangement]", annotations: [] },
        { src: null, width: 1600, height: 1000, kind: "Exploded view", alt: "", caption: "[Exploded view of an assembly]", annotations: [] },
        { src: null, width: 1600, height: 1000, kind: "Detail view", alt: "", caption: "[Section or detail view]", annotations: [] },
      ],
      // Same framing in both images — drives the drawing-vs-render slider.
      compare: { drawing: null, render: null, width: 1600, height: 900, caption: "[Part name]" },
      // A .glb export enables the interactive 3D viewer (see README).
      model: null,
    },
    confirm: ["CAD tools used", "Which models and drawings are cleared for public sharing"],
  },
  {
    slug: "hel-mate",
    index: "05",
    era: "physical",
    tier: "foundation",
    title: "Hel-Mate",
    subtitle: "Helmet detection that controls ignition",
    org: "[Context — e.g. academic or personal project]",
    period: "[Year]",
    role: "[Your role]",
    summary:
      "A computer-vision system in Python and OpenCV that detects whether a two-wheeler rider is wearing a helmet and controls the ignition accordingly.",
    context:
      "A safety idea at the meeting point of mechanical and software systems: the vehicle only starts when the rider is wearing a helmet.",
    contributions: ["Built helmet detection with Python and OpenCV.", "[Add specifics: hardware, your part of the build.]"],
    howItWorks: [
      { title: "See", body: "A camera view of the rider is processed with OpenCV." },
      { title: "Detect", body: "Python and OpenCV detect whether a helmet is present." },
      { title: "Act", body: "The result controls the ignition." },
    ],
    results: [],
    stack: ["Python", "OpenCV", "Computer vision"],
    figure: "helmet",
    exhibits: ["system"],
    system: {
      title: "Hel-Mate",
      note: "Descriptive view of how the system works.",
      height: 280,
      initial: "detect",
      nodes: [
        { id: "cam", label: "Camera", sub: "Rider view", kind: "input", x: 120, y: 140, detail: "Image of the rider." },
        { id: "detect", label: "Helmet detection", sub: "Python · OpenCV", kind: "model", x: 360, y: 140, detail: "Computer vision detects whether the rider wears a helmet." },
        { id: "decide", label: "Decision", sub: "Helmet present?", x: 600, y: 140, detail: "Turns the detection into an allow / block decision." },
        { id: "ignition", label: "Ignition control", sub: "Vehicle", kind: "output", x: 840, y: 140, detail: "Ignition is controlled according to the result." },
      ],
      edges: [
        { id: "a", from: "cam", to: "detect" },
        { id: "b", from: "detect", to: "decide" },
        { id: "c", from: "decide", to: "ignition" },
      ],
      flows: [{ id: "path", label: "Detection path", edges: ["a", "b", "c"], note: "From camera to ignition." }],
    },
    confirm: ["Project context and year", "Hardware used", "Photos or demo"],
  },
  {
    slug: "collision-prediction",
    index: "06",
    era: "physical",
    tier: "foundation",
    title: "Traffic Collision Prediction & Assistance",
    subtitle: "Vehicle-to-vehicle communication over DSRC",
    org: "Texas Instruments competition",
    period: "[Year]",
    role: "Team leader",
    summary:
      "A vehicle-to-vehicle communication system using Dedicated Short Range Communication (DSRC) for collision prediction and driver assistance. I led the team in a Texas Instruments competition.",
    context:
      "Vehicles that can talk to each other can anticipate collisions. This project explored that with DSRC, the short-range radio standard designed for vehicle communication.",
    contributions: ["Led the team in a Texas Instruments competition.", "[Add specifics: your technical part of the build, hardware, outcome.]"],
    howItWorks: [
      { title: "Communicate", body: "Vehicles exchange messages over DSRC." },
      { title: "Predict", body: "Shared information is used to predict potential collisions." },
      { title: "Assist", body: "The system provides assistance to the driver." },
    ],
    results: [],
    stack: ["DSRC", "Vehicle-to-vehicle communication", "[Hardware / platform]"],
    figure: "v2v",
    exhibits: ["system"],
    system: {
      title: "V2V collision assistance",
      note: "Descriptive view of how the system works.",
      height: 320,
      initial: "dsrc",
      nodes: [
        { id: "va", label: "Vehicle A", sub: "Transmits & receives", kind: "input", x: 120, y: 80, detail: "One of the communicating vehicles." },
        { id: "vb", label: "Vehicle B", sub: "Transmits & receives", kind: "input", x: 120, y: 240, detail: "Another communicating vehicle." },
        { id: "dsrc", label: "DSRC link", sub: "V2V messages", kind: "control", x: 360, y: 160, detail: "Dedicated Short Range Communication between vehicles." },
        { id: "predict", label: "Collision prediction", sub: "Processing", kind: "model", x: 600, y: 160, detail: "Uses shared vehicle information to predict collisions." },
        { id: "assist", label: "Driver assistance", sub: "Output", kind: "output", x: 840, y: 160, detail: "Assists the driver in response." },
      ],
      edges: [
        { id: "a", from: "va", to: "dsrc" },
        { id: "b", from: "vb", to: "dsrc" },
        { id: "c", from: "dsrc", to: "predict" },
        { id: "d", from: "predict", to: "assist" },
      ],
      flows: [{ id: "path", label: "Assistance path", edges: ["a", "b", "c", "d"], note: "From vehicle messages to driver assistance." }],
    },
    confirm: ["Competition name, year and result", "Your technical contribution"],
  },
];

export const eras = {
  intelligent: { label: "Intelligent systems", code: "AI" },
  data: { label: "Data systems", code: "DE" },
  physical: { label: "Physical systems & foundations", code: "ME" },
};

export function getProject(slug) {
  return projects.find((project) => project.slug === slug);
}

export function getAdjacentProjects(slug) {
  const i = projects.findIndex((project) => project.slug === slug);
  return {
    previous: projects[(i - 1 + projects.length) % projects.length],
    next: projects[(i + 1) % projects.length],
  };
}
