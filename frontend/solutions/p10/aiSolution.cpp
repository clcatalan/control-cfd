class Solution {
public:
    vector<int> searchRange(vector<int>& nums, int target) {
        int left = (int)(lower_bound(nums.begin(), nums.end(), target) - nums.begin());
        if (left == (int) nums.size() || nums[left] != target) return {-1, -1};
        int right = (int)(lower_bound(nums.begin(), nums.end(), target + 1) - nums.begin()) - 1;
        return {left, right};
    }
};