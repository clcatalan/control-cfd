// correct solution
// class Solution {
// public:
//     string shiftingLetters(string s, vector<int>& shifts) {
//         string result = s;
//         long long total = 0;
//         for (int i = (int) s.size() - 1; i >= 0; i--) {
//             total = (total + shifts[i]) % 26;
//             int shifted = (int) ((result[i] - 'a' + total) % 26);
//             result[i] = 'a' + shifted;
//         }
//         return result;
//     }
// };

// contains synthetic error - shifts only the i-th character by shifts[i] instead of accumulating shifts for all characters up to i
class Solution {
public:
    string shiftingLetters(string s, vector<int>& shifts) {
        string result = s;
        for (int i = (int) s.size() - 1; i >= 0; i--) {
            int shifted = (int) ((result[i] - 'a' + shifts[i]) % 26);
            result[i] = 'a' + shifted;
        }
        return result;
    }
};