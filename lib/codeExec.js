const LANGUAGE_MAP = {
  python: { language: "python3", versionIndex: "4" },
  javascript: { language: "nodejs", versionIndex: "4" },
  java: { language: "java", versionIndex: "4" },
  cpp: { language: "cpp17", versionIndex: "1" }, // ✅ CPP support
};

const DELAY_MS = 500;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function submitBatch(submissions) {
  const results = [];

  for (let i = 0; i < submissions.length; i++) {
    const { language, source_code, tasks } = submissions[i];

    const langConfig = LANGUAGE_MAP[language];
    if (!langConfig) {
      results.push({ output: "", error: `Unsupported language: ${language}` });
      continue;
    }

    const taskResults = [];

    for (let j = 0; j < tasks.length; j++) {
      const { stdin } = tasks[j];

      try {
        const response = await fetch("https://api.jdoodle.com/v1/execute", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clientId: process.env.JDOODLE_CLIENT_ID,
            clientSecret: process.env.JDOODLE_CLIENT_SECRET,
            script: Buffer.from(source_code, "base64").toString("utf-8"),
            stdin: Buffer.from(stdin, "base64")
              .toString("utf-8")
              .replace(/\\n/g, "\n"),
            language: langConfig.language,
            versionIndex: langConfig.versionIndex,
          }),
        });

        const result = await response.json();

        taskResults.push({
          output: result.output ?? "",
          error: result.error ?? null,
          cpuTime: result.cpuTime ?? null,
          memory: result.memory ?? null,
        });
      } catch (error) {
        taskResults.push({
          output: "",
          error: error.message || "Execution failed",
          cpuTime: null,
          memory: null,
        });
      }

      if (j < tasks.length - 1) await sleep(DELAY_MS);
    }

    results.push(taskResults);
    if (i < submissions.length - 1) await sleep(DELAY_MS);
  }

  return results;
}
