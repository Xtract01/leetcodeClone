import Link from "next/link";
import {
  Code2,
  Layers,
  Database,
  ShieldCheck,
  Zap,
  BookMarked,
  Github,
  Globe,
  Terminal,
  Lock,
} from "lucide-react";

const techStack = [
  {
    icon: Layers,
    name: "Next.js 14",
    description: "App Router, Server Components, Server Actions",
  },
  {
    icon: Database,
    name: "PostgreSQL + Prisma",
    description: "Type-safe ORM with relational data modeling",
  },
  {
    icon: ShieldCheck,
    name: "Clerk",
    description: "Authentication, user management & role-based access",
  },
  {
    icon: Terminal,
    name: "JDoodle API",
    description: "Remote code execution across multiple languages",
  },
  {
    icon: Zap,
    name: "Tailwind CSS + shadcn/ui",
    description: "Utility-first styling with accessible components",
  },
  {
    icon: Lock,
    name: "Neon DB",
    description: "Serverless PostgreSQL with connection pooling and branching",
  },
];

const features = [
  {
    icon: Code2,
    title: "Code & Submit",
    description:
      "Write solutions in Python, JavaScript, Java, or C++ directly in the browser and get instant feedback.",
  },
  {
    icon: BookMarked,
    title: "Playlists",
    description:
      "Organize problems into custom playlists to structure your learning path.",
  },
  {
    icon: ShieldCheck,
    title: "Admin Controls",
    description:
      "Admins can create and manage problems with test cases, hints, and reference solutions.",
  },
  {
    icon: Globe,
    title: "Submission History",
    description:
      "Track every submission with detailed test case results, memory, and runtime.",
  },
];

const creator = {
  name: "Anirudh Singh",
  role: "Full Stack Developer",
  bio: "Built this platform as a full-stack project to practice competitive programming tooling, system design, and modern web development.",
  github: "https://github.com/Xtract01",
  website: "https://github.com/Xtract01",
};

const AboutPage = () => {
  return (
    <div className="pt-28 pb-20 px-4">
      <div className="max-w-4xl mx-auto space-y-24">
        {/* Hero */}
        <section className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-amber-500 uppercase border border-amber-200 dark:border-amber-800 rounded-full px-4 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Open Source Project
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
            About <span className="text-amber-400">LeetCode</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A full-stack coding practice platform built with modern web
            technologies. Solve problems, track progress, and organize your
            study with playlists.
          </p>
        </section>

        {/* Divider */}
        <div className="border-t border-dashed border-border" />

        {/* Features */}
        <section className="space-y-10">
          <div className="space-y-2">
            <p className="text-xs font-mono tracking-widest text-muted-foreground uppercase">
              What it does
            </p>
            <h2 className="text-3xl font-bold tracking-tight">Features</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="group p-6 rounded-2xl border border-border hover:border-amber-300 dark:hover:border-amber-700 transition-colors duration-200 bg-card"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/50 shrink-0 group-hover:bg-amber-100 dark:group-hover:bg-amber-900/50 transition-colors">
                      <Icon className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{f.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {f.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-dashed border-border" />

        {/* Tech Stack */}
        <section className="space-y-10">
          <div className="space-y-2">
            <p className="text-xs font-mono tracking-widest text-muted-foreground uppercase">
              Built with
            </p>
            <h2 className="text-3xl font-bold tracking-tight">Tech Stack</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {techStack.map((tech) => {
              const Icon = tech.icon;
              return (
                <div
                  key={tech.name}
                  className="p-5 rounded-2xl border border-border bg-card hover:bg-muted/50 transition-colors duration-200"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="font-semibold text-sm">{tech.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {tech.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-dashed border-border" />

        {/* Creator */}
        <section className="space-y-10">
          <div className="space-y-2">
            <p className="text-xs font-mono tracking-widest text-muted-foreground uppercase">
              The team
            </p>
            <h2 className="text-3xl font-bold tracking-tight">Creator</h2>
          </div>
          <div className="p-8 rounded-2xl border border-border bg-card max-w-lg">
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold">{creator.name}</h3>
                <p className="text-sm text-amber-500 font-mono">
                  {creator.role}
                </p>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {creator.bio}
              </p>
              <div className="flex items-center gap-3 pt-2">
                <a
                  href={creator.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </a>
                <span className="text-border">·</span>
                <a
                  href={creator.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  Website
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center space-y-6 py-8">
          <h2 className="text-2xl font-bold">Ready to practice?</h2>
          <Link
            href="/problems"
            className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-200"
          >
            <Code2 className="w-4 h-4" />
            Browse Problems
          </Link>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
