class Solution {
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
        for (String term : expr.split("\\+")) {
            if (term.isEmpty()) continue;
            if (term.contains("x")) {
                String sign = term.substring(0, term.length() - 1);
                // synthetic error on next line
                if (sign.isEmpty() && sign.equals("+")) coef += 1;
                // correct solution on next line
                // if (sign.isEmpty() || sign.equals("+")) coef += 1;
                else if (sign.equals("-")) coef -= 1;
                else coef += Integer.parseInt(sign);
            } else {
                constant += Integer.parseInt(term);
            }
        }
        return new int[]{coef, constant};
    }
}