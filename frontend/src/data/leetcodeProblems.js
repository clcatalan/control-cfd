const leetcodeProblems = [
  {
    id: 1,
    title: '1838. Frequency of the Most Frequent Element',
    difficulty: 'Medium',
    url: 'https://leetcode.com/problems/frequency-of-the-most-frequent-element/description/',
    description:
      "You are given an integer array nums and an integer k. In one operation, you can choose an index of nums and increment the element at that index by 1.\n\nReturn the maximum possible frequency of an element after performing at most k operations.",
    examples: [
      {
        input: 'nums = [1,2,4], k = 5',
        output: '3',
        explanation:
          'Increment the first element three times and the second element two times to make nums = [4,4,4]. 5 total increments were used.',
      },
      {
        input: 'nums = [1,4,8,13], k = 5',
        output: '2',
        explanation:
          'There are multiple optimal solutions:\n- Increment the first element three times to make nums = [4,4,8,13]. 3 total increments were used.\n- Increment the second element four times to make nums = [1,8,8,13]. 4 total increments were used.\n- Increment the third element five times to make nums = [1,4,13,13]. 5 total increments were used.',
      },
      {
        input: 'nums = [3,9,6], k = 2',
        output: '1',
        explanation: '',
      },
    ],
    constraints: [
      '1 <= nums.length <= 10^5',
      '1 <= nums[i] <= 10^5',
      '1 <= k <= 10^5',
    ],
    solutions: {
      python: `class Solution:
    def maxFrequency(self, nums: List[int], k: int) -> int:
        nums.sort()
        left = 0
        total = 0
        best = 1
        for right in range(len(nums)):
            total += nums[right]
            while nums[right] * (right - left + 1) - total > k:
                total -= nums[left]
                left += 1
            best = max(best, right - left + 1)
        return best`,
    },
  },
  {
    id: 2,
    title: '640. Solve the Equation',
    difficulty: 'Medium',
    url: 'https://leetcode.com/problems/solve-the-equation/description/',
    description:
      "Solve a given equation and return the value of 'x' in the form of a string \"x=#value\". The equation contains only '+', '-' operation, the variable 'x' and its coefficient. You should return \"No solution\" if there is no solution for the equation, or \"Infinite solutions\" if there are infinite solutions for the equation.\n\nIf there is exactly one solution for the equation, we ensure that the value of 'x' is an integer.",
    examples: [
      { input: 'equation = "x+5-3+x=6+x-2"', output: '"x=2"', explanation: '' },
      { input: 'equation = "x=x"', output: '"Infinite solutions"', explanation: '' },
      { input: 'equation = "2x=x"', output: '"x=0"', explanation: '' },
    ],
    constraints: [
      '3 <= equation.length <= 1000',
      "equation has exactly one '='.",
      "equation consists of integers with an absolute value in the range [0, 100] without any leading zeros, and the variable 'x'.",
      'The input is guaranteed to be valid.',
    ],
    solutions: {
      python: `class Solution:
    def solveEquation(self, equation: str) -> str:
        def parse(expr):
            expr = expr.replace('-', '+-')
            coef = const = 0
            for term in expr.split('+'):
                if not term:
                    continue
                if 'x' in term:
                    sign = term[:-1]
                    if sign in ('', '+'):
                        coef += 1
                    elif sign == '-':
                        coef -= 1
                    else:
                        coef += int(sign)
                else:
                    const += int(term)
            return coef, const

        left, right = equation.split('=')
        coefL, constL = parse(left)
        coefR, constR = parse(right)

        coef = coefL - coefR
        const = constR - constL

        if coef == 0:
            return "Infinite solutions" if const == 0 else "No solution"
        return f"x={const // coef}"`,
    },
  },
  {
    id: 3,
    title: '227. Basic Calculator II',
    difficulty: 'Medium',
    url: 'https://leetcode.com/problems/basic-calculator-ii/description/',
    description:
      "Given a string s which represents an expression, evaluate this expression and return its value.\n\nThe integer division should truncate toward zero.\n\nYou may assume that the given expression is always valid. All intermediate results will be in the range of [-2^31, 2^31 - 1].\n\nNote: You are not allowed to use any built-in function which evaluates strings as mathematical expressions, such as eval().",
    examples: [
      { input: 's = "3+2*2"', output: '7', explanation: '' },
      { input: 's = " 3/2 "', output: '1', explanation: '' },
      { input: 's = " 3+5 / 2 "', output: '5', explanation: '' },
    ],
    constraints: [
      '1 <= s.length <= 3 * 10^5',
      "s consists of integers and operators ('+', '-', '*', '/') separated by some number of spaces.",
      's represents a valid expression.',
      'All the integers in the expression are non-negative integers in the range [0, 2^31 - 1].',
      'The answer is guaranteed to fit in a 32-bit integer.',
    ],
    solutions: {
      python: `class Solution:
    def calculate(self, s: str) -> int:
        stack = []
        num = 0
        sign = '+'
        s = s + '+'
        for ch in s:
            if ch.isdigit():
                num = num * 10 + int(ch)
            elif ch != ' ':
                if sign == '+':
                    stack.append(num)
                elif sign == '-':
                    stack.append(-num)
                elif sign == '*':
                    stack.append(stack.pop() * num)
                elif sign == '/':
                    prev = stack.pop()
                    stack.append(int(prev / num))
                sign = ch
                num = 0
        return sum(stack)`,
    },
  },
  {
    id: 4,
    title: '3634. Minimum Removals to Balance Array',
    difficulty: 'Medium',
    url: 'https://leetcode.com/problems/minimum-removals-to-balance-array/description/',
    description:
      'You are given an integer array nums and an integer k. An array is considered balanced if the value of its maximum element is at most k times the value of its minimum element.\n\nYou may remove any number of elements from nums without making it empty. Return the minimum number of elements to remove so that the remaining array is balanced.\n\nNote: An array of size 1 is considered balanced, since its maximum and minimum are equal.',
    examples: [
      {
        input: 'nums = [2,1,5], k = 2',
        output: '1',
        explanation:
          'Remove nums[2] = 5 to get nums = [2,1]. Now max = 2, min = 1, and max <= min * k since 2 <= 1 * 2.',
      },
      {
        input: 'nums = [1,6,2,9], k = 3',
        output: '2',
        explanation:
          'Remove nums[0] = 1 and nums[3] = 9 to get nums = [6,2]. Now max = 6, min = 2, and max <= min * k since 6 <= 2 * 3.',
      },
      {
        input: 'nums = [2,4], k = 4',
        output: '0',
        explanation: 'nums is already balanced since 4 <= 2 * 4, so no elements need to be removed.',
      },
    ],
    constraints: [
      '1 <= nums.length <= 10^5',
      '1 <= nums[i] <= 10^9',
      '1 <= k <= 10^5',
    ],
    solutions: {
      python: `class Solution:
    def minRemoval(self, nums: List[int], k: int) -> int:
        nums.sort()
        n = len(nums)
        left = 0
        best = 1
        for right in range(n):
            while nums[right] > nums[left] * k:
                left += 1
            best = max(best, right - left + 1)
        return n - best`,
    },
  },
  {
    id: 5,
    title: '79. Word Search',
    difficulty: 'Medium',
    url: 'https://leetcode.com/problems/word-search/description/',
    description:
      'Given an m x n grid of characters board and a string word, return true if word exists in the grid.\n\nThe word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.',
    examples: [
      {
        input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"',
        output: 'true',
        explanation: '',
      },
      {
        input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "SEE"',
        output: 'true',
        explanation: '',
      },
      {
        input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCB"',
        output: 'false',
        explanation: '',
      },
    ],
    constraints: [
      'm == board.length',
      'n = board[i].length',
      '1 <= m, n <= 6',
      '1 <= word.length <= 15',
      'board and word consist of only lowercase and uppercase English letters.',
    ],
    solutions: {
      python: `class Solution:
    def exist(self, board: List[List[str]], word: str) -> bool:
        rows, cols = len(board), len(board[0])

        def dfs(r, c, i):
            if i == len(word):
                return True
            if r < 0 or r >= rows or c < 0 or c >= cols or board[r][c] != word[i]:
                return False

            temp = board[r][c]
            board[r][c] = '#'
            found = (dfs(r + 1, c, i + 1) or
                     dfs(r - 1, c, i + 1) or
                     dfs(r, c + 1, i + 1) or
                     dfs(r, c - 1, i + 1))
            board[r][c] = temp
            return found

        for r in range(rows):
            for c in range(cols):
                if dfs(r, c, 0):
                    return True
        return False`,
    },
  },
  {
    id: 6,
    title: '3152. Special Array II',
    difficulty: 'Medium',
    url: 'https://leetcode.com/problems/special-array-ii/description/',
    description:
      "An array is considered special if every pair of its adjacent elements contains two numbers with different parity.\n\nYou are given an array of integers nums and a 2D integer matrix queries, where for queries[i] = [from_i, to_i] your task is to check that subarray nums[from_i..to_i] is special or not.\n\nReturn an array of booleans answer such that for each query, answer[i] is true if nums[from_i..to_i] is special, or false otherwise.",
    examples: [
      {
        input: 'nums = [3,4,1,2,6], queries = [[0,4]]',
        output: '[false]',
        explanation: 'The subarray is [3,4,1,2,6]. 2 and 6 are both even, so it is not special.',
      },
      {
        input: 'nums = [4,3,1,6], queries = [[0,2],[2,3]]',
        output: '[false,true]',
        explanation:
          'The subarray [4,3,1] has adjacent elements with different parity, so it is special.\nThe subarray [1,6] has adjacent elements with different parity, so it is special.',
      },
    ],
    constraints: [
      '1 <= nums.length <= 10^5',
      '1 <= nums[i] <= 10^5',
      '1 <= queries.length <= 1.5 * 10^5',
      'queries[i].length == 2',
      '0 <= from_i <= to_i <= nums.length - 1',
    ],
    solutions: {
      python: `class Solution:
    def isArraySpecial(self, nums: List[int], queries: List[List[int]]) -> List[bool]:
        n = len(nums)
        prefix = [0] * n
        for i in range(1, n):
            prefix[i] = prefix[i - 1] + (0 if nums[i] % 2 != nums[i - 1] % 2 else 1)

        return [prefix[r] - prefix[l] == 0 for l, r in queries]`,
    },
  },
  {
    id: 7,
    title: '735. Asteroid Collision',
    difficulty: 'Medium',
    url: 'https://leetcode.com/problems/asteroid-collision/description/',
    description:
      'We are given an array asteroids of integers representing asteroids in a row. For each asteroid, the absolute value represents its size, and the sign represents its direction (positive meaning right, negative meaning left). Each asteroid moves at the same speed.\n\nFind out the state of the asteroids after all collisions. If two asteroids meet, the smaller one will explode. If both are the same size, both will explode. Two asteroids moving in the same direction will never meet.',
    examples: [
      { input: 'asteroids = [5,10,-5]', output: '[5,10]', explanation: 'The 10 and -5 collide resulting in 10. The 5 and 10 never collide.' },
      { input: 'asteroids = [8,-8]', output: '[]', explanation: 'The 8 and -8 collide exploding each other.' },
      { input: 'asteroids = [10,2,-5]', output: '[10]', explanation: 'The 2 and -5 collide resulting in -5. The 10 and -5 collide resulting in 10.' },
    ],
    constraints: [
      '2 <= asteroids.length <= 10^4',
      '-1000 <= asteroids[i] <= 1000',
      'asteroids[i] != 0',
    ],
    solutions: {
      python: `class Solution:
    def asteroidCollision(self, asteroids: List[int]) -> List[int]:
        stack = []
        for a in asteroids:
            alive = True
            while alive and a < 0 and stack and stack[-1] > 0:
                if stack[-1] < -a:
                    stack.pop()
                    continue
                elif stack[-1] == -a:
                    stack.pop()
                alive = False
            if alive:
                stack.append(a)
        return stack`,
    },
  },
  {
    id: 8,
    title: '146. LRU Cache',
    difficulty: 'Medium',
    url: 'https://leetcode.com/problems/lru-cache/description/',
    description:
      "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.\n\nImplement the LRUCache class:\n- LRUCache(int capacity) Initialize the LRU cache with positive size capacity.\n- int get(int key) Return the value of the key if the key exists, otherwise return -1.\n- void put(int key, int value) Update the value of the key if the key exists. Otherwise, add the key-value pair to the cache. If the number of keys exceeds the capacity from this operation, evict the least recently used key.\n\nThe functions get and put must each run in O(1) average time complexity.",
    examples: [
      {
        input:
          '["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]\n[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]',
        output: '[null, null, null, 1, null, -1, null, -1, 3, 4]',
        explanation:
          'LRUCache lRUCache = new LRUCache(2);\nlRUCache.put(1, 1);\nlRUCache.put(2, 2);\nlRUCache.get(1);    // return 1\nlRUCache.put(3, 3); // evicts key 2\nlRUCache.get(2);    // returns -1 (not found)\nlRUCache.put(4, 4); // evicts key 1\nlRUCache.get(1);    // return -1 (not found)\nlRUCache.get(3);    // return 3\nlRUCache.get(4);    // return 4',
      },
    ],
    constraints: [
      '1 <= capacity <= 3000',
      '0 <= key <= 10^4',
      '0 <= value <= 10^5',
      'At most 2 * 10^5 calls will be made to get and put.',
    ],
    solutions: {
      python: `from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = OrderedDict()

    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        self.cache.move_to_end(key)
        return self.cache[key]

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.capacity:
            self.cache.popitem(last=False)`,
    },
  },
  {
    id: 9,
    title: '1621. Number of Sets of K Non-Overlapping Line Segments',
    difficulty: 'Medium',
    url: 'https://leetcode.com/problems/number-of-sets-of-k-non-overlapping-line-segments/description/',
    description:
      'Given n points on a 1-D plane, where the ith point (from 0 to n-1) is at x = i, find the number of ways we can draw exactly k non-overlapping line segments such that each segment covers two or more points. The endpoints of each line segment must have integral coordinates. The k line segments do not have to cover all n points, and they are allowed to share endpoints.\n\nReturn the number of ways we can draw k non-overlapping line segments. Since this number can be huge, return it modulo 10^9 + 7.',
    examples: [
      {
        input: 'n = 4, k = 2',
        output: '5',
        explanation:
          'The two line segments are shown in red and blue. The image above shows the 5 different ways {(0,2),(2,3)}, {(0,1),(1,3)}, {(0,1),(2,3)}, {(1,2),(2,3)}, {(0,1),(1,2)}.',
      },
      { input: 'n = 3, k = 1', output: '3', explanation: '' },
      { input: 'n = 30, k = 7', output: '796297179', explanation: '' },
    ],
    constraints: ['2 <= n <= 1000', '1 <= k <= n - 1'],
    solutions: {
      python: `class Solution:
    def numberOfSets(self, n: int, k: int) -> int:
        MOD = 10 ** 9 + 7
        # dp[i] = ways to place the current number of segments using points 0..i
        dp = [1] * n

        for _ in range(k):
            new_dp = [0] * n
            prefix = 0
            for i in range(n):
                new_dp[i] = ((new_dp[i - 1] if i > 0 else 0) + prefix) % MOD
                prefix = (prefix + dp[i]) % MOD
            dp = new_dp

        return dp[-1] % MOD`,
    },
  },
  {
    id: 10,
    title: '34. Find First and Last Position of Element in Sorted Array',
    difficulty: 'Medium',
    url: 'https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/description/',
    description:
      'Given an array of integers nums sorted in non-decreasing order, find the starting and ending position of a given target value.\n\nIf target is not found in the array, return [-1, -1].\n\nYou must write an algorithm with O(log n) runtime complexity.',
    examples: [
      { input: 'nums = [5,7,7,8,8,10], target = 8', output: '[3,4]', explanation: '' },
      { input: 'nums = [5,7,7,8,8,10], target = 6', output: '[-1,-1]', explanation: '' },
      { input: 'nums = [], target = 0', output: '[-1,-1]', explanation: '' },
    ],
    constraints: [
      '0 <= nums.length <= 10^5',
      '-10^9 <= nums[i] <= 10^9',
      'nums is a non-decreasing array.',
      '-10^9 <= target <= 10^9',
    ],
    solutions: {
      python: `import bisect

class Solution:
    def searchRange(self, nums: List[int], target: int) -> List[int]:
        left = bisect.bisect_left(nums, target)
        if left == len(nums) or nums[left] != target:
            return [-1, -1]
        right = bisect.bisect_right(nums, target) - 1
        return [left, right]`,
    },
  },
]

export default leetcodeProblems
