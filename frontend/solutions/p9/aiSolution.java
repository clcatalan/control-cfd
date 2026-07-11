// correct solution
// class Solution {
//     public String shiftingLetters(String s, int[] shifts) {
//         char[] result = s.toCharArray();
//         long total = 0;
//         for (int i = s.length() - 1; i >= 0; i--) {
//             total = (total + shifts[i]) % 26;
//             int shifted = (int) ((result[i] - 'a' + total) % 26);
//             result[i] = (char) ('a' + shifted);
//         }
//         return new String(result);
//     }
// }

// contains synthetic error - shifts only the i-th character by shifts[i] instead of accumulating shifts for all characters up to i
class Solution {
    public String shiftingLetters(String s, int[] shifts) {
        char[] result = s.toCharArray();
        for (int i = s.length() - 1; i >= 0; i--) {
            int shifted = (int) ((result[i] - 'a' + shifts[i]) % 26);
            result[i] = (char) ('a' + shifted);
        }
        return new String(result);
    }
}