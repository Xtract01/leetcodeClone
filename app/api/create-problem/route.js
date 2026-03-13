import { currentUserRole, getCurrentUser } from "@/modules/auth/actions";
import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { submitBatch } from "@/lib/codeExec";
import { db } from "@/lib/db";

export async function POST(request) {
  try {
    const userRole = await currentUserRole();
    const user = await getCurrentUser();

    if (!user || userRole !== UserRole.ADMIN) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 },
      );
    }

    const body = await request.json();

    const {
      title,
      description,
      difficulty,
      tags,
      examples,
      constraints,
      testCases,
      codeSnippets,
      referenceSolutions,
    } = body;

    // basic validation
    if (
      !title ||
      !description ||
      !difficulty ||
      !testCases ||
      !codeSnippets ||
      !referenceSolutions
    ) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 },
      );
    }

    if (!Array.isArray(testCases) || testCases.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Test cases must be a non-empty array of { input, output } objects",
        },
        { status: 400 },
      );
    }

    // Validate ALL languages against ALL test cases
    for (const [lang, solution] of Object.entries(referenceSolutions)) {
      const submission = {
        language: lang.toLowerCase(),
        source_code: Buffer.from(solution).toString("base64"),
        tasks: testCases.map((tc) => ({
          stdin: Buffer.from(tc.input).toString("base64"),
        })),
      };

      // submitBatch returns array of arrays: results[submissionIndex][taskIndex]
      const results = await submitBatch([submission]);
      const taskResults = results[0]; // first (only) submission → array of task results

      if (!taskResults || !Array.isArray(taskResults)) {
        return NextResponse.json(
          {
            success: false,
            message: `Invalid response from execution API for ${lang}`,
          },
          { status: 500 },
        );
      }

      for (let i = 0; i < taskResults.length; i++) {
        const expected = testCases[i].output.trim();
        const output = (taskResults[i]?.output ?? "").trim();

        console.log(
          `[${lang}] Test ${i + 1} — expected: "${expected}", received: "${output}"`,
        );

        if (output !== expected) {
          return NextResponse.json(
            {
              success: false,
              message: `Reference solution failed for ${lang} on test case ${i + 1}`,
              expected,
              received: output,
            },
            { status: 400 },
          );
        }
      }
    }

    // save problem
    const newProblem = await db.problem.create({
      data: {
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        testCases,
        codeSnippets,
        referenceSolutions,
        userId: user.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Problem created successfully",
      problem: newProblem,
    });
  } catch (error) {
    console.error("Create Problem Error:", error);
    return NextResponse.json(
      { success: false, message: "Error occurred while processing request" },
      { status: 500 },
    );
  }
}
