import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Editor from "@monaco-editor/react";
import axiosClient from "../utils/axiosClient";
import ChatAi from "../components/ChatAi";

const problemConstraints = {
  "sum of Two Numbers": ["-10^3 <= a, b <= 10^3", "Both inputs are integers."],
  "sort an array": ["1 <= nums.length <= 5 * 10^4", "-5 * 10^4 <= nums[i] <= 5 * 10^4"],
  "Maximum Subarray Sum": ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
  "Two Sum": ["2 <= nums.length <= 10^4", "-10^9 <= nums[i], target <= 10^9"],
  "Remove Duplicates from Sorted Array": ["1 <= nums.length <= 3 * 10^4", "-100 <= nums[i] <= 100; nums is sorted."],
  "Rotate Array": ["1 <= nums.length <= 10^5", "-2^31 <= nums[i] <= 2^31 - 1; 0 <= k <= 10^5"],
  "Reverse Linked List": ["0 <= number of nodes <= 5 * 10^3", "-5 * 10^3 <= Node.val <= 5 * 10^3"],
  "Merge Two Sorted Lists": ["0 <= list lengths <= 50", "-100 <= Node.val <= 100; both lists are sorted."],
  "Best Time to Buy and Sell Stock": ["1 <= prices.length <= 10^5", "0 <= prices[i] <= 10^4"],
  "Move Zeroes": ["1 <= nums.length <= 10^4", "-2^31 <= nums[i] <= 2^31 - 1"],
  "Find Middle of Linked List": ["1 <= number of nodes <= 100", "1 <= Node.val <= 100"],
  "Detect Cycle in Linked List": ["0 <= number of nodes <= 10^4", "pos is -1 or a valid zero-based node index."],
  "Climbing Stairs": ["1 <= n <= 45", "Each move climbs exactly 1 or 2 steps."],
  "Palindrome Linked List": ["1 <= number of nodes <= 10^5", "0 <= Node.val <= 9"],
  "Remove Linked List Elements": ["0 <= number of nodes <= 10^4", "1 <= Node.val, x <= 50"],
  "Clone Graph": ["0 <= number of nodes <= 100", "Node values are unique integers from 1 to 100."],
  "Longest Common Subsequence": ["1 <= text1.length, text2.length <= 1000", "Both strings contain lowercase English letters."],
  "Middle of the Linked List": ["1 <= number of nodes <= 100", "1 <= Node.val <= 100"],
  "Binary Tree Level Order Traversal": ["0 <= number of nodes <= 10^4", "-1000 <= Node.val <= 1000; -1 denotes a missing node."],
  "Course Schedule": ["1 <= numCourses <= 2000", "0 <= prerequisites.length <= 5000"],
  "Unique Paths": ["1 <= m, n <= 100", "The answer is at most 2 * 10^9."],
  "Coin Change": ["1 <= coins.length <= 12; 1 <= coin <= 2^31 - 1", "0 <= amount <= 10^4"],
  "Longest Increasing Subsequence": ["1 <= nums.length <= 2500", "-10^4 <= nums[i] <= 10^4"],
  "Shortest Path in an Unweighted Graph": ["1 <= vertices <= 10^5; 0 <= edges <= 2 * 10^5", "Vertices are numbered from 0 to vertices - 1."],
  "House Robber": ["1 <= nums.length <= 100", "0 <= nums[i] <= 400"],
  "Minimum Cost Climbing Stairs": ["2 <= cost.length <= 1000", "0 <= cost[i] <= 999"],
};

const ProblemPage = () => {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  // =========================================================
  // STATES
  // =========================================================

  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] =
    useState("javascript");
  const [code, setCode] = useState("");

  const [loading, setLoading] = useState(false);

  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);

  const [activeLeftTab, setActiveLeftTab] =
    useState("description");

  // Submission history
  const [submissions, setSubmissions] = useState([]);
  const [submissionsLoading, setSubmissionsLoading] =
    useState(false);
  const [selectedSubmission, setSelectedSubmission] =
    useState(null);

  // Console height
  const [consoleHeight, setConsoleHeight] =
    useState(230);

  const editorRef = useRef(null);

  // =========================================================
  // FETCH PROBLEM
  // =========================================================

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const { data } = await axiosClient.get(
          `/problem/problemById/${problemId}`
        );

        console.log("Problem Data:", data);

        setProblem(data);

        const savedEditor = JSON.parse(sessionStorage.getItem("codebyte-editor") || "null");
        if (savedEditor?.problemId === problemId) {
          setSelectedLanguage(savedEditor.language);
          setCode(savedEditor.code);
          sessionStorage.removeItem("codebyte-editor");
          return;
        }

        // Default JavaScript code
        const javascriptCode =
          data.startCode?.find(
            (item) =>
              item.language === "javascript"
          );

        if (javascriptCode) {
          setCode(javascriptCode.initialCode);
        } else if (data.startCode?.length > 0) {
          setSelectedLanguage(
            data.startCode[0].language
          );

          setCode(
            data.startCode[0].initialCode
          );
        }
      } catch (error) {
        console.error(
          "Error fetching problem:",
          error
        );
      }
    };

    fetchProblem();
  }, [problemId]);

  // =========================================================
  // FETCH SUBMISSIONS
  // =========================================================

  const fetchSubmissions = async () => {
    try {
      setSubmissionsLoading(true);

      const { data } = await axiosClient.get(
        `/problem/sumittedProblem/${problemId}`
      );

      if (Array.isArray(data)) {
        const sortedSubmissions = [...data].sort(
          (a, b) =>
            new Date(b.createdAt) -
            new Date(a.createdAt)
        );

        setSubmissions(sortedSubmissions);
      } else {
        setSubmissions([]);
      }
    } catch (error) {
      console.error(
        "Error fetching submissions:",
        error
      );

      setSubmissions([]);
    } finally {
      setSubmissionsLoading(false);
    }
  };

  useEffect(() => {
    if (problemId && isAuthenticated) {
      fetchSubmissions();
    }
  }, [problemId, isAuthenticated]);

  // =========================================================
  // EDITOR MOUNT
  // =========================================================

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  // =========================================================
  // LANGUAGE CHANGE
  // =========================================================

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);

    const selectedCode =
      problem?.startCode?.find(
        (item) => item.language === language
      );

    setCode(
      selectedCode?.initialCode || ""
    );

    // Clear previous results
    setRunResult(null);
    setSubmitResult(null);
  };

  // =========================================================
  // MONACO LANGUAGE
  // =========================================================

  const getLanguageForMonaco = (lang) => {
    switch (lang) {
      case "javascript":
        return "javascript";

      case "java":
        return "java";

      case "c++":
        return "cpp";

      default:
        return "javascript";
    }
  };

  // =========================================================
  // NORMALIZE OUTPUT
  // =========================================================

  const normalizeOutput = (value) => {
    if (
      value === null ||
      value === undefined
    ) {
      return "";
    }

    return String(value)
      .replace(/\r\n/g, "\n")
      .trim();
  };

  // =========================================================
  // GET OUTPUT FROM JUDGE0 RESULT
  // =========================================================

  const getOutput = (result) => {
    if (!result) {
      return "";
    }

    if (result.stdout !== undefined) {
      return result.stdout;
    }

    if (result.output !== undefined) {
      return result.output;
    }

    return "";
  };

  // =========================================================
  // GET ERROR FROM JUDGE0 RESULT
  // =========================================================

  const getError = (result) => {
    if (!result) {
      return "";
    }

    if (result.stderr) {
      return result.stderr;
    }

    if (result.compile_output) {
      return result.compile_output;
    }

    return "";
  };

  // =========================================================
  // CHECK TEST CASE
  // =========================================================

  const checkTestCase = (
    result,
    testCase
  ) => {
    const error = getError(result);

    if (error) {
      return false;
    }

    const actual = normalizeOutput(
      getOutput(result)
    );

    const expected = normalizeOutput(
      testCase?.output
    );

    return actual === expected;
  };

  // =========================================================
  // RUN CODE
  // =========================================================

  const handleRun = async () => {
    if (!isAuthenticated) {
      sessionStorage.setItem("codebyte-editor", JSON.stringify({ problemId, code, language: selectedLanguage }));
      navigate("/login", { state: { from: `/problem/${problemId}` } });
      return;
    }
    setLoading(true);

    // Clear old result
    setRunResult(null);
    setSubmitResult(null);

    try {
      const response =
        await axiosClient.post(
          `/submission/run/${problemId}`,
          {
            code: code,
            language: selectedLanguage,
          }
        );

      console.log(
        "Run Result:",
        response.data
      );

      setRunResult(response.data);
    } catch (error) {
      console.error(
        "Error running code:",
        error
      );

      setRunResult({
        success: false,
        error:
          error.response?.data?.message ||
          "Internal server error",
      });
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // SUBMIT CODE
  // =========================================================

  const handleSubmitCode = async () => {
    if (!isAuthenticated) {
      sessionStorage.setItem("codebyte-editor", JSON.stringify({ problemId, code, language: selectedLanguage }));
      navigate("/login", { state: { from: `/problem/${problemId}` } });
      return;
    }
    setLoading(true);

    // Clear old result
    setSubmitResult(null);
    setRunResult(null);

    try {
      const response =
        await axiosClient.post(
          `/submission/submit/${problemId}`,
          {
            code: code,
            language: selectedLanguage,
          }
        );

      console.log(
        "Submit Result:",
        response.data
      );

      setSubmitResult(response.data);

      // Refresh submission history
      await fetchSubmissions();
    } catch (error) {
      console.error(
        "Error submitting code:",
        error
      );

      setSubmitResult({
        success: false,
        error:
          error.response?.data?.message ||
          "Internal server error",
      });
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // RESIZE CONSOLE
  // =========================================================

  const handleMouseMove = (e) => {
    const newHeight =
      window.innerHeight - e.clientY;

    if (
      newHeight >= 120 &&
      newHeight <= 500
    ) {
      setConsoleHeight(newHeight);
    }
  };

  const stopResize = () => {
    document.removeEventListener(
      "mousemove",
      handleMouseMove
    );

    document.removeEventListener(
      "mouseup",
      stopResize
    );
  };

  const startResize = () => {
    document.addEventListener(
      "mousemove",
      handleMouseMove
    );

    document.addEventListener(
      "mouseup",
      stopResize
    );
  };

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleString();
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (!problem) {
    return (
      <div className="h-screen bg-[#090d0b] text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="h-screen w-full bg-[#090d0b] text-white flex flex-col overflow-hidden">

      {/* =====================================================
          MAIN AREA
      ===================================================== */}

      <div className="flex flex-1 min-h-0">

        {/* ===================================================
            LEFT SIDE
        =================================================== */}

        <div className="w-[45%] border-r border-slate-800 flex flex-col min-h-0 bg-[#0b100d]">

          {/* =================================================
              LEFT NAVIGATION
          ================================================= */}

          <div className="h-14 border-b border-slate-800 flex items-center flex-shrink-0 overflow-x-auto">

            <button
              onClick={() =>
                setActiveLeftTab(
                  "description"
                )
              }
              className={`px-6 h-full text-sm ${
                activeLeftTab ===
                "description"
                  ? "text-[#c8ff3d] border-b-2 border-[#c8ff3d]"
                  : "text-gray-500 hover:text-white"
              }`}
            >
              Description
            </button>

            <button
              onClick={() =>
                setActiveLeftTab(
                  "editorial"
                )
              }
              className={`px-6 h-full text-sm ${
                activeLeftTab ===
                "editorial"
                  ? "text-[#c8ff3d] border-b-2 border-[#c8ff3d]"
                  : "text-gray-500 hover:text-white"
              }`}
            >
              Editorial
            </button>

            <button
              onClick={() =>
                setActiveLeftTab(
                  "solutions"
                )
              }
              className={`px-6 h-full text-sm ${
                activeLeftTab ===
                "solutions"
                  ? "text-[#c8ff3d] border-b-2 border-[#c8ff3d]"
                  : "text-gray-500 hover:text-white"
              }`}
            >
              Solutions
            </button>

            <button
              onClick={() =>
                setActiveLeftTab(
                  "submissions"
                )
              }
              className={`px-6 h-full text-sm ${
                activeLeftTab ===
                "submissions"
                  ? "text-[#c8ff3d] border-b-2 border-[#c8ff3d]"
                  : "text-gray-500 hover:text-white"
              }`}
            >
              Submissions
            </button>

            <button
  onClick={() => {
    if (!isAuthenticated) {
      navigate("/login", {
        state: { from: `/problem/${problemId}` }
      });
      return;
    }

    setActiveLeftTab("ChatAI");
  }}
  className={`px-6 h-full text-sm ${
    activeLeftTab === "ChatAI"
      ? "text-[#c8ff3d] border-b-2 border-[#c8ff3d]"
      : "text-gray-500 hover:text-white"
  }`}
>
  ChatAI
</button>

          </div>

          {/* =================================================
              LEFT CONTENT
          ================================================= */}

          <div className="flex-1 overflow-y-auto">

            {/* =================================================
                DESCRIPTION
            ================================================= */}

            {activeLeftTab === "description" && (
  <div className="p-7">

    {/* TITLE */}

    <div className="flex items-center gap-3 mb-6 flex-wrap">

      <h1 className="text-3xl font-bold">
        {problem.title}
      </h1>

      {/* DIFFICULTY */}

      <span
        className={`px-3 py-1 rounded-full text-sm font-semibold ${
          problem.difficulty === "easy"
            ? "bg-green-500/20 text-green-400"
            : problem.difficulty === "medium"
            ? "bg-yellow-500/20 text-yellow-400"
            : "bg-red-500/20 text-red-400"
        }`}
      >
        {problem.difficulty?.charAt(0).toUpperCase() +
          problem.difficulty?.slice(1)}
      </span>

      {/* TAG */}

      {problem.tags && (
        <span className="px-3 py-1 rounded-full bg-lime-300/10 text-[#c8ff3d] text-sm">
          {problem.tags}
        </span>
      )}

    </div>

    {/* =====================================================
        PROBLEM DESCRIPTION
    ===================================================== */}

    <div className="text-gray-300 leading-7 mb-8 whitespace-pre-wrap">
      {problem.description}
    </div>

    {/* =====================================================
        EXAMPLES
    ===================================================== */}

    {problem.visibleTestCases?.length > 0 && (
      <>
        <h2 className="text-xl font-semibold mb-5">
          Examples:
        </h2>

        <div className="space-y-5">

          {problem.visibleTestCases.map(
            (testCase, index) => (
              <div
                key={index}
                className="bg-[#111610] border border-slate-800 rounded-xl p-5 shadow-sm"
              >

                <h3 className="font-semibold mb-4">
                  Example {index + 1}:
                </h3>

                <div className="space-y-3 text-gray-300">

                  <p>
                    <span className="text-white font-semibold">
                      Input:
                    </span>{" "}
                    {testCase.input}
                  </p>

                  <p>
                    <span className="text-white font-semibold">
                      Output:
                    </span>{" "}
                    {testCase.output}
                  </p>

                  {testCase.explanation && (
                    <p>
                      <span className="text-white font-semibold">
                        Explanation:
                      </span>{" "}
                      {testCase.explanation}
                    </p>
                  )}

                </div>

              </div>
            )
          )}

        </div>
      </>
    )}

    {/* =====================================================
        CONSTRAINTS
    ===================================================== */}

    <div className="mt-8">

      <h2 className="text-xl font-semibold mb-4">
        Constraints:
      </h2>

      <ul className="list-disc ml-6 text-gray-300 space-y-2">
        {(problemConstraints[problem.title] || ["Use valid input values for this problem."]).map((constraint) => <li key={constraint}>{constraint}</li>)}
      </ul>

    </div>

  </div>
)}
            {/* =================================================
                EDITORIAL
            ================================================= */}

            {activeLeftTab ===
              "editorial" && (
              <div className="p-7">

                <h1 className="text-2xl font-bold mb-5">
                  Editorial
                </h1>

                {/* Intentionally empty */}

              </div>
            )}

            {/* =================================================
                SOLUTIONS
            ================================================= */}

            {activeLeftTab ===
              "solutions" && (
              <div className="p-7">

                <h1 className="text-2xl font-bold mb-6">
                  Solutions
                </h1>

                {problem.referenceSolution
                  ?.length > 0 ? (

                  <div className="space-y-6">

                    {problem.referenceSolution.map(
                      (solution, index) => (

                        <div
                          key={index}
                          className="border border-slate-800 rounded-xl overflow-hidden bg-[#111610]"
                        >

                          {/* LANGUAGE HEADER */}

                          <div className="px-5 py-3 bg-[#171c16] border-b border-slate-800 flex items-center justify-between">

                            <span className="font-semibold">

                              {solution.language ===
                              "javascript"
                                ? "JavaScript"
                                : solution.language ===
                                  "java"
                                ? "Java"
                                : solution.language ===
                                  "c++"
                                ? "C++"
                                : solution.language}

                            </span>

                          </div>

                          {/* SOLUTION CODE */}

                          <div className="bg-[#0b100d]">

                            <pre className="p-5 overflow-x-auto text-sm text-gray-300 leading-6 whitespace-pre-wrap">

                              <code>
                                {
                                  solution.completeCode
                                }
                              </code>

                            </pre>

                          </div>

                        </div>

                      )
                    )}

                  </div>

                ) : (

                  <p className="text-gray-500">
                    No solution available.
                  </p>

                )}

              </div>
            )}

            {/* =================================================
                SUBMISSIONS
            ================================================= */}

            {activeLeftTab ===
              "submissions" && (
              <div className="p-7">

                {!selectedSubmission ? (

                  <>
                    <div className="flex items-center justify-between mb-5">

                      <h1 className="text-2xl font-bold">
                        Submissions
                      </h1>

                      <button
                        onClick={
                          fetchSubmissions
                        }
                        className="text-xs text-gray-500 hover:text-white"
                      >
                        Refresh
                      </button>

                    </div>

                    {submissionsLoading ? (

                      <p className="text-gray-500">
                        Loading submissions...
                      </p>

                    ) : submissions.length ===
                      0 ? (

                      <p className="text-gray-500">
                        No submissions yet.
                      </p>

                    ) : (

                      <div className="space-y-3">

                        {submissions.map(
                          (
                            submission,
                            index
                          ) => (

                            <button
                              key={
                                submission._id ||
                                index
                              }
                              onClick={() =>
                                setSelectedSubmission(
                                  submission
                                )
                              }
                              className="w-full text-left border border-slate-800 rounded-xl bg-[#111610] p-4 hover:border-lime-300/25 hover:bg-[#171c16] transition"
                            >

                              <div className="flex items-center justify-between">

                                <span
                                  className={`font-semibold capitalize ${
                                    submission.status ===
                                    "accepted"
                                      ? "text-green-400"
                                      : submission.status ===
                                        "wrong"
                                      ? "text-red-400"
                                      : "text-orange-400"
                                  }`}
                                >
                                  {
                                    submission.status
                                  }
                                </span>

                                <span className="text-xs text-gray-600">
                                  {formatDate(
                                    submission.createdAt
                                  )}
                                </span>

                              </div>

                              <div className="flex gap-6 mt-3 text-xs text-gray-500">

                                <span>
                                  Language:{" "}
                                  <span className="text-gray-300">
                                    {
                                      submission.language
                                    }
                                  </span>
                                </span>

                                <span>
                                  Tests:{" "}
                                  <span className="text-gray-300">
                                    {
                                      submission.testCasesPassed
                                    }
                                    /
                                    {
                                      submission.testCasesTotal
                                    }
                                  </span>
                                </span>

                              </div>

                            </button>

                          )
                        )}

                      </div>

                    )}

                  </>

                ) : (

                  <>
                    {/* BACK */}

                    <button
                      onClick={() =>
                        setSelectedSubmission(
                          null
                        )
                      }
                      className="text-xs text-gray-500 hover:text-white mb-6"
                    >
                      ← Back to submissions
                    </button>

                    {/* HEADER */}

                    <div className="flex items-center justify-between mb-5">

                      <div>

                        <h1 className="text-2xl font-bold">
                          Submission
                        </h1>

                        <p className="text-xs text-gray-600 mt-1">
                          {formatDate(
                            selectedSubmission.createdAt
                          )}
                        </p>

                      </div>

                      <span
                        className={`font-semibold capitalize ${
                          selectedSubmission.status ===
                          "accepted"
                            ? "text-green-400"
                            : selectedSubmission.status ===
                              "wrong"
                            ? "text-red-400"
                            : "text-orange-400"
                        }`}
                      >
                        {
                          selectedSubmission.status
                        }
                      </span>

                    </div>

                    {/* STATS */}

                    <div className="grid grid-cols-3 gap-3 mb-5">

                      <div className="border border-gray-800 rounded-lg p-3">

                        <p className="text-xs text-gray-600">
                          Tests
                        </p>

                        <p className="text-sm mt-1">
                          {
                            selectedSubmission.testCasesPassed
                          }
                          /
                          {
                            selectedSubmission.testCasesTotal
                          }
                        </p>

                      </div>

                      <div className="border border-gray-800 rounded-lg p-3">

                        <p className="text-xs text-gray-600">
                          Runtime
                        </p>

                        <p className="text-sm mt-1">
                          {
                            selectedSubmission.runtime
                          }
                        </p>

                      </div>

                      <div className="border border-gray-800 rounded-lg p-3">

                        <p className="text-xs text-gray-600">
                          Memory
                        </p>

                        <p className="text-sm mt-1">
                          {
                            selectedSubmission.memory
                          }
                        </p>

                      </div>

                    </div>

                    {/* EXACT SUBMITTED CODE */}

                    <div className="border border-slate-800 rounded-xl overflow-hidden bg-[#111610]">

                      <div className="px-5 py-3 bg-[#171c16] border-b border-slate-800 flex justify-between">

                        <span className="font-semibold">
                          Submitted Code
                        </span>

                        <span className="text-xs text-gray-500">
                          {
                            selectedSubmission.language
                          }
                        </span>

                      </div>

                      <pre className="p-5 bg-[#0b100d] overflow-x-auto text-sm text-gray-300 leading-6 whitespace-pre-wrap">

                        <code>
                          {
                            selectedSubmission.code
                          }
                        </code>

                      </pre>

                    </div>

                    {/* ERROR */}

                    {selectedSubmission.errorMessage && (
                      <div className="mt-4 border border-red-900/40 rounded-lg p-4">

                        <p className="text-xs text-red-400 mb-2">
                          Error
                        </p>

                        <pre className="text-sm text-red-300 whitespace-pre-wrap">
                          {
                            selectedSubmission.errorMessage
                          }
                        </pre>

                      </div>
                    )}

                  </>

                )}

              </div>
            )}

             {activeLeftTab ===
              "ChatAI" && (
              <div className="p-7">

                <h1 className="text-2xl font-bold mb-5">
                  chat with Ai
                </h1>
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  <ChatAi problem={problem}></ChatAi>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* ===================================================
            RIGHT SIDE
        =================================================== */}

        <div className="w-[55%] flex flex-col min-h-0 bg-[#090d0b]">

          {/* =================================================
              CODE HEADER
          ================================================= */}

          <div className="h-14 border-b border-slate-800 flex items-center px-5 flex-shrink-0 bg-[#0e130f]">

            <span className="text-sm text-white mr-3">
              Code
            </span>

            {/* LANGUAGE DROPDOWN BESIDE CODE */}

            <select
              value={selectedLanguage}
              onChange={(e) =>
                handleLanguageChange(
                  e.target.value
                )
              }
              className="bg-[#171c16] border border-slate-700 rounded-lg px-3 py-2 text-sm text-gray-300 outline-none cursor-pointer focus:border-[#c8ff3d]"
            >

              <option value="javascript">
                JavaScript
              </option>

              <option value="java">
                Java
              </option>

              <option value="c++">
                C++
              </option>

            </select>

          </div>

          {/* =================================================
              BIG CODE EDITOR
          ================================================= */}

          <div className="flex-1 min-h-0">

            <Editor
              height="100%"
              theme="vs-dark"
              language={getLanguageForMonaco(
                selectedLanguage
              )}
              value={code}
              onChange={(value) =>
                setCode(value || "")
              }
              onMount={handleEditorDidMount}
              options={{
                fontSize: 16,

                minimap: {
                  enabled: false,
                },

                automaticLayout: true,
                scrollBeyondLastLine: false,
                tabSize: 2,
                insertSpaces: true,
                wordWrap: "on",
                lineNumbers: "on",
                folding: true,
                glyphMargin: false,
                lineDecorationsWidth: 10,
                lineNumbersMinChars: 3,
                renderLineHighlight: "line",
                selectOnLineNumbers: true,
                roundedSelection: false,
                readOnly: false,
                cursorStyle: "line",
                mouseWheelZoom: true,
              }}
            />

          </div>

          {/* =================================================
              RESIZE HANDLE
          ================================================= */}

          <div
            onMouseDown={startResize}
            className="h-2 flex-shrink-0 cursor-row-resize bg-[#151a14] hover:bg-slate-600 border-t border-slate-800 border-b border-slate-800"
            title="Drag to resize console"
          />

          {/* =================================================
              CONSOLE
          ================================================= */}

          <div
            style={{
              height: `${consoleHeight}px`,
            }}
            className="flex flex-col flex-shrink-0"
          >

            {/* =================================================
                CONSOLE HEADER
            ================================================= */}

            <div className="h-12 border-b border-slate-800 flex items-center px-5 gap-7 flex-shrink-0 bg-[#0e130f]">

              <span className="text-sm text-[#c8ff3d] border-b-2 border-[#c8ff3d] h-full flex items-center">
                Testcase
              </span>

              <span className="text-sm text-gray-500">
                Result
              </span>

            </div>

            {/* =================================================
                CONSOLE CONTENT
            ================================================= */}

            <div className="flex-1 overflow-y-auto p-4">

              {/* =================================================
                  BEFORE RUN
              ================================================= */}

              {!runResult &&
                !submitResult && (
                  <div className="h-full flex items-center justify-center">

                    <p className="text-sm text-gray-600">
                      Run your code to see test cases
                    </p>

                  </div>
                )}

              {/* =================================================
                  RUN ERROR
              ================================================= */}

              {runResult?.error && (
                <div className="border border-red-900/40 bg-red-500/5 rounded-lg p-4">

                  <p className="text-xs text-red-400 mb-2">
                    Error
                  </p>

                  <pre className="text-sm text-red-300 whitespace-pre-wrap">
                    {runResult.error}
                  </pre>

                </div>
              )}

              {/* =================================================
                  RUN RESULTS
              ================================================= */}

              {Array.isArray(runResult) && (
                <div className="space-y-4">

                  {runResult.map(
                    (result, index) => {

                      const testCase =
                        problem.visibleTestCases?.[
                          index
                        ];

                      const actualOutput =
                        getOutput(result);

                      const expectedOutput =
                        testCase?.output || "";

                      const error =
                        getError(result);

                      const passed =
                        checkTestCase(
                          result,
                          testCase
                        );

                      return (
                        <div
                          key={index}
                          className="border border-slate-800 rounded-xl overflow-hidden bg-[#111610]"
                        >

                          {/* TEST CASE HEADER */}

                          <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between bg-[#171c16]">

                            <span className="text-sm font-medium">
                              Test Case{" "}
                              {index + 1}
                            </span>

                            <span
                              className={`text-xs font-semibold ${
                                passed
                                  ? "text-green-400"
                                  : "text-red-400"
                              }`}
                            >
                              {passed
                                ? "Passed"
                                : "Failed"}
                            </span>

                          </div>

                          {/* TEST CASE DATA */}

                          <div className="grid grid-cols-3 gap-4 p-4">

                            {/* INPUT */}

                            <div>

                              <p className="text-xs text-gray-500 mb-2">
                                Input
                              </p>

                              <pre className="bg-[#0b100d] border border-slate-800 rounded-lg p-3 text-xs text-gray-300 whitespace-pre-wrap overflow-x-auto">
                                {testCase?.input ||
                                  "—"}
                              </pre>

                            </div>

                            {/* EXPECTED */}

                            <div>

                              <p className="text-xs text-gray-500 mb-2">
                                Expected
                              </p>

                              <pre className="bg-[#0b100d] border border-slate-800 rounded-lg p-3 text-xs text-gray-300 whitespace-pre-wrap overflow-x-auto">
                                {expectedOutput ||
                                  "—"}
                              </pre>

                            </div>

                            {/* OUTPUT */}

                            <div>

                              <p className="text-xs text-gray-500 mb-2">
                                Output
                              </p>

                              <pre
                                className={`bg-[#0b100d] border rounded-lg p-3 text-xs whitespace-pre-wrap overflow-x-auto ${
                                  passed
                                    ? "border-gray-800 text-gray-300"
                                    : "border-red-900/40 text-red-300"
                                }`}
                              >
                                {error
                                  ? error
                                  : actualOutput ||
                                    "No output"}
                              </pre>

                            </div>

                          </div>

                        </div>
                      );
                    }
                  )}

                </div>
              )}

              {/* =================================================
                  SUBMIT RESULT
              ================================================= */}

              {submitResult && (
                <div className="mt-2">

                  {submitResult.accepted ===
                  true ? (

                    <div className="text-green-400">

                      <h3 className="text-xl font-semibold mb-3">
                        Accepted ✓
                      </h3>

                      <p className="text-gray-300">
                        {
                          submitResult.passedTestcases
                        }{" "}
                        /{" "}
                        {
                          submitResult.testCasesTotal
                        }{" "}
                        test cases passed
                      </p>

                      <p className="text-gray-400 mt-2">
                        Runtime:{" "}
                        {
                          submitResult.runtime
                        }
                        s
                      </p>

                      <p className="text-gray-400">
                        Memory:{" "}
                        {
                          submitResult.memory
                        }{" "}
                        KB
                      </p>

                    </div>

                  ) : (

                    <div className="text-red-400">

                      <h3 className="text-xl font-semibold mb-3">
                        Wrong Answer
                      </h3>

                      <p className="text-gray-300">
                        {
                          submitResult.passedTestcases
                        }{" "}
                        /{" "}
                        {
                          submitResult.testCasesTotal
                        }{" "}
                        test cases passed
                      </p>

                      {submitResult.error && (
                        <pre className="mt-3 text-sm text-red-300 whitespace-pre-wrap">
                          {
                            submitResult.error
                          }
                        </pre>
                      )}

                    </div>

                  )}

                </div>
              )}

            </div>

            {/* =================================================
                ACTION BAR
            ================================================= */}

            <div className="h-16 border-t border-gray-800 flex items-center justify-end px-5 gap-3 flex-shrink-0">

              <button
                onClick={handleRun}
                disabled={loading}
                className="px-6 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-50 transition"
              >
                {loading
                  ? "Running..."
                  : "Run"}
              </button>

              <button
                onClick={handleSubmitCode}
                disabled={loading}
                className="px-6 py-2 rounded-lg bg-[#c8ff3d] text-[#11120e] font-semibold hover:bg-[#dcff7a] disabled:opacity-50 transition"
              >
                {loading
                  ? "Submitting..."
                  : "Submit"}
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ProblemPage;
