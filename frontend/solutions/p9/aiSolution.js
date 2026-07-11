/**
 * @param {number} n
 * @param {number} k
 * @return {number}
 */
var numberOfSets = function(n, k) {
    const MOD = 1000000007;
    let dp = new Array(n).fill(1);

    for (let iter = 0; iter < k; iter++) {
        const newDp = new Array(n).fill(0);
        let prefix = 0;
        for (let i = 0; i < n; i++) {
            newDp[i] = ((i > 0 ? newDp[i - 1] : 0) + prefix) % MOD;
            prefix = (prefix + dp[i]) % MOD;
        }
        dp = newDp;
    }

    return dp[n - 1];
};