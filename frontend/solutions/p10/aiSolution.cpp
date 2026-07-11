// correct solution
// class Solution {
// public:
//     vector<int> searchRange(vector<int>& nums, int target) {
//         int left = (int)(lower_bound(nums.begin(), nums.end(), target) - nums.begin());
//         if (left == (int) nums.size() || nums[left] != target) return {-1, -1};
//         int right = (int)(lower_bound(nums.begin(), nums.end(), target + 1) - nums.begin()) - 1;
//         return {left, right};
//     }
// };

// contains synthetic error - computes the right boundary with lower_bound(target) instead of lower_bound(target + 1), so right is always left - 1
class Solution {
public:
    vector<int> searchRange(vector<int>& nums, int target) {
        int left = (int)(lower_bound(nums.begin(), nums.end(), target) - nums.begin());
        if (left == (int) nums.size() || nums[left] != target) return {-1, -1};
        int right = (int)(lower_bound(nums.begin(), nums.end(), target) - nums.begin()) - 1;
        return {left, right};
    }
};