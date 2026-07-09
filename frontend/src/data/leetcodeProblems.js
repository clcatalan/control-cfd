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
      javascript: `/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var maxFrequency = function(nums, k) {
    nums.sort((a, b) => a - b);
    let left = 0;
    let total = 0;
    let best = 1;
    for (let right = 0; right < nums.length; right++) {
        total += nums[right];
        while (nums[right] * (right - left + 1) - total > k) {
            total -= nums[left];
            left++;
        }
        best = Math.max(best, right - left + 1);
    }
    return best;
};`,
      java: `class Solution {
    public int maxFrequency(int[] nums, int k) {
        Arrays.sort(nums);
        int left = 0;
        long total = 0;
        int best = 1;
        for (int right = 0; right < nums.length; right++) {
            total += nums[right];
            while ((long) nums[right] * (right - left + 1) - total > k) {
                total -= nums[left];
                left++;
            }
            best = Math.max(best, right - left + 1);
        }
        return best;
    }
}`,
      cpp: `class Solution {
public:
    int maxFrequency(vector<int>& nums, int k) {
        sort(nums.begin(), nums.end());
        int left = 0;
        long long total = 0;
        int best = 1;
        for (int right = 0; right < (int)nums.size(); right++) {
            total += nums[right];
            while ((long long) nums[right] * (right - left + 1) - total > k) {
                total -= nums[left];
                left++;
            }
            best = max(best, right - left + 1);
        }
        return best;
    }
};`,
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
                    if sign == '' or sign == '+':
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
      javascript: `/**
 * @param {string} equation
 * @return {string}
 */
var solveEquation = function(equation) {
    const parse = (expr) => {
        expr = expr.split('-').join('+-');
        let coef = 0;
        let const_ = 0;
        for (const term of expr.split('+')) {
            if (term === '') continue;
            if (term.includes('x')) {
                const sign = term.slice(0, -1);
                if (sign === '' || sign === '+') coef += 1;
                else if (sign === '-') coef -= 1;
                else coef += parseInt(sign, 10);
            } else {
                const_ += parseInt(term, 10);
            }
        }
        return [coef, const_];
    };

    const [left, right] = equation.split('=');
    const [coefL, constL] = parse(left);
    const [coefR, constR] = parse(right);

    const coef = coefL - coefR;
    const constant = constR - constL;

    if (coef === 0) {
        return constant === 0 ? "Infinite solutions" : "No solution";
    }
    return \`x=\${constant / coef}\`;
};`,
      java: `class Solution {
    public String solveEquation(String equation) {
        String[] sides = equation.split("=");
        int[] left = parse(sides[0]);
        int[] right = parse(sides[1]);

        int coef = left[0] - right[0];
        int constant = right[1] - left[1];

        if (coef == 0) {
            return constant == 0 ? "Infinite solutions" : "No solution";
        }
        return "x=" + (constant / coef);
    }

    private int[] parse(String expr) {
        expr = expr.replace("-", "+-");
        int coef = 0, constant = 0;
        for (String term : expr.split("\\\\+")) {
            if (term.isEmpty()) continue;
            if (term.contains("x")) {
                String sign = term.substring(0, term.length() - 1);
                if (sign.isEmpty() || sign.equals("+")) coef += 1;
                else if (sign.equals("-")) coef -= 1;
                else coef += Integer.parseInt(sign);
            } else {
                constant += Integer.parseInt(term);
            }
        }
        return new int[]{coef, constant};
    }
}`,
      cpp: `class Solution {
public:
    string solveEquation(string equation) {
        int eq = equation.find('=');
        string left = equation.substr(0, eq);
        string right = equation.substr(eq + 1);

        auto [coefL, constL] = parse(left);
        auto [coefR, constR] = parse(right);

        int coef = coefL - coefR;
        int constant = constR - constL;

        if (coef == 0) {
            return constant == 0 ? "Infinite solutions" : "No solution";
        }
        return "x=" + to_string(constant / coef);
    }

private:
    pair<int, int> parse(string expr) {
        string normalized;
        for (char c : expr) {
            if (c == '-') {
                normalized += '+';
                normalized += '-';
            } else {
                normalized += c;
            }
        }

        int coef = 0, constant = 0;
        stringstream ss(normalized);
        string term;
        while (getline(ss, term, '+')) {
            if (term.empty()) continue;
            if (term.find('x') != string::npos) {
                string sign = term.substr(0, term.size() - 1);
                if (sign.empty() || sign == "+") coef += 1;
                else if (sign == "-") coef -= 1;
                else coef += stoi(sign);
            } else {
                constant += stoi(term);
            }
        }
        return {coef, constant};
    }
};`,
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
      javascript: `/**
 * @param {string} s
 * @return {number}
 */
var calculate = function(s) {
    const stack = [];
    let num = 0;
    let sign = '+';
    s = s + '+';
    for (const ch of s) {
        if (ch >= '0' && ch <= '9') {
            num = num * 10 + Number(ch);
        } else if (ch !== ' ') {
            if (sign === '+') stack.push(num);
            else if (sign === '-') stack.push(-num);
            else if (sign === '*') stack.push(stack.pop() * num);
            else if (sign === '/') {
                const prev = stack.pop();
                stack.push(Math.trunc(prev / num));
            }
            sign = ch;
            num = 0;
        }
    }
    return stack.reduce((a, b) => a + b, 0);
};`,
      java: `class Solution {
    public int calculate(String s) {
        Deque<Integer> stack = new ArrayDeque<>();
        int num = 0;
        char sign = '+';
        s = s + "+";
        for (char ch : s.toCharArray()) {
            if (Character.isDigit(ch)) {
                num = num * 10 + (ch - '0');
            } else if (ch != ' ') {
                if (sign == '+') stack.push(num);
                else if (sign == '-') stack.push(-num);
                else if (sign == '*') stack.push(stack.pop() * num);
                else if (sign == '/') {
                    int prev = stack.pop();
                    stack.push(prev / num);
                }
                sign = ch;
                num = 0;
            }
        }
        int result = 0;
        for (int n : stack) result += n;
        return result;
    }
}`,
      cpp: `class Solution {
public:
    int calculate(string s) {
        vector<int> stack;
        int num = 0;
        char sign = '+';
        s += '+';
        for (char ch : s) {
            if (isdigit(ch)) {
                num = num * 10 + (ch - '0');
            } else if (ch != ' ') {
                if (sign == '+') stack.push_back(num);
                else if (sign == '-') stack.push_back(-num);
                else if (sign == '*') stack.back() *= num;
                else if (sign == '/') stack.back() /= num;
                sign = ch;
                num = 0;
            }
        }
        int result = 0;
        for (int n : stack) result += n;
        return result;
    }
};`,
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
      javascript: `/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var minRemoval = function(nums, k) {
    nums.sort((a, b) => a - b);
    const n = nums.length;
    let left = 0;
    let best = 1;
    for (let right = 0; right < n; right++) {
        while (nums[right] > nums[left] * k) {
            left++;
        }
        best = Math.max(best, right - left + 1);
    }
    return n - best;
};`,
      java: `class Solution {
    public int minRemoval(int[] nums, int k) {
        Arrays.sort(nums);
        int n = nums.length;
        int left = 0;
        int best = 1;
        for (int right = 0; right < n; right++) {
            while ((long) nums[right] > (long) nums[left] * k) {
                left++;
            }
            best = Math.max(best, right - left + 1);
        }
        return n - best;
    }
}`,
      cpp: `class Solution {
public:
    int minRemoval(vector<int>& nums, int k) {
        sort(nums.begin(), nums.end());
        int n = nums.size();
        int left = 0;
        int best = 1;
        for (int right = 0; right < n; right++) {
            while ((long long) nums[right] > (long long) nums[left] * k) {
                left++;
            }
            best = max(best, right - left + 1);
        }
        return n - best;
    }
};`,
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
      javascript: `/**
 * @param {character[][]} board
 * @param {string} word
 * @return {boolean}
 */
var exist = function(board, word) {
    const rows = board.length;
    const cols = board[0].length;

    const dfs = (r, c, i) => {
        if (i === word.length) return true;
        if (r < 0 || r >= rows || c < 0 || c >= cols || board[r][c] !== word[i]) return false;

        const temp = board[r][c];
        board[r][c] = '#';
        const found = dfs(r + 1, c, i + 1) ||
                      dfs(r - 1, c, i + 1) ||
                      dfs(r, c + 1, i + 1) ||
                      dfs(r, c - 1, i + 1);
        board[r][c] = temp;
        return found;
    };

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (dfs(r, c, 0)) return true;
        }
    }
    return false;
};`,
      java: `class Solution {
    private int rows, cols;
    private char[][] board;
    private String word;

    public boolean exist(char[][] board, String word) {
        this.board = board;
        this.word = word;
        this.rows = board.length;
        this.cols = board[0].length;

        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (dfs(r, c, 0)) return true;
            }
        }
        return false;
    }

    private boolean dfs(int r, int c, int i) {
        if (i == word.length()) return true;
        if (r < 0 || r >= rows || c < 0 || c >= cols || board[r][c] != word.charAt(i)) return false;

        char temp = board[r][c];
        board[r][c] = '#';
        boolean found = dfs(r + 1, c, i + 1) ||
                         dfs(r - 1, c, i + 1) ||
                         dfs(r, c + 1, i + 1) ||
                         dfs(r, c - 1, i + 1);
        board[r][c] = temp;
        return found;
    }
}`,
      cpp: `class Solution {
public:
    bool exist(vector<vector<char>>& board, string word) {
        rows = board.size();
        cols = board[0].size();
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (dfs(board, word, r, c, 0)) return true;
            }
        }
        return false;
    }

private:
    int rows, cols;

    bool dfs(vector<vector<char>>& board, const string& word, int r, int c, int i) {
        if (i == (int) word.size()) return true;
        if (r < 0 || r >= rows || c < 0 || c >= cols || board[r][c] != word[i]) return false;

        char temp = board[r][c];
        board[r][c] = '#';
        bool found = dfs(board, word, r + 1, c, i + 1) ||
                     dfs(board, word, r - 1, c, i + 1) ||
                     dfs(board, word, r, c + 1, i + 1) ||
                     dfs(board, word, r, c - 1, i + 1);
        board[r][c] = temp;
        return found;
    }
};`,
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
      javascript: `/**
 * @param {number[]} nums
 * @param {number[][]} queries
 * @return {boolean[]}
 */
var isArraySpecial = function(nums, queries) {
    const n = nums.length;
    const prefix = new Array(n).fill(0);
    for (let i = 1; i < n; i++) {
        prefix[i] = prefix[i - 1] + (nums[i] % 2 !== nums[i - 1] % 2 ? 0 : 1);
    }

    return queries.map(([l, r]) => prefix[r] - prefix[l] === 0);
};`,
      java: `class Solution {
    public boolean[] isArraySpecial(int[] nums, int[][] queries) {
        int n = nums.length;
        int[] prefix = new int[n];
        for (int i = 1; i < n; i++) {
            prefix[i] = prefix[i - 1] + (nums[i] % 2 != nums[i - 1] % 2 ? 0 : 1);
        }

        boolean[] answer = new boolean[queries.length];
        for (int i = 0; i < queries.length; i++) {
            int l = queries[i][0], r = queries[i][1];
            answer[i] = prefix[r] - prefix[l] == 0;
        }
        return answer;
    }
}`,
      cpp: `class Solution {
public:
    vector<bool> isArraySpecial(vector<int>& nums, vector<vector<int>>& queries) {
        int n = nums.size();
        vector<int> prefix(n, 0);
        for (int i = 1; i < n; i++) {
            prefix[i] = prefix[i - 1] + (nums[i] % 2 != nums[i - 1] % 2 ? 0 : 1);
        }

        vector<bool> answer;
        answer.reserve(queries.size());
        for (auto& q : queries) {
            answer.push_back(prefix[q[1]] - prefix[q[0]] == 0);
        }
        return answer;
    }
};`,
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
      javascript: `/**
 * @param {number[]} asteroids
 * @return {number[]}
 */
var asteroidCollision = function(asteroids) {
    const stack = [];
    for (const a of asteroids) {
        let alive = true;
        while (alive && a < 0 && stack.length && stack[stack.length - 1] > 0) {
            const top = stack[stack.length - 1];
            if (top < -a) {
                stack.pop();
                continue;
            } else if (top === -a) {
                stack.pop();
            }
            alive = false;
        }
        if (alive) stack.push(a);
    }
    return stack;
};`,
      java: `class Solution {
    public int[] asteroidCollision(int[] asteroids) {
        Deque<Integer> stack = new ArrayDeque<>();
        for (int a : asteroids) {
            boolean alive = true;
            while (alive && a < 0 && !stack.isEmpty() && stack.peekLast() > 0) {
                int top = stack.peekLast();
                if (top < -a) {
                    stack.pollLast();
                    continue;
                } else if (top == -a) {
                    stack.pollLast();
                }
                alive = false;
            }
            if (alive) stack.addLast(a);
        }

        int[] result = new int[stack.size()];
        int i = 0;
        for (int val : stack) result[i++] = val;
        return result;
    }
}`,
      cpp: `class Solution {
public:
    vector<int> asteroidCollision(vector<int>& asteroids) {
        vector<int> stack;
        for (int a : asteroids) {
            bool alive = true;
            while (alive && a < 0 && !stack.empty() && stack.back() > 0) {
                if (stack.back() < -a) {
                    stack.pop_back();
                    continue;
                } else if (stack.back() == -a) {
                    stack.pop_back();
                }
                alive = false;
            }
            if (alive) stack.push_back(a);
        }
        return stack;
    }
};`,
    },
  },
  {
    id: 8,
    title: '146. LRU Cache',
    difficulty: 'Medium',
    url: 'https://leetcode.com/problems/lru-cache/description/',
    description:
      "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.\n\nImplement the LRUCache class:\n- LRUCache(int capacity) Initialize the LRU cache with positive size capacity.\n- int get(int key) Return the value of the key if the key exists, otherwise return -1.\n- void put(int key, int value) Update the value of the key if the key exists. Otherwise, add the key-value pair to the cache. If the number of keys exceeds the capacity from this operation, evict the least recently used key.",
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
      javascript: `/**
 * @param {number} capacity
 */
var LRUCache = function(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
};

/**
 * @param {number} key
 * @return {number}
 */
LRUCache.prototype.get = function(key) {
    if (!this.cache.has(key)) return -1;
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
};

/**
 * @param {number} key
 * @param {number} value
 * @return {void}
 */
LRUCache.prototype.put = function(key, value) {
    if (this.cache.has(key)) {
        this.cache.delete(key);
    }
    this.cache.set(key, value);
    if (this.cache.size > this.capacity) {
        const oldestKey = this.cache.keys().next().value;
        this.cache.delete(oldestKey);
    }
};`,
      java: `class LRUCache extends LinkedHashMap<Integer, Integer> {
    private int capacity;

    public LRUCache(int capacity) {
        super(capacity, 0.75f, true);
        this.capacity = capacity;
    }

    public int get(int key) {
        return super.getOrDefault(key, -1);
    }

    public void put(int key, int value) {
        super.put(key, value);
    }

    @Override
    protected boolean removeEldestEntry(Map.Entry<Integer, Integer> eldest) {
        return size() > capacity;
    }
}`,
      cpp: `class LRUCache {
public:
    LRUCache(int capacity) : capacity(capacity) {}

    int get(int key) {
        auto it = map.find(key);
        if (it == map.end()) return -1;
        order.splice(order.begin(), order, it->second);
        return it->second->second;
    }

    void put(int key, int value) {
        auto it = map.find(key);
        if (it != map.end()) {
            it->second->second = value;
            order.splice(order.begin(), order, it->second);
            return;
        }
        order.emplace_front(key, value);
        map[key] = order.begin();
        if ((int) map.size() > capacity) {
            auto last = order.back();
            map.erase(last.first);
            order.pop_back();
        }
    }

private:
    int capacity;
    list<pair<int, int>> order;
    unordered_map<int, list<pair<int, int>>::iterator> map;
};`,
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
      javascript: `/**
 * @param {number} n
 * @param {number} k
 * @return {number}
 */
var numberOfSets = function(n, k) {
    const MOD = 1000000007;
    let dp = new Array(n).fill(1);

    for (let iter = 0; iter < k; iter++) {
        const newDp = new Array(n).fill(0);
        let prefix = 0;
        for (let i = 0; i < n; i++) {
            newDp[i] = ((i > 0 ? newDp[i - 1] : 0) + prefix) % MOD;
            prefix = (prefix + dp[i]) % MOD;
        }
        dp = newDp;
    }

    return dp[n - 1];
};`,
      java: `class Solution {
    public int numberOfSets(int n, int k) {
        final int MOD = 1_000_000_007;
        long[] dp = new long[n];
        Arrays.fill(dp, 1);

        for (int iter = 0; iter < k; iter++) {
            long[] newDp = new long[n];
            long prefix = 0;
            for (int i = 0; i < n; i++) {
                newDp[i] = ((i > 0 ? newDp[i - 1] : 0) + prefix) % MOD;
                prefix = (prefix + dp[i]) % MOD;
            }
            dp = newDp;
        }

        return (int) (dp[n - 1] % MOD);
    }
}`,
      cpp: `class Solution {
public:
    int numberOfSets(int n, int k) {
        const long long MOD = 1e9 + 7;
        vector<long long> dp(n, 1);

        for (int iter = 0; iter < k; iter++) {
            vector<long long> newDp(n, 0);
            long long prefix = 0;
            for (int i = 0; i < n; i++) {
                newDp[i] = ((i > 0 ? newDp[i - 1] : 0) + prefix) % MOD;
                prefix = (prefix + dp[i]) % MOD;
            }
            dp = newDp;
        }

        return (int) (dp[n - 1] % MOD);
    }
};`,
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
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var searchRange = function(nums, target) {
    const lowerBound = (val) => {
        let lo = 0, hi = nums.length;
        while (lo < hi) {
            const mid = (lo + hi) >> 1;
            if (nums[mid] < val) lo = mid + 1;
            else hi = mid;
        }
        return lo;
    };

    const left = lowerBound(target);
    if (left === nums.length || nums[left] !== target) return [-1, -1];
    const right = lowerBound(target + 1) - 1;
    return [left, right];
};`,
      java: `class Solution {
    public int[] searchRange(int[] nums, int target) {
        int left = lowerBound(nums, target);
        if (left == nums.length || nums[left] != target) return new int[]{-1, -1};
        int right = lowerBound(nums, target + 1) - 1;
        return new int[]{left, right};
    }

    private int lowerBound(int[] nums, int val) {
        int lo = 0, hi = nums.length;
        while (lo < hi) {
            int mid = (lo + hi) >>> 1;
            if (nums[mid] < val) lo = mid + 1;
            else hi = mid;
        }
        return lo;
    }
}`,
      cpp: `class Solution {
public:
    vector<int> searchRange(vector<int>& nums, int target) {
        int left = (int)(lower_bound(nums.begin(), nums.end(), target) - nums.begin());
        if (left == (int) nums.size() || nums[left] != target) return {-1, -1};
        int right = (int)(lower_bound(nums.begin(), nums.end(), target + 1) - nums.begin()) - 1;
        return {left, right};
    }
};`,
    },
  },
]

export default leetcodeProblems
