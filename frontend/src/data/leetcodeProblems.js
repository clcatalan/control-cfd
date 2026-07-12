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
    hlePython:
      'The Python solution sorts nums, then slides a two-pointer window (left, right) while tracking a running total, shrinking the window from the left whenever the cost to raise every element up to nums[right] exceeds k. The best variable tracks the largest valid window size seen, which is returned as the answer.',
    hleJava:
      'The Java solution sorts the array with Arrays.sort, then uses a two-pointer sliding window with a running long total, shrinking the window from the left whenever (long) nums[right] * (right - left + 1) - total exceeds k. best is updated with Math.max on each valid window and returned once the loop finishes.',
    hleJS:
      'The JavaScript solution sorts nums numerically with nums.sort((a, b) => a - b), then runs a two-pointer sliding window with a running total, shrinking the window from the left whenever nums[right] * (right - left + 1) - total exceeds k. best is updated with Math.max on every iteration and returned as the final answer.',
    hleCpp:
      'The C++ solution sorts the vector with sort(nums.begin(), nums.end()), then applies a two-pointer sliding window with a running long long total, shrinking the window from the left whenever (long long) nums[right] * (right - left + 1) - total exceeds k. best is updated with max(best, right - left + 1) on each valid window and returned once the loop completes.',
    dlePython:
      'line 3\nThe algorithm starts by calling nums.sort(), which is essential: once sorted, any optimal group of equal elements can be represented as a contiguous window, since it is always cheaper to raise smaller elements up to a nearby larger one than to bridge a gap across unsorted values.\n\nlines 7-8\nThe right pointer expands the window one element at a time in the for loop, adding nums[right] to the running total variable, which represents the sum of all elements currently inside the window.\n\nlines 9-11\nThe key inequality nums[right] * (right - left + 1) - total computes exactly how many increments would be needed to raise every element in the window up to nums[right]; when this exceeds k, the while loop advances left and subtracts nums[left] from total, shrinking the window until the operation budget is respected again.\n\nline 12\nAfter each adjustment, best = max(best, right - left + 1) records the largest feasible window size, which corresponds to the maximum achievable frequency.\n\nlines 1-13\nBecause the window only ever expands or contracts monotonically, the total work is O(n) after the O(n log n) sort, making this an efficient two-pointer/sliding-window solution.',
    dleJava:
      'line 3\nThe algorithm begins with Arrays.sort(nums), which groups equal-cost elements contiguously so any optimal answer can be represented as a window over the sorted array.\n\nlines 5, 7-8\nA for loop advances right, adding nums[right] into a running long total that tracks the sum of the current window; total is declared as long specifically to avoid overflow once it accumulates values from up to 10^5 elements.\n\nlines 9-11\nThe core check (long) nums[right] * (right - left + 1) - total > k casts the multiplication to long before comparing against k, since nums[right] * (right - left + 1) could otherwise overflow a 32-bit int; whenever this cost exceeds k, the inner while loop increments left and subtracts nums[left] from total to shrink the window.\n\nlines 13, 15\nbest = Math.max(best, right - left + 1) is updated on every iteration to track the largest window that stays within the operation budget, and this value is returned as the final answer.\n\nlines 1-16\nThe overall approach runs in O(n log n) time dominated by the sort, with the two-pointer scan itself running in linear time.',
    dleJS:
      'line 7\nThe solution first sorts nums numerically using nums.sort((a, b) => a - b), which is necessary because JavaScript\'s default sort() converts elements to strings and would otherwise order them incorrectly; sorting groups elements so an optimal frequency window is always contiguous.\n\nlines 11-12\nA for loop expands right across the array, adding nums[right] to a running total that represents the sum of the current window\'s elements.\n\nlines 13-15\nThe condition nums[right] * (right - left + 1) - total > k checks whether raising every element in the window up to nums[right] would require more than k increments; if so, the while loop moves left forward and subtracts nums[left] from total until the window is affordable again.\n\nlines 17, 19\nbest = Math.max(best, right - left + 1) is updated after every window adjustment to capture the largest valid window size seen so far, which is returned as the maximum achievable frequency.\n\nlines 1-20\nThis two-pointer technique keeps the scan itself linear, so the overall complexity is O(n log n) due to the initial sort.',
    dleCPP:
      'line 4\nThe algorithm sorts the vector in place with sort(nums.begin(), nums.end()), which is what allows any optimal group of equal elements to be treated as a contiguous window rather than scattered indices.\n\nlines 6, 8-9\nA for loop advances right while accumulating a running long long total that tracks the sum of elements currently in the window; total is declared as long long specifically to prevent overflow, since the array can hold up to 10^5 elements each as large as 10^5.\n\nlines 10-12\nThe condition (long long) nums[right] * (right - left + 1) - total > k explicitly casts the multiplication to long long before comparing to k, because nums[right] * (right - left + 1) can exceed the range of a 32-bit int; when the cost is too high, the while loop advances left and subtracts nums[left] from total to shrink the window back within budget.\n\nlines 14, 16\nbest = max(best, right - left + 1) is updated on every valid window to track the maximum frequency achievable, and it is returned after the loop finishes scanning the whole array.\n\nlines 1-17\nOverall the solution runs in O(n log n) time, dominated by the sort, with the sliding window itself contributing only O(n).',
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
    hlePython:
      'The Python solution splits the equation on \'=\' and parses each side with a helper that walks the terms, normalizing subtraction into addition by replacing \'-\' with \'+-\' before splitting on \'+\'. Each term\'s sign prefix determines whether it contributes an implicit +1, an implicit -1, or an explicit numeric coefficient to the x variable, and the two sides are combined into a single coef and const to solve for x.',
    hleJava:
      'The Java solution splits the equation into two sides using String.split("="), then runs each side through a parse helper that flattens subtraction into addition and walks each term to accumulate a coefficient and a constant. The sign prefix in front of each x term is inspected to determine whether it represents +1, -1, or an explicit numeric coefficient before the two sides are combined to isolate x.',
    hleJS:
      'The JavaScript solution splits the equation string on \'=\' and passes each side through a parse closure that normalizes subtraction into addition using split(\'-\').join(\'+-\') before splitting on \'+\'. Each term\'s sign prefix is examined to decide whether it contributes an implicit +1, an implicit -1, or an explicit coefficient, and the two parsed sides are combined into a final coefficient and constant to compute x.',
    hleCpp:
      'The C++ solution locates the \'=\' character to split the equation into two substrings, then runs each through a parse helper that rewrites every \'-\' as \'+\' followed by \'-\' so the whole expression can be tokenized on \'+\' with a stringstream. Each token\'s sign prefix determines whether it adds +1, -1, or an explicit numeric value to the running coefficient, and the two sides are combined to solve for x.',
    dlePython:
      'lines 4, 6\nThe parse helper normalizes the expression by replacing every \'-\' with \'+-\', which lets the whole string be split uniformly on \'+\' into individual signed terms.\n\nlines 9-16\nFor each term, if it contains an \'x\', the code inspects everything before the \'x\' character as sign; when sign is empty it represents an implicit coefficient of +1, when sign is \'-\' it represents an implicit coefficient of -1, and otherwise sign is parsed as an explicit integer coefficient.\n\nlines 17-19\nTerms without an \'x\' are accumulated into const instead, giving each side of the equation a (coef, const) pair.\n\nlines 21-26\nThe two sides are then combined by subtracting the right side\'s coefficient and constant from the left\'s, producing a single coef and const representing coef * x = const.\n\nlines 28-30\nFinally, if coef is 0 the code returns "Infinite solutions" or "No solution" depending on whether const is also 0, and otherwise returns x = const // coef as the unique integer solution.',
    dleJava:
      'lines 17, 19\nThe parse helper first calls expr.replace("-", "+-") so that every subtraction becomes an explicit addition of a negative term, allowing the whole expression to be split uniformly on "+".\n\nlines 20-25\nFor each resulting term, if it contains an \'x\' the substring before the \'x\' is treated as sign: an empty sign means an implicit +1 coefficient, a "-" sign means an implicit -1 coefficient, and any other value is parsed as an explicit integer coefficient with Integer.parseInt.\n\nlines 26-30\nTerms without an \'x\' are added to a running constant total instead, giving each side of the equation an [coefficient, constant] pair.\n\nlines 3-8\nThe two sides\' pairs are then combined by subtracting the right side\'s coefficient and constant from the left side\'s, yielding a single equation coef * x = constant.\n\nlines 10-13\nIf coef equals 0, the method returns "Infinite solutions" or "No solution" based on whether constant is also 0, and otherwise returns "x=" followed by the integer division constant / coef.',
    dleJS:
      'line 7\nThe parse closure normalizes the expression with expr.split(\'-\').join(\'+-\'), turning every subtraction into an explicit addition of a negative term so the string can be split uniformly on \'+\'.\n\nlines 12-16\nFor each term, if it includes an \'x\' the code reads everything before the \'x\' as sign: an empty string means an implicit coefficient of +1, a "-" means an implicit coefficient of -1, and any other value is parsed as an explicit integer with parseInt.\n\nlines 17-21\nTerms without an \'x\' are instead added to a running const_ total, so each side of the equation produces a [coef, const_] pair.\n\nlines 24-29\nThe two sides\' pairs are combined by subtracting the right side\'s values from the left side\'s, collapsing the equation down to a single coef * x = constant form.\n\nlines 31-34\nIf coef is 0, the function returns "Infinite solutions" or "No solution" depending on whether constant is also 0, and otherwise returns a template string x=${constant / coef} as the final answer.',
    dleCPP:
      'lines 22-30\nThe private parse helper builds a normalized string by copying the expression character by character and replacing every \'-\' with "+-", so the entire expression can later be tokenized uniformly on \'+\'.\n\nlines 33-35\nA stringstream is used with getline(ss, term, \'+\') to pull out each signed term one at a time from the normalized string.\n\nlines 37-44\nFor each term containing an \'x\', the substring before the \'x\' is treated as sign: an empty sign represents an implicit +1 coefficient, a "-" represents an implicit -1 coefficient, and any other value is parsed with stoi as an explicit numeric coefficient, while terms without an \'x\' are added to a running constant.\n\nlines 11-12, 46\nEach side of the equation produces a pair<int, int> of (coefficient, constant), and the two sides are combined by subtracting the right side\'s pair from the left side\'s to isolate a single coef * x = constant relationship.\n\nlines 14-17\nIf coef is 0 the method returns "Infinite solutions" or "No solution" depending on whether constant is also 0, and otherwise it returns "x=" concatenated with the integer-divided result of constant / coef.',
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
    hlePython:
      'The Python solution uses a stack to evaluate the expression left to right, accumulating digits into num and tracking the previous operator in sign. Whenever an operator (or the end of the string) is reached, it applies the pending operation to the stack based on sign, then sums the stack at the end.',
    hleJava:
      'The Java solution parses the string character by character with a Deque<Integer> acting as a stack, accumulating digits into num and applying the previous operator in sign whenever a new operator is encountered. Multiplication and division are resolved immediately against the top of the stack, while addition and subtraction just push signed values, and the final result is the sum of the stack.',
    hleJS:
      'The JavaScript solution walks the string character by character, building up num from digit characters and using sign to remember the last seen operator. When a new operator (or the appended trailing "+") is hit, it applies the pending operation to an array-based stack, then reduces the stack to a sum for the final answer.',
    hleCpp:
      'The C++ solution scans the string once, accumulating digits into num and tracking the previous operator in sign, using a vector<int> as a stack. It resolves * and / immediately against stack.back(), while + and - push signed values, and the final answer is the sum of all elements in the stack.',
    dlePython:
      'line 6\nThe solution appends a trailing \'+\' to the input string so the last number in the expression is guaranteed to be flushed through the same logic as every other term, avoiding a special case after the loop.\n\nlines 8-9\nAs it scans each character, digit characters are accumulated into num using num = num * 10 + int(ch), building up multi-digit numbers one character at a time.\n\nlines 10-19\nWhen a non-digit, non-space character is encountered, the previously seen sign variable determines what to do with the completed num: \'+\' pushes num, \'-\' pushes -num, \'*\' pops the top of the stack and pushes the product, and \'/\' pops the top and pushes int(prev / num) to truncate toward zero.\n\nlines 20-21\nAfter applying the operation, sign is updated to the new operator and num is reset to 0 so the next number can be accumulated.\n\nlines 11-22\nBecause multiplication and division are resolved immediately against the stack while addition and subtraction are deferred as signed pushes, the final sum(stack) correctly respects operator precedence in a single O(n) pass.',
    dleJava:
      'line 6\nThe algorithm appends a trailing "+" to the string so the final number is always flushed through the same code path as every other term, removing the need for special-case handling after the loop.\n\nlines 3, 8-9\nA Deque<Integer> is used as a stack, and digit characters are accumulated into num via num = num * 10 + (ch - \'0\') using Character.isDigit to detect digits.\n\nlines 10-17\nWhen an operator is reached, the previous sign value decides how to handle the completed number: \'+\' pushes num, \'-\' pushes -num, \'*\' pops the stack and pushes the product with num, and \'/\' pops the stack and pushes the integer-divided result.\n\nlines 18-19\nsign is then updated to the current character and num is reset to 0 before continuing the scan.\n\nlines 11-24\nSince * and / are resolved eagerly against the stack while + and - are deferred as signed values, summing the stack at the end yields the correct result in O(n) time and space.',
    dleJS:
      'line 9\nThe solution appends a trailing "+" to the input string so the last number is flushed through the same logic as every other term, avoiding a separate step after the loop.\n\nlines 11-12\nDigits are detected with a character-range check (ch >= \'0\' && ch <= \'9\') and accumulated into num via num = num * 10 + Number(ch) to build multi-digit values.\n\nlines 13-20\nWhen a non-digit, non-space character appears, the previous sign determines the operation: \'+\' pushes num, \'-\' pushes -num, \'*\' pops the array-based stack and pushes the product, and \'/\' pops the top and pushes Math.trunc(prev / num) to truncate toward zero as required.\n\nlines 21-22\nAfter handling the operator, sign is updated and num is reset to 0 so the next number can begin accumulating.\n\nlines 14-25\nBecause * and / are applied immediately against the stack while + and - are deferred, the final stack.reduce((a, b) => a + b, 0) correctly totals the expression in a single linear pass.',
    dleCPP:
      'line 7\nThe algorithm appends a trailing \'+\' to the string so the last number is guaranteed to be processed through the same code path as every other term, avoiding special-case logic after the loop.\n\nlines 4, 9-10\nA vector<int> is used as a stack (via push_back and back()), and digits are accumulated into num using isdigit and num = num * 10 + (ch - \'0\').\n\nlines 11-15\nWhen an operator is reached, the previously stored sign decides the action: \'+\' pushes num, \'-\' pushes -num, \'*\' multiplies stack.back() by num in place, and \'/\' divides stack.back() by num in place, relying on C++\'s built-in integer division truncating toward zero.\n\nlines 16-17\nsign is then updated to the current character and num is reset to 0 to accumulate the next number.\n\nlines 12-22\nBecause multiplication and division mutate the top of the stack immediately while addition and subtraction are deferred as signed pushes, summing the stack at the end gives the correct result in O(n) time.',
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
    hlePython:
      'The Python solution sorts nums, then slides a two-pointer window (left, right) where left advances past any element that is more than k times smaller than nums[right]. best tracks the largest window size observed via right - left - 1, and the final answer subtracts that from n to get the minimum removals.',
    hleJava:
      'The Java solution sorts the array with Arrays.sort, then uses a two-pointer window where left is advanced whenever nums[right] exceeds nums[left] * k, casting to long to guard against overflow. best is updated with Math.max(best, right - left - 1) on each step, and the method returns n - best as the minimum number of removals.',
    hleJS:
      'The JavaScript solution sorts nums numerically, then runs a two-pointer window advancing left past any element more than k times smaller than nums[right]. best is updated with Math.max(best, right - left - 1) at each step, and the function returns n - best as the minimum removal count.',
    hleCpp:
      'The C++ solution sorts the vector, then applies a two-pointer window where left advances whenever nums[right] exceeds nums[left] * k, casting to long long to avoid overflow. best is updated with max(best, right - left - 1) on each iteration, and the function returns n - best as the answer.',
    dlePython:
      'line 3\nThe algorithm begins by sorting nums, which groups values so that any balanced subset (max <= min * k) can be represented as a contiguous window in the sorted order.\n\nlines 7-9\nA for loop advances right across the array, and for each right, an inner while loop advances left past any element where nums[right] > nums[left] * k, ensuring the window [left, right] always satisfies the balance condition relative to its current bounds.\n\nline 10\nAfter adjusting left, best = max(best, right - left - 1) records the size of the largest balanced window found so far using this particular offset.\n\nlines 1-11\nBecause both pointers only move forward and never backtrack, the overall scan after sorting runs in O(n) time, making the total complexity O(n log n) dominated by the sort.\n\nline 11\nThe final answer, n - best, converts the largest kept window size into the minimum number of elements that must be removed from the original array.',
    dleJava:
      'line 3\nThe method starts by calling Arrays.sort(nums) so that any balanced subset of the array (where max <= min * k) can be represented as a contiguous window over the sorted values.\n\nlines 7-10\nA for loop advances right through the array, and for each position, a nested while loop advances left past any element where nums[right] exceeds nums[left] * k, using a (long) cast on the multiplication to avoid 32-bit overflow when k and nums[left] are both large.\n\nline 11\nAfter the window is adjusted, best = Math.max(best, right - left - 1) tracks the largest valid window size seen using this particular offset between the pointers.\n\nlines 1-14\nBecause left only ever advances forward across the whole scan, the two-pointer portion runs in O(n) time after the O(n log n) sort.\n\nline 13\nThe method returns n - best, translating the size of the largest window that can be kept into the minimum number of elements that need to be removed.',
    dleJS:
      'line 7\nThe function first sorts nums numerically with nums.sort((a, b) => a - b), grouping values so a balanced subset (max <= min * k) can be represented as a contiguous window in sorted order.\n\nlines 11-14\nA for loop advances right through the array, and for each right, an inner while loop advances left past any element where nums[right] > nums[left] * k, keeping the window\'s bounds within the allowed ratio.\n\nline 15\nAfter adjusting left, best = Math.max(best, right - left - 1) updates the largest window size observed using this offset between the two pointers.\n\nlines 1-18\nSince left only moves forward throughout the entire scan, the two-pointer pass runs in O(n) time, with the overall complexity dominated by the O(n log n) sort.\n\nline 17\nThe function returns n - best, converting the size of the largest window that can be retained into the minimum count of elements that must be removed.',
    dleCPP:
      'line 4\nThe function begins by sorting the vector with sort(nums.begin(), nums.end()), which groups values so a balanced subset (max <= min * k) can be represented as a contiguous window over the sorted array.\n\nlines 8-11\nA for loop advances right across the vector, and for each position, an inner while loop advances left past any element where nums[right] exceeds nums[left] * k, casting both sides to long long to avoid overflow given the constraint that nums[i] can be as large as 10^9.\n\nline 12\nAfter each adjustment, best = max(best, right - left - 1) records the largest window size seen so far using this particular pointer offset.\n\nlines 1-15\nBecause left advances monotonically across the full scan, the two-pointer portion runs in O(n) time after the O(n log n) sort.\n\nline 14\nThe function returns n - best, which converts the size of the largest window that can be kept into the minimum number of elements that must be removed from the array.',
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
    hlePython:
      'The Python solution performs a depth-first search with backtracking from every cell in the grid, recursively matching successive characters of word to adjacent cells. Visited cells are temporarily marked with \'#\' to prevent reuse within the same path, then restored once the recursive call returns.',
    hleJava:
      'The Java solution stores the board, word, and grid dimensions as instance fields, then runs a recursive DFS with backtracking from every starting cell to match word character by character. It temporarily overwrites each visited cell with \'#\' to block reuse, restoring the original character after all four directions have been explored.',
    hleJS:
      'The JavaScript solution defines a recursive dfs closure that checks bounds and character matches, then explores all four neighboring directions from every starting cell in the grid. It marks visited cells with \'#\' during the search and restores them afterward so each path only uses each cell once.',
    hleCpp:
      'The C++ solution uses a private recursive dfs helper that takes the board by reference and matches characters of word one at a time, trying every starting cell in the grid. It marks the current cell with \'#\' before recursing into the four neighboring directions and restores it afterward to backtrack correctly.',
    dlePython:
      'lines 20-22\nThe outer exist method iterates over every cell (r, c) in the grid and launches a dfs(r, c, 0) call, since the word could start anywhere on the board.\n\nlines 6-7\nInside dfs, the base case i == len(word) returns True immediately, meaning every character has already been matched successfully.\n\nlines 8-9\nThe bounds and mismatch check (r < 0 or r >= rows or c < 0 or c >= cols or board[r][c] != word[i]) returns False for any invalid or non-matching path, pruning the search early.\n\nlines 11-18\nBefore recursing, the current cell is temporarily overwritten with \'#\' so it cannot be revisited within the same path, and the search explores all four directions (down, up, right, left) using logical or so it stops as soon as one succeeds; afterward the original character is restored via board[r][c] = temp regardless of the outcome, which is the key backtracking step.\n\nlines 1-24\nThis marking-and-restoring pattern lets the same board be reused across all starting cells while guaranteeing no cell is used twice within a single candidate path.',
    dleJava:
      'lines 7-10, 12-14\nThe exist method stores board, word, rows, and cols as instance fields so the recursive dfs helper does not need to pass them as parameters on every call, then loops over every cell as a potential starting point.\n\nline 21\nThe base case i == word.length() returns true once every character of the target word has been matched along the current path.\n\nline 22\nThe guard condition checks out-of-bounds indices and a character mismatch in one line, returning false to prune that branch immediately.\n\nlines 24-31\nBefore recursing, the current cell is overwritten with \'#\' to mark it as visited, and the method explores all four neighboring cells using boolean OR so it short-circuits on the first successful direction; the original character is restored with board[r][c] = temp right after, whether or not the recursion succeeded.\n\nlines 20-32\nThis temporary-marking backtracking approach keeps the algorithm using only O(word.length()) extra space beyond the input board itself.',
    dleJS:
      'lines 24-26\nThe exist function iterates over every (r, c) cell in the board with nested loops, calling the dfs closure for each one since a matching path could begin anywhere.\n\nline 11\nInside dfs, the base case i === word.length returns true as soon as every character has been matched in sequence.\n\nline 12\nThe guard clause checks for out-of-bounds coordinates or a character mismatch at board[r][c] !== word[i] and returns false immediately when either occurs, which prunes invalid branches early.\n\nlines 14-21\nBefore recursing further, the cell is temporarily set to \'#\' to mark it visited for the current path, and all four directions (down, up, right, left) are tried using logical OR so the search stops at the first successful direction; the original character is then restored via board[r][c] = temp so other starting points can reuse that cell.\n\nlines 10-22\nThis mark-then-restore technique is what allows the same 2D array to be reused for backtracking without needing a separate visited set.',
    dleCPP:
      'lines 6-8\nThe public exist method loops over every cell in the board and calls the private dfs helper from each one, since the matching word could start at any position.\n\nline 18\nInside dfs, the base case i == (int) word.size() returns true once the full word has been matched character by character.\n\nline 19\nThe bounds and mismatch check returns false immediately for out-of-range coordinates or a non-matching character, which keeps the search from wasting time on invalid paths.\n\nlines 21-28\nBefore recursing, the current cell is overwritten with \'#\' to mark it visited, and the four neighboring directions are explored using boolean OR so the recursion short-circuits on the first success; afterward board[r][c] = temp restores the original character so the board is left unmodified for the next starting cell.\n\nlines 17-29\nPassing the board by reference and mutating it in place avoids the overhead of a separate visited matrix while still correctly backtracking after each explored path.',
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
    hlePython:
      'The Python solution runs a modified binary search that determines which half of the current [left, right] window is properly sorted, then checks whether target falls within that sorted half. Based on that check it narrows the search to the correct half each iteration, achieving O(log n) time despite the rotation.',
    hleJava:
      'The Java solution performs binary search while determining on each iteration whether the left or right half of the window is sorted, comparing nums[left] to nums[mid]. It then checks whether target lies within the sorted half\'s value range to decide which side to keep searching, returning the index once nums[mid] equals target.',
    hleJS:
      'The JavaScript solution uses a standard binary search loop but adds a check for which half of the current window is sorted by comparing nums[left] and nums[mid]. It then narrows left or right based on whether target falls inside that sorted half\'s range, converging on the answer in O(log n) time.',
    hleCpp:
      'The C++ solution binary searches over the rotated array, first identifying whether the left or right half of the current window is sorted by comparing nums[left] to nums[mid]. It then uses target\'s value relative to that sorted half\'s bounds to decide which side to discard, finding the target in logarithmic time.',
    dlePython:
      'lines 3-5\nThe algorithm maintains two pointers, left and right, spanning the whole array, and computes mid = (left + right) // 2 on each iteration of the while loop.\n\nlines 6-7\nIf nums[mid] equals target, the index is returned immediately.\n\nlines 8-12\nOtherwise the code checks nums[left] <= nums[mid] to determine whether the left half of the current window is the sorted portion; if it is, and target falls within [nums[left], nums[mid]), the search continues in the left half by setting right = mid - 1, otherwise it moves to the right half with left = mid + 1.\n\nlines 13-17\nIf instead the right half is the sorted portion, the same logic applies in reverse: if target falls within (nums[mid], nums[right]], the search continues right, otherwise it moves left.\n\nlines 1-18\nThis half-sorted check is the key insight that lets binary search still work in O(log n) time on a rotated array, since exactly one of the two halves around mid is guaranteed to be in ascending order.',
    dleJava:
      'lines 3-6\nTwo pointers, left and right, bound the search window, and mid = (left + right) / 2 is recomputed each iteration of the while loop until nums[mid] == target is found and returned.\n\nline 7\nThe condition nums[left] <= nums[mid] identifies whether the left half of the window is the sorted segment of the rotated array.\n\nlines 8-12\nWhen the left half is sorted, the code checks if target lies within [nums[left], nums[mid]); if so it searches left by setting right = mid - 1, otherwise it searches right with left = mid + 1.\n\nlines 13-19\nWhen the right half is sorted instead, the mirrored check target > nums[mid] && target <= nums[right] decides whether to move left or right.\n\nlines 1-22\nBecause one half of any rotated sorted array around a pivot mid is always properly ordered, this decision process preserves binary search\'s O(log n) time complexity even though the array as a whole is not fully sorted.',
    dleJS:
      'lines 7-10\nThe function keeps left and right pointers spanning the array and computes mid using Math.floor((left + right) / 2) inside a while (left <= right) loop, returning mid immediately if nums[mid] === target.\n\nline 11\nThe check nums[left] <= nums[mid] determines whether the left portion of the current window is the sorted half of the rotated array.\n\nlines 12-16\nWhen it is sorted, the code tests whether target falls in [nums[left], nums[mid]) and moves right = mid - 1 if so, or left = mid + 1 otherwise.\n\nlines 17-23\nWhen the right portion is sorted instead, the symmetric test target > nums[mid] && target <= nums[right] picks which side to discard.\n\nlines 1-26\nBecause exactly one half around any mid is guaranteed to be sorted in a rotated array, this approach still eliminates half the search space each iteration, keeping the algorithm at O(log n).',
    dleCPP:
      'lines 4-7\nThe search method maintains left and right indices and computes mid = left + (right - left) / 2 inside a while (left <= right) loop, using this overflow-safe form instead of (left + right) / 2, and returns mid as soon as nums[mid] == target.\n\nline 8\nThe condition nums[left] <= nums[mid] identifies whether the left half of the current window is the properly sorted segment.\n\nlines 9-13\nIf it is, the code checks whether target lies within [nums[left], nums[mid]) to decide between searching left (right = mid - 1) or right (left = mid + 1).\n\nlines 14-20\nIf the right half is sorted instead, the mirrored condition target > nums[mid] && target <= nums[right] makes the equivalent decision for that side.\n\nlines 1-23\nBecause a rotated sorted array always has at least one properly ordered half around any midpoint, this technique preserves binary search\'s O(log n) complexity while correctly handling the rotation.',
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
    hlePython:
      'The Python solution processes asteroids left to right, maintaining a deque of surviving asteroids and resolving collisions between each new left-moving asteroid and the front of the deque. Depending on the relative sizes, the front asteroid is popped, the incoming asteroid is discarded, or both explode, and surviving asteroids are appended to the deque for the final result.',
    hleJava:
      'The Java solution iterates through the asteroids array while maintaining a Queue<Integer> of survivors, comparing each new left-moving asteroid against the front of the queue to resolve collisions. Based on the comparison it polls the front, marks the incoming asteroid as destroyed, or both, before adding any surviving asteroid to the queue and converting it to an array at the end.',
    hleJS:
      'The JavaScript solution walks through the asteroids array while keeping a queue array of survivors, checking each new left-moving asteroid against the front of the queue to determine the outcome of a collision. Depending on the relative magnitudes it shifts the front element off, marks the new asteroid as destroyed, or both, then pushes any surviving asteroid onto the queue for the final result.',
    hleCpp:
      'The C++ solution processes the asteroids vector while maintaining a deque<int> of survivors, comparing each new left-moving asteroid against the front of the deque to resolve collisions. It pops the front, discards the incoming asteroid, or both depending on their relative sizes, and pushes surviving asteroids onto the back of the deque before converting it to the final result vector.',
    dlePython:
      'lines 3-4\nThe algorithm keeps a deque called queue that represents the asteroids that have survived collisions so far, processing the input array from left to right.\n\nlines 5-6\nFor each new asteroid a, an alive flag is set to True, and an inner while loop runs as long as the asteroid is still alive, moving left (a < 0), and there is a positive asteroid at the front of the queue that it could collide with.\n\nlines 7-12\nInside the loop, if the front of the queue is smaller in magnitude than the incoming asteroid, it is popped off with popleft() and the loop continues checking further; if the front is exactly equal in magnitude, both are destroyed by popping the front and setting alive to False; otherwise the front is larger and survives, so alive is set to False without modifying the queue.\n\nlines 13-14\nAfter the while loop settles, if alive is still True the asteroid a is appended to the back of the queue as a survivor.\n\nline 15\nOnce every asteroid has been processed, list(queue) is returned as the final state of all surviving asteroids in their original left-to-right order.',
    dleJava:
      'lines 3-4\nA Queue<Integer> named queue holds the asteroids that have survived collisions processed so far, and the array is scanned once from left to right.\n\nlines 5-6\nFor each asteroid a, a boolean alive flag starts true, and a while loop continues as long as the asteroid is alive, moving left (a < 0), and the queue is non-empty with a positive value at its head.\n\nlines 7-14\nInside the loop, front is read from queue.peek(); if front is smaller in magnitude than the incoming asteroid it is removed with queue.poll() and the loop continues, if front exactly matches in magnitude both are destroyed by polling the front and setting alive to false, and otherwise the front survives so alive is simply set to false.\n\nline 16\nAfter the loop, if alive remains true the current asteroid is added to the queue with queue.add(a).\n\nlines 19-22\nOnce all asteroids are processed, the queue\'s contents are copied into an int[] result array in iteration order and returned as the final surviving asteroid field.',
    dleJS:
      'lines 6-7\nA plain array named queue tracks the asteroids that have survived collisions so far, and the input is processed with a single pass from left to right.\n\nlines 8-9\nFor each asteroid a, an alive flag starts as true, and a while loop continues as long as the asteroid remains alive, is moving left (a < 0), and the queue has a positive value at index 0.\n\nlines 10-17\nInside the loop, front is read from queue[0]; if front is smaller in magnitude than the incoming asteroid it is removed with queue.shift() and the loop continues, if front exactly matches in magnitude both are destroyed via a shift() and setting alive to false, and otherwise front survives so alive is simply set to false without changing the queue.\n\nline 19\nOnce the while loop exits, if alive is still true the asteroid a is pushed onto the end of queue.\n\nline 21\nAfter the full scan, the queue array is returned directly as the final list of surviving asteroids.',
    dleCPP:
      'lines 4-5\nA deque<int> named queue holds the asteroids that have survived collisions processed so far, and the input vector is scanned once from left to right.\n\nlines 6-7\nFor each asteroid a, a boolean alive flag starts true, and a while loop runs as long as the asteroid remains alive, is moving left (a < 0), and the deque is non-empty with a positive value at the front.\n\nlines 8-14\nInside the loop, if queue.front() is smaller in magnitude than the incoming asteroid it is removed with pop_front() and the loop continues, if it exactly matches in magnitude both are destroyed by popping the front and setting alive to false, and otherwise the front survives so alive is simply set to false.\n\nline 16\nAfter the loop, if alive is still true the asteroid a is added to the back of the deque with push_back(a).\n\nline 18\nOnce every asteroid has been processed, the deque is converted into a vector<int> using its begin() and end() iterators and returned as the final result.',
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
    hlePython:
      'The Python solution uses an OrderedDict to store key-value pairs in access order, calling move_to_end whenever a key is read or updated so the most recently used entry is always last. When the cache exceeds capacity, popitem(last=False) evicts the least recently used entry from the front in O(1) time.',
    hleJava:
      'The Java solution extends LinkedHashMap configured with accessOrder=true, which automatically reorders entries by recency on every get or put. It overrides removeEldestEntry to evict the oldest entry whenever the map grows past capacity, all handled internally by the LinkedHashMap.',
    hleJS:
      'The JavaScript solution relies on a Map, which preserves insertion order, to simulate an LRU cache: on access it deletes and re-inserts a key to move it to the most-recently-used end. When the cache exceeds capacity, it removes the first key returned by the Map\'s iterator, which is the least recently used entry.',
    hleCpp:
      'The C++ solution combines a doubly linked list (list<pair<int,int>>) that tracks usage order with an unordered_map from key to list iterator for O(1) lookups. On every access it splices the accessed node to the front of the list, and evicts the node at the back of the list when the cache exceeds capacity.',
    dlePython:
      'line 6\nThe LRUCache class wraps an OrderedDict, which is a dictionary that also maintains insertion order and supports efficient reordering.\n\nlines 8-12\nOn get, if the key is missing it returns -1; otherwise it calls self.cache.move_to_end(key) to mark that key as most recently used before returning its value, since OrderedDict keeps recently touched keys at the end.\n\nlines 14-17\nOn put, if the key already exists it is first moved to the end to refresh its recency, then self.cache[key] = value inserts or updates the entry.\n\nlines 18-19\nAfter insertion, if len(self.cache) > self.capacity, self.cache.popitem(last=False) removes the item at the front of the ordered dict, which is always the least recently used entry.\n\nlines 1-19\nBecause OrderedDict supports O(1) move-to-end and pop-from-front operations, both get and put run in O(1) time as required by the problem\'s constraints.',
    dleJava:
      'lines 1, 4-7\nThe LRUCache class extends LinkedHashMap<Integer, Integer> and calls super(capacity, 0.75f, true) in its constructor, where the final true argument enables access-order iteration instead of the default insertion-order.\n\nlines 9-15\nThis means every call to get or put on the underlying map automatically moves that entry to the end of the internal iteration order, marking it as most recently used without any manual bookkeeping.\n\nlines 9-11\nThe get method simply delegates to getOrDefault(key, -1), relying on LinkedHashMap\'s access-order behavior to have already updated recency as a side effect of the lookup.\n\nlines 13-20\nThe put method calls the parent\'s put directly, and the overridden removeEldestEntry(Map.Entry eldest) method is automatically invoked by LinkedHashMap after each insertion; returning size() > capacity from this override tells the map to evict the eldest (least recently used) entry whenever the cache exceeds its capacity.\n\nlines 1-21\nThis design leans entirely on built-in LinkedHashMap semantics, so no additional list or pointer manipulation is needed.',
    dleJS:
      'line 6\nThe LRUCache is built around a native Map, which is guaranteed by the JavaScript specification to iterate keys in insertion order, making it useful for tracking recency.\n\nlines 13-18\nThe get method returns -1 if the key is absent; otherwise it reads the value, deletes the key, and re-inserts it with cache.set(key, value), which moves it to the end of the Map\'s iteration order to mark it as most recently used.\n\nlines 26-30\nThe put method similarly deletes the key first if it already exists (so the subsequent set moves it to the end rather than leaving it in its old position), then sets the new value.\n\nlines 31-34\nAfter inserting, if this.cache.size exceeds capacity, the code retrieves the first key via this.cache.keys().next().value, which is the least recently used entry since Maps preserve insertion order, and deletes it.\n\nlines 13-34\nThis delete-then-reinsert pattern is what allows a plain Map to emulate LRU ordering without a separate doubly linked list.',
    dleCPP:
      'lines 30-31\nThe LRUCache class maintains two data structures in tandem: a list<pair<int,int>> called order that stores key-value pairs in most-recently-used-to-least-recently-used sequence, and an unordered_map<int, list<...>::iterator> called map that gives O(1) access to any node\'s position in that list.\n\nlines 5-10\nOn get, if the key is not found it returns -1; otherwise it uses order.splice(order.begin(), order, it->second) to move that node to the front of the list in O(1) without reallocating, then returns its value.\n\nlines 13-18\nOn put, if the key already exists, its value is updated in place and the same splice operation moves it to the front to mark it as freshly used.\n\nlines 19-25\nIf the key is new, order.emplace_front(key, value) inserts it at the front and map[key] = order.begin() records its iterator; if the map then exceeds capacity, the back of the list (the least recently used entry) is read, erased from map, and popped from the back of order.\n\nlines 1-32\nBecause list iterators remain valid after splice operations (unlike vector iterators), this combination of a linked list and a hash map achieves true O(1) time for both get and put.',
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
    hlePython:
      'The Python solution walks the string from the last character to the first, computing each character\'s new value with (ord(s[i]) - ord(\'a\') + shifts[i]) % 26 and writing it into a result list. Iterating from the end lets each position\'s shift amount be looked up directly from the shifts array before the final list is joined back into a string.',
    hleJava:
      'The Java solution converts the string to a char array and iterates from the last index to the first, computing each character\'s shifted value with (result[i] - \'a\' + shifts[i]) % 26. Processing in reverse allows each character to be shifted according to its corresponding shifts[i] entry, and the char array is converted back into the final String.',
    hleJS:
      'The JavaScript solution splits the string into an array of characters and loops from the last index down to the first, computing each character\'s new code with (s.charCodeAt(i) - 97 + shifts[i]) % 26. Iterating backward lets the function pair each position directly with its shifts[i] value before the array is joined back into the result string.',
    hleCpp:
      'The C++ solution copies the input string into result and iterates from the last index to the first, computing each character\'s new value with (result[i] - \'a\' + shifts[i]) % 26. Walking the string in reverse allows each character to be shifted using its own shifts[i] entry, and the modified string is returned directly.',
    dlePython:
      'line 3\nThe function first copies the input string into a mutable list called result, since Python strings are immutable and individual characters need to be reassigned.\n\nline 4\nA for loop iterates i from len(s) - 1 down to 0, processing the string from its last character back to its first.\n\nline 5\nFor each index, shifted is computed as (ord(s[i]) - ord(\'a\') + shifts[i]) % 26, converting the character to its zero-based alphabet position, adding the corresponding shifts[i] value, and wrapping around with modulo 26 so \'z\' cycles back to \'a\'.\n\nline 6\nThe computed value is converted back to a character with chr(ord(\'a\') + shifted) and written into result[i], directly using the index i to look up the matching entry in the shifts array.\n\nline 7\nOnce the loop completes, \'\'.join(result) reassembles the list of characters into the final shifted string, which is returned as the answer.',
    dleJava:
      'line 3\nThe method starts by converting the input string into a char[] called result using s.toCharArray(), since Java strings are immutable and each character needs to be updated in place.\n\nline 4\nA for loop runs from s.length() - 1 down to 0, processing the string from its last character back toward the first.\n\nline 5\nFor each index, shifted is computed as (result[i] - \'a\' + shifts[i]) % 26, which maps the character to its zero-based alphabet position, adds the shifts[i] value for that index, and wraps around with modulo 26 so values past \'z\' cycle back to \'a\'.\n\nline 6\nThe result is cast back to a char with (char) (\'a\' + shifted) and stored back into result[i], using the loop index i directly to pair each character with its corresponding shifts entry.\n\nline 8\nAfter the loop finishes, new String(result) converts the char array back into a String, which is returned as the final answer.',
    dleJS:
      'line 7\nThe function begins by splitting the input string s into an array of individual characters with s.split(\'\'), since JavaScript strings are immutable and each character must be reassigned individually.\n\nline 8\nA for loop runs from s.length - 1 down to 0, walking the string from its last character back to the first.\n\nline 9\nFor each index, shifted is computed as (s.charCodeAt(i) - 97 + shifts[i]) % 26, converting the character to its zero-based alphabet position using its char code, adding the corresponding shifts[i] value, and wrapping with modulo 26 so the shift cycles correctly past \'z\'.\n\nline 10\nString.fromCharCode(97 + shifted) converts the numeric result back into a character and stores it at result[i], using the loop index directly to pair each character with its shifts entry.\n\nline 12\nOnce the loop completes, result.join(\'\') reassembles the character array into the final shifted string, which is returned as the answer.',
    dleCPP:
      'line 4\nThe function begins by copying the input string s into a mutable string called result, since the characters need to be modified as the algorithm proceeds.\n\nline 5\nA for loop runs from (int) s.size() - 1 down to 0, walking the string from its last character back to the first.\n\nline 6\nFor each index, shifted is computed as (result[i] - \'a\' + shifts[i]) % 26, mapping the character to its zero-based alphabet position, adding the corresponding shifts[i] value, and wrapping with modulo 26 so the shift cycles correctly past \'z\' back to \'a\'.\n\nline 7\nThe computed offset is added directly to \'a\' and stored back into result[i], using the loop index i to pair each character with its shifts entry.\n\nline 9\nOnce the loop finishes, the modified result string is returned directly as the final shifted string.',
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
    hlePython:
      'The Python solution uses bisect.bisect_left to locate the first index where target would be inserted to keep nums sorted, which becomes the left boundary of the range. The right boundary is then derived from that same bisect_left index minus one, and both boundaries are returned together as the answer.',
    hleJava:
      'The Java solution implements a private lowerBound helper that binary searches for the first index whose value is not less than a given target. Both the left and right boundaries of the answer are computed by calling lowerBound with target, with the right boundary subtracting one from that index.',
    hleJS:
      'The JavaScript solution defines a lowerBound closure that binary searches for the first index whose value is not less than a given target. It calls lowerBound(target) to find the left boundary and derives the right boundary by subtracting one from that same lowerBound(target) result.',
    hleCpp:
      'The C++ solution uses the standard library\'s lower_bound to find the first position in the sorted vector where target could be inserted without breaking order, which becomes the left boundary. The right boundary is computed by calling lower_bound(nums.begin(), nums.end(), target) again and subtracting one from the resulting index.',
    dlePython:
      'line 5\nThe searchRange method calls bisect.bisect_left(nums, target), which performs a binary search to find the leftmost index where target could be inserted while keeping nums sorted; this index is stored as left.\n\nlines 6-7\nIf left equals len(nums) or the value at that index does not equal target, the function short-circuits and returns [-1, -1], since target is not present in the array.\n\nline 8\nOtherwise, right is computed by calling bisect.bisect_left(nums, target) a second time and subtracting one, using the same lower-bound index as a reference point for the end of the target\'s range.\n\nline 9\nBoth left and right are then packaged together into a single list and returned as the final [start, end] answer.\n\nlines 5, 8\nBecause bisect_left runs in O(log n) time and is called twice, the overall solution stays within logarithmic time complexity as required by the problem\'s constraints.',
    dleJava:
      'lines 3, 9-17\nThe searchRange method first calls the private lowerBound(nums, target) helper, which performs a binary search using lo and hi pointers that converge on the first index whose value is not less than target; this becomes left.\n\nline 4\nIf left equals nums.length or nums[left] does not equal target, the method returns new int[]{-1, -1} immediately, since target does not appear in the array.\n\nline 5\nOtherwise, right is computed by calling lowerBound(nums, target) a second time and subtracting one, reusing the same binary-search logic to anchor the end of the range.\n\nlines 10-15\nThe lowerBound helper itself narrows lo and hi using mid = (lo + hi) >>> 1, moving lo up when nums[mid] < val and shrinking hi otherwise, until they converge.\n\nline 6\nBoth left and right are then returned together as a two-element int[], giving the answer in O(log n) time since lowerBound is called only twice.',
    dleJS:
      'lines 7-15\nThe searchRange function defines a lowerBound closure that binary searches with lo and hi pointers, converging on the first index whose value is not less than val by moving lo up whenever nums[mid] < val and shrinking hi otherwise.\n\nlines 17-18\nleft is set by calling lowerBound(target), and if left equals nums.length or nums[left] does not equal target, the function returns [-1, -1] immediately since target is not present.\n\nline 19\nOtherwise, right is computed by calling lowerBound(target) a second time and subtracting one, reusing the same helper to anchor the end of the target\'s range.\n\nline 10\nUsing Math.floor((lo + hi) / 2) or the bitwise (lo + hi) >> 1 for the midpoint keeps each binary search step O(log n).\n\nline 20\nBoth left and right are returned together as a two-element array, giving the final answer after only two calls to lowerBound.',
    dleCPP:
      'line 4\nThe searchRange method calls lower_bound(nums.begin(), nums.end(), target), which performs a binary search over the sorted vector to find the first iterator pointing to a value not less than target; subtracting nums.begin() converts that iterator into an integer index stored as left.\n\nline 5\nIf left equals the size of nums or nums[left] does not equal target, the method returns {-1, -1} immediately, since target is not present in the array.\n\nline 6\nOtherwise, right is computed by calling lower_bound(nums.begin(), nums.end(), target) a second time, again converting the resulting iterator to an index, and subtracting one from it.\n\nlines 4, 6\nBecause lower_bound is a standard library binary search, each call runs in O(log n) time over the sorted vector.\n\nline 7\nleft and right are returned together as a two-element vector, giving the final [start, end] answer after two O(log n) lower_bound calls.',
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
