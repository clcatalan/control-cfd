class Solution:
    def isArraySpecial(self, nums: List[int], queries: List[List[int]]) -> List[bool]:
        n = len(nums)
        prefix = [0] * n
        for i in range(1, n):
            prefix[i] = prefix[i - 1] + (0 if nums[i] % 2 != nums[i - 1] % 2 else 1)

        return [prefix[r] - prefix[l] == 0 for l, r in queries]