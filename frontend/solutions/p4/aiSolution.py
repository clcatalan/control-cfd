class Solution:
    def minRemoval(self, nums: List[int], k: int) -> int:
        nums.sort()
        n = len(nums)
        left = 0
        best = 1
        for right in range(n):
            while nums[right] > nums[left] * k:
                left += 1
            # synthetic error on next line
            best = max(best, right - left - 1)
            # correct solution on next line
            # best = max(best, right - left + 1)
        return n - best