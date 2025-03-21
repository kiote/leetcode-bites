export const problems = [
  {
    id: 1,
    title: 'Character Uniqueness Check',
    description: 'Write a function that determines if a string contains all unique characters. This establishes the fundamental concept of checking for character uniqueness, which is the core constraint of our target problem.',
    initialCode: `def has_all_unique_chars(s):
    # Your code here`
  },
  {
    id: 2,
    title: 'Is Substring Unique',
    description: 'Given a string and two indices (start and end), determine if the substring from start to end (inclusive) contains all unique characters. This builds on the previous challenge by examining specific substrings rather than the entire string.',
    initialCode: `def is_substring_unique(s, start, end):
    # Your code here`
  },
  {
    id: 3,
    title: 'Find All Valid Substrings',
    description: 'Given a string, find all substrings that contain no duplicate characters. This extends the previous challenge by finding all valid unique-character substrings, preparing us to identify the longest one.',
    initialCode: `def find_all_unique_substrings(s):
    # Your code here`
  },
  {
    id: 4,
    title: 'Length of Longest Valid Substring (Brute Force)',
    description: 'Find the length of the longest substring without repeating characters by examining all possible substrings. This directly addresses the main problem but uses a brute force approach.',
    initialCode: `def length_of_longest_substring_brute_force(s):
    # Your code here`
  },
  {
    id: 5,
    title: 'Valid Substring Starting at Index',
    description: 'For a given string and starting index, find the length of the longest substring without repeating characters that begins at that index. This introduces the concept of finding the longest valid substring from a specific starting point.',
    initialCode: `def longest_substring_from_index(s, start_index):
    # Your code here`
  },
  {
    id: 6,
    title: 'Sliding Window Technique (Fixed Size)',
    description: 'Using a sliding window of fixed size k, determine if the string contains a substring of length k with all unique characters. This introduces the sliding window technique with a fixed size.',
    initialCode: `def has_unique_substring_of_length(s, k):
    # Your code here`
  },
  {
    id: 7,
    title: 'Sliding Window with Expansion and Contraction',
    description: 'Implement a sliding window approach where the window expands when a new unique character is encountered and contracts when a duplicate is found. This refines the sliding window technique to dynamically adjust based on uniqueness.',
    initialCode: `def length_of_longest_substring_dynamic(s):
    # Your code here`
  },
  {
    id: 8,
    title: 'Optimized Sliding Window with Character Tracking',
    description: 'Enhance the sliding window approach by efficiently tracking the most recent position of each character, allowing the window to jump forward when duplicates are found. This introduces an optimization that avoids unnecessary window contractions.',
    initialCode: `def length_of_longest_substring_optimized(s):
    # Your code here`
  },
  {
    id: 9,
    title: 'Longest Substring Without Repeating Characters',
    description: 'Given a string s, find the length of the longest substring without duplicate characters. This is the final target problem, combining all the concepts we\'ve developed.',
    initialCode: `def length_of_longest_substring(s):
    # Your code here`
  }
];
