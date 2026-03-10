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
  ArrowLeft,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { toast } from "sonner";
import Link from "next/link";
import { executeCode, getProblemById } from "@/modules/problems/actions";

const LANGUAGE_MAP = {
  JAVASCRIPT: "javascript",
  PYTHON: "python",
  JAVA: "java",
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
  const [testResults, setTestResults] = useState(null);
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
    if (problem?.codeSnippets[selectedLanguage]) {
      setCode(problem.codeSnippets[selectedLanguage]);
    }
  }, [selectedLanguage, problem]);

  const handleRun = async () => {
    try {
      setIsRunning(true);
      setTestResults(null);

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

      if (res.success) {
        setTestResults(res.submission.testCases);
        const allPassed = res.submission.testCases.every((tc) => tc.passed);
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
          {/* Left — Problem Description */}
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

                {/* Example */}
                {problem.examples[selectedLanguage] && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Example:</h3>
                    <div className="bg-muted p-4 rounded-lg space-y-2">
                      <div>
                        <span className="font-medium text-amber-400">
                          Input:{" "}
                        </span>
                        <code className="text-sm bg-zinc-200 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-200 px-2 py-1 rounded">
                          {problem.examples[selectedLanguage].input}
                        </code>
                      </div>
                      <div>
                        <span className="font-medium text-amber-400">
                          Output:{" "}
                        </span>
                        <code className="text-sm bg-zinc-200 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-200 px-2 py-1 rounded">
                          {problem.examples[selectedLanguage].output}
                        </code>
                      </div>
                      {problem.examples[selectedLanguage].explanation && (
                        <div>
                          <span className="font-medium">Explanation: </span>
                          <span className="text-sm">
                            {problem.examples[selectedLanguage].explanation}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Constraints */}
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
          </div>

          {/* Right — Editor + Test Cases */}
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
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="JAVASCRIPT">JavaScript</SelectItem>
                      <SelectItem value="PYTHON">Python</SelectItem>
                      <SelectItem value="JAVA">Java</SelectItem>
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
                    disabled={isRunning}
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

            {/* Test Results */}
            {testResults && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {testResults.map((tc) => (
                    <div
                      key={tc.testCase}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        tc.passed
                          ? "bg-green-50 border-green-200 dark:bg-green-950/20"
                          : "bg-red-50 border-red-200 dark:bg-red-950/20"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {tc.passed ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span className="text-sm font-medium">
                          Test Case {tc.testCase}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground space-x-4">
                        <span>
                          Expected: <code>{tc.expected}</code>
                        </span>
                        <span>
                          Got: <code>{tc.stdout ?? tc.stderr ?? "—"}</code>
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemIdPage;
