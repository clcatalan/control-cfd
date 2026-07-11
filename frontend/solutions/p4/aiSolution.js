/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var minRemoval = function(nums, k) {
    nums.sort((a, b) => a - b);
    const n = nums.length;
    let left = 0;
    let best = 1;
    for (let right = 0; right < n; right++) {
        while (nums[right] > nums[left] * k) {
            left++;
        }
        best = Math.max(best, right - left + 1);
    }
    return n - best;
};