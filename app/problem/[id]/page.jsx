"use client";
import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Editor from "@monaco-editor/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Play,
  Send,
  Code,
  FileText,
  Lightbulb,
  Trophy,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { toast } from "sonner";
import Link from "next/link";
import {
  executeCode,
  getAllSubmissionByCurrentUserForProblem,
  getProblemById,
} from "@/modules/problems/actions";
import { SubmissionDetails } from "@/modules/problems/components/submission-details";
import { TestCaseTable } from "@/modules/problems/components/test-case-table";
import { SubmissionHistory } from "@/modules/problems/components/submission-history";

// ✅ Added CPP
const LANGUAGE_MAP = {
  JAVASCRIPT: "javascript",
  PYTHON: "python",
  JAVA: "java",
  CPP: "cpp",
};

const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case "EASY":
      return "bg-green-100 text-green-800 border-green-200";
    case "MEDIUM":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "HARD":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const ProblemIdPage = ({ params }) => {
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("JAVASCRIPT");
  const [code, setCode] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionHistory, setSubmissionHistory] = useState([]);
  const [executionResponse, setExecutionResponse] = useState(null);
  const [runMode, setRunMode] = useState(null); // "run" | "submit"
  const { theme } = useTheme();

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const resolvedParams = await params;
        const result = await getProblemById(resolvedParams.id);
        if (result.success) {
          setProblem(result.data);
          setCode(result.data.codeSnippets[selectedLanguage] || "");
        }
      } catch (error) {
        console.error("Error fetching problem:", error);
      }
    };
    fetchProblem();
  }, [params]);

  useEffect(() => {
    const fetchSubmissionHistory = async () => {
      try {
        const resolvedParams = await params;
        const result = await getAllSubmissionByCurrentUserForProblem(
          resolvedParams.id,
        );
        if (result.success) setSubmissionHistory(result.data);
      } catch (error) {
        console.error("Error fetching submissions:", error);
      }
    };
    fetchSubmissionHistory();
  }, [params]);

  useEffect(() => {
    if (problem?.codeSnippets[selectedLanguage]) {
      setCode(problem.codeSnippets[selectedLanguage]);
    } else if (problem) {
      // ✅ fallback if CPP snippet not defined on older problems
      setCode("// Write your C++ solution here");
    }
  }, [selectedLanguage, problem]);

  const handleRun = async () => {
    try {
      setIsRunning(true);
      setRunMode("run");
      setExecutionResponse(null);

      const language = LANGUAGE_MAP[selectedLanguage];
      const stdin = problem.testCases.map((tc) => tc.input);
      const expected_outputs = problem.testCases.map((tc) => tc.output);

      const res = await executeCode(
        code,
        language,
        stdin,
        expected_outputs,
        problem.id,
      );

      setExecutionResponse(res);

      if (res.success) {
        const allPassed = res.submission?.testCases?.every((tc) => tc.passed);
        allPassed
          ? toast.success("All test cases passed!")
          : toast.error("Some test cases failed.");
      } else {
        toast.error(res.error || "Execution failed");
      }
    } catch (error) {
      console.error("Error running code:", error);
      toast.error(error.message || "Execution failed");
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setRunMode("submit");
      setExecutionResponse(null);

      const language = LANGUAGE_MAP[selectedLanguage];
      const stdin = problem.testCases.map((tc) => tc.input);
      const expected_outputs = problem.testCases.map((tc) => tc.output);

      const res = await executeCode(
        code,
        language,
        stdin,
        expected_outputs,
        problem.id,
      );

      setExecutionResponse(res);

      if (res.success) {
        const allPassed = res.submission?.testCases?.every((tc) => tc.passed);
        if (allPassed) {
          toast.success("Accepted! All test cases passed.");
          const resolvedParams = await params;
          const history = await getAllSubmissionByCurrentUserForProblem(
            resolvedParams.id,
          );
          if (history.success) setSubmissionHistory(history.data);
        } else {
          toast.error("Wrong Answer. Some test cases failed.");
        }
      } else {
        toast.error(res.error || "Submission failed");
      }
    } catch (error) {
      console.error("Error submitting:", error);
      toast.error(error.message || "Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!problem) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin size-5 text-amber-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <Link href="/problems">
                <Button variant="outline" size="icon">
                  <ArrowLeft className="size-4" />
                </Button>
              </Link>
              <h1 className="text-3xl font-bold">{problem.title}</h1>
              <Badge
                className={cn(
                  "font-medium",
                  getDifficultyColor(problem.difficulty),
                )}
              >
                {problem.difficulty}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              {problem.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-sm">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <ModeToggle />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left — Problem + Tabs */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Problem Description
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-foreground leading-relaxed">
                  {problem.description}
                </p>

                {/* ✅ fallback to JAVASCRIPT example if CPP not defined */}
                {(problem.examples[selectedLanguage] ||
                  problem.examples["JAVASCRIPT"]) && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Example:</h3>
                    <div className="bg-muted p-4 rounded-lg space-y-2">
                      <div>
                        <span className="font-medium text-amber-400">
                          Input:{" "}
                        </span>
                        <code className="text-sm bg-zinc-200 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-200 px-2 py-1 rounded">
                          {
                            (
                              problem.examples[selectedLanguage] ||
                              problem.examples["JAVASCRIPT"]
                            ).input
                          }
                        </code>
                      </div>
                      <div>
                        <span className="font-medium text-amber-400">
                          Output:{" "}
                        </span>
                        <code className="text-sm bg-zinc-200 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-200 px-2 py-1 rounded">
                          {
                            (
                              problem.examples[selectedLanguage] ||
                              problem.examples["JAVASCRIPT"]
                            ).output
                          }
                        </code>
                      </div>
                      {(
                        problem.examples[selectedLanguage] ||
                        problem.examples["JAVASCRIPT"]
                      ).explanation && (
                        <div>
                          <span className="font-medium">Explanation: </span>
                          <span className="text-sm">
                            {
                              (
                                problem.examples[selectedLanguage] ||
                                problem.examples["JAVASCRIPT"]
                              ).explanation
                            }
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold text-lg mb-3">Constraints:</h3>
                  <div className="bg-muted p-4 rounded-lg">
                    <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {problem.constraints}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Card>
              <CardContent className="p-3">
                <Tabs defaultValue="submissions" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger
                      value="submissions"
                      className="flex items-center gap-2"
                    >
                      <Trophy className="h-4 w-4" />
                      Submissions
                    </TabsTrigger>
                    <TabsTrigger
                      value="editorial"
                      className="flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      Editorial
                    </TabsTrigger>
                    <TabsTrigger
                      value="hints"
                      className="flex items-center gap-2"
                    >
                      <Lightbulb className="h-4 w-4" />
                      Hints
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="submissions" className="p-2">
                    <SubmissionHistory submissions={submissionHistory} />
                  </TabsContent>
                  <TabsContent value="editorial" className="p-6">
                    <div className="text-center py-8 text-muted-foreground">
                      {problem.editorial ?? "Editorial not available yet."}
                    </div>
                  </TabsContent>
                  <TabsContent value="hints" className="p-6">
                    <div className="text-center py-8 text-muted-foreground">
                      {problem.hints ?? "No hints available for this problem."}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right — Editor + Test Cases + Results */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Code Editor
                  </CardTitle>
                  <Select
                    value={selectedLanguage}
                    onValueChange={setSelectedLanguage}
                  >
                    <SelectTrigger className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="JAVASCRIPT">JavaScript</SelectItem>
                      <SelectItem value="PYTHON">Python</SelectItem>
                      <SelectItem value="JAVA">Java</SelectItem>
                      <SelectItem value="CPP">C++</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <Editor
                    height="400px"
                    language={LANGUAGE_MAP[selectedLanguage]}
                    value={code}
                    onChange={(value) => setCode(value || "")}
                    theme={theme === "dark" ? "vs-dark" : "light"}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 16,
                      lineNumbers: "on",
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      tabSize: 2,
                      wordWrap: "on",
                    }}
                  />
                </div>
                <div className="flex gap-3 mt-4">
                  <Button
                    onClick={handleRun}
                    disabled={isRunning || isSubmitting}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    {isRunning ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                    {isRunning ? "Running..." : "Run"}
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting || isRunning}
                    className="flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Test Cases */}
            <Card>
              <CardHeader>
                <CardTitle>Test Cases</CardTitle>
                <CardDescription>
                  Run your code against these test cases
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-48">
                  <div className="space-y-3">
                    {problem.testCases.map((testCase, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="text-sm font-medium mb-2">
                          Test Case {index + 1}
                        </div>
                        <div className="space-y-1 text-sm">
                          <div>
                            <span className="text-muted-foreground">
                              Input:{" "}
                            </span>
                            <code className="bg-muted px-2 py-1 rounded text-xs">
                              {testCase.input}
                            </code>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Expected:{" "}
                            </span>
                            <code className="bg-muted px-2 py-1 rounded text-xs">
                              {testCase.output}
                            </code>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Execution Results */}
            {executionResponse?.submission && (
              <div className="space-y-4">
                {runMode === "run" ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Run Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <TestCaseTable
                        testCases={executionResponse.submission.testCases}
                      />
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    <SubmissionDetails
                      submission={executionResponse.submission}
                    />
                    <TestCaseTable
                      testCases={executionResponse.submission.testCases}
                    />
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemIdPage;
