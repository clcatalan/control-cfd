// correct implementation: stack data structure
// class Solution {
// public:
//     vector<int> asteroidCollision(vector<int>& asteroids) {
//         vector<int> stack;
//         for (int a : asteroids) {
//             bool alive = true;
//             while (alive && a < 0 && !stack.empty() && stack.back() > 0) {
//                 if (stack.back() < -a) {
//                     stack.pop_back();
//                     continue;
//                 } else if (stack.back() == -a) {
//                     stack.pop_back();
//                 }
//                 alive = false;
//             }
//             if (alive) stack.push_back(a);
//         }
//         return stack;
//     }
// };

// contains synthetic error - uses queue instead of stack
class Solution {
public:
    vector<int> asteroidCollision(vector<int>& asteroids) {
        deque<int> queue;
        for (int a : asteroids) {
            bool alive = true;
            while (alive && a < 0 && !queue.empty() && queue.front() > 0) {
                if (queue.front() < -a) {
                    queue.pop_front();
                    continue;
                } else if (queue.front() == -a) {
                    queue.pop_front();
                }
                alive = false;
            }
            if (alive) queue.push_back(a);
        }
        return vector<int>(queue.begin(), queue.end());
    }
};