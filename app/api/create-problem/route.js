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

    // prepare execution tasks
    const submissions = [];
    for (const [lang, solutionCode] of Object.entries(referenceSolutions)) {
      submissions.push({
        language: lang.toLowerCase(),
        source_code: Buffer.from(solutionCode).toString("base64"),
        tasks: testCases.map((tc) => ({
          stdin: Buffer.from(tc.input).toString("base64"),
        })),
      });
    }

    // run reference solutions
    const results = await submitBatch(submissions);

    if (!results || !Array.isArray(results)) {
      return NextResponse.json(
        { success: false, message: "Invalid response from execution API" },
        { status: 500 },
      );
    }

    // validate outputs — results are flat: [lang0_task0, lang0_task1, lang1_task0, ...]
    const numTestCases = testCases.length;
    for (const [index, result] of results.entries()) {
      const testCaseIndex = index % numTestCases;
      const expected = testCases[testCaseIndex].output.trim();
      const output = (result.output || "").trim(); // ✅ JDoodle returns "output", not "stdout"

      console.log(
        `Result ${index} — expected: "${expected}", received: "${output}"`,
      );

      if (output !== expected) {
        return NextResponse.json(
          {
            success: false,
            message: "Reference solution failed test cases",
            expected,
            received: output,
          },
          { status: 400 },
        );
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
