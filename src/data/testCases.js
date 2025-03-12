export const allTests = {
  1: [
    {
      id: 1,
      name: 'Test add function with positive numbers',
      testCode: 'add(2, 3) === 5',
      functionName: 'add',
      inputs: [2, 3],
      expectedOutput: 5
    },
    {
      id: 2,
      name: 'Test add function with negative numbers',
      testCode: 'add(-1, -1) === -2',
      functionName: 'add',
      inputs: [-1, -1],
      expectedOutput: -2
    },
    {
      id: 3,
      name: 'Test multiply function with positive numbers',
      testCode: 'multiply(3, 4) === 12',
      functionName: 'multiply',
      inputs: [3, 4],
      expectedOutput: 12
    },
    {
      id: 4,
      name: 'Test multiply function with zero',
      testCode: 'multiply(5, 0) === 0',
      functionName: 'multiply',
      inputs: [5, 0],
      expectedOutput: 0
    }
  ],
  2: [
    {
      id: 1,
      name: 'Reverse simple string',
      testCode: 'reverseString("hello") === "olleh"',
      functionName: 'reverseString',
      inputs: ['hello'],
      expectedOutput: 'olleh'
    },
    {
      id: 2,
      name: 'Reverse string with spaces',
      testCode: 'reverseString("hello world") === "dlrow olleh"',
      functionName: 'reverseString',
      inputs: ['hello world'],
      expectedOutput: 'dlrow olleh'
    }
  ],
  3: [
    {
      id: 1,
      name: 'Check simple palindrome',
      testCode: 'isPalindrome("racecar") === true',
      functionName: 'isPalindrome',
      inputs: ['racecar'],
      expectedOutput: true
    },
    {
      id: 2,
      name: 'Check non-palindrome',
      testCode: 'isPalindrome("hello") === false',
      functionName: 'isPalindrome',
      inputs: ['hello'],
      expectedOutput: false
    }
  ]
};

// For backward compatibility
export const predefinedTests = allTests[1];
