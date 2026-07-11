class Solution:
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

        return dp[-1] % MOD