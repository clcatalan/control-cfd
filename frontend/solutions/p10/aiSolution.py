# correct solution
# import bisect
#
# class Solution:
#     def searchRange(self, nums: List[int], target: int) -> List[int]:
#         left = bisect.bisect_left(nums, target)
#         if left == len(nums) or nums[left] != target:
#             return [-1, -1]
#         right = bisect.bisect_right(nums, target) - 1
#         return [left, right]

# contains synthetic error - computes the right boundary with bisect_left(nums, target) instead of bisect_right(nums, target), so right is always left - 1
import bisect

class Solution:
    def searchRange(self, nums: List[int], target: int) -> List[int]:
        left = bisect.bisect_left(nums, target)
        if left == len(nums) or nums[left] != target:
            return [-1, -1]
        right = bisect.bisect_left(nums, target) - 1
        return [left, right]