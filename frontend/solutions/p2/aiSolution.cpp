class Solution {
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
                // correct code on next line
                // if (sign.empty() || sign == "+") coef += 1;
                else if (sign == "-") coef -= 1;
                else coef += stoi(sign);
            } else {
                constant += stoi(term);
            }
        }
        return {coef, constant};
    }
};