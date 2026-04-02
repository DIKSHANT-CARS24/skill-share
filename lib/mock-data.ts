import type {
  Category,
  ReviewedItem,
  ReviewItem,
  Skill,
  SkillSort,
  Uploader,
} from "@/lib/types";

export const APP_NAME = "Skill Share";

export const categories: Category[] = [
  {
    id: "design",
    name: "Design",
    description: "Design systems, UI reviews, and design-to-content workflows.",
  },
  {
    id: "development",
    name: "Development",
    description: "Debugging, code generation, QA, and technical triage workflows.",
  },
  {
    id: "product",
    name: "Product",
    description: "Planning, hiring, enablement, and launch decision support.",
  },
  {
    id: "finance",
    name: "Finance",
    description: "Reporting, review prep, and compliance support templates.",
  },
  {
    id: "operations",
    name: "Operations",
    description: "Process design, support operations, and workflow automation prompts.",
  },
];

export const uploaders: Uploader[] = [
  {
    id: "priya-shah",
    name: "Priya Shah",
    email: "priya.shah@cars24.com",
    initials: "PS",
    role: "Senior Program Manager",
    team: "Operations Excellence",
  },
  {
    id: "arjun-menon",
    name: "Arjun Menon",
    email: "arjun.menon@cars24.com",
    initials: "AM",
    role: "Staff Engineer",
    team: "Platform Engineering",
  },
  {
    id: "neha-kapoor",
    name: "Neha Kapoor",
    email: "neha.kapoor@cars24.com",
    initials: "NK",
    role: "Support Lead",
    team: "Customer Experience",
  },
  {
    id: "rahul-verma",
    name: "Rahul Verma",
    email: "rahul.verma@cars24.com",
    initials: "RV",
    role: "Finance Operations Manager",
    team: "Finance Systems",
  },
];

export const skills: Skill[] = [
  {
    id: "incident-triage-brief",
    title: "Incident Triage Brief",
    summary:
      "Turns noisy bug reports into a reproducible engineering brief with severity, owner, and next action.",
    description:
      "Best for first-response support engineers and platform leads who need a structured incident summary quickly.",
    categoryId: "development",
    uploaderId: "arjun-menon",
    status: "approved",
    latestVersion: "2.4.1",
    versionCount: 6,
    updatedAt: "2026-03-28",
    createdAt: "2025-11-16",
    usageLast30Days: 324,
    saves: 81,
    downloads: 129,
    tags: ["bugs", "incident", "triage", "handoff"],
    reviewNote: "Approved for org-wide use. Works best with links to logs and screenshots.",
    markdownBlocks: [
      { type: "heading", level: 2, content: "Purpose" },
      {
        type: "paragraph",
        content:
          "Create a concise triage brief from issue context, logs, console output, and a user impact summary.",
      },
      { type: "heading", level: 2, content: "Inputs" },
      {
        type: "list",
        items: [
          "Customer complaint or internal QA report",
          "Observed behavior and expected behavior",
          "Relevant console, API, or worker logs",
        ],
      },
      { type: "heading", level: 2, content: "Output format" },
      {
        type: "quote",
        content:
          "Return severity, affected surface, repro steps, suspected cause, owner recommendation, and a one-line executive summary.",
      },
      {
        type: "code",
        language: "md",
        content:
          "## Severity\nP1\n\n## Repro Steps\n1. Open listing dashboard\n2. Apply date filter\n3. Trigger export",
      },
    ],
    versionHistory: [
      {
        version: "2.4.1",
        publishedAt: "2026-03-28",
        status: "approved",
        summary: "Refined severity rubric and added owner recommendation section.",
      },
      {
        version: "2.3.0",
        publishedAt: "2026-02-19",
        status: "approved",
        summary: "Improved log summarization for long stack traces.",
      },
      {
        version: "2.0.0",
        publishedAt: "2025-12-08",
        status: "approved",
        summary: "Initial stable version after incident management review.",
      },
    ],
  },
  {
    id: "customer-thread-summarizer",
    title: "Customer Thread Summarizer",
    summary:
      "Condenses long support threads into a customer-safe summary and an internal resolution note.",
    description:
      "Useful for handoffs, leadership escalations, and post-resolution documentation in support ops.",
    categoryId: "operations",
    uploaderId: "neha-kapoor",
    status: "approved",
    latestVersion: "1.9.0",
    versionCount: 5,
    updatedAt: "2026-03-25",
    createdAt: "2025-10-02",
    usageLast30Days: 286,
    saves: 74,
    downloads: 97,
    tags: ["support", "summary", "handoff"],
    reviewNote: "Approved with customer-safe phrasing guidelines.",
    markdownBlocks: [
      { type: "heading", level: 2, content: "When to use" },
      {
        type: "paragraph",
        content:
          "Use after a complex support exchange when another agent, team lead, or specialist needs quick context.",
      },
      {
        type: "list",
        items: [
          "Summarize issue history in under 120 words",
          "Separate internal notes from customer-facing language",
          "Call out open risks and next contact date",
        ],
      },
      {
        type: "code",
        language: "md",
        content:
          "## Customer Summary\n...\n\n## Internal Notes\n...\n\n## Next Steps\n...",
      },
    ],
    versionHistory: [
      {
        version: "1.9.0",
        publishedAt: "2026-03-25",
        status: "approved",
        summary: "Added clearer separation between customer and internal sections.",
      },
      {
        version: "1.7.2",
        publishedAt: "2026-01-13",
        status: "approved",
        summary: "Tuned prompt for multilingual conversations.",
      },
      {
        version: "1.4.0",
        publishedAt: "2025-11-20",
        status: "approved",
        summary: "Added escalation tags and sentiment capture.",
      },
    ],
  },
  {
    id: "launch-readiness-check",
    title: "Launch Readiness Check",
    summary:
      "Reviews release notes, dependencies, owners, and rollback plans before a feature launch.",
    description:
      "Built for PMs and release managers who need consistent readiness checks across teams.",
    categoryId: "product",
    uploaderId: "priya-shah",
    status: "approved",
    latestVersion: "3.1.0",
    versionCount: 8,
    updatedAt: "2026-03-23",
    createdAt: "2025-09-18",
    usageLast30Days: 198,
    saves: 68,
    downloads: 89,
    tags: ["launch", "readiness", "risk"],
    reviewNote: "Approved. Includes required rollback checkpoint language.",
    markdownBlocks: [
      { type: "heading", level: 2, content: "Checklist areas" },
      {
        type: "list",
        items: [
          "Scope and customer impact",
          "Dependencies, QA evidence, and known risks",
          "Rollback owner and support communication plan",
        ],
      },
      {
        type: "paragraph",
        content:
          "The output is designed to be scanned in a weekly launch review without needing the full feature spec.",
      },
    ],
    versionHistory: [
      {
        version: "3.1.0",
        publishedAt: "2026-03-23",
        status: "approved",
        summary: "Added compliance and support readiness prompts.",
      },
      {
        version: "3.0.0",
        publishedAt: "2026-02-08",
        status: "approved",
        summary: "Refined structure for release review meetings.",
      },
      {
        version: "2.7.1",
        publishedAt: "2025-12-14",
        status: "approved",
        summary: "Improved risk wording for non-technical stakeholders.",
      },
    ],
  },
  {
    id: "hiring-scorecard-writer",
    title: "Hiring Scorecard Writer",
    summary:
      "Transforms interviewer notes into a balanced scorecard with evidence, concerns, and recommendation.",
    description:
      "Helps recruiting teams standardize interviewer feedback and reduce vague pass/fail decisions.",
    categoryId: "product",
    uploaderId: "priya-shah",
    status: "approved",
    latestVersion: "1.5.3",
    versionCount: 4,
    updatedAt: "2026-03-19",
    createdAt: "2025-12-02",
    usageLast30Days: 152,
    saves: 46,
    downloads: 63,
    tags: ["hiring", "interviews", "scorecard"],
    reviewNote: "Approved with mandatory evidence-based recommendation language.",
    markdownBlocks: [
      { type: "heading", level: 2, content: "Evaluation categories" },
      {
        type: "list",
        items: [
          "Role fit and depth of expertise",
          "Communication and collaboration",
          "Signals, concerns, and final recommendation",
        ],
      },
      {
        type: "quote",
        content:
          "Avoid personality judgments. Every recommendation must cite interview evidence.",
      },
    ],
    versionHistory: [
      {
        version: "1.5.3",
        publishedAt: "2026-03-19",
        status: "approved",
        summary: "Clarified bar-raiser recommendation wording.",
      },
      {
        version: "1.3.0",
        publishedAt: "2026-01-22",
        status: "approved",
        summary: "Added calibration notes for final interview rounds.",
      },
      {
        version: "1.0.0",
        publishedAt: "2025-12-02",
        status: "approved",
        summary: "First version published for product and hiring teams.",
      },
    ],
  },
  {
    id: "variance-analysis-draft",
    title: "Variance Analysis Draft",
    summary:
      "Builds a monthly finance narrative around plan vs actual movement, anomalies, and follow-ups.",
    description:
      "Useful for finance operations teams preparing close reviews or executive reporting decks.",
    categoryId: "finance",
    uploaderId: "rahul-verma",
    status: "approved",
    latestVersion: "2.0.2",
    versionCount: 5,
    updatedAt: "2026-03-18",
    createdAt: "2025-08-21",
    usageLast30Days: 133,
    saves: 31,
    downloads: 51,
    tags: ["finance", "analysis", "reporting"],
    reviewNote: "Approved for internal finance use only.",
    markdownBlocks: [
      { type: "heading", level: 2, content: "Expected inputs" },
      {
        type: "list",
        items: [
          "Business unit actuals and plan",
          "Known operational drivers",
          "One-off events and corrective actions",
        ],
      },
      {
        type: "code",
        language: "md",
        content:
          "## What moved\n...\n\n## Why it moved\n...\n\n## What needs action next month\n...",
      },
    ],
    versionHistory: [
      {
        version: "2.0.2",
        publishedAt: "2026-03-18",
        status: "approved",
        summary: "Improved wording around one-time adjustments.",
      },
      {
        version: "2.0.0",
        publishedAt: "2026-02-03",
        status: "approved",
        summary: "Expanded template for BU-level reporting.",
      },
      {
        version: "1.6.0",
        publishedAt: "2025-11-30",
        status: "approved",
        summary: "Added executive summary mode.",
      },
    ],
  },
  {
    id: "qa-regression-scan",
    title: "QA Regression Scan",
    summary:
      "Converts exploratory testing notes into a prioritized regression report with release risk framing.",
    description:
      "Helps QA and product teams communicate release confidence in a standard format.",
    categoryId: "development",
    uploaderId: "arjun-menon",
    status: "in-review",
    latestVersion: "0.8.0",
    versionCount: 2,
    updatedAt: "2026-03-16",
    createdAt: "2026-02-28",
    usageLast30Days: 89,
    saves: 16,
    downloads: 20,
    tags: ["qa", "release", "regression"],
    reviewNote: "Pending admin review for phrasing consistency and risk labels.",
    markdownBlocks: [
      { type: "heading", level: 2, content: "Report sections" },
      {
        type: "list",
        items: [
          "Validated scope",
          "Potential regressions by severity",
          "Recommendation to ship, hold, or narrow rollout",
        ],
      },
      {
        type: "paragraph",
        content:
          "This draft is tuned for release review meetings and still needs moderation before broad rollout.",
      },
    ],
    versionHistory: [
      {
        version: "0.8.0",
        publishedAt: "2026-03-16",
        status: "in-review",
        summary: "Submitted for moderation with updated severity guidance.",
      },
      {
        version: "0.5.1",
        publishedAt: "2026-03-05",
        status: "draft",
        summary: "Internal pilot draft shared with QA leads.",
      },
    ],
  },
  {
    id: "escalation-root-cause-note",
    title: "Escalation Root Cause Note",
    summary:
      "Produces a plain-language incident note for leaders after a critical customer escalation.",
    description:
      "Designed for cross-functional stakeholders who need cause, impact, and action without deep technical detail.",
    categoryId: "operations",
    uploaderId: "neha-kapoor",
    status: "approved",
    latestVersion: "1.2.4",
    versionCount: 3,
    updatedAt: "2026-03-12",
    createdAt: "2025-12-12",
    usageLast30Days: 104,
    saves: 22,
    downloads: 41,
    tags: ["escalation", "incident", "leadership"],
    reviewNote: "Approved with incident comms wording guardrails.",
    markdownBlocks: [
      { type: "heading", level: 2, content: "Audience" },
      {
        type: "paragraph",
        content:
          "Use this when business leaders need a clear root-cause note without raw logs or engineering terminology.",
      },
      {
        type: "list",
        items: [
          "Impact summary",
          "Underlying cause",
          "Immediate mitigation",
          "Longer-term prevention",
        ],
      },
    ],
    versionHistory: [
      {
        version: "1.2.4",
        publishedAt: "2026-03-12",
        status: "approved",
        summary: "Tightened executive summary structure and tone.",
      },
      {
        version: "1.0.0",
        publishedAt: "2025-12-12",
        status: "approved",
        summary: "Initial approved release for escalation teams.",
      },
    ],
  },
  {
    id: "vendor-risk-brief",
    title: "Vendor Risk Brief",
    summary:
      "Summarizes vendor due diligence material into a quick recommendation for finance and procurement reviewers.",
    description:
      "A serious internal template for compliance-heavy reviews and procurement handoffs.",
    categoryId: "finance",
    uploaderId: "rahul-verma",
    status: "needs-changes",
    latestVersion: "0.6.2",
    versionCount: 2,
    updatedAt: "2026-03-10",
    createdAt: "2026-02-21",
    usageLast30Days: 41,
    saves: 9,
    downloads: 13,
    tags: ["risk", "vendor", "procurement"],
    reviewNote: "Needs changes before approval. Add sourcing disclaimer and approved output format.",
    markdownBlocks: [
      { type: "heading", level: 2, content: "Required sections" },
      {
        type: "list",
        items: [
          "Vendor overview and contract exposure",
          "Security, legal, and process concerns",
          "Recommendation and required follow-up",
        ],
      },
      {
        type: "quote",
        content:
          "Do not issue legal conclusions. Escalate unresolved legal concerns to Procurement Ops.",
      },
    ],
    versionHistory: [
      {
        version: "0.6.2",
        publishedAt: "2026-03-10",
        status: "needs-changes",
        summary: "Moderation requested stronger disclaimer and approval scope.",
      },
      {
        version: "0.4.0",
        publishedAt: "2026-02-21",
        status: "draft",
        summary: "Initial vendor diligence pilot draft.",
      },
    ],
  },
  {
    id: "new-manager-1-1-planner",
    title: "New Manager 1:1 Planner",
    summary:
      "Creates a practical first-month conversation plan for new people managers with agenda prompts and follow-up actions.",
    description:
      "Supports onboarding for first-time managers who need a structured, repeatable 1:1 format.",
    categoryId: "product",
    uploaderId: "priya-shah",
    status: "approved",
    latestVersion: "1.1.1",
    versionCount: 2,
    updatedAt: "2026-03-07",
    createdAt: "2026-01-18",
    usageLast30Days: 78,
    saves: 19,
    downloads: 27,
    tags: ["manager", "onboarding", "people"],
    reviewNote: "Approved for internal leadership enablement.",
    markdownBlocks: [
      { type: "heading", level: 2, content: "Outputs" },
      {
        type: "list",
        items: [
          "Week-by-week agenda",
          "Trust-building prompts",
          "Action items and follow-up checkpoints",
        ],
      },
      {
        type: "paragraph",
        content:
          "The tone is practical and structured so new managers can use it with minimal editing.",
      },
    ],
    versionHistory: [
      {
        version: "1.1.1",
        publishedAt: "2026-03-07",
        status: "approved",
        summary: "Simplified first-month agenda for smaller teams.",
      },
      {
        version: "1.0.0",
        publishedAt: "2026-01-18",
        status: "approved",
        summary: "Initial manager onboarding template.",
      },
    ],
  },
  {
    id: "refund-case-optimizer",
    title: "Refund Case Optimizer",
    summary:
      "Guides support agents through refund-case analysis with clear policy framing and escalation language.",
    description:
      "Built to reduce inconsistent case handling and improve speed on policy-sensitive support requests.",
    categoryId: "operations",
    uploaderId: "neha-kapoor",
    status: "approved",
    latestVersion: "2.2.0",
    versionCount: 4,
    updatedAt: "2026-03-04",
    createdAt: "2025-09-09",
    usageLast30Days: 231,
    saves: 55,
    downloads: 86,
    tags: ["refund", "policy", "support"],
    reviewNote: "Approved after policy team review.",
    markdownBlocks: [
      { type: "heading", level: 2, content: "Use case" },
      {
        type: "paragraph",
        content:
          "Use for policy-sensitive refund requests where the agent needs both a rationale and clear next-step language.",
      },
      {
        type: "code",
        language: "md",
        content:
          "## Case Summary\n...\n\n## Policy Check\n...\n\n## Recommended Reply\n...",
      },
    ],
    versionHistory: [
      {
        version: "2.2.0",
        publishedAt: "2026-03-04",
        status: "approved",
        summary: "Added stronger policy exception handling guidance.",
      },
      {
        version: "2.0.0",
        publishedAt: "2026-01-10",
        status: "approved",
        summary: "Refreshed output structure for quality audits.",
      },
      {
        version: "1.5.0",
        publishedAt: "2025-10-30",
        status: "approved",
        summary: "Initial broad rollout to support operations.",
      },
    ],
  },
];

export const reviewQueue: ReviewItem[] = [
  {
    id: "review-qa-regression-scan",
    skillId: "qa-regression-scan",
    priority: "High",
    requestedBy: "Arjun Menon",
    requestedAt: "2026-03-16",
    reason: "Needs moderation before release review teams can adopt it.",
    currentStep: "Tone and severity labels under review",
  },
  {
    id: "review-vendor-risk-brief",
    skillId: "vendor-risk-brief",
    priority: "High",
    requestedBy: "Rahul Verma",
    requestedAt: "2026-03-10",
    reason: "Missing disclaimer and approved decision language.",
    currentStep: "Awaiting uploader revision",
  },
  {
    id: "review-refund-case-optimizer",
    skillId: "refund-case-optimizer",
    priority: "Medium",
    requestedBy: "Neha Kapoor",
    requestedAt: "2026-03-04",
    reason: "Quarterly policy validation requested by support ops.",
    currentStep: "Ready for compliance sign-off",
  },
];

export const sortOptions: Array<{ value: SkillSort; label: string }> = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "title-asc", label: "Title A-Z" },
  { value: "uploader-asc", label: "Uploader A-Z" },
];

export const reviewedItems: ReviewedItem[] = [
  {
    id: "reviewed-incident-triage-brief",
    skillId: "incident-triage-brief",
    reviewedBy: "Aisha Patel",
    reviewedAt: "2026-03-28",
    decision: "approved",
    note: "Approved after adding a clearer owner recommendation section.",
  },
  {
    id: "reviewed-escalation-root-cause-note",
    skillId: "escalation-root-cause-note",
    reviewedBy: "Aisha Patel",
    reviewedAt: "2026-03-22",
    decision: "approved",
    note: "Approved after confirming the leadership summary stayed plain-language and factual.",
  },
  {
    id: "reviewed-launch-readiness-check",
    skillId: "launch-readiness-check",
    reviewedBy: "Marcus Lee",
    reviewedAt: "2026-03-21",
    decision: "approved",
    note: "Ready for broad rollout with the updated rollback checklist wording.",
  },
];

export const previewLinks = [
  { href: "/login", label: "Login", description: "Mocked SSO entry and access messaging." },
  { href: "/skills", label: "Skills catalog", description: "Search, filters, sorting, and skill cards." },
  { href: "/skills/incident-triage-brief", label: "Skill detail", description: "Markdown preview, metadata, and version history." },
  { href: "/upload", label: "Upload", description: "Mocked upload flow with a preview-first review layout." },
  { href: "/admin", label: "Admin", description: "Moderation queue, review metrics, and reviewer actions." },
  { href: "/profile", label: "Profile", description: "Contributor profile, recent uploads, and status snapshots." },
  { href: "/states/empty", label: "Empty state", description: "No skills published yet for a workspace or filter set." },
  { href: "/states/loading", label: "Loading state", description: "Skeleton layout for catalog loading." },
  { href: "/states/error", label: "Error state", description: "System message, retry CTA, and fallback guidance." },
  {
    href: "/states/no-search-results",
    label: "No search results",
    description: "Search-specific empty state with query recovery suggestions.",
  },
];

export function getCategoryById(id: string) {
  return categories.find((category) => category.id === id);
}

export function getUploaderById(id: string) {
  return uploaders.find((uploader) => uploader.id === id);
}

export function getSkillById(id: string) {
  return skills.find((skill) => skill.id === id);
}

export function getRelatedSkills(currentId: string) {
  return skills.filter((skill) => skill.id !== currentId).slice(0, 3);
}
