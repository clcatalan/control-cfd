/**
 * @param {number[]} nums
 * @param {number[][]} queries
 * @return {boolean[]}
 */
var isArraySpecial = function(nums, queries) {
    const n = nums.length;
    const prefix = new Array(n).fill(0);
    for (let i = 1; i < n; i++) {
        prefix[i] = prefix[i - 1] + (nums[i] % 2 !== nums[i - 1] % 2 ? 0 : 1);
    }

    return queries.map(([l, r]) => prefix[r] - prefix[l] === 0);
};