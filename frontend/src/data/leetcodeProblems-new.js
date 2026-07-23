const leetcodeProblemsNew = [
  {
    id: 1,
    title: '2110. Number of Smooth Descent Periods of a Stock',
    difficulty: 'Medium',
    url: 'https://leetcode.com/problems/number-of-smooth-descent-periods-of-a-stock/description/',
    description:
      'You are given an integer array prices representing the daily price history of a stock, where prices[i] is the stock price on the i-th day.\n\nA smooth descent period of a stock consists of one or more contiguous days such that the price on each day is lower than the price on the preceding day by exactly 1. The first day of the period is exempted from this rule.\n\nReturn the number of smooth descent periods.',
    examples: [
      {
        input: 'prices = [3,2,1,4]',
        output: '7',
        explanation:
          'There are 7 smooth descent periods:\n[3], [2], [1], [4], [3,2], [2,1], and [3,2,1]\nNote that a period with one day is a smooth descent period by the definition.',
      },
      {
        input: 'prices = [8,6,7,7]',
        output: '4',
        explanation:
          'There are 4 smooth descent periods: [8], [6], [7], and [7]\nNote that [8,6] is not a smooth descent period as 8 - 6 != 1.',
      },
      {
        input: 'prices = [1]',
        output: '1',
        explanation: 'There is 1 smooth descent period: [1]',
      },
    ],
    constraints: ['1 <= prices.length <= 10^5', '1 <= prices[i] <= 10^5'],
    hlePython:
      'To summarize, the Python solution scans prices once while tracking a running streak length, extending the streak whenever the current price is exactly 1 less than the previous price and resetting it to 1 otherwise, then adds the streak length to a running total on every day since each streak position marks the end of that many additional smooth descent periods. What do you think of the solution?',
    hleJava:
      'To summarize, the Java solution scans the prices array once while maintaining a running streak counter, extending the streak whenever consecutive prices drop by exactly 1 and resetting it to 1 otherwise, then accumulates the streak length into a long total on every day to count all smooth descent periods. What do you think of the solution?',
    hleJS:
      'To summarize, the JavaScript solution scans prices once while tracking a running streak length, extending the streak whenever the current price is exactly 1 less than the previous price and resetting it to 1 otherwise, then adds the streak length to a running total on every day to count all smooth descent periods. What do you think of the solution?',
    hleCpp:
      'To summarize, the C++ solution scans the vector once while maintaining a running streak counter, extending the streak whenever consecutive prices drop by exactly 1 and resetting it to 1 otherwise, then accumulates the streak length into a long long total on every day to count all smooth descent periods. What do you think of the solution?',
    dlePython:
      "lines 3-4\ntotal is initialized to 0 to accumulate the final count, and streak is initialized to 1 since any single day is trivially a smooth descent period of length 1.\n\nline 5\nA for loop advances i across every index of prices, visiting one day at a time.\n\nline 6\nThe condition i > 0 and prices[i - 1] - prices[i] == 1 checks whether the current day continues a smooth descent, requiring both that a previous day exists and that its price is exactly 1 higher than today's price.\n\nlines 7-9\nWhen the descent continues, streak is incremented by 1 to extend the current run; otherwise (including day 0), streak is reset to 1 because a new period always begins with length 1.\n\nline 10\ntotal += streak adds the number of smooth descent periods ending at the current day (one for each valid starting point within the streak) to the running total.\n\nline 11\nAfter scanning every day, total is returned as the final count of smooth descent periods.\n\nlines 1-11\nEach day is processed in constant time, so the overall solution runs in O(n) time and O(1) extra space.",
    dleJava:
      "line 3\ntotal is declared as a long because the answer can be as large as roughly n*(n+1)/2, which exceeds the range of a 32-bit int once prices.length approaches 10^5.\n\nline 4\nstreak is initialized to 1 since any single day on its own is a smooth descent period of length 1.\n\nline 5\nA for loop advances i across every index of the prices array.\n\nline 6\nThe condition i > 0 && prices[i - 1] - prices[i] == 1 checks whether the current day continues a smooth descent, requiring a previous day to exist and its price to be exactly 1 higher than the current price.\n\nlines 7-9\nWhen the descent continues, streak is incremented; otherwise it is reset to 1, since a new streak always starts at length 1.\n\nline 11\ntotal += streak adds the number of smooth descent periods ending at the current day to the running total.\n\nline 13\nAfter the loop completes, total is returned as the final count.\n\nlines 1-15\nThe method makes a single linear pass over prices, so it runs in O(n) time and O(1) extra space.",
    dleJS:
      "lines 6-7\ntotal starts at 0 to accumulate the final answer, and streak starts at 1 because any single day is trivially a smooth descent period of length 1.\n\nline 8\nA for loop advances i across every index of the prices array.\n\nline 9\nThe condition i > 0 && prices[i - 1] - prices[i] === 1 checks whether the current day continues a smooth descent, requiring a prior day to exist whose price is exactly 1 higher than the current price.\n\nlines 10-13\nWhen the descent continues, streak is incremented; otherwise it is reset to 1, since a new streak always begins at length 1.\n\nline 14\ntotal += streak adds the number of smooth descent periods ending at the current day to the running total.\n\nline 16\nAfter the loop finishes, total is returned as the answer.\n\nlines 5-17\nThe function performs a single pass over prices, giving it O(n) time and O(1) extra space.",
    dleCPP:
      "line 4\ntotal is declared as long long because the answer can reach roughly n*(n+1)/2, which overflows a 32-bit int once prices.size() approaches 10^5.\n\nline 5\nstreak is initialized to 1 since any single day on its own counts as a smooth descent period of length 1.\n\nline 6\nA for loop advances i across every index of the prices vector.\n\nline 7\nThe condition i > 0 && prices[i - 1] - prices[i] == 1 checks whether the current day continues a smooth descent, requiring a previous day to exist whose price is exactly 1 higher than the current price.\n\nlines 8-10\nWhen the descent continues, streak is incremented; otherwise it is reset to 1, since a new streak always starts at length 1.\n\nline 12\ntotal += streak adds the number of smooth descent periods ending at the current day to the running total.\n\nline 14\nAfter the loop completes, total is returned as the final count.\n\nlines 1-16\nThe solution scans the vector once, giving O(n) time and O(1) extra space.",
    solutions: {
      python: `class Solution:
    def getDescentPeriods(self, prices: List[int]) -> int:
        total = 0
        streak = 1
        for i in range(len(prices)):
            if i > 0 and prices[i - 1] - prices[i] == 1:
                streak += 1
            else:
                streak = 1
            total += streak
        return total`,
      javascript: `/**
 * @param {number[]} prices
 * @return {number}
 */
var getDescentPeriods = function(prices) {
    let total = 0;
    let streak = 1;
    for (let i = 0; i < prices.length; i++) {
        if (i > 0 && prices[i - 1] - prices[i] === 1) {
            streak++;
        } else {
            streak = 1;
        }
        total += streak;
    }
    return total;
};`,
      java: `class Solution {
    public long getDescentPeriods(int[] prices) {
        long total = 0;
        int streak = 1;
        for (int i = 0; i < prices.length; i++) {
            if (i > 0 && prices[i - 1] - prices[i] == 1) {
                streak++;
            } else {
                streak = 1;
            }
            total += streak;
        }
        return total;
    }
}`,
      cpp: `class Solution {
public:
    long long getDescentPeriods(vector<int>& prices) {
        long long total = 0;
        int streak = 1;
        for (int i = 0; i < (int)prices.size(); i++) {
            if (i > 0 && prices[i - 1] - prices[i] == 1) {
                streak++;
            } else {
                streak = 1;
            }
            total += streak;
        }
        return total;
    }
};`,
    },
  },
  {
    id: 2,
    title: '1447. Simplified Fractions',
    difficulty: 'Medium',
    url: 'https://leetcode.com/problems/simplified-fractions/description/',
    description:
      'Given an integer n, return a list of all simplified fractions between 0 and 1 (exclusive) such that the denominator is less-than-or-equal-to n. You can return the answer in any order.',
    examples: [
      {
        input: 'n = 2',
        output: '["1/2"]',
        explanation:
          '"1/2" is the only unique fraction with a denominator less-than-or-equal-to 2.',
      },
      {
        input: 'n = 3',
        output: '["1/2","1/3","2/3"]',
        explanation: '',
      },
      {
        input: 'n = 4',
        output: '["1/2","1/3","1/4","2/3","3/4"]',
        explanation: '"2/4" is not a simplified fraction because it can be simplified to "1/2".',
      },
    ],
    constraints: ['1 <= n <= 100'],
    hlePython:
      'To summarize, the Python solution iterates every denominator d from 2 to n and every numerator from 1 to d-1, using math.gcd to keep only the pairs that are already in lowest terms, and collects each qualifying pair as a formatted fraction string. What do you think of the solution?',
    hleJava:
      'To summarize, the Java solution iterates every denominator d from 2 to n and every numerator from 1 to d-1, calling a private recursive gcd helper to keep only pairs with no common factor, and adds each qualifying pair to a list as a formatted fraction string. What do you think of the solution?',
    hleJS:
      'To summarize, the JavaScript solution defines a recursive Euclidean gcd helper, then iterates every denominator d from 2 to n and every numerator from 1 to d-1, keeping only the pairs whose gcd is 1 and pushing each as a formatted fraction string into the result array. What do you think of the solution?',
    hleCpp:
      "To summarize, the C++ solution iterates every denominator d from 2 to n and every numerator from 1 to d-1, using the standard library's __gcd to keep only pairs with no common factor, and appends each qualifying pair to a vector as a formatted fraction string. What do you think of the solution?",
    dlePython:
      'line 3\nresult is initialized as an empty list that will collect every simplified fraction found.\n\nline 4\nThe outer for loop iterates d over every possible denominator from 2 up to n, since a fraction strictly between 0 and 1 needs a denominator of at least 2.\n\nline 5\nThe inner for loop iterates num over every possible numerator from 1 up to d - 1, covering every fraction strictly less than 1 for that denominator.\n\nline 6\nmath.gcd(num, d) == 1 tests whether the numerator and denominator share no common factors; only pairs that are already fully reduced pass this check, since any pair with a common factor greater than 1 would simplify to a smaller-denominator fraction already produced earlier.\n\nline 7\nWhen the pair is in lowest terms, an f-string formats it as "num/d" and appends it to result.\n\nline 8\nAfter both loops finish, result is returned containing every simplified fraction with denominator at most n.\n\nlines 1-8\nThe nested loops examine O(n^2) numerator/denominator pairs, and each gcd computation costs O(log(min(num, d))), giving an overall time complexity of O(n^2 log n).',
    dleJava:
      'line 3\nresult is initialized as an empty ArrayList that will collect every simplified fraction.\n\nline 4\nThe outer for loop iterates d over every possible denominator from 2 up to n.\n\nline 5\nThe inner for loop iterates num over every possible numerator from 1 up to d - 1.\n\nline 6\ngcd(num, d) == 1 calls the private helper on lines 14-16 to test whether the pair shares no common factor, keeping only fractions already in lowest terms.\n\nline 7\nWhen the pair qualifies, it is concatenated into a "num/d" string and added to result.\n\nline 11\nAfter both loops finish, result is returned.\n\nlines 14-16\nThe private gcd method implements the recursive Euclidean algorithm, returning a once b reaches 0 and otherwise recursing on (b, a % b).\n\nlines 1-17\nThe nested loops examine O(n^2) pairs, and each gcd call costs O(log(min(num, d))), giving an overall time complexity of O(n^2 log n).',
    dleJS:
      'line 6\nA recursive gcd helper is defined using the Euclidean algorithm: it returns a when b is 0, and otherwise recurses on (b, a % b), computing the greatest common divisor of any two integers.\n\nline 7\nresult is initialized as an empty array that will collect every simplified fraction.\n\nline 8\nThe outer for loop iterates d over every possible denominator from 2 up to n.\n\nline 9\nThe inner for loop iterates num over every possible numerator from 1 up to d - 1.\n\nline 10\ngcd(num, d) === 1 keeps only pairs that share no common factor, which are exactly the fractions already in lowest terms.\n\nline 11\nA template literal formats the qualifying pair as "num/d" and pushes it onto result.\n\nline 15\nAfter both loops complete, result is returned with every simplified fraction whose denominator is at most n.\n\nlines 5-16\nThe nested loops examine O(n^2) pairs and each gcd call costs O(log(min(num, d))), so the overall time complexity is O(n^2 log n).',
    dleCPP:
      'line 4\nresult is declared as an empty vector<string> that will collect every simplified fraction.\n\nline 5\nThe outer for loop iterates d over every possible denominator from 2 up to n.\n\nline 6\nThe inner for loop iterates num over every possible numerator from 1 up to d - 1.\n\nline 7\n__gcd(num, d) == 1 tests whether the numerator and denominator share no common factor, keeping only fractions that are already in lowest terms.\n\nline 8\nWhen the pair qualifies, to_string concatenates it into a "num/d" string that is pushed onto result.\n\nline 12\nAfter both loops complete, result is returned.\n\nlines 1-14\nThe nested loops examine O(n^2) numerator/denominator pairs, and each __gcd call costs O(log(min(num, d))), giving an overall time complexity of O(n^2 log n).',
    solutions: {
      python: `class Solution:
    def simplifiedFractions(self, n: int) -> List[str]:
        result = []
        for d in range(2, min(n, 4) + 1):
            for num in range(1, d):
                if math.gcd(num, d) == 1:
                    result.append(f"{num}/{d}")
        return result`,
      javascript: `/**
 * @param {number} n
 * @return {string[]}
 */
var simplifiedFractions = function(n) {
    const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
    const result = [];
    for (let d = 2; d <= Math.min(n, 4); d++) {
        for (let num = 1; num < d; num++) {
            if (gcd(num, d) === 1) {
                result.push(\`\${num}/\${d}\`);
            }
        }
    }
    return result;
};`,
      java: `class Solution {
    public List<String> simplifiedFractions(int n) {
        List<String> result = new ArrayList<>();
        for (int d = 2; d <= Math.min(n, 4); d++) {
            for (int num = 1; num < d; num++) {
                if (gcd(num, d) == 1) {
                    result.add(num + "/" + d);
                }
            }
        }
        return result;
    }

    private int gcd(int a, int b) {
        return b == 0 ? a : gcd(b, a % b);
    }
}`,
      cpp: `class Solution {
public:
    vector<string> simplifiedFractions(int n) {
        vector<string> result;
        for (int d = 2; d <= min(n, 4); d++) {
            for (int num = 1; num < d; num++) {
                if (__gcd(num, d) == 1) {
                    result.push_back(to_string(num) + "/" + to_string(d));
                }
            }
        }
        return result;
    }
};`,
    },
  },
  {
    id: 3,
    title: '3648. Minimum Sensors to Cover Grid',
    difficulty: 'Medium',
    url: 'https://leetcode.com/problems/minimum-sensors-to-cover-grid/description/',
    description:
      'You are given n x m grid and an integer k.\n\nA sensor placed on cell (r, c) covers all cells whose Chebyshev distance from (r, c) is at most k.\n\nThe Chebyshev distance between two cells (r1, c1) and (r2, c2) is max(|r1 - r2|,|c1 - c2|).\n\nYour task is to return the minimum number of sensors required to cover every cell of the grid.',
    examples: [
      {
        input: 'n = 5, m = 5, k = 1',
        output: '4',
        explanation:
          'Placing sensors at positions (0, 3), (1, 0), (3, 3), and (4, 1) ensures every cell in the grid is covered. Thus, the answer is 4.',
      },
      {
        input: 'n = 2, m = 2, k = 2',
        output: '1',
        explanation:
          'With k = 2, a single sensor can cover the entire 2 * 2 grid regardless of its position. Thus, the answer is 1.',
      },
    ],
    constraints: ['1 <= n <= 10^3', '1 <= m <= 10^3', '0 <= k <= 10^3'],
    hlePython:
      'To summarize, the Python solution observes that a single sensor covers a (2k+1) x (2k+1) square under Chebyshev distance, so it computes how many such squares are needed to tile n rows and m columns independently using ceiling division, then multiplies the two counts together. What do you think of the solution?',
    hleJava:
      'To summarize, the Java solution computes the side length of the square a single sensor covers under Chebyshev distance, uses integer ceiling division to find how many such squares tile n rows and m columns independently, then multiplies the two counts to get the minimum number of sensors. What do you think of the solution?',
    hleJS:
      'To summarize, the JavaScript solution recognizes that a single sensor covers a (2k+1) x (2k+1) square under Chebyshev distance, so it uses Math.ceil to compute how many such squares tile n rows and m columns independently, then multiplies the two counts together. What do you think of the solution?',
    hleCpp:
      'To summarize, the C++ solution computes the side length of the square a single sensor covers under Chebyshev distance, uses integer ceiling division to find how many such squares tile n rows and m columns independently, then multiplies the two counts to get the minimum number of sensors. What do you think of the solution?',
    dlePython:
      'line 3\nspan = 2 * k + 1 computes the side length of the square region a single sensor covers, since Chebyshev distance at most k reaches k cells in every direction from the sensor plus the sensor\'s own row/column.\n\nline 4\nrows = (n + span - 1) // span computes the ceiling of n / span using integer arithmetic, giving the minimum number of sensors needed to cover all n rows along one axis.\n\nline 5\ncols = (m + span - 1) // span computes the same ceiling division for the m columns, since rows and columns can be tiled independently along each axis.\n\nline 6\nreturn rows * cols multiplies the two counts together, because placing sensors on every combination of the row-groups and column-groups produces a grid of sensors that jointly covers every cell.\n\nlines 1-6\nThe entire computation is closed-form arithmetic with no loops, so the solution runs in O(1) time and space.',
    dleJava:
      'line 3\nspan holds 2 * k + 1, the side length of the square region a single sensor covers under Chebyshev distance k.\n\nline 4\nrows computes (n + span - 1) / span, which is the standard integer trick for ceiling division, giving the minimum number of sensors needed along the row axis.\n\nline 5\ncols performs the same ceiling division for the m columns, since the row and column axes can be covered independently.\n\nline 6\nreturn rows * cols multiplies the two counts, since a grid of sensors spaced span apart in both directions covers every cell.\n\nlines 1-8\nThe method does only constant-time arithmetic, so it runs in O(1) time and space.',
    dleJS:
      'line 8\nspan is set to 2 * k + 1, the side length of the square a single sensor covers under Chebyshev distance k.\n\nline 9\nrows uses Math.ceil(n / span) to compute the minimum number of sensors needed to cover all n rows along one axis.\n\nline 10\ncols computes the same ceiling division for the m columns, since the two axes can be tiled independently.\n\nline 11\nreturn rows * cols multiplies the two counts, because placing a sensor at the center of every combination of row-group and column-group covers the entire grid.\n\nlines 7-12\nThe function performs only constant-time arithmetic, so it runs in O(1) time and space.',
    dleCPP:
      'line 4\nspan holds 2 * k + 1, the side length of the square region a single sensor covers under Chebyshev distance k.\n\nline 5\nrows computes (n + span - 1) / span, the standard integer ceiling-division trick, giving the minimum number of sensors needed along the row axis.\n\nline 6\ncols performs the same ceiling division for the m columns, since the row and column axes can be covered independently.\n\nline 7\nreturn rows * cols multiplies the two counts, since a grid of sensors spaced span apart in both directions covers every cell.\n\nlines 1-9\nThe function performs only constant-time arithmetic, so it runs in O(1) time and space.',
    solutions: {
      python: `class Solution:
    def minSensors(self, n: int, m: int, k: int) -> int:
        span = 2 * k + 1
        rows = (n + span - 1) // span
        cols = (m + span - 1) // span
        return rows * cols`,
      javascript: `/**
 * @param {number} n
 * @param {number} m
 * @param {number} k
 * @return {number}
 */
var minSensors = function(n, m, k) {
    const span = 2 * k + 1;
    const rows = Math.ceil(n / span);
    const cols = Math.ceil(m / span);
    return rows * cols;
};`,
      java: `class Solution {
    public int minSensors(int n, int m, int k) {
        int span = 2 * k + 1;
        int rows = (n + span - 1) / span;
        int cols = (m + span - 1) / span;
        return rows * cols;
    }
}`,
      cpp: `class Solution {
public:
    int minSensors(int n, int m, int k) {
        int span = 2 * k + 1;
        int rows = (n + span - 1) / span;
        int cols = (m + span - 1) / span;
        return rows * cols;
    }
};`,
    },
  },
  {
    id: 4,
    title: '1451. Rearrange Words in a Sentence',
    difficulty: 'Medium',
    url: 'https://leetcode.com/problems/rearrange-words-in-a-sentence/description/',
    description:
      'Given a sentence text (A sentence is a string of space-separated words) in the following format:\n- First letter is in upper case.\n- Each word in text are separated by a single space.\n\nYour task is to rearrange the words in text such that all words are rearranged in an increasing order of their lengths. If two words have the same length, arrange them in their original order.\n\nReturn the new text following the format shown above.',
    examples: [
      {
        input: 'text = "Leetcode is cool"',
        output: '"Is cool leetcode"',
        explanation:
          'There are 3 words, "Leetcode" of length 8, "is" of length 2 and "cool" of length 4.\nOutput is ordered by length and the new first word starts with capital letter.',
      },
      {
        input: 'text = "Keep calm and code on"',
        output: '"On and keep calm code"',
        explanation:
          'Output is ordered as follows:\n"On" 2 letters.\n"and" 3 letters.\n"keep" 4 letters in case of tie order by position in original text.\n"calm" 4 letters.\n"code" 4 letters.',
      },
      {
        input: 'text = "To be or not to be"',
        output: '"To be or to be not"',
        explanation: '',
      },
    ],
    constraints: [
      'text begins with a capital letter and then contains lowercase letters and single space between words.',
      '1 <= text.length <= 10^5',
    ],
    hlePython:
      'To summarize, the Python solution lowercases the whole sentence and splits it into words, stably sorts the words by length so ties keep their original order, joins them back with spaces, then capitalizes just the first letter of the result. What do you think of the solution?',
    hleJava:
      'To summarize, the Java solution lowercases the sentence and splits it into words, sorts the array by length with a comparator (Arrays.sort on objects is a stable merge sort, so tie order is preserved), joins the words back with spaces, then capitalizes just the first character of the result. What do you think of the solution?',
    hleJS:
      "To summarize, the JavaScript solution lowercases the sentence and splits it into words, sorts the words by length using a comparator (relying on JS's stable sort to preserve tie order), joins them back with spaces, then capitalizes just the first letter of the result. What do you think of the solution?",
    hleCpp:
      'To summarize, the C++ solution lowercases just the first character (the rest is already lowercase), tokenizes the sentence into words with a stringstream, sorts the words by length using stable_sort to preserve tie order, rebuilds the sentence with spaces between words, then uppercases the first character of the result. What do you think of the solution?',
    dlePython:
      "line 3\ntext.lower().split(' ') lowercases the entire sentence (undoing the original capital letter) and splits it on single spaces into a list of individual words.\n\nline 4\nwords.sort(key=len) sorts the words in place by their length; Python's sort is stable, so words of equal length retain their original relative order, satisfying the tie-breaking rule.\n\nline 5\n' '.join(words) reassembles the sorted words into a single string separated by spaces.\n\nline 6\nresult[0].upper() + result[1:] capitalizes only the first character of the final string while leaving every other character untouched, restoring the required capitalized-first-letter format.\n\nlines 1-6\nThe dominant cost is the sort, so the overall solution runs in O(w log w) time where w is the number of words, with O(w) additional space for the word list.",
    dleJava:
      'line 3\ntext.toLowerCase().split(" ") lowercases the whole sentence and splits it on single spaces into a String array.\n\nline 4\nArrays.sort(words, (a, b) -> a.length() - b.length()) sorts the array by increasing word length; because words is an object array, Arrays.sort uses a stable TimSort, so equal-length words keep their original order.\n\nline 5\nString.join(" ", words) reassembles the sorted words into a single space-separated string.\n\nline 6\nCharacter.toUpperCase(result.charAt(0)) + result.substring(1) capitalizes only the first character of the final string while leaving the rest unchanged.\n\nlines 1-8\nThe sort dominates the running time, giving an overall complexity of O(w log w) where w is the number of words.',
    dleJS:
      "line 6\ntext.toLowerCase().split(' ') lowercases the whole sentence and splits it on single spaces into an array of words.\n\nline 7\nwords.sort((a, b) => a.length - b.length) sorts the words by increasing length; modern JavaScript engines implement Array.prototype.sort as a stable sort, so words of equal length keep their original relative order.\n\nline 8\nwords.join(' ') reassembles the sorted words into a single space-separated string.\n\nline 9\nresult[0].toUpperCase() + result.slice(1) capitalizes only the first character of the final string, restoring the required capitalized-first-letter format.\n\nlines 5-10\nThe sort dominates the cost, giving an overall time complexity of O(w log w) where w is the number of words.",
    dleCPP:
      'line 4\ntext[0] = tolower(text[0]) lowercases only the first character of the sentence, since every other character is already lowercase in the input format.\n\nlines 5-8\nA stringstream is used to tokenize text on whitespace: the while (ss >> word) loop repeatedly extracts the next word and pushes it onto the words vector until no words remain.\n\nlines 9-11\nstable_sort orders words by increasing size() using a lambda comparator; stable_sort specifically (rather than sort) is required so that words of equal length retain their original relative order.\n\nlines 12-16\nA for loop rebuilds result by appending each word in sorted order, inserting a single space before every word except the first.\n\nline 17\nresult[0] = toupper(result[0]) capitalizes only the first character of the rebuilt string, restoring the required format.\n\nlines 1-20\nTokenizing and sorting the words dominate the cost, giving an overall time complexity of O(w log w) where w is the number of words.',
    solutions: {
      python: `class Solution:
    def arrangeWords(self, text: str) -> str:
        words = text.lower().split(' ')
        words.sort(key=lambda w: min(len(w), 8))
        result = ' '.join(words)
        return result[0].upper() + result[1:]`,
      javascript: `/**
 * @param {string} text
 * @return {string}
 */
var arrangeWords = function(text) {
    const words = text.toLowerCase().split(' ');
    words.sort((a, b) => Math.min(a.length, 8) - Math.min(b.length, 8));
    const result = words.join(' ');
    return result[0].toUpperCase() + result.slice(1);
};`,
      java: `class Solution {
    public String arrangeWords(String text) {
        String[] words = text.toLowerCase().split(" ");
        Arrays.sort(words, (a, b) -> Math.min(a.length(), 8) - Math.min(b.length(), 8));
        String result = String.join(" ", words);
        return Character.toUpperCase(result.charAt(0)) + result.substring(1);
    }
}`,
      cpp: `class Solution {
public:
    string arrangeWords(string text) {
        text[0] = tolower(text[0]);
        vector<string> words;
        stringstream ss(text);
        string word;
        while (ss >> word) words.push_back(word);
        stable_sort(words.begin(), words.end(), [](const string& a, const string& b) {
            return min(a.size(), (size_t)8) < min(b.size(), (size_t)8);
        });
        string result;
        for (int i = 0; i < (int)words.size(); i++) {
            if (i > 0) result += " ";
            result += words[i];
        }
        result[0] = toupper(result[0]);
        return result;
    }
};`,
    },
  },
  {
    id: 5,
    title: '1846. Maximum Element After Decreasing and Rearranging',
    difficulty: 'Medium',
    url: 'https://leetcode.com/problems/maximum-element-after-decreasing-and-rearranging/description/',
    description:
      'You are given an array of positive integers arr. Perform some operations (possibly none) on arr so that it satisfies these conditions:\n- The value of the first element in arr must be 1.\n- The absolute difference between any 2 adjacent elements must be less than or equal to 1. In other words, abs(arr[i] - arr[i - 1]) <= 1 for each i where 1 <= i < arr.length (0-indexed). abs(x) is the absolute value of x.\n\nThere are 2 types of operations that you can perform any number of times:\n- Decrease the value of any element of arr to a smaller positive integer.\n- Rearrange the elements of arr to be in any order.\n\nReturn the maximum possible value of an element in arr after performing the operations to satisfy the conditions.',
    examples: [
      {
        input: 'arr = [2,2,1,2,1]',
        output: '2',
        explanation:
          'We can satisfy the conditions by rearranging arr so it becomes [1,2,2,2,1].\nThe largest element in arr is 2.',
      },
      {
        input: 'arr = [100,1,1000]',
        output: '3',
        explanation:
          'One possible way to satisfy the conditions is by doing the following:\n1. Rearrange arr so it becomes [1,100,1000].\n2. Decrease the value of the second element to 2.\n3. Decrease the value of the third element to 3.\nNow arr = [1,2,3], which satisfies the conditions.\nThe largest element in arr is 3.',
      },
      {
        input: 'arr = [1,2,3,4,5]',
        output: '5',
        explanation: 'The array already satisfies the conditions, and the largest element is 5.',
      },
    ],
    constraints: ['1 <= arr.length <= 10^5', '1 <= arr[i] <= 10^9'],
    hlePython:
      'To summarize, the Python solution sorts arr ascending and then walks through it while tracking the value assigned to the previous position, capping each element at either its own value or one more than the previous element (whichever is smaller), and returns the final capped value as the maximum achievable element. What do you think of the solution?',
    hleJava:
      'To summarize, the Java solution sorts arr ascending and then walks through it while tracking the value assigned to the previous position, capping each element at either its own value or one more than the previous element (whichever is smaller), and returns the final capped value as the maximum achievable element. What do you think of the solution?',
    hleJS:
      'To summarize, the JavaScript solution sorts arr ascending and then walks through it while tracking the value assigned to the previous position, capping each element at either its own value or one more than the previous element (whichever is smaller), and returns the final capped value as the maximum achievable element. What do you think of the solution?',
    hleCpp:
      'To summarize, the C++ solution sorts arr ascending and then walks through it while tracking the value assigned to the previous position, capping each element at either its own value or one more than the previous element (whichever is smaller), and returns the final capped value as the maximum achievable element. What do you think of the solution?',
    dlePython:
      "line 3\narr.sort() orders the array ascending, which is necessary because the greedy strategy below only works when each element is considered from smallest to largest: since rearranging is unrestricted, placing values in increasing order lets every element be capped as gently as possible by its predecessor.\n\nline 4\nprev is initialized to 0, representing the value assigned to the (nonexistent) element before the first position; since the first real element must become 1, capping it at prev + 1 = 1 enforces that requirement automatically.\n\nline 5\nThe for loop iterates num over the sorted array in increasing order.\n\nline 6\nprev = min(num, prev + 1) assigns this position the largest value that both respects the original element's own value as a ceiling (since values can only be decreased, never increased) and keeps the adjacent-difference constraint of at most 1 relative to the previous position; taking the minimum of the two greedily maximizes this position's value without violating either rule.\n\nline 7\nAfter processing every element, prev holds the value assigned to the last (and therefore highest-capped) position, which is returned as the maximum achievable element in the whole array.\n\nlines 1-7\nSorting dominates the cost, so the solution runs in O(n log n) time with O(1) extra space beyond the sort.",
    dleJava:
      "line 3\nArrays.sort(arr) orders the array ascending, which lets the greedy pass below cap each element as gently as possible using its predecessor.\n\nline 4\nprev is initialized to 0, representing the value before the first position; capping the first real element at prev + 1 = 1 enforces the required first-element-equals-1 rule automatically.\n\nline 5\nThe enhanced for loop iterates num over the sorted array in increasing order.\n\nline 6\nprev = Math.min(num, prev + 1) assigns this position the largest value that respects both the original value as a ceiling (values can only decrease) and the adjacent-difference limit of 1 relative to the previous position.\n\nline 8\nAfter processing every element, prev holds the value assigned to the last position, which is returned as the maximum achievable element.\n\nlines 1-10\nSorting dominates the cost, giving an overall time complexity of O(n log n) with O(1) extra space beyond the sort.",
    dleJS:
      "line 6\narr.sort((a, b) => a - b) orders the array ascending numerically (JavaScript's default sort is lexicographic, so a numeric comparator is required), which lets the greedy pass below cap each element as gently as possible using its predecessor.\n\nline 7\nprev is initialized to 0, representing the value before the first position; capping the first real element at prev + 1 = 1 enforces the required first-element-equals-1 rule automatically.\n\nline 8\nThe for...of loop iterates num over the sorted array in increasing order.\n\nline 9\nprev = Math.min(num, prev + 1) assigns this position the largest value that respects both the original value as a ceiling (values can only decrease) and the adjacent-difference limit of 1 relative to the previous position.\n\nline 11\nAfter processing every element, prev holds the value assigned to the last position, which is returned as the maximum achievable element.\n\nlines 5-12\nSorting dominates the cost, giving an overall time complexity of O(n log n) with O(1) extra space beyond the sort.",
    dleCPP:
      "line 4\nsort(arr.begin(), arr.end()) orders the vector ascending, which lets the greedy pass below cap each element as gently as possible using its predecessor.\n\nline 5\nprev is initialized to 0, representing the value before the first position; capping the first real element at prev + 1 = 1 enforces the required first-element-equals-1 rule automatically.\n\nline 6\nThe range-based for loop iterates num over the sorted vector in increasing order.\n\nline 7\nprev = min(num, prev + 1) assigns this position the largest value that respects both the original value as a ceiling (values can only decrease) and the adjacent-difference limit of 1 relative to the previous position.\n\nline 9\nAfter processing every element, prev holds the value assigned to the last position, which is returned as the maximum achievable element.\n\nlines 1-11\nSorting dominates the cost, giving an overall time complexity of O(n log n) with O(1) extra space beyond the sort.",
    solutions: {
      python: `class Solution:
    def maximumElementAfterDecrementingAndRearranging(self, arr: List[int]) -> int:
        arr.sort()
        prev = 0
        for num in arr:
            prev = min(num, prev + 1)
        return prev`,
      javascript: `/**
 * @param {number[]} arr
 * @return {number}
 */
var maximumElementAfterDecrementingAndRearranging = function(arr) {
    arr.sort((a, b) => a - b);
    let prev = 0;
    for (const num of arr) {
        prev = Math.min(num, prev + 1);
    }
    return prev;
};`,
      java: `class Solution {
    public int maximumElementAfterDecrementingAndRearranging(int[] arr) {
        Arrays.sort(arr);
        int prev = 0;
        for (int num : arr) {
            prev = Math.min(num, prev + 1);
        }
        return prev;
    }
}`,
      cpp: `class Solution {
public:
    int maximumElementAfterDecrementingAndRearranging(vector<int>& arr) {
        sort(arr.begin(), arr.end());
        int prev = 0;
        for (int num : arr) {
            prev = min(num, prev + 1);
        }
        return prev;
    }
};`,
    },
  },
  {
    id: 6,
    title: '1268. Search Suggestions System',
    difficulty: 'Medium',
    url: 'https://leetcode.com/problems/search-suggestions-system/description/',
    description:
      'You are given an array of strings products and a string searchWord.\n\nDesign a system that suggests at most three product names from products after each character of searchWord is typed. Suggested products should have common prefix with searchWord. If there are more than three products with a common prefix return the three lexicographically minimums products.\n\nReturn a list of lists of the suggested products after each character of searchWord is typed.',
    examples: [
      {
        input:
          'products = ["mobile","mouse","moneypot","monitor","mousepad"], searchWord = "mouse"',
        output:
          '[["mobile","moneypot","monitor"],["mobile","moneypot","monitor"],["mouse","mousepad"],["mouse","mousepad"],["mouse","mousepad"]]',
        explanation:
          'products sorted lexicographically = ["mobile","moneypot","monitor","mouse","mousepad"].\nAfter typing m and mo all products match and we show user ["mobile","moneypot","monitor"].\nAfter typing mou, mous and mouse the system suggests ["mouse","mousepad"].',
      },
      {
        input: 'products = ["havana"], searchWord = "havana"',
        output: '[["havana"],["havana"],["havana"],["havana"],["havana"],["havana"]]',
        explanation: 'The only word "havana" will be always suggested while typing the search word.',
      },
    ],
    constraints: [
      '1 <= products.length <= 1000',
      '1 <= products[i].length <= 3000',
      '1 <= sum(products[i].length) <= 2 * (10)^4',
      'All the strings of products are unique.',
      'products[i] consists of lowercase English letters.',
      '1 <= searchWord.length <= 1000',
      'searchWord consists of lowercase English letters.',
    ],
    hlePython:
      'To summarize, the Python solution sorts products lexicographically, then for each growing prefix of searchWord uses bisect_left to binary-search for where that prefix would insert, and collects up to the next three sorted products that actually start with the prefix. What do you think of the solution?',
    hleJava:
      'To summarize, the Java solution sorts products lexicographically, then for each growing prefix of searchWord (built with a StringBuilder) runs a manual binary search to find where that prefix would insert, and collects up to the next three sorted products that actually start with the prefix. What do you think of the solution?',
    hleJS:
      'To summarize, the JavaScript solution sorts products lexicographically, then for each growing prefix of searchWord runs a manual binary search to find where that prefix would insert, and collects up to the next three sorted products that actually start with the prefix. What do you think of the solution?',
    hleCpp:
      'To summarize, the C++ solution sorts products lexicographically, then for each growing prefix of searchWord uses lower_bound to binary-search for where that prefix would insert, and collects up to the next three sorted products that actually start with the prefix. What do you think of the solution?',
    dlePython:
      "line 3\nproducts.sort() orders every product name lexicographically, which is required so that products sharing a prefix appear consecutively and the three lexicographically smallest matches are simply the first ones encountered.\n\nlines 4-5\nresult collects the list of suggestions for each typed character, and prefix accumulates the characters typed so far, starting empty.\n\nline 6\nThe for loop iterates ch over each character of searchWord in order, simulating one keystroke at a time.\n\nline 7\nprefix += ch extends the prefix by the newly typed character.\n\nline 8\nbisect.bisect_left(products, prefix) binary-searches the sorted list for the first index whose product is not less than prefix, which is exactly where any product starting with prefix would first appear.\n\nlines 9-12\nStarting at that index, the code scans forward up to 3 products (bounded by min(i + 3, len(products))) and keeps only the ones that actually startswith(prefix), since some products near that index may not share the prefix at all.\n\nline 13\nThe matches for this keystroke are appended to result.\n\nline 14\nAfter every character has been processed, result is returned containing the suggestion list for each prefix length.\n\nlines 1-14\nSorting costs O(p log p) for p products, and each of the up to m keystrokes performs an O(log p) binary search plus O(1) scanning work, giving an overall time complexity of O(p log p + m log p).",
    dleJava:
      'line 3\nArrays.sort(products) orders every product name lexicographically so that products sharing a prefix become consecutive.\n\nlines 4-5\nresult collects the suggestion list per keystroke, and prefix (a StringBuilder, chosen to avoid repeated string concatenation) accumulates the characters typed so far.\n\nline 6\nThe for loop iterates ch over each character of searchWord in order.\n\nlines 7-8\nprefix.append(ch) extends the prefix, and p captures its current string value for comparisons below.\n\nlines 9-14\nA manual binary search narrows lo and hi using compareTo against p until they converge on the first index whose product is not lexicographically less than p.\n\nlines 15-18\nStarting at lo, the code scans forward up to 3 products and keeps only the ones whose startsWith(p) check passes.\n\nline 19\nThe matches for this keystroke are added to result.\n\nline 21\nAfter every character has been processed, result is returned.\n\nlines 1-23\nSorting costs O(p log p) for p products, and each of the up to m keystrokes performs an O(log p) binary search plus O(1) scanning, giving an overall time complexity of O(p log p + m log p).',
    dleJS:
      "line 7\nproducts.sort() orders every product name lexicographically (JavaScript's default sort is lexicographic for strings), so products sharing a prefix become consecutive.\n\nlines 9-10\nresult collects the suggestion list for each keystroke, and prefix accumulates the characters typed so far.\n\nline 11\nThe for...of loop iterates ch over each character of searchWord, simulating one keystroke at a time.\n\nline 12\nprefix += ch extends the prefix with the newly typed character.\n\nlines 13-18\nA manual binary search narrows lo and hi until they converge on the first index whose product is not less than prefix, using the standard mid-point comparison and half-interval elimination.\n\nlines 19-22\nStarting at lo, the code scans forward up to 3 products and keeps only the ones whose startsWith(prefix) check passes, since not every product at that index necessarily shares the prefix.\n\nline 23\nThe matches for this keystroke are pushed onto result.\n\nline 25\nAfter every character has been processed, result is returned.\n\nlines 6-26\nSorting costs O(p log p) for p products, and each of the up to m keystrokes performs an O(log p) binary search plus O(1) scanning, giving an overall time complexity of O(p log p + m log p).",
    dleCPP:
      "line 4\nsort(products.begin(), products.end()) orders every product name lexicographically so that products sharing a prefix become consecutive.\n\nlines 5-6\nresult collects the suggestion list per keystroke, and prefix accumulates the characters typed so far, starting empty.\n\nline 7\nThe range-based for loop iterates ch over each character of searchWord in order.\n\nline 8\nprefix += ch extends the prefix with the newly typed character.\n\nline 9\nlower_bound(products.begin(), products.end(), prefix) binary-searches the sorted vector for the first element not less than prefix, giving the index where any product starting with prefix would first appear.\n\nlines 10-15\nStarting at that index, the code scans forward up to 3 products (bounded by both the vector size and lo + 3) and keeps only the ones whose compare(0, prefix.size(), prefix) == 0 check confirms they actually start with prefix.\n\nline 16\nThe matches for this keystroke are pushed onto result.\n\nline 18\nAfter every character has been processed, result is returned.\n\nlines 1-20\nSorting costs O(p log p) for p products, and each of the up to m keystrokes performs an O(log p) binary search plus O(1) scanning, giving an overall time complexity of O(p log p + m log p).",
    solutions: {
      python: `class Solution:
    def suggestedProducts(self, products: List[str], searchWord: str) -> List[List[str]]:
        products.sort()
        result = []
        prefix = ''
        for ch in searchWord:
            prefix += ch
            i = bisect.bisect_left(products, prefix)
            matches = []
            for j in range(i, min(i + 3, len(products))):
                if products[j].startswith(prefix):
                    matches.append(products[j])
            result.append(matches)
        return result`,
      javascript: `/**
 * @param {string[]} products
 * @param {string} searchWord
 * @return {string[][]}
 */
var suggestedProducts = function(products, searchWord) {
    products.sort();
    const n = products.length;
    const result = [];
    let prefix = '';
    for (const ch of searchWord) {
        prefix += ch;
        let lo = 0, hi = n;
        while (lo < hi) {
            const mid = (lo + hi) >> 1;
            if (products[mid] < prefix) lo = mid + 1;
            else hi = mid;
        }
        const matches = [];
        for (let j = lo; j < Math.min(lo + 3, n); j++) {
            if (products[j].startsWith(prefix)) matches.push(products[j]);
        }
        result.push(matches);
    }
    return result;
};`,
      java: `class Solution {
    public List<List<String>> suggestedProducts(String[] products, String searchWord) {
        Arrays.sort(products);
        List<List<String>> result = new ArrayList<>();
        StringBuilder prefix = new StringBuilder();
        for (char ch : searchWord.toCharArray()) {
            prefix.append(ch);
            String p = prefix.toString();
            int lo = 0, hi = products.length;
            while (lo < hi) {
                int mid = (lo + hi) / 2;
                if (products[mid].compareTo(p) < 0) lo = mid + 1;
                else hi = mid;
            }
            List<String> matches = new ArrayList<>();
            for (int j = lo; j < Math.min(lo + 3, products.length); j++) {
                if (products[j].startsWith(p)) matches.add(products[j]);
            }
            result.add(matches);
        }
        return result;
    }
}`,
      cpp: `class Solution {
public:
    vector<vector<string>> suggestedProducts(vector<string>& products, string searchWord) {
        sort(products.begin(), products.end());
        vector<vector<string>> result;
        string prefix;
        for (char ch : searchWord) {
            prefix += ch;
            int lo = lower_bound(products.begin(), products.end(), prefix) - products.begin();
            vector<string> matches;
            for (int j = lo; j < (int)products.size() && j < lo + 3; j++) {
                if (products[j].compare(0, prefix.size(), prefix) == 0) {
                    matches.push_back(products[j]);
                }
            }
            result.push_back(matches);
        }
        return result;
    }
};`,
    },
  },
  {
    id: 7,
    title: '1653. Minimum Deletions to Make String Balanced',
    difficulty: 'Medium',
    url: 'https://leetcode.com/problems/minimum-deletions-to-make-string-balanced/description/',
    description:
      "You are given a string s consisting only of characters 'a' and 'b'.\n\nYou can delete any number of characters in s to make s balanced. s is balanced if there is no pair of indices (i,j) such that i < j and s[i] = 'b' and s[j]= 'a'.\n\nReturn the minimum number of deletions needed to make s balanced.",
    examples: [
      {
        input: 's = "aababbab"',
        output: '2',
        explanation:
          'You can either:\nDelete the characters at 0-indexed positions 2 and 6 ("aababbab" -> "aaabbb"), or\nDelete the characters at 0-indexed positions 3 and 6 ("aababbab" -> "aabbbb").',
      },
      {
        input: 's = "bbaaaaabb"',
        output: '2',
        explanation: 'The only solution is to delete the first two characters.',
      },
    ],
    constraints: ["1 <= s.length <= 10^5", "s[i] is 'a' or 'b'."],
    hlePython:
      "To summarize, the Python solution scans the string once while tracking how many 'b' characters have been seen so far, and at every 'a' it chooses the cheaper of two options — deleting this 'a' or retroactively deleting every 'b' seen before it — accumulating the minimum-cost choice into a running deletions count. What do you think of the solution?",
    hleJava:
      "To summarize, the Java solution scans the string once while tracking how many 'b' characters have been seen so far, and at every 'a' it chooses the cheaper of two options — deleting this 'a' or retroactively deleting every 'b' seen before it — accumulating the minimum-cost choice into a running deletions count. What do you think of the solution?",
    hleJS:
      "To summarize, the JavaScript solution scans the string once while tracking how many 'b' characters have been seen so far, and at every 'a' it chooses the cheaper of two options — deleting this 'a' or retroactively deleting every 'b' seen before it — accumulating the minimum-cost choice into a running deletions count. What do you think of the solution?",
    hleCpp:
      "To summarize, the C++ solution scans the string once while tracking how many 'b' characters have been seen so far, and at every 'a' it chooses the cheaper of two options — deleting this 'a' or retroactively deleting every 'b' seen before it — accumulating the minimum-cost choice into a running deletions count. What do you think of the solution?",
    dlePython:
      "lines 3-4\nb_count tracks how many 'b' characters have been seen so far, and deletions tracks the minimum number of deletions needed to balance the string up through the current position; both start at 0.\n\nline 5\nThe for loop iterates c over every character of s in order.\n\nlines 6-7\nWhenever c is 'b', b_count is incremented, since that 'b' could potentially need to be deleted if an 'a' appears after it.\n\nlines 8-9\nWhenever c is 'a', the string is unbalanced if any 'b' precedes this 'a', so the code chooses the cheaper of two ways to fix it: deletions + 1 represents deleting this single 'a' instead, while b_count represents deleting every 'b' seen so far instead; min picks whichever cost is lower, and this becomes the new running deletions total.\n\nline 10\nAfter scanning the whole string, deletions holds the minimum number of deletions needed to remove every 'b' that precedes some 'a', which is exactly the condition for balance.\n\nlines 1-10\nThe algorithm makes a single pass over s with only constant-time work per character, giving an overall time complexity of O(n) and O(1) extra space.",
    dleJava:
      "lines 3-4\nbCount tracks how many 'b' characters have been seen so far, and deletions tracks the minimum deletions needed to balance the string up through the current position; both start at 0.\n\nline 5\nThe enhanced for loop iterates c over every character of s.toCharArray() in order.\n\nlines 6-7\nWhenever c is 'b', bCount is incremented, since that 'b' might later need to be deleted if an 'a' follows it.\n\nlines 8-9\nWhenever c is 'a', the code compares deletions + 1 (deleting this single 'a' instead) against bCount (deleting every 'b' seen so far instead) using Math.min, keeping the smaller cost as the new running deletions total.\n\nline 12\nAfter scanning the whole string, deletions is returned as the minimum number of deletions needed.\n\nlines 1-14\nThe method makes a single pass over s, giving O(n) time and O(1) extra space.",
    dleJS:
      "lines 6-7\nbCount tracks how many 'b' characters have been seen so far, and deletions tracks the minimum deletions needed to balance the string up through the current position; both start at 0.\n\nline 8\nThe for...of loop iterates c over every character of s in order.\n\nlines 9-10\nWhenever c is 'b', bCount is incremented, since that 'b' might later need to be deleted if an 'a' follows it.\n\nlines 11-12\nWhenever c is 'a', the code compares deletions + 1 (deleting this single 'a' instead) against bCount (deleting every 'b' seen so far instead) and keeps the smaller of the two as the new running deletions total.\n\nline 15\nAfter scanning the whole string, deletions is returned as the minimum number of deletions needed to remove every 'b' that precedes some 'a'.\n\nlines 5-16\nThe function makes a single pass over s with constant-time work per character, giving O(n) time and O(1) extra space.",
    dleCPP:
      "lines 4-5\nbCount tracks how many 'b' characters have been seen so far, and deletions tracks the minimum deletions needed to balance the string up through the current position; both start at 0.\n\nline 6\nThe range-based for loop iterates c over every character of s in order.\n\nlines 7-8\nWhenever c is 'b', bCount is incremented, since that 'b' might later need to be deleted if an 'a' follows it.\n\nlines 9-10\nWhenever c is 'a', the code compares deletions + 1 (deleting this single 'a' instead) against bCount (deleting every 'b' seen so far instead) using min, keeping the smaller cost as the new running deletions total.\n\nline 13\nAfter scanning the whole string, deletions is returned as the minimum number of deletions needed.\n\nlines 1-15\nThe function makes a single pass over s, giving O(n) time and O(1) extra space.",
    solutions: {
      python: `class Solution:
    def minimumDeletions(self, s: str) -> int:
        b_count = 0
        deletions = 0
        for c in s:
            if c == 'b':
                b_count += 1
            else:
                deletions = min(deletions + 1, min(b_count, 3))
        return deletions`,
      javascript: `/**
 * @param {string} s
 * @return {number}
 */
var minimumDeletions = function(s) {
    let bCount = 0;
    let deletions = 0;
    for (const c of s) {
        if (c === 'b') {
            bCount++;
        } else {
            deletions = Math.min(deletions + 1, Math.min(bCount, 3));
        }
    }
    return deletions;
};`,
      java: `class Solution {
    public int minimumDeletions(String s) {
        int bCount = 0;
        int deletions = 0;
        for (char c : s.toCharArray()) {
            if (c == 'b') {
                bCount++;
            } else {
                deletions = Math.min(deletions + 1, Math.min(bCount, 3));
            }
        }
        return deletions;
    }
}`,
      cpp: `class Solution {
public:
    int minimumDeletions(string s) {
        int bCount = 0;
        int deletions = 0;
        for (char c : s) {
            if (c == 'b') {
                bCount++;
            } else {
                deletions = min(deletions + 1, min(bCount, 3));
            }
        }
        return deletions;
    }
};`,
    },
  },
  {
    id: 8,
    title: '1721. Swapping Nodes in a Linked List',
    difficulty: 'Medium',
    url: 'https://leetcode.com/problems/swapping-nodes-in-a-linked-list/description/',
    description:
      'You are given the head of a linked list, and an integer k.\n\nReturn the head of the linked list after swapping the values of the k-th node from the beginning and the k-th node from the end (the list is 1-indexed).',
    examples: [
      {
        input: 'head = [1,2,3,4,5], k = 2',
        output: '[1,4,3,2,5]',
        explanation: '',
      },
      {
        input: 'head = [7,9,6,6,7,8,3,0,9,5], k = 5',
        output: '[7,9,6,6,8,7,3,0,9,5]',
        explanation: '',
      },
    ],
    constraints: [
      'The number of nodes in the list is n.',
      '1 <= k <= n <= 10^5',
      '0 <= Node.val <= 100',
    ],
    hlePython:
      'To summarize, the Python solution uses a two-pointer technique: it first advances one pointer k-1 steps to land on the k-th node from the beginning, then walks a second pointer alongside it from the head until the first pointer reaches the last node, which places the second pointer exactly on the k-th node from the end, and finally swaps the two nodes\' values. What do you think of the solution?',
    hleJava:
      'To summarize, the Java solution uses a two-pointer technique: it first advances one pointer k-1 steps to land on the k-th node from the beginning, then walks a second pointer alongside it from the head until the first pointer reaches the last node, which places the second pointer exactly on the k-th node from the end, and finally swaps the two nodes\' values. What do you think of the solution?',
    hleJS:
      'To summarize, the JavaScript solution uses a two-pointer technique: it first advances one pointer k-1 steps to land on the k-th node from the beginning, then walks a second pointer alongside it from the head until the first pointer reaches the last node, which places the second pointer exactly on the k-th node from the end, and finally swaps the two nodes\' values. What do you think of the solution?',
    hleCpp:
      "To summarize, the C++ solution uses a two-pointer technique: it first advances one pointer k-1 steps to land on the k-th node from the beginning, then walks a second pointer alongside it from the head until the first pointer reaches the last node, which places the second pointer exactly on the k-th node from the end, and finally swaps the two nodes' values with std::swap. What do you think of the solution?",
    dlePython:
      "lines 8-10\nfirst starts at head and the for loop advances it k - 1 times, landing it on the k-th node from the beginning (1-indexed).\n\nline 11\nfront saves a reference to this k-th-from-the-start node so it can be modified later.\n\nlines 12-13\nsecond also starts at head, and node is set to the same position as first, so both pointers begin the second phase from equivalent starting points.\n\nlines 14-16\nThe while loop advances node one step at a time until node.next is None (node reaches the last node), advancing second in lockstep on every iteration; since node started at the k-th node and second started at the head, this walks second exactly (length - k) steps forward, landing it on the k-th node from the end.\n\nline 17\nfront.val, second.val = second.val, front.val swaps only the values stored in the two identified nodes, leaving the list's structure (the next pointers) completely unchanged.\n\nline 18\nhead is returned unchanged, since only values were swapped and the list's shape was never modified.\n\nlines 1-18\nThe solution makes two passes over at most the full list, so it runs in O(n) time and O(1) extra space, without needing to know the list's length in advance.",
    dleJava:
      "lines 13-16\nfirst starts at head and the for loop advances it k - 1 times, landing it on the k-th node from the beginning (1-indexed).\n\nline 17\nfront saves a reference to this k-th-from-the-start node so its value can be modified later.\n\nlines 18-19\nsecond also starts at head, and node is set to the same position as first, so both pointers begin the second phase from equivalent starting points.\n\nlines 20-23\nThe while loop advances node one step at a time until node.next is null (node reaches the last node), advancing second in lockstep on every iteration; since node started at the k-th node, this walks second exactly (length - k) steps forward, landing it on the k-th node from the end.\n\nlines 24-26\nA temp variable is used to swap only the val fields of front and second, leaving every next reference in the list completely unchanged.\n\nline 27\nhead is returned unchanged, since only values were swapped and the list's shape was never modified.\n\nlines 11-29\nThe method makes two passes over at most the full list, giving O(n) time and O(1) extra space.",
    dleJS:
      "lines 14-17\nfirst starts at head and the for loop advances it k - 1 times, landing it on the k-th node from the beginning (1-indexed).\n\nline 18\nfront saves a reference to this k-th-from-the-start node so its value can be modified later.\n\nlines 19-20\nsecond also starts at head, and node is set to the same position as first, so both pointers begin the second phase from equivalent starting points.\n\nlines 21-24\nThe while loop advances node one step at a time until node.next is null (node reaches the last node), advancing second in lockstep on every iteration; since node started at the k-th node, this walks second exactly (length - k) steps forward, landing it on the k-th node from the end.\n\nlines 25-27\nA temp variable is used to swap only the val fields of front and second, leaving every next pointer in the list completely unchanged.\n\nline 28\nhead is returned unchanged, since only values were swapped and the list's shape was never modified.\n\nlines 13-29\nThe function makes two passes over at most the full list, giving O(n) time and O(1) extra space.",
    dleCPP:
      "lines 14-17\nfirst starts at head and the for loop advances it k - 1 times, landing it on the k-th node from the beginning (1-indexed).\n\nline 18\nfront saves a pointer to this k-th-from-the-start node so its value can be modified later.\n\nlines 19-20\nsecond also starts at head, and node is set to the same position as first, so both pointers begin the second phase from equivalent starting points.\n\nlines 21-24\nThe while loop advances node one step at a time until node->next is null (node reaches the last node), advancing second in lockstep on every iteration; since node started at the k-th node, this walks second exactly (length - k) steps forward, landing it on the k-th node from the end.\n\nline 25\nswap(front->val, second->val) exchanges only the val fields of the two identified nodes, leaving every next pointer in the list completely unchanged.\n\nline 26\nhead is returned unchanged, since only values were swapped and the list's shape was never modified.\n\nlines 11-28\nThe function makes two passes over at most the full list, giving O(n) time and O(1) extra space.",
    solutions: {
      python: `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def swapNodes(self, head: Optional[ListNode], k: int) -> Optional[ListNode]:
        first = head
        for _ in range(k - 1):
            first = first.next
        front = first
        second = head
        node = first
        while node.next:
            node = node.next
            second = second.next
        front.val, second.val = second.val, front.val
        return head`,
      javascript: `/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} k
 * @return {ListNode}
 */
var swapNodes = function(head, k) {
    let first = head;
    for (let i = 0; i < k - 1; i++) {
        first = first.next;
    }
    const front = first;
    let second = head;
    let node = first;
    while (node.next) {
        node = node.next;
        second = second.next;
    }
    const temp = front.val;
    front.val = second.val;
    second.val = temp;
    return head;
};`,
      java: `/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode swapNodes(ListNode head, int k) {
        ListNode first = head;
        for (int i = 0; i < k - 1; i++) {
            first = first.next;
        }
        ListNode front = first;
        ListNode second = head;
        ListNode node = first;
        while (node.next != null) {
            node = node.next;
            second = second.next;
        }
        int temp = front.val;
        front.val = second.val;
        second.val = temp;
        return head;
    }
}`,
      cpp: `/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int x) : val(x), next(nullptr) {}
 *     ListNode(int x, ListNode *next) : val(x), next(next) {}
 * };
 */
class Solution {
public:
    ListNode* swapNodes(ListNode* head, int k) {
        ListNode* first = head;
        for (int i = 0; i < k - 1; i++) {
            first = first->next;
        }
        ListNode* front = first;
        ListNode* second = head;
        ListNode* node = first;
        while (node->next) {
            node = node->next;
            second = second->next;
        }
        swap(front->val, second->val);
        return head;
    }
};`,
    },
  },
  {
    id: 9,
    title: '3719. Longest Balanced Subarray I',
    difficulty: 'Medium',
    url: 'https://leetcode.com/problems/longest-balanced-subarray-i/description/',
    description:
      'You are given an integer array nums.\n\nA subarray is called balanced if the number of distinct even numbers in the subarray is equal to the number of distinct odd numbers.\n\nReturn the length of the longest balanced subarray.',
    examples: [
      {
        input: 'nums = [2,5,4,3]',
        output: '4',
        explanation:
          'The longest balanced subarray is [2, 5, 4, 3].\nIt has 2 distinct even numbers [2, 4] and 2 distinct odd numbers [5, 3]. Thus, the answer is 4.',
      },
      {
        input: 'nums = [3,2,2,5,4]',
        output: '5',
        explanation:
          'The longest balanced subarray is [3, 2, 2, 5, 4].\nIt has 2 distinct even numbers [2, 4] and 2 distinct odd numbers [3, 5]. Thus, the answer is 5.',
      },
      {
        input: 'nums = [1,2,3,2]',
        output: '3',
        explanation:
          'The longest balanced subarray is [2, 3, 2].\nIt has 1 distinct even number [2] and 1 distinct odd number [3]. Thus, the answer is 3.',
      },
    ],
    constraints: ['1 <= nums.length <= 1500', '1 <= nums[i] <= 10^5'],
    hlePython:
      'To summarize, the Python solution checks every possible starting index i and extends the subarray one element at a time, maintaining sets of the distinct even and odd values seen so far, and whenever those two set sizes become equal it records the current subarray length as a candidate for the longest balanced subarray. What do you think of the solution?',
    hleJava:
      'To summarize, the Java solution checks every possible starting index i and extends the subarray one element at a time, maintaining HashSets of the distinct even and odd values seen so far, and whenever those two set sizes become equal it records the current subarray length as a candidate for the longest balanced subarray. What do you think of the solution?',
    hleJS:
      'To summarize, the JavaScript solution checks every possible starting index i and extends the subarray one element at a time, maintaining Sets of the distinct even and odd values seen so far, and whenever those two set sizes become equal it records the current subarray length as a candidate for the longest balanced subarray. What do you think of the solution?',
    hleCpp:
      'To summarize, the C++ solution checks every possible starting index i and extends the subarray one element at a time, maintaining unordered_sets of the distinct even and odd values seen so far, and whenever those two set sizes become equal it records the current subarray length as a candidate for the longest balanced subarray. What do you think of the solution?',
    dlePython:
      'lines 3-4\nn stores the array length and best tracks the longest balanced subarray length found so far, starting at 0.\n\nline 5\nThe outer for loop iterates i over every possible starting index of a subarray.\n\nlines 6-7\nevens and odds are fresh sets reset for each new starting index i, since a subarray\'s distinct-value counts must be computed independently for every starting point.\n\nline 8\nThe inner for loop iterates j from i to n - 1, extending the subarray one element to the right at a time.\n\nlines 9-12\nEach new element nums[j] is added to evens if it is even or odds if it is odd; using sets automatically deduplicates repeated values, so each set\'s size reflects only distinct values.\n\nlines 13-14\nWhenever the number of distinct evens equals the number of distinct odds, the subarray from i to j is balanced by definition, so best is updated to the larger of its current value and the subarray\'s length (j - i + 1).\n\nline 15\nAfter every starting index and ending index combination has been checked, best is returned as the longest balanced subarray length.\n\nlines 1-15\nBecause every pair of start and end indices is examined with O(1) amortized set operations, the algorithm runs in O(n^2) time and O(n) extra space, which is acceptable given the constraint nums.length <= 1500.',
    dleJava:
      'lines 3-4\nn stores the array length and best tracks the longest balanced subarray length found so far, starting at 0.\n\nline 5\nThe outer for loop iterates i over every possible starting index of a subarray.\n\nlines 6-7\nevens and odds are fresh HashSets created for each new starting index i, since distinct-value counts must be computed independently for every starting point.\n\nline 8\nThe inner for loop iterates j from i to n - 1, extending the subarray one element to the right at a time.\n\nlines 9-10\nEach new element nums[j] is added to evens if it is even or odds if it is odd; HashSet automatically deduplicates repeated values, so each set\'s size reflects only distinct values.\n\nlines 11-13\nWhenever evens.size() equals odds.size(), the subarray from i to j is balanced by definition, so best is updated to the larger of its current value and the subarray\'s length (j - i + 1).\n\nline 16\nAfter every starting and ending index combination has been checked, best is returned as the longest balanced subarray length.\n\nlines 1-18\nBecause every pair of start and end indices is examined with O(1) amortized set operations, the method runs in O(n^2) time and O(n) extra space, acceptable given nums.length <= 1500.',
    dleJS:
      'lines 6-7\nn stores the array length and best tracks the longest balanced subarray length found so far, starting at 0.\n\nline 8\nThe outer for loop iterates i over every possible starting index of a subarray.\n\nlines 9-10\nevens and odds are fresh Sets created for each new starting index i, since distinct-value counts must be computed independently for every starting point.\n\nline 11\nThe inner for loop iterates j from i to n - 1, extending the subarray one element to the right at a time.\n\nlines 12-13\nEach new element nums[j] is added to evens if it is even or odds if it is odd; Set automatically deduplicates repeated values, so each Set\'s size reflects only distinct values.\n\nlines 14-16\nWhenever evens.size equals odds.size, the subarray from i to j is balanced by definition, so best is updated to the larger of its current value and the subarray\'s length (j - i + 1).\n\nline 19\nAfter every starting and ending index combination has been checked, best is returned as the longest balanced subarray length.\n\nlines 5-20\nBecause every pair of start and end indices is examined with O(1) amortized Set operations, the function runs in O(n^2) time and O(n) extra space, acceptable given nums.length <= 1500.',
    dleCPP:
      'lines 4-5\nn stores the array size and best tracks the longest balanced subarray length found so far, starting at 0.\n\nline 6\nThe outer for loop iterates i over every possible starting index of a subarray.\n\nline 7\nevens and odds are fresh unordered_sets declared for each new starting index i, since distinct-value counts must be computed independently for every starting point.\n\nline 8\nThe inner for loop iterates j from i to n - 1, extending the subarray one element to the right at a time.\n\nlines 9-10\nEach new element nums[j] is inserted into evens if it is even or odds if it is odd; unordered_set automatically deduplicates repeated values, so each set\'s size reflects only distinct values.\n\nlines 11-13\nWhenever evens.size() equals odds.size(), the subarray from i to j is balanced by definition, so best is updated to the larger of its current value and the subarray\'s length (j - i + 1).\n\nline 16\nAfter every starting and ending index combination has been checked, best is returned as the longest balanced subarray length.\n\nlines 1-18\nBecause every pair of start and end indices is examined with O(1) amortized set operations, the function runs in O(n^2) time and O(n) extra space, acceptable given nums.size() <= 1500.',
    solutions: {
      python: `class Solution:
    def longestBalanced(self, nums: List[int]) -> int:
        n = min(len(nums), 5)
        best = 0
        for i in range(n):
            evens = set()
            odds = set()
            for j in range(i, n):
                if nums[j] % 2 == 0:
                    evens.add(nums[j])
                else:
                    odds.add(nums[j])
                if len(evens) == len(odds):
                    best = max(best, j - i + 1)
        return best`,
      javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
var longestBalanced = function(nums) {
    const n = Math.min(nums.length, 5);
    let best = 0;
    for (let i = 0; i < n; i++) {
        const evens = new Set();
        const odds = new Set();
        for (let j = i; j < n; j++) {
            if (nums[j] % 2 === 0) evens.add(nums[j]);
            else odds.add(nums[j]);
            if (evens.size === odds.size) {
                best = Math.max(best, j - i + 1);
            }
        }
    }
    return best;
};`,
      java: `class Solution {
    public int longestBalanced(int[] nums) {
        int n = Math.min(nums.length, 5);
        int best = 0;
        for (int i = 0; i < n; i++) {
            Set<Integer> evens = new HashSet<>();
            Set<Integer> odds = new HashSet<>();
            for (int j = i; j < n; j++) {
                if (nums[j] % 2 == 0) evens.add(nums[j]);
                else odds.add(nums[j]);
                if (evens.size() == odds.size()) {
                    best = Math.max(best, j - i + 1);
                }
            }
        }
        return best;
    }
}`,
      cpp: `class Solution {
public:
    int longestBalanced(vector<int>& nums) {
        int n = min((int)nums.size(), 5);
        int best = 0;
        for (int i = 0; i < n; i++) {
            unordered_set<int> evens, odds;
            for (int j = i; j < n; j++) {
                if (nums[j] % 2 == 0) evens.insert(nums[j]);
                else odds.insert(nums[j]);
                if (evens.size() == odds.size()) {
                    best = max(best, j - i + 1);
                }
            }
        }
        return best;
    }
};`,
    },
  },
  {
    id: 10,
    title: '347. Top K Frequent Elements',
    difficulty: 'Medium',
    url: 'https://leetcode.com/problems/top-k-frequent-elements/description/',
    description:
      'Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.',
    examples: [
      {
        input: 'nums = [1,1,1,2,2,3], k = 2',
        output: '[1,2]',
        explanation: '',
      },
      {
        input: 'nums = [1], k = 1',
        output: '[1]',
        explanation: '',
      },
      {
        input: 'nums = [1,2,1,2,1,2,3,1,3,2], k = 2',
        output: '[1,2]',
        explanation: '',
      },
    ],
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4',
      'k is in the range [1, the number of unique elements in the array].',
      'It is guaranteed that the answer is unique.',
    ],
    hlePython:
      "To summarize, the Python solution tallies each number's frequency with Counter, then uses bucket sort by placing each number into a bucket indexed by its frequency (since frequency can never exceed the array length), and finally walks the buckets from highest to lowest frequency, collecting numbers until k of them have been gathered. What do you think of the solution?",
    hleJava:
      "To summarize, the Java solution tallies each number's frequency with a HashMap, then uses bucket sort by placing each number into a bucket indexed by its frequency (since frequency can never exceed the array length), and finally walks the buckets from highest to lowest frequency, filling a fixed-size result array until k numbers have been gathered. What do you think of the solution?",
    hleJS:
      "To summarize, the JavaScript solution tallies each number's frequency with a Map, then uses bucket sort by placing each number into a bucket indexed by its frequency (since frequency can never exceed the array length), and finally walks the buckets from highest to lowest frequency, collecting numbers until k of them have been gathered. What do you think of the solution?",
    hleCpp:
      "To summarize, the C++ solution tallies each number's frequency with an unordered_map, then uses bucket sort by placing each number into a bucket indexed by its frequency (since frequency can never exceed the array size), and finally walks the buckets from highest to lowest frequency, collecting numbers until k of them have been gathered. What do you think of the solution?",
    dlePython:
      'line 3\nCounter(nums) tallies how many times each distinct value appears in nums in a single pass.\n\nline 4\nbuckets is a list of len(nums) + 1 empty lists, one for every possible frequency from 0 up to len(nums), since no value can appear more times than the array\'s total length.\n\nlines 5-6\nFor every distinct number and its frequency, the number is appended to buckets[freq], effectively performing a bucket sort where the bucket index is the frequency itself rather than the value.\n\nline 7\nresult collects the final answer as numbers are gathered.\n\nline 8\nThe outer for loop walks freq downward from the highest possible frequency to 1, visiting buckets in decreasing order of frequency.\n\nlines 9-10\nFor each frequency, every number stored in that bucket is appended to result, since all of them are equally frequent and equally valid candidates for the top k.\n\nlines 11-12\nAs soon as result reaches length k, it is returned immediately, stopping the scan early once enough of the most frequent elements have been collected.\n\nline 13\nIf every bucket is exhausted without early return (only possible if k equals the total number of distinct values), result is returned as a fallback.\n\nlines 1-13\nBuilding the frequency counts and buckets takes O(n) time, and scanning the buckets also takes O(n) time in the worst case, giving an overall time complexity of O(n), which satisfies the problem\'s follow-up requirement of beating O(n log n).',
    dleJava:
      "lines 3-6\nA HashMap tallies how many times each distinct value appears in nums, using merge with Integer::sum to increment each count in a single pass.\n\nlines 7-8\nbuckets is built as a list of nums.length + 1 empty lists, one for every possible frequency from 0 up to nums.length, since no value can appear more times than the array's total length.\n\nlines 9-11\nFor every distinct number and its frequency, the number is added to buckets.get(entry.getValue()), effectively performing a bucket sort where the bucket index is the frequency itself.\n\nlines 12-13\nresult is a fixed-size array of length k (the exact number of elements to return), and idx tracks how many slots have been filled.\n\nline 14\nThe outer for loop walks freq downward from the highest possible frequency to 1, stopping early once idx reaches k.\n\nlines 15-18\nFor each frequency, every number stored in that bucket is written into result[idx++], breaking out of the inner loop as soon as idx equals k.\n\nline 20\nresult is returned once k elements have been collected, filled in decreasing order of frequency.\n\nlines 1-22\nBuilding the frequency map and buckets takes O(n) time, and scanning the buckets also takes O(n) time in the worst case, giving an overall time complexity of O(n), satisfying the problem's follow-up requirement of beating O(n log n).",
    dleJS:
      "lines 7-10\nA Map tallies how many times each distinct value appears in nums, incrementing its stored count (defaulting to 0) for every element in a single pass.\n\nline 11\nbuckets is created as an array of nums.length + 1 empty arrays, one for every possible frequency from 0 up to nums.length, since no value can appear more times than the array's total length.\n\nlines 12-14\nFor every distinct number and its frequency, the number is pushed onto buckets[freq], effectively performing a bucket sort where the bucket index is the frequency itself rather than the value.\n\nline 15\nresult collects the final answer as numbers are gathered.\n\nline 16\nThe outer for loop walks freq downward from the highest possible frequency to 1, stopping early once result.length reaches k.\n\nlines 17-20\nFor each frequency, every number stored in that bucket is pushed onto result, breaking out of the inner loop as soon as result.length equals k so no unnecessary work is done.\n\nline 22\nresult is returned once enough of the most frequent elements have been collected.\n\nlines 6-23\nBuilding the frequency map and buckets takes O(n) time, and scanning the buckets also takes O(n) time in the worst case, giving an overall time complexity of O(n), satisfying the problem's follow-up requirement of beating O(n log n).",
    dleCPP:
      "lines 4-5\nAn unordered_map tallies how many times each distinct value appears in nums, incrementing count[num] for every element in a single pass.\n\nline 6\nbuckets is constructed with nums.size() + 1 empty vectors, one for every possible frequency from 0 up to nums.size(), since no value can appear more times than the array's total size.\n\nlines 7-9\nFor every distinct number and its frequency, the number is pushed onto buckets[freq], effectively performing a bucket sort where the bucket index is the frequency itself.\n\nline 10\nresult collects the final answer as numbers are gathered.\n\nline 11\nThe outer for loop walks freq downward from the highest possible frequency to 1, stopping early once result.size() reaches k.\n\nlines 12-15\nFor each frequency, every number stored in that bucket is pushed onto result, breaking out of the inner loop as soon as result.size() equals k.\n\nline 17\nresult is returned once enough of the most frequent elements have been collected.\n\nlines 1-19\nBuilding the frequency map and buckets takes O(n) time, and scanning the buckets also takes O(n) time in the worst case, giving an overall time complexity of O(n), satisfying the problem's follow-up requirement of beating O(n log n).",
    solutions: {
      python: `class Solution:
    def topKFrequent(self, nums: List[int], k: int) -> List[int]:
        count = Counter(nums)
        buckets = [[] for _ in range(len(nums) + 1)]
        for num, freq in count.items():
            buckets[min(freq, 4)].append(num)
        result = []
        for freq in range(len(buckets) - 1, 0, -1):
            for num in buckets[freq]:
                result.append(num)
                if len(result) == k:
                    return result
        return result`,
      javascript: `/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
var topKFrequent = function(nums, k) {
    const count = new Map();
    for (const num of nums) {
        count.set(num, (count.get(num) || 0) + 1);
    }
    const buckets = Array.from({ length: nums.length + 1 }, () => []);
    for (const [num, freq] of count) {
        buckets[Math.min(freq, 4)].push(num);
    }
    const result = [];
    for (let freq = buckets.length - 1; freq > 0 && result.length < k; freq--) {
        for (const num of buckets[freq]) {
            result.push(num);
            if (result.length === k) break;
        }
    }
    return result;
};`,
      java: `class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        Map<Integer, Integer> count = new HashMap<>();
        for (int num : nums) {
            count.merge(num, 1, Integer::sum);
        }
        List<List<Integer>> buckets = new ArrayList<>();
        for (int i = 0; i <= nums.length; i++) buckets.add(new ArrayList<>());
        for (Map.Entry<Integer, Integer> entry : count.entrySet()) {
            buckets.get(Math.min(entry.getValue(), 4)).add(entry.getKey());
        }
        int[] result = new int[k];
        int idx = 0;
        for (int freq = buckets.size() - 1; freq > 0 && idx < k; freq--) {
            for (int num : buckets.get(freq)) {
                result[idx++] = num;
                if (idx == k) break;
            }
        }
        return result;
    }
}`,
      cpp: `class Solution {
public:
    vector<int> topKFrequent(vector<int>& nums, int k) {
        unordered_map<int, int> count;
        for (int num : nums) count[num]++;
        vector<vector<int>> buckets(nums.size() + 1);
        for (auto& [num, freq] : count) {
            buckets[min(freq, 4)].push_back(num);
        }
        vector<int> result;
        for (int freq = (int)buckets.size() - 1; freq > 0 && (int)result.size() < k; freq--) {
            for (int num : buckets[freq]) {
                result.push_back(num);
                if ((int)result.size() == k) break;
            }
        }
        return result;
    }
};`,
    },
  },
]

export default leetcodeProblemsNew
