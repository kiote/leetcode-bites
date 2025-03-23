export const allTests = {
  1: [
    {
      id: 1,
      name: 'Test with unique characters',
      testCode: 'has_all_unique_chars("abc") == True',
      functionName: 'has_all_unique_chars',
      inputs: ['abc'],
      expectedOutput: true
    },
    {
      id: 2,
      name: 'Test with duplicate characters',
      testCode: 'has_all_unique_chars("abca") == False',
      functionName: 'has_all_unique_chars',
      inputs: ['abca'],
      expectedOutput: false
    },
    {
      id: 3,
      name: 'Test with empty string',
      testCode: 'has_all_unique_chars("") == True',
      functionName: 'has_all_unique_chars',
      inputs: [''],
      expectedOutput: true
    }
  ],
  2: [
    {
      id: 1,
      name: 'Test unique substring',
      testCode: 'is_substring_unique("abcdef", 0, 2) == True',
      functionName: 'is_substring_unique',
      inputs: ['abcdef', 0, 2],
      expectedOutput: true
    },
    {
      id: 2,
      name: 'Test substring with duplicates',
      testCode: 'is_substring_unique("abcaef", 0, 3) == False',
      functionName: 'is_substring_unique',
      inputs: ['abcaef', 0, 3],
      expectedOutput: false
    },
    {
      id: 3,
      name: 'Test single character substring',
      testCode: 'is_substring_unique("abc", 1, 1) == True',
      functionName: 'is_substring_unique',
      inputs: ['abc', 1, 1],
      expectedOutput: true
    }
  ],
  3: [
    {
      id: 1,
      name: 'Find all unique substrings in short string',
      testCode: 'JSON.stringify(sorted(find_all_unique_substrings("abc"))) === JSON.stringify(sorted(["a", "ab", "abc", "b", "bc", "c"]))',
      functionName: 'find_all_unique_substrings',
      inputs: ['abc'],
      expectedOutput: ["a", "ab", "abc", "b", "bc", "c"]
    },
    {
      id: 2,
      name: 'Find all unique substrings with duplicates',
      testCode: 'JSON.stringify(sorted(find_all_unique_substrings("abb"))) === JSON.stringify(sorted(["a", "ab", "b"]))',
      functionName: 'find_all_unique_substrings',
      inputs: ['abb'],
      expectedOutput: ["a", "ab", "b"]
    },
    {
      id: 3,
      name: 'Test with empty string',
      testCode: 'find_all_unique_substrings("").length === 0',
      functionName: 'find_all_unique_substrings',
      inputs: [''],
      expectedOutput: []
    }
  ],
  4: [
    {
      id: 1,
      name: 'Test with example string "abcabcbb"',
      testCode: 'length_of_longest_substring_brute_force("abcabcbb") == 3',
      functionName: 'length_of_longest_substring_brute_force',
      inputs: ['abcabcbb'],
      expectedOutput: 3
    },
    {
      id: 2,
      name: 'Test with repeated characters "bbbbb"',
      testCode: 'length_of_longest_substring_brute_force("bbbbb") == 1',
      functionName: 'length_of_longest_substring_brute_force',
      inputs: ['bbbbb'],
      expectedOutput: 1
    },
    {
      id: 3,
      name: 'Test with example string "pwwkew"',
      testCode: 'length_of_longest_substring_brute_force("pwwkew") == 3',
      functionName: 'length_of_longest_substring_brute_force',
      inputs: ['pwwkew'],
      expectedOutput: 3
    },
    {
      id: 4,
      name: 'Test with empty string',
      testCode: 'length_of_longest_substring_brute_force("") == 0',
      functionName: 'length_of_longest_substring_brute_force',
      inputs: [''],
      expectedOutput: 0
    }
  ],
  5: [
    {
      id: 1,
      name: 'Test from index 0 with "abcabcbb"',
      testCode: 'longest_substring_from_index("abcabcbb", 0) == 3',
      functionName: 'longest_substring_from_index',
      inputs: ['abcabcbb', 0],
      expectedOutput: 3
    },
    {
      id: 2,
      name: 'Test from index 2 with "abcabcbb"',
      testCode: 'longest_substring_from_index("abcabcbb", 2) == 4',
      functionName: 'longest_substring_from_index',
      inputs: ['abcabcbb', 2],
      expectedOutput: 4
    },
    {
      id: 3,
      name: 'Test with single repeating character',
      testCode: 'longest_substring_from_index("bbbbb", 2) == 1',
      functionName: 'longest_substring_from_index',
      inputs: ['bbbbb', 2],
      expectedOutput: 1
    }
  ],
  6: [
    {
      id: 1,
      name: 'Test with valid fixed-size window',
      testCode: 'has_unique_substring_of_length("abcabcbb", 3) == True',
      functionName: 'has_unique_substring_of_length',
      inputs: ['abcabcbb', 3],
      expectedOutput: true
    },
    {
      id: 2,
      name: 'Test with invalid fixed-size window',
      testCode: 'has_unique_substring_of_length("bbbbb", 2) == False',
      functionName: 'has_unique_substring_of_length',
      inputs: ['bbbbb', 2],
      expectedOutput: false
    },
    {
      id: 3,
      name: 'Test with window larger than string',
      testCode: 'has_unique_substring_of_length("abc", 4) == False',
      functionName: 'has_unique_substring_of_length',
      inputs: ['abc', 4],
      expectedOutput: false
    }
  ],
  7: [
    {
      id: 1,
      name: 'Test with example string "abcabcbb"',
      testCode: 'length_of_longest_substring_dynamic("abcabcbb") == 3',
      functionName: 'length_of_longest_substring_dynamic',
      inputs: ['abcabcbb'],
      expectedOutput: 3
    },
    {
      id: 2,
      name: 'Test with repeated characters "bbbbb"',
      testCode: 'length_of_longest_substring_dynamic("bbbbb") == 1',
      functionName: 'length_of_longest_substring_dynamic',
      inputs: ['bbbbb'],
      expectedOutput: 1
    },
    {
      id: 3,
      name: 'Test with example string "pwwkew"',
      testCode: 'length_of_longest_substring_dynamic("pwwkew") == 3',
      functionName: 'length_of_longest_substring_dynamic',
      inputs: ['pwwkew'],
      expectedOutput: 3
    }
  ],
  8: [
    {
      id: 1,
      name: 'Test with example string "abcabcbb"',
      testCode: 'length_of_longest_substring_optimized("abcabcbb") == 3',
      functionName: 'length_of_longest_substring_optimized',
      inputs: ['abcabcbb'],
      expectedOutput: 3
    },
    {
      id: 2,
      name: 'Test with longer example "abcdeafbdgcbb"',
      testCode: 'length_of_longest_substring_optimized("abcdeafbdgcbb") == 7',
      functionName: 'length_of_longest_substring_optimized',
      inputs: ['abcdeafbdgcbb'],
      expectedOutput: 7
    },
    {
      id: 3,
      name: 'Test with repeated characters "bbbbb"',
      testCode: 'length_of_longest_substring_optimized("bbbbb") == 1',
      functionName: 'length_of_longest_substring_optimized',
      inputs: ['bbbbb'],
      expectedOutput: 1
    }
  ],
  9: [
    {
      id: 1,
      name: 'Test with example string "abcabcbb"',
      testCode: 'length_of_longest_substring("abcabcbb") == 3',
      functionName: 'length_of_longest_substring',
      inputs: ['abcabcbb'],
      expectedOutput: 3
    },
    {
      id: 2,
      name: 'Test with repeated characters "bbbbb"',
      testCode: 'length_of_longest_substring("bbbbb") == 1',
      functionName: 'length_of_longest_substring',
      inputs: ['bbbbb'],
      expectedOutput: 1
    },
    {
      id: 3,
      name: 'Test with example string "pwwkew"',
      testCode: 'length_of_longest_substring("pwwkew") == 3',
      functionName: 'length_of_longest_substring',
      inputs: ['pwwkew'],
      expectedOutput: 3
    },
    {
      id: 4,
      name: 'Test with empty string',
      testCode: 'length_of_longest_substring("") == 0',
      functionName: 'length_of_longest_substring',
      inputs: [''],
      expectedOutput: 0
    },
    {
      id: 5,
      name: 'Test with single character',
      testCode: 'length_of_longest_substring("a") == 1',
      functionName: 'length_of_longest_substring',
      inputs: ['a'],
      expectedOutput: 1
    }
  ]
};
