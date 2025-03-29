export const allTests = {
  1: [
    {
      id: 1,
      name: 'Test with unique characters',
      functionName: 'has_all_unique_chars',
      inputs: ['abc'],
      expectedOutput: true
    },
    {
      id: 2,
      name: 'Test with duplicate characters',
      functionName: 'has_all_unique_chars',
      inputs: ['abca'],
      expectedOutput: false
    },
    {
      id: 3,
      name: 'Test with empty string',
      functionName: 'has_all_unique_chars',
      inputs: [''],
      expectedOutput: true
    }
  ],
  2: [
    {
      id: 1,
      name: 'Test unique substring',
      functionName: 'is_substring_unique',
      inputs: ['abcdef', 0, 2],
      expectedOutput: true
    },
    {
      id: 2,
      name: 'Test substring with duplicates',
      functionName: 'is_substring_unique',
      inputs: ['abcaef', 0, 3],
      expectedOutput: false
    },
    {
      id: 3,
      name: 'Test single character substring',
      functionName: 'is_substring_unique',
      inputs: ['abc', 1, 1],
      expectedOutput: true
    }
  ],
  3: [
    {
      id: 1,
      name: 'Find all unique substrings in short string',
      functionName: 'find_all_unique_substrings',
      inputs: ['abc'],
      expectedOutput: ["a", "ab", "abc", "b", "bc", "c"]
    },
    {
      id: 2,
      name: 'Find all unique substrings with duplicates',
      functionName: 'find_all_unique_substrings',
      inputs: ['abb'],
      expectedOutput: ["a", "ab", "b"]
    },
    {
      id: 3,
      name: 'Test with empty string',
      functionName: 'find_all_unique_substrings',
      inputs: [''],
      expectedOutput: []
    }
  ],
  4: [
    {
      id: 1,
      name: 'Test with example string "abcabcbb"',
      functionName: 'length_of_longest_substring_brute_force',
      inputs: ['abcabcbb'],
      expectedOutput: 3
    },
    {
      id: 2,
      name: 'Test with repeated characters "bbbbb"',
      functionName: 'length_of_longest_substring_brute_force',
      inputs: ['bbbbb'],
      expectedOutput: 1
    },
    {
      id: 3,
      name: 'Test with example string "pwwkew"',
      functionName: 'length_of_longest_substring_brute_force',
      inputs: ['pwwkew'],
      expectedOutput: 3
    },
    {
      id: 4,
      name: 'Test with empty string',
      functionName: 'length_of_longest_substring_brute_force',
      inputs: [''],
      expectedOutput: 0
    }
  ],
  5: [
    {
      id: 1,
      name: 'Test from index 0 with "abcabcbb"',
      functionName: 'longest_substring_from_index',
      inputs: ['abcabcbb', 0],
      expectedOutput: 3
    },
    {
      id: 2,
      name: 'Test from index 2 with "abcabcbb"',
      functionName: 'longest_substring_from_index',
      inputs: ['abcabcbb', 2],
      expectedOutput: 3
    },
    {
      id: 3,
      name: 'Test with single repeating character',
      functionName: 'longest_substring_from_index',
      inputs: ['bbbbb', 2],
      expectedOutput: 1
    }
  ],
  6: [
    {
      id: 1,
      name: 'Test with valid fixed-size window',
      functionName: 'has_unique_substring_of_length',
      inputs: ['abcabcbb', 3],
      expectedOutput: true
    },
    {
      id: 2,
      name: 'Test with invalid fixed-size window',
      functionName: 'has_unique_substring_of_length',
      inputs: ['bbbbb', 2],
      expectedOutput: false
    },
    {
      id: 3,
      name: 'Test with window larger than string',
      functionName: 'has_unique_substring_of_length',
      inputs: ['abc', 4],
      expectedOutput: false
    }
  ],
  7: [
    {
      id: 1,
      name: 'Test with example string "abcabcbb"',
      functionName: 'length_of_longest_substring_dynamic',
      inputs: ['abcabcbb'],
      expectedOutput: 3
    },
    {
      id: 2,
      name: 'Test with repeated characters "bbbbb"',
      functionName: 'length_of_longest_substring_dynamic',
      inputs: ['bbbbb'],
      expectedOutput: 1
    },
    {
      id: 3,
      name: 'Test with example string "pwwkew"',
      functionName: 'length_of_longest_substring_dynamic',
      inputs: ['pwwkew'],
      expectedOutput: 3
    }
  ],
  8: [
    {
      id: 1,
      name: 'Test with example string "abcabcbb"',
      functionName: 'length_of_longest_substring_optimized',
      inputs: ['abcabcbb'],
      expectedOutput: 3
    },
    {
      id: 2,
      name: 'Test with longer example "abcdeafbdgcbb"',
      functionName: 'length_of_longest_substring_optimized',
      inputs: ['abcdeafbdgcbb'],
      expectedOutput: 7
    },
    {
      id: 3,
      name: 'Test with repeated characters "bbbbb"',
      functionName: 'length_of_longest_substring_optimized',
      inputs: ['bbbbb'],
      expectedOutput: 1
    }
  ],
  9: [
    {
      id: 1,
      name: 'Test with example string "abcabcbb"',
      functionName: 'length_of_longest_substring',
      inputs: ['abcabcbb'],
      expectedOutput: 3
    },
    {
      id: 2,
      name: 'Test with repeated characters "bbbbb"',
      functionName: 'length_of_longest_substring',
      inputs: ['bbbbb'],
      expectedOutput: 1
    },
    {
      id: 3,
      name: 'Test with example string "pwwkew"',
      functionName: 'length_of_longest_substring',
      inputs: ['pwwkew'],
      expectedOutput: 3
    },
    {
      id: 4,
      name: 'Test with empty string',
      functionName: 'length_of_longest_substring',
      inputs: [''],
      expectedOutput: 0
    },
    {
      id: 5,
      name: 'Test with single character',
      functionName: 'length_of_longest_substring',
      inputs: ['a'],
      expectedOutput: 1
    }
  ]
};
