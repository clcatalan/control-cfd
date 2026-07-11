// correct solution
// class Solution {
//     public int[] searchRange(int[] nums, int target) {
//         int left = lowerBound(nums, target);
//         if (left == nums.length || nums[left] != target) return new int[]{-1, -1};
//         int right = lowerBound(nums, target + 1) - 1;
//         return new int[]{left, right};
//     }
//
//     private int lowerBound(int[] nums, int val) {
//         int lo = 0, hi = nums.length;
//         while (lo < hi) {
//             int mid = (lo + hi) >>> 1;
//             if (nums[mid] < val) lo = mid + 1;
//             else hi = mid;
//         }
//         return lo;
//     }
// }

// contains synthetic error - computes the right boundary with lowerBound(nums, target) instead of lowerBound(nums, target + 1), so right is always left - 1
class Solution {
    public int[] searchRange(int[] nums, int target) {
        int left = lowerBound(nums, target);
        if (left == nums.length || nums[left] != target) return new int[]{-1, -1};
        int right = lowerBound(nums, target) - 1;
        return new int[]{left, right};
    }

    private int lowerBound(int[] nums, int val) {
        int lo = 0, hi = nums.length;
        while (lo < hi) {
            int mid = (lo + hi) >>> 1;
            if (nums[mid] < val) lo = mid + 1;
            else hi = mid;
        }
        return lo;
    }
}