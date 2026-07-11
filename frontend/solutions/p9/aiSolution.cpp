class Solution {
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
};