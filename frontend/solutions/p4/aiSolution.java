class Solution {
    public int minRemoval(int[] nums, int k) {
        Arrays.sort(nums);
        int n = nums.length;
        int left = 0;
        int best = 1;
        for (int right = 0; right < n; right++) {
            while ((long) nums[right] > (long) nums[left] * k) {
                left++;
            }
            // synthetic error on next line
            best = Math.max(best, right - left - 1);
            // correct solution on next line
            // best = Math.max(best, right - left + 1);
        }
        return n - best;
    }
}