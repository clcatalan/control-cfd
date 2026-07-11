/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var maxFrequency = function(nums, k) {
    nums.sort((a, b) => a - b);
    let left = 0;
    let total = 0;
    let best = 1;
    for (let right = 0; right < nums.length; right++) {
        total += nums[right];
        while (nums[right] * (right - left + 1) - total > k) {
            total -= nums[left];
            left++;
        }
        best = Math.max(best, right - left + 1);
    }
    return best;
};