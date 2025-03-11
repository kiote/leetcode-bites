export const predefinedTests = [
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
];
