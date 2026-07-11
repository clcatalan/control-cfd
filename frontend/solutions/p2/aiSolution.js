/**
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
                // correct solution on next line
                // if (sign === '' || sign === '+') coef += 1;
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
    return `x=${constant / coef}`;
};