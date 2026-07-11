# correct solution
# class Solution:
#     def shiftingLetters(self, s: str, shifts: List[int]) -> str:
#         result = list(s)
#         total = 0
#         for i in range(len(s) - 1, -1, -1):
#             total = (total + shifts[i]) % 26
#             shifted = (ord(s[i]) - ord('a') + total) % 26
#             result[i] = chr(ord('a') + shifted)
#         return ''.join(result)

# contains synthetic error - shifts only the i-th character by shifts[i] instead of accumulating shifts for all characters up to i
class Solution:
    def shiftingLetters(self, s: str, shifts: List[int]) -> str:
        result = list(s)
        for i in range(len(s) - 1, -1, -1):
            shifted = (ord(s[i]) - ord('a') + shifts[i]) % 26
            result[i] = chr(ord('a') + shifted)
        return ''.join(result)