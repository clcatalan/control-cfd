class Solution {
    public int[] asteroidCollision(int[] asteroids) {
        Deque<Integer> stack = new ArrayDeque<>();
        for (int a : asteroids) {
            boolean alive = true;
            while (alive && a < 0 && !stack.isEmpty() && stack.peekLast() > 0) {
                int top = stack.peekLast();
                if (top < -a) {
                    stack.pollLast();
                    continue;
                } else if (top == -a) {
                    stack.pollLast();
                }
                alive = false;
            }
            if (alive) stack.addLast(a);
        }

        int[] result = new int[stack.size()];
        int i = 0;
        for (int val : stack) result[i++] = val;
        return result;
    }
}