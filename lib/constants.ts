type DashboardSection = {
  title: string;
  description: string;
};

type SkillSummary = {
  slug: string;
  name: string;
  summary: string;
  category: string;
  uploaderName: string;
  uploaderEmail: string;
  latestVersion: string;
  versionCount: number;
};

export const APP_NAME = "skill-share";

export const DASHBOARD_SECTIONS: DashboardSection[] = [
  {
    title: "Browse all skills",
    description: "Search, sort, and filter patterns are represented in the starter UI.",
  },
  {
    title: "Upload markdown files",
    description: "The next phase will turn markdown uploads into versioned skill records.",
  },
  {
    title: "Restrict access to Cars users",
    description: "Auth is intentionally deferred, but the product shape is documented now.",
  },
];

export const SAMPLE_SKILLS: SkillSummary[] = [
  {
    slug: "sales-handshake-prompts",
    name: "Sales Handshake Prompts",
    summary:
      "Templates for follow-up emails, objection handling, and lead qualification prompts.",
    category: "Product",
    uploaderName: "Aarav Sharma",
    uploaderEmail: "aarav@cars24.com",
    latestVersion: "1.3.0",
    versionCount: 4,
  },
  {
    slug: "frontend-bug-triage",
    name: "Frontend Bug Triage",
    summary:
      "A coding skill for reducing noisy bug reports into reproducible engineering tickets.",
    category: "Development",
    uploaderName: "Meera Patel",
    uploaderEmail: "meera@cars24.com",
    latestVersion: "0.9.1",
    versionCount: 2,
  },
  {
    slug: "support-summary-writer",
    name: "Support Summary Writer",
    summary:
      "Summarizes long support threads into concise internal notes and customer-facing replies.",
    category: "Operations",
    uploaderName: "Kabir Rao",
    uploaderEmail: "kabir@cars24.com",
    latestVersion: "2.1.0",
    versionCount: 7,
  },
];
