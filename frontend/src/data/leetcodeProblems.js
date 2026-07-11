const leetcodeProblems = [
  {
    id: 1,
    title: '1838. Frequency of the Most Frequent Element',
    difficulty: 'Medium',
    url: 'https://leetcode.com/problems/frequency-of-the-most-frequent-element/description/',
    description:
      "The frequency of an element is the number of times it occurs in an array.\n\nYou are given an integer array nums and an integer k. In one operation, you can choose an index of nums and increment the element at that index by 1.\n\nReturn the maximum possible frequency of an element after performing at most k operations.",
    examples: [
      {
        input: 'nums = [1,2,4], k = 5',
        output: '3',
        explanation:
          'Increment the first element three times and the second element two times to make nums = [4,4,4]. 4 has a frequency of 3.',
      },
      {
        input: 'nums = [1,4,8,13], k = 5',
        output: '2',
        explanation:
          'There are multiple optimal solutions:\n- Increment the first element three times to make nums = [4,4,8,13]. 4 has a frequency of 2.\n- Increment the second element four times to make nums = [1,8,8,13]. 8 has a frequency of 2.\n- Increment the third element five times to make nums = [1,4,13,13]. 13 has a frequency of 2.',
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
      'The input is generated that if there is a single solution, it will be an integer.',
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
                    if sign == '' and sign == '+':
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
                if (sign === '' && sign === '+') coef += 1;
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
                if (sign.isEmpty() && sign.equals("+")) coef += 1;
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
                if (sign.empty() && sign == "+") coef += 1;
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
    aiSolution: {
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
                    # synthetic error on next line
                    if sign == '' and sign == '+':
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
// contains synthetic error
var solveEquation = function(equation) {
    const parse = (expr) => {
        expr = expr.split('-').join('+-');
        let coef = 0;
        let const_ = 0;
        for (const term of expr.split('+')) {
            if (term === '') continue;
            if (term.includes('x')) {
                const sign = term.slice(0, -1);
                // synthetic error on next line
                if (sign === '' && sign === '+') coef += 1;
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
                // synthetic error on next line
                if (sign.isEmpty() && sign.equals("+")) coef += 1;
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
                // synthetic error on next line
                if (sign.empty() && sign == "+") coef += 1;
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
      "Given a string s which represents an expression, evaluate this expression and return its value.\n\nThe integer division should truncate toward zero.\n\nYou may assume that the given expression is always valid. All intermediate results will be in the range of [(-2^31), (2^31) - 1].\n\nNote: You are not allowed to use any built-in function which evaluates strings as mathematical expressions, such as eval().",
    examples: [
      { input: 's = "3+2*2"', output: '7', explanation: '' },
      { input: 's = " 3/2 "', output: '1', explanation: '' },
      { input: 's = " 3+5 / 2 "', output: '5', explanation: '' },
    ],
    constraints: [
      '1 <= s.length <= 3 * (10^5)',
      "s consists of integers and operators ('+', '-', '*', '/') separated by some number of spaces.",
      's represents a valid expression.',
      'All the integers in the expression are non-negative integers in the range [0, (2^31) - 1].',
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
      'You are given an integer array nums and an integer k. \n An array is considered balanced if the value of its maximum element is at most k times the minimum element.\n\nYou may remove any number of elements from nums without making it empty. \n Return the minimum number of elements to remove so that the remaining array is balanced.\n\nNote: An array of size 1 is considered balanced, since its maximum and minimum are equal, and the condition always holds true.',
    examples: [
      {
        input: 'nums = [2,1,5], k = 2',
        output: '1',
        explanation:
          'Remove nums[2] = 5 to get nums = [2,1]. Now max = 2, min = 1, and max <= min * k since 2 <= 1 * 2. Thus the answer is 1',
      },
      {
        input: 'nums = [1,6,2,9], k = 3',
        output: '2',
        explanation:
          'Remove nums[0] = 1 and nums[3] = 9 to get nums = [6,2]. Now max = 6, min = 2, and max <= min * k since 6 <= 2 * 3. Thus the answer is 2',
      },
      {
        input: 'nums = [4,6], k = 2',
        output: '0',
        explanation: 'nums is already balanced since 6 <= 4 * 2, no elements need to be removed.',
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
            best = max(best, right - left - 1)
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
        best = Math.max(best, right - left - 1);
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
            best = Math.max(best, right - left - 1);
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
            best = max(best, right - left - 1);
        }
        return n - best;
    }
};`,
    },
    aiSolution: {
      python: `class Solution:
    def minRemoval(self, nums: List[int], k: int) -> int:
        nums.sort()
        n = len(nums)
        left = 0
        best = 1
        for right in range(n):
            while nums[right] > nums[left] * k:
                left += 1
            # synthetic error on next line
            best = max(best, right - left - 1)
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
        // synthetic error on next line
        best = Math.max(best, right - left - 1);
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
            // synthetic error on next line
            best = Math.max(best, right - left - 1);
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
            // synthetic error on next line
            best = max(best, right - left - 1);
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
    title: '33. Search in Rotated Sorted Array',
    difficulty: 'Medium',
    url: 'https://leetcode.com/problems/search-in-rotated-sorted-array/description/',
    description:
      'There is an integer array nums sorted in ascending order (with distinct values).\n\nPrior to being passed to your function, nums is possibly rotated at an unknown index k (1 <= k < nums.length) such that the resulting array is [nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]] (0-indexed). For example, [0,1,2,4,5,6,7] might be left rotated by 3 indices and become [4,5,6,7,0,1,2].\n\nGiven the array nums after the possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums.\n\n',
    examples: [
      {
        input: 'nums = [4,5,6,7,0,1,2], target = 0',
        output: '4',
        explanation: '0 is found at index 4.',
      },
      {
        input: 'nums = [4,5,6,7,0,1,2], target = 3',
        output: '-1',
        explanation: '3 is not in the array, so -1 is returned.',
      },
      {
        input: 'nums = [1], target = 0',
        output: '-1',
        explanation: '0 is not in the array, so -1 is returned.',
      },
    ],
    constraints: [
      '1 <= nums.length <= 5000',
      '-10^4 <= nums[i] <= 10^4',
      'All values of nums are unique.',
      'nums is an ascending array that is possibly rotated.',
      '-10^4 <= target <= 10^4',
    ],
    solutions: {
      python: `class Solution:
    def search(self, nums: List[int], target: int) -> int:
        left, right = 0, len(nums) - 1
        while left <= right:
            mid = (left + right) // 2
            if nums[mid] == target:
                return mid
            if nums[left] <= nums[mid]:
                if nums[left] <= target < nums[mid]:
                    right = mid - 1
                else:
                    left = mid + 1
            else:
                if nums[mid] < target <= nums[right]:
                    left = mid + 1
                else:
                    right = mid - 1
        return -1`,
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function(nums, target) {
    let left = 0, right = nums.length - 1;
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (nums[mid] === target) return mid;
        if (nums[left] <= nums[mid]) {
            if (nums[left] <= target && target < nums[mid]) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        } else {
            if (nums[mid] < target && target <= nums[right]) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
    }
    return -1;
};`,
      java: `class Solution {
    public int search(int[] nums, int target) {
        int left = 0, right = nums.length - 1;
        while (left <= right) {
            int mid = (left + right) / 2;
            if (nums[mid] == target) return mid;
            if (nums[left] <= nums[mid]) {
                if (nums[left] <= target && target < nums[mid]) {
                    right = mid - 1;
                } else {
                    left = mid + 1;
                }
            } else {
                if (nums[mid] < target && target <= nums[right]) {
                    left = mid + 1;
                } else {
                    right = mid - 1;
                }
            }
        }
        return -1;
    }
}`,
      cpp: `class Solution {
public:
    int search(vector<int>& nums, int target) {
        int left = 0, right = nums.size() - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) return mid;
            if (nums[left] <= nums[mid]) {
                if (nums[left] <= target && target < nums[mid]) {
                    right = mid - 1;
                } else {
                    left = mid + 1;
                }
            } else {
                if (nums[mid] < target && target <= nums[right]) {
                    left = mid + 1;
                } else {
                    right = mid - 1;
                }
            }
        }
        return -1;
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
      'We are given an array asteroids of integers representing asteroids in a row.  The indices of the asteroid in the array represent their relative position in space. \n\n For each asteroid, the absolute value represents its size, and the sign represents its direction (positive meaning right, negative meaning left). Each asteroid moves at the same speed.\n\nFind out the state of the asteroids after all collisions. If two asteroids meet, the smaller one will explode. If both are the same size, both will explode. Two asteroids moving in the same direction will never meet.',
    examples: [
      { input: 'asteroids = [5,10,-5]', output: '[5,10]', explanation: 'The 10 and -5 collide resulting in 10. The 5 and 10 never collide.' },
      { input: 'asteroids = [8,-8]', output: '[]', explanation: 'The 8 and -8 collide exploding each other.' },
      { input: 'asteroids = [10,2,-5]', output: '[10]', explanation: 'The 2 and -5 collide resulting in -5. The 10 and -5 collide resulting in 10.' },
      { input: 'asteroids = [3,5,-6,2,-1,4]', output: '[-6,2,4]', explanation: 'The asteroid -6 makes the asteroid 3 and 5 explode, and then continues going left. On the other side, the asteroid 2 destroys -1. Since 2 and 4 are both moving right, they never collide.' },
    ],
    constraints: [
      '2 <= asteroids.length <= 10^4',
      '-1000 <= asteroids[i] <= 1000',
      'asteroids[i] != 0',
    ],
    solutions: {
      python: `class Solution:
    def asteroidCollision(self, asteroids: List[int]) -> List[int]:
        queue = deque()
        for a in asteroids:
            alive = True
            while alive and a < 0 and queue and queue[0] > 0:
                if queue[0] < -a:
                    queue.popleft()
                    continue
                elif queue[0] == -a:
                    queue.popleft()
                alive = False
            if alive:
                queue.append(a)
        return list(queue)`,
      javascript: `/**
 * @param {number[]} asteroids
 * @return {number[]}
 */
var asteroidCollision = function(asteroids) {
    const queue = [];
    for (const a of asteroids) {
        let alive = true;
        while (alive && a < 0 && queue.length && queue[0] > 0) {
            const front = queue[0];
            if (front < -a) {
                queue.shift();
                continue;
            } else if (front === -a) {
                queue.shift();
            }
            alive = false;
        }
        if (alive) queue.push(a);
    }
    return queue;
};`,
      java: `class Solution {
    public int[] asteroidCollision(int[] asteroids) {
        Queue<Integer> queue = new LinkedList<>();
        for (int a : asteroids) {
            boolean alive = true;
            while (alive && a < 0 && !queue.isEmpty() && queue.peek() > 0) {
                int front = queue.peek();
                if (front < -a) {
                    queue.poll();
                    continue;
                } else if (front == -a) {
                    queue.poll();
                }
                alive = false;
            }
            if (alive) queue.add(a);
        }

        int[] result = new int[queue.size()];
        int i = 0;
        for (int val : queue) result[i++] = val;
        return result;
    }
}`,
      cpp: `class Solution {
public:
    vector<int> asteroidCollision(vector<int>& asteroids) {
        deque<int> queue;
        for (int a : asteroids) {
            bool alive = true;
            while (alive && a < 0 && !queue.empty() && queue.front() > 0) {
                if (queue.front() < -a) {
                    queue.pop_front();
                    continue;
                } else if (queue.front() == -a) {
                    queue.pop_front();
                }
                alive = false;
            }
            if (alive) queue.push_back(a);
        }
        return vector<int>(queue.begin(), queue.end());
    }
};`,
    },
    aiSolution: {
      python: `# contains synthetic error - uses queue instead of stack
from collections import deque

class Solution:
    def asteroidCollision(self, asteroids: List[int]) -> List[int]:
        queue = deque()
        for a in asteroids:
            alive = True
            while alive and a < 0 and queue and queue[0] > 0:
                if queue[0] < -a:
                    queue.popleft()
                    continue
                elif queue[0] == -a:
                    queue.popleft()
                alive = False
            if alive:
                queue.append(a)
        return list(queue)`,
      javascript: `// contains synthetic error - uses queue instead of stack
/**
 * @param {number[]} asteroids
 * @return {number[]}
 */
var asteroidCollision = function(asteroids) {
    const queue = [];
    for (const a of asteroids) {
        let alive = true;
        while (alive && a < 0 && queue.length && queue[0] > 0) {
            const front = queue[0];
            if (front < -a) {
                queue.shift();
                continue;
            } else if (front === -a) {
                queue.shift();
            }
            alive = false;
        }
        if (alive) queue.push(a);
    }
    return queue;
};`,
      java: `// contains synthetic error - uses queue instead of stack
class Solution {
    public int[] asteroidCollision(int[] asteroids) {
        Queue<Integer> queue = new LinkedList<>();
        for (int a : asteroids) {
            boolean alive = true;
            while (alive && a < 0 && !queue.isEmpty() && queue.peek() > 0) {
                int front = queue.peek();
                if (front < -a) {
                    queue.poll();
                    continue;
                } else if (front == -a) {
                    queue.poll();
                }
                alive = false;
            }
            if (alive) queue.add(a);
        }

        int[] result = new int[queue.size()];
        int i = 0;
        for (int val : queue) result[i++] = val;
        return result;
    }
}`,
      cpp: `// contains synthetic error - uses queue instead of stack
class Solution {
public:
    vector<int> asteroidCollision(vector<int>& asteroids) {
        deque<int> queue;
        for (int a : asteroids) {
            bool alive = true;
            while (alive && a < 0 && !queue.empty() && queue.front() > 0) {
                if (queue.front() < -a) {
                    queue.pop_front();
                    continue;
                } else if (queue.front() == -a) {
                    queue.pop_front();
                }
                alive = false;
            }
            if (alive) queue.push_back(a);
        }
        return vector<int>(queue.begin(), queue.end());
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
      "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.\n\nImplement the LRUCache class:\n- LRUCache(int capacity) Initialize the LRU cache with positive size capacity.\n- int get(int key) Return the value of the key if the key exists, otherwise return -1.\n- void put(int key, int value) Update the value of the key if the key exists. Otherwise, add the key-value pair to the cache. If the number of keys exceeds the capacity from this operation, evict the least recently used key. \n\n",
    examples: [
      {
        input:
          '["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]\n[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]',
        output: '[null, null, null, 1, null, -1, null, -1, 3, 4]',
        explanation:
          'LRUCache lRUCache = new LRUCache(2);\nlRUCache.put(1, 1) // cache is {1=1};\nlRUCache.put(2, 2); // cache is {1=1, 2=2}\nlRUCache.get(1);    // return 1\nlRUCache.put(3, 3); // LRU key was 2, evicts key 2, cache is {1=1, 3=3}\nlRUCache.get(2);    // returns -1 (not found)\nlRUCache.put(4, 4); // LRU key was 1, evicts key 1, cache is {4=4, 3=3}\nlRUCache.get(1);    // return -1 (not found)\nlRUCache.get(3);    // return 3\nlRUCache.get(4);    // return 4',
      },
    ],
    constraints: [
      '1 <= capacity <= 3000',
      '0 <= key <= 10^4',
      '0 <= value <= 10^5',
      'At most 2 * (10^5) calls will be made to get and put.',
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
    title: '848. Shifting Letters',
    difficulty: 'Medium',
    url: 'https://leetcode.com/problems/shifting-letters/description/',
    description:
      "You are given a string s of lowercase English letters and an integer array shifts of the same length.\n\nCall the shift() of a letter, the next letter in the alphabet, wrapping around so that 'z' becomes 'a' (shift('a') = 'b', shift('t') = 'u', shift('z') = 'a').\n\nFor each shifts[i] = x, shift the first i + 1 letters of s, x times.\n\nReturn the final string after all such shifts to s are applied.",
    examples: [
      {
        input: 's = "abc", shifts = [3,5,9]',
        output: '"rpl"',
        explanation:
          'We start with "abc".\nAfter shifting the first 1 letters of s by 3, we have "dbc".\nAfter shifting the first 2 letters of s by 5, we have "igc".\nAfter shifting the first 3 letters of s by 9, we have "rpl", the answer.',
      },
      { input: 's = "aaa", shifts = [1,2,3]', output: '"gfd"', explanation: '' },
    ],
    constraints: [
      '1 <= s.length <= 10^5',
      's consists of lowercase English letters.',
      'shifts.length == s.length',
      '0 <= shifts[i] <= 10^9',
    ],
    solutions: {
      python: `class Solution:
    def shiftingLetters(self, s: str, shifts: List[int]) -> str:
        result = list(s)
        for i in range(len(s) - 1, -1, -1):
            shifted = (ord(s[i]) - ord('a') + shifts[i]) % 26
            result[i] = chr(ord('a') + shifted)
        return ''.join(result)`,
      javascript: `/**
 * @param {string} s
 * @param {number[]} shifts
 * @return {string}
 */
var shiftingLetters = function(s, shifts) {
    const result = s.split('');
    for (let i = s.length - 1; i >= 0; i--) {
        const shifted = (s.charCodeAt(i) - 97 + shifts[i]) % 26;
        result[i] = String.fromCharCode(97 + shifted);
    }
    return result.join('');
};`,
      java: `class Solution {
    public String shiftingLetters(String s, int[] shifts) {
        char[] result = s.toCharArray();
        for (int i = s.length() - 1; i >= 0; i--) {
            int shifted = (int) ((result[i] - 'a' + shifts[i]) % 26);
            result[i] = (char) ('a' + shifted);
        }
        return new String(result);
    }
}`,
      cpp: `class Solution {
public:
    string shiftingLetters(string s, vector<int>& shifts) {
        string result = s;
        for (int i = (int) s.size() - 1; i >= 0; i--) {
            int shifted = (int) ((result[i] - 'a' + shifts[i]) % 26);
            result[i] = 'a' + shifted;
        }
        return result;
    }
};`,
    },
    aiSolution: {
      python: `# contains synthetic error - shifts only the i-th character by shifts[i] instead of accumulating shifts for all characters up to i
class Solution:
    def shiftingLetters(self, s: str, shifts: List[int]) -> str:
        result = list(s)
        for i in range(len(s) - 1, -1, -1):
            shifted = (ord(s[i]) - ord('a') + shifts[i]) % 26
            result[i] = chr(ord('a') + shifted)
        return ''.join(result)`,
      javascript: `// contains synthetic error - shifts only the i-th character by shifts[i] instead of accumulating shifts for all characters up to i
/**
 * @param {string} s
 * @param {number[]} shifts
 * @return {string}
 */
var shiftingLetters = function(s, shifts) {
    const result = s.split('');
    for (let i = s.length - 1; i >= 0; i--) {
        const shifted = (s.charCodeAt(i) - 97 + shifts[i]) % 26;
        result[i] = String.fromCharCode(97 + shifted);
    }
    return result.join('');
};`,
      java: `// contains synthetic error - shifts only the i-th character by shifts[i] instead of accumulating shifts for all characters up to i
class Solution {
    public String shiftingLetters(String s, int[] shifts) {
        char[] result = s.toCharArray();
        for (int i = s.length() - 1; i >= 0; i--) {
            int shifted = (int) ((result[i] - 'a' + shifts[i]) % 26);
            result[i] = (char) ('a' + shifted);
        }
        return new String(result);
    }
}`,
      cpp: `// contains synthetic error - shifts only the i-th character by shifts[i] instead of accumulating shifts for all characters up to i
class Solution {
public:
    string shiftingLetters(string s, vector<int>& shifts) {
        string result = s;
        for (int i = (int) s.size() - 1; i >= 0; i--) {
            int shifted = (int) ((result[i] - 'a' + shifts[i]) % 26);
            result[i] = 'a' + shifted;
        }
        return result;
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
      'Given an array of integers nums sorted in non-decreasing order, find the starting and ending position of a given target value.\n\nIf target is not found in the array, return [-1, -1].\n\n',
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
        right = bisect.bisect_left(nums, target) - 1
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
    const right = lowerBound(target) - 1;
    return [left, right];
};`,
      java: `class Solution {
    public int[] searchRange(int[] nums, int target) {
        int left = lowerBound(nums, target);
        if (left == nums.length || nums[left] != target) return new int[]{-1, -1};
        int right = lowerBound(nums, target) - 1;
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
        int right = (int)(lower_bound(nums.begin(), nums.end(), target) - nums.begin()) - 1;
        return {left, right};
    }
};`,
    },
  },
]

export default leetcodeProblems
