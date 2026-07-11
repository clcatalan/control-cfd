class Solution {
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
}