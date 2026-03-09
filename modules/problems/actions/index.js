"use server";

import { db } from "@/lib/db";
import { submitBatch } from "@/lib/codeExec";
import { currentUser } from "@clerk/nextjs/server";
import { UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";

// ─── Helpers ────────────────────────────────────────────────────────────────

function getLanguageName(languageKey) {
  const map = {
    javascript: "JavaScript",
    js: "JavaScript",
    python: "Python",
    py: "Python",
    java: "Java",
    c: "C",
    cpp: "C++",
  };
  return map[languageKey?.toLowerCase()] ?? languageKey ?? "Unknown";
}

async function getDbUser(clerkId) {
  if (!clerkId) throw new Error("Unauthorized");
  const dbUser = await db.user.findUnique({ where: { clerkId } });
  if (!dbUser) throw new Error("User not found");
  return dbUser;
}

// ─── Problem Actions ─────────────────────────────────────────────────────────

export const getAllProblems = async () => {
  try {
    const user = await currentUser();
    const dbUser = await db.user.findUnique({
      where: { clerkId: user?.id },
      select: { id: true },
    });

    const problems = await db.problem.findMany({
      include: {
        solvedBy: {
          where: { userId: dbUser?.id },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: problems };
  } catch (error) {
    console.error("❌ Error fetching problems:", error);
    return { success: false, error: "Failed to fetch problems" };
  }
};

export const getProblemById = async (id) => {
  try {
    const problem = await db.problem.findUnique({ where: { id } });
    return { success: true, data: problem };
  } catch (error) {
    console.error("❌ Error fetching problem:", error);
    return { success: false, error: "Failed to fetch problem" };
  }
};

export const deleteProblem = async (problemId) => {
  try {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");

    const dbUser = await db.user.findUnique({
      where: { clerkId: user.id },
      select: { role: true },
    });

    if (dbUser?.role !== UserRole.ADMIN) {
      throw new Error("Only admins can delete problems");
    }

    await db.problem.delete({ where: { id: problemId } });
    revalidatePath("/problems");

    return { success: true, message: "Problem deleted successfully" };
  } catch (error) {
    console.error("Error deleting problem:", error);
    return {
      success: false,
      error: error.message || "Failed to delete problem",
    };
  }
};

// ─── Execute Code ─────────────────────────────────────────────────────────────

export const executeCode = async (
  source_code,
  language,
  stdin,
  expected_outputs,
  problemId,
) => {
  try {
    const user = await currentUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const dbUser = await getDbUser(user.id);

    if (
      !Array.isArray(stdin) ||
      stdin.length === 0 ||
      !Array.isArray(expected_outputs) ||
      expected_outputs.length !== stdin.length
    ) {
      return { success: false, error: "Invalid test cases" };
    }

    // Build submission in codeExec format
    const submission = {
      language: language.toLowerCase(),
      source_code: Buffer.from(source_code).toString("base64"),
      tasks: stdin.map((input) => ({
        stdin: Buffer.from(input).toString("base64"),
      })),
    };

    const results = await submitBatch([submission]);

    let allPassed = true;

    const detailedResults = results.map((result, i) => {
      const stdout = result.output?.trim() ?? null; // JDoodle returns "output"
      const expected = expected_outputs[i]?.trim();
      const passed = stdout === expected;

      if (!passed) allPassed = false;

      return {
        testCase: i + 1,
        passed,
        stdout,
        expected,
        stderr: result.error && result.error !== "0" ? result.error : null,
        status: passed ? "Accepted" : "Wrong Answer",
        memory: result.memory ? `${result.memory} KB` : null,
        time: result.cpuTime ? `${result.cpuTime} s` : null,
      };
    });

    // Save submission
    const savedSubmission = await db.submission.create({
      data: {
        userId: dbUser.id,
        problemId,
        sourceCode: source_code,
        language: getLanguageName(language),
        stdin: stdin.join("\n"),
        stdout: JSON.stringify(detailedResults.map((r) => r.stdout)),
        stderr: detailedResults.some((r) => r.stderr)
          ? JSON.stringify(detailedResults.map((r) => r.stderr))
          : null,
        compileOutput: null, // JDoodle doesn't separate compile output
        status: allPassed ? "Accepted" : "Wrong Answer",
        memory: detailedResults.some((r) => r.memory)
          ? JSON.stringify(detailedResults.map((r) => r.memory))
          : null,
        time: detailedResults.some((r) => r.time)
          ? JSON.stringify(detailedResults.map((r) => r.time))
          : null,
      },
    });

    // Mark problem as solved if all passed
    if (allPassed) {
      await db.problemSolved.upsert({
        where: {
          userId_problemId: { userId: dbUser.id, problemId },
        },
        update: {},
        create: { userId: dbUser.id, problemId },
      });
    }

    // Save per-test-case results
    const testCaseResults = detailedResults.map((result) => ({
      submissionId: savedSubmission.id,
      testCase: result.testCase,
      passed: result.passed,
      stdout: result.stdout,
      expected: result.expected,
      stderr: result.stderr,
      compileOutput: null,
      status: result.status,
      memory: result.memory,
      time: result.time,
    }));

    await db.testCaseResult.createMany({ data: testCaseResults });

    const submissionWithTestCases = await db.submission.findUnique({
      where: { id: savedSubmission.id },
      include: { testCases: true },
    });

    return { success: true, submission: submissionWithTestCases };
  } catch (error) {
    console.error("❌ executeCode error:", error);
    return { success: false, error: error.message || "Execution failed" };
  }
};

// ─── Submission History ───────────────────────────────────────────────────────

export const getAllSubmissionByCurrentUserForProblem = async (problemId) => {
  try {
    const user = await currentUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const dbUser = await getDbUser(user.id);

    const submissions = await db.submission.findMany({
      where: { problemId, userId: dbUser.id },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: submissions };
  } catch (error) {
    console.error("❌ Error fetching submissions:", error);
    return { success: false, error: "Failed to fetch submissions" };
  }
};
