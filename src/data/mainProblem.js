// Main problem content with examples and constraints
const mainProblem = {
  title: "Main Problem:",
  description: "Given a string s, find the length of the longest substring without duplicate characters.",
  
  // Examples section data
  examples: [
    {
      id: 1,
      input: "s = \"abcabcbb\"",
      output: "3",
      explanation: "The answer is \"abc\", with the length of 3."
    },
    {
      id: 2,
      input: "s = \"bbbbb\"",
      output: "1",
      explanation: "The answer is \"b\", with the length of 1."
    },
    {
      id: 3,
      input: "s = \"pwwkew\"",
      output: "3",
      explanation: [
        "The answer is \"wke\", with the length of 3.",
        "Notice that the answer must be a substring, \"pwke\" is a subsequence and not a substring."
      ]
    }
  ],
  
  // Constraints section data
  constraints: [
    "0 ≤ s.length ≤ 5 * 10^4",
    "s consists of English letters, digits, symbols and spaces."
  ]
};

export default mainProblem;
