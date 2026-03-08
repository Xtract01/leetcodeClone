import axios from "axios";

const BASE64 = "base64";
const DELAY_MS = 500;

const LANGUAGE_MAP = {
  python: { language: "python3", versionIndex: "4" },
  py: { language: "python3", versionIndex: "4" },
  javascript: { language: "nodejs", versionIndex: "4" },
  js: { language: "nodejs", versionIndex: "4" },
  java: { language: "java", versionIndex: "4" },
  c: { language: "c", versionIndex: "5" },
  cpp: { language: "cpp17", versionIndex: "0" },
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function getCodeExecLanguageId(language) {
  if (!language || typeof language !== "string") return null;
  return LANGUAGE_MAP[language.toLowerCase()] ?? null;
}

export async function submitBatch(submissions) {
  if (!Array.isArray(submissions) || submissions.length === 0) return [];

  const results = [];

  for (const submission of submissions) {
    const langConfig = getCodeExecLanguageId(submission.language);
    if (!langConfig) {
      throw new Error(`Unsupported language: "${submission.language}"`);
    }

    const sourceCode = Buffer.from(submission.source_code, BASE64).toString();

    for (const [taskIndex, task] of submission.tasks.entries()) {
      const stdin = task.stdin
        ? Buffer.from(task.stdin, BASE64).toString()
        : "";

      try {
        const response = await axios.post(
          "https://api.jdoodle.com/v1/execute", // ✅ direct JDoodle, not RapidAPI
          {
            clientId: process.env.JDOODLE_CLIENT_ID, // ✅ replaces x-rapidapi-key
            clientSecret: process.env.JDOODLE_CLIENT_SECRET, // ✅ new field
            script: sourceCode, // ✅ back to "script"
            stdin, // ✅ back to "stdin"
            language: langConfig.language,
            versionIndex: langConfig.versionIndex,
          },
        );

        results.push(response.data);
      } catch (error) {
        const detail = error.response?.data ?? error.message;
        throw new Error(
          `Execution failed for language "${submission.language}", task index ${taskIndex}: ${JSON.stringify(detail)}`,
        );
      }

      await sleep(DELAY_MS);
    }
  }

  return results;
}
