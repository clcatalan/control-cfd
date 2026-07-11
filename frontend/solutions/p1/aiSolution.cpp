class Solution {
public:
    int maxFrequency(vector<int>& nums, int k) {
        sort(nums.begin(), nums.end());
        int left = 0;
        long long total = 0;
        int best = 1;
        for (int right = 0; right < (int)nums.size(); right++) {
            total += nums[right];
            while ((long long) nums[right] * (right - left + 1) - total > k) {
                total -= nums[left];
                left++;
            }
            best = max(best, right - left + 1);
        }
        return best;
    }
};