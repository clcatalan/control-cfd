class Solution {
    private int rows, cols;
    private char[][] board;
    private String word;

    public boolean exist(char[][] board, String word) {
        this.board = board;
        this.word = word;
        this.rows = board.length;
        this.cols = board[0].length;

        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (dfs(r, c, 0)) return true;
            }
        }
        return false;
    }

    private boolean dfs(int r, int c, int i) {
        if (i == word.length()) return true;
        if (r < 0 || r >= rows || c < 0 || c >= cols || board[r][c] != word.charAt(i)) return false;

        char temp = board[r][c];
        board[r][c] = '#';
        boolean found = dfs(r + 1, c, i + 1) ||
                         dfs(r - 1, c, i + 1) ||
                         dfs(r, c + 1, i + 1) ||
                         dfs(r, c - 1, i + 1);
        board[r][c] = temp;
        return found;
    }
}