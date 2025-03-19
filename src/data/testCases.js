export const allTests = {
  1: [
    {
      id: 1,
      name: 'Test with unique characters',
      testCode: 'hasAllUniqueChars("abc") === true',
      functionName: 'hasAllUniqueChars',
      inputs: ['abc'],
      expectedOutput: true
    },
    {
      id: 2,
      name: 'Test with duplicate characters',
      testCode: 'hasAllUniqueChars("abca") === false',
      functionName: 'hasAllUniqueChars',
      inputs: ['abca'],
      expectedOutput: false
    },
    {
      id: 3,
      name: 'Test with empty string',
      testCode: 'hasAllUniqueChars("") === true',
      functionName: 'hasAllUniqueChars',
      inputs: [''],
      expectedOutput: true
    }
  ],
  2: [
    {
      id: 1,
      name: 'Test unique substring',
      testCode: 'isSubstringUnique("abcdef", 0, 2) === true',
      functionName: 'isSubstringUnique',
      inputs: ['abcdef', 0, 2],
      expectedOutput: true
    },
    {
      id: 2,
      name: 'Test substring with duplicates',
      testCode: 'isSubstringUnique("abcaef", 0, 3) === false',
      functionName: 'isSubstringUnique',
      inputs: ['abcaef', 0, 3],
      expectedOutput: false
    },
    {
      id: 3,
      name: 'Test single character substring',
      testCode: 'isSubstringUnique("abc", 1, 1) === true',
      functionName: 'isSubstringUnique',
      inputs: ['abc', 1, 1],
      expectedOutput: true
    }
  ],
  3: [
    {
      id: 1,
      name: 'Find all unique substrings in short string',
      testCode: 'JSON.stringify(findAllUniqueSubstrings("abc").sort()) === JSON.stringify(["a", "ab", "abc", "b", "bc", "c"].sort())',
      functionName: 'findAllUniqueSubstrings',
      inputs: ['abc'],
      expectedOutput: ["a", "ab", "abc", "b", "bc", "c"]
    },
    {
      id: 2,
      name: 'Find all unique substrings with duplicates',
      testCode: 'JSON.stringify(findAllUniqueSubstrings("abb").sort()) === JSON.stringify(["a", "ab", "b"].sort())',
      functionName: 'findAllUniqueSubstrings',
      inputs: ['abb'],
      expectedOutput: ["a", "ab", "b"]
    },
    {
      id: 3,
      name: 'Test with empty string',
      testCode: 'findAllUniqueSubstrings("").length === 0',
      functionName: 'findAllUniqueSubstrings',
      inputs: [''],
      expectedOutput: []
    }
  ],
  4: [
    {
      id: 1,
      name: 'Test with example string "abcabcbb"',
      testCode: 'lengthOfLongestSubstringBruteForce("abcabcbb") === 3',
      functionName: 'lengthOfLongestSubstringBruteForce',
      inputs: ['abcabcbb'],
      expectedOutput: 3
    },
    {
      id: 2,
      name: 'Test with repeated characters "bbbbb"',
      testCode: 'lengthOfLongestSubstringBruteForce("bbbbb") === 1',
      functionName: 'lengthOfLongestSubstringBruteForce',
      inputs: ['bbbbb'],
      expectedOutput: 1
    },
    {
      id: 3,
      name: 'Test with example string "pwwkew"',
      testCode: 'lengthOfLongestSubstringBruteForce("pwwkew") === 3',
      functionName: 'lengthOfLongestSubstringBruteForce',
      inputs: ['pwwkew'],
      expectedOutput: 3
    },
    {
      id: 4,
      name: 'Test with empty string',
      testCode: 'lengthOfLongestSubstringBruteForce("") === 0',
      functionName: 'lengthOfLongestSubstringBruteForce',
      inputs: [''],
      expectedOutput: 0
    }
  ],
  5: [
    {
      id: 1,
      name: 'Test from index 0 with "abcabcbb"',
      testCode: 'longestSubstringFromIndex("abcabcbb", 0) === 3',
      functionName: 'longestSubstringFromIndex',
      inputs: ['abcabcbb', 0],
      expectedOutput: 3
    },
    {
      id: 2,
      name: 'Test from index 2 with "abcabcbb"',
      testCode: 'longestSubstringFromIndex("abcabcbb", 2) === 4',
      functionName: 'longestSubstringFromIndex',
      inputs: ['abcabcbb', 2],
      expectedOutput: 4
    },
    {
      id: 3,
      name: 'Test with single repeating character',
      testCode: 'longestSubstringFromIndex("bbbbb", 2) === 1',
      functionName: 'longestSubstringFromIndex',
      inputs: ['bbbbb', 2],
      expectedOutput: 1
    }
  ],
  6: [
    {
      id: 1,
      name: 'Test with valid fixed-size window',
      testCode: 'hasUniqueSubstringOfLength("abcabcbb", 3) === true',
      functionName: 'hasUniqueSubstringOfLength',
      inputs: ['abcabcbb', 3],
      expectedOutput: true
    },
    {
      id: 2,
      name: 'Test with invalid fixed-size window',
      testCode: 'hasUniqueSubstringOfLength("bbbbb", 2) === false',
      functionName: 'hasUniqueSubstringOfLength',
      inputs: ['bbbbb', 2],
      expectedOutput: false
    },
    {
      id: 3,
      name: 'Test with window larger than string',
      testCode: 'hasUniqueSubstringOfLength("abc", 4) === false',
      functionName: 'hasUniqueSubstringOfLength',
      inputs: ['abc', 4],
      expectedOutput: false
    }
  ],
  7: [
    {
      id: 1,
      name: 'Test with example string "abcabcbb"',
      testCode: 'lengthOfLongestSubstringDynamic("abcabcbb") === 3',
      functionName: 'lengthOfLongestSubstringDynamic',
      inputs: ['abcabcbb'],
      expectedOutput: 3
    },
    {
      id: 2,
      name: 'Test with repeated characters "bbbbb"',
      testCode: 'lengthOfLongestSubstringDynamic("bbbbb") === 1',
      functionName: 'lengthOfLongestSubstringDynamic',
      inputs: ['bbbbb'],
      expectedOutput: 1
    },
    {
      id: 3,
      name: 'Test with example string "pwwkew"',
      testCode: 'lengthOfLongestSubstringDynamic("pwwkew") === 3',
      functionName: 'lengthOfLongestSubstringDynamic',
      inputs: ['pwwkew'],
      expectedOutput: 3
    }
  ],
  8: [
    {
      id: 1,
      name: 'Test with example string "abcabcbb"',
      testCode: 'lengthOfLongestSubstringOptimized("abcabcbb") === 3',
      functionName: 'lengthOfLongestSubstringOptimized',
      inputs: ['abcabcbb'],
      expectedOutput: 3
    },
    {
      id: 2,
      name: 'Test with longer example "abcdeafbdgcbb"',
      testCode: 'lengthOfLongestSubstringOptimized("abcdeafbdgcbb") === 7',
      functionName: 'lengthOfLongestSubstringOptimized',
      inputs: ['abcdeafbdgcbb'],
      expectedOutput: 7
    },
    {
      id: 3,
      name: 'Test with repeated characters "bbbbb"',
      testCode: 'lengthOfLongestSubstringOptimized("bbbbb") === 1',
      functionName: 'lengthOfLongestSubstringOptimized',
      inputs: ['bbbbb'],
      expectedOutput: 1
    }
  ],
  9: [
    {
      id: 1,
      name: 'Test with example string "abcabcbb"',
      testCode: 'lengthOfLongestSubstring("abcabcbb") === 3',
      functionName: 'lengthOfLongestSubstring',
      inputs: ['abcabcbb'],
      expectedOutput: 3
    },
    {
      id: 2,
      name: 'Test with repeated characters "bbbbb"',
      testCode: 'lengthOfLongestSubstring("bbbbb") === 1',
      functionName: 'lengthOfLongestSubstring',
      inputs: ['bbbbb'],
      expectedOutput: 1
    },
    {
      id: 3,
      name: 'Test with example string "pwwkew"',
      testCode: 'lengthOfLongestSubstring("pwwkew") === 3',
      functionName: 'lengthOfLongestSubstring',
      inputs: ['pwwkew'],
      expectedOutput: 3
    },
    {
      id: 4,
      name: 'Test with empty string',
      testCode: 'lengthOfLongestSubstring("") === 0',
      functionName: 'lengthOfLongestSubstring',
      inputs: [''],
      expectedOutput: 0
    },
    {
      id: 5,
      name: 'Test with single character',
      testCode: 'lengthOfLongestSubstring("a") === 1',
      functionName: 'lengthOfLongestSubstring',
      inputs: ['a'],
      expectedOutput: 1
    }
  ]
};
