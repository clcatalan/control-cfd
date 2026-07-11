class Solution:
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
                    # correct solution on next line
                    # if sign == '' or sign == '+':
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
        return f"x={const // coef}"