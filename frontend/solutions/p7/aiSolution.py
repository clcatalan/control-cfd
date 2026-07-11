# correct implementation stack data structure
# class Solution:
#     def asteroidCollision(self, asteroids: List[int]) -> List[int]:
#         stack = []
#         for a in asteroids:
#             alive = True
#             while alive and a < 0 and stack and stack[-1] > 0:
#                 if stack[-1] < -a:
#                     stack.pop()
#                     continue
#                 elif stack[-1] == -a:
#                     stack.pop()
#                 alive = False
#             if alive:
#                 stack.append(a)
#         return stack

# contains synthetic error - uses queue instead of stack
class Solution:
    def asteroidCollision(self, asteroids: List[int]) -> List[int]:
        queue = deque()
        for a in asteroids:
            alive = True
            while alive and a < 0 and queue and queue[0] > 0:
                if queue[0] < -a:
                    queue.popleft()
                    continue
                elif queue[0] == -a:
                    queue.popleft()
                alive = False
            if alive:
                queue.append(a)
        return list(queue)