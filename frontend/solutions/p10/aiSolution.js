// correct solution
// /**
//  * @param {number[]} nums
//  * @param {number} target
//  * @return {number[]}
//  */
// var searchRange = function(nums, target) {
//     const lowerBound = (val) => {
//         let lo = 0, hi = nums.length;
//         while (lo < hi) {
//             const mid = (lo + hi) >> 1;
//             if (nums[mid] < val) lo = mid + 1;
//             else hi = mid;
//         }
//         return lo;
//     };
//
//     const left = lowerBound(target);
//     if (left === nums.length || nums[left] !== target) return [-1, -1];
//     const right = lowerBound(target + 1) - 1;
//     return [left, right];
// };

// contains synthetic error - computes the right boundary with lowerBound(target) instead of lowerBound(target + 1), so right is always left - 1
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var searchRange = function(nums, target) {
    const lowerBound = (val) => {
        let lo = 0, hi = nums.length;
        while (lo < hi) {
            const mid = (lo + hi) >> 1;
            if (nums[mid] < val) lo = mid + 1;
            else hi = mid;
        }
        return lo;
    };

    const left = lowerBound(target);
    if (left === nums.length || nums[left] !== target) return [-1, -1];
    const right = lowerBound(target) - 1;
    return [left, right];
};