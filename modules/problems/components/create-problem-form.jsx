"use client";
import { Editor } from "@monaco-editor/react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Plus,
  Trash2,
  Code2,
  FileText,
  Lightbulb,
  BookOpen,
  CheckCircle2,
  Download,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const problemSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  constraints: z.string().min(1, "Constraints are required"),
  hints: z.string().optional(),
  editorial: z.string().optional(),
  testCases: z
    .array(
      z.object({
        input: z.string().min(1, "Input is required"),
        output: z.string().min(1, "Output is required"),
      }),
    )
    .min(1, "At least one test case is required"),
  examples: z.object({
    JAVASCRIPT: z.object({
      input: z.string().min(1, "Input is required"),
      output: z.string().min(1, "Output is required"),
      explanation: z.string().optional(),
    }),
    PYTHON: z.object({
      input: z.string().min(1, "Input is required"),
      output: z.string().min(1, "Output is required"),
      explanation: z.string().optional(),
    }),
    JAVA: z.object({
      input: z.string().min(1, "Input is required"),
      output: z.string().min(1, "Output is required"),
      explanation: z.string().optional(),
    }),
    CPP: z.object({
      input: z.string().min(1, "Input is required"),
      output: z.string().min(1, "Output is required"),
      explanation: z.string().optional(),
    }),
  }),
  codeSnippets: z.object({
    JAVASCRIPT: z.string().min(1, "JavaScript code snippet is required"),
    PYTHON: z.string().min(1, "Python code snippet is required"),
    JAVA: z.string().min(1, "Java code snippet is required"),
    CPP: z.string().min(1, "C++ code snippet is required"),
  }),
  referenceSolutions: z.object({
    JAVASCRIPT: z.string().min(1, "JavaScript solution is required"),
    PYTHON: z.string().min(1, "Python solution is required"),
    JAVA: z.string().min(1, "Java solution is required"),
    CPP: z.string().min(1, "C++ solution is required"),
  }),
});

// ============================================================
// ALL SAMPLE PROBLEMS
// ============================================================
const SAMPLE_PROBLEMS = {
  "climbing-stairs": {
    title: "Climbing Stairs",
    description:
      "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    difficulty: "EASY",
    tags: ["Dynamic Programming", "Math", "Memoization"],
    constraints: "1 <= n <= 45",
    hints:
      "To reach the nth step, you can either come from the (n-1)th step or the (n-2)th step.",
    editorial:
      "This is a classic dynamic programming problem. The number of ways to reach the nth step is the sum of ways to reach (n-1)th and (n-2)th steps, forming a Fibonacci-like sequence.",
    testCases: [
      { input: "2", output: "2" },
      { input: "3", output: "3" },
      { input: "4", output: "5" },
    ],
    examples: {
      JAVASCRIPT: {
        input: "n = 2",
        output: "2",
        explanation: "Two ways: 1+1 or 2.",
      },
      PYTHON: {
        input: "n = 3",
        output: "3",
        explanation: "Three ways: 1+1+1, 1+2, 2+1.",
      },
      JAVA: {
        input: "n = 4",
        output: "5",
        explanation: "Five ways to reach step 4.",
      },
      CPP: {
        input: "n = 5",
        output: "8",
        explanation: "Eight ways to reach step 5.",
      },
    },
    codeSnippets: {
      JAVASCRIPT: `function climbStairs(n) {
  // Write your code here
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, terminal: false });
rl.on('line', (line) => {
  console.log(climbStairs(parseInt(line.trim())));
  rl.close();
});`,
      PYTHON: `class Solution:
    def climbStairs(self, n: int) -> int:
        # Write your code here
        pass

if __name__ == "__main__":
    import sys
    n = int(sys.stdin.readline().strip())
    sol = Solution()
    print(sol.climbStairs(n))`,
      JAVA: `import java.util.Scanner;

public class Main {
    public int climbStairs(int n) {
        // Write your code here
        return 0;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = Integer.parseInt(scanner.nextLine().trim());
        Main main = new Main();
        System.out.println(main.climbStairs(n));
    }
}`,
      CPP: `#include <iostream>
using namespace std;

int climbStairs(int n) {
    // Write your code here
    return 0;
}

int main() {
    int n;
    cin >> n;
    cout << climbStairs(n) << endl;
    return 0;
}`,
    },
    referenceSolutions: {
      JAVASCRIPT: `function climbStairs(n) {
  if (n <= 2) return n;
  let dp = new Array(n + 1);
  dp[1] = 1;
  dp[2] = 2;
  for (let i = 3; i <= n; i++) dp[i] = dp[i - 1] + dp[i - 2];
  return dp[n];
}

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, terminal: false });
rl.on('line', (line) => {
  console.log(climbStairs(parseInt(line.trim())));
  rl.close();
});`,
      PYTHON: `import sys

def climbStairs(n):
    if n <= 2:
        return n
    dp = [0] * (n + 1)
    dp[1] = 1
    dp[2] = 2
    for i in range(3, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    return dp[n]

print(climbStairs(int(sys.stdin.readline().strip())))`,
      JAVA: `import java.util.Scanner;

public class Main {
    public static int climbStairs(int n) {
        if (n <= 2) return n;
        int[] dp = new int[n + 1];
        dp[1] = 1;
        dp[2] = 2;
        for (int i = 3; i <= n; i++) dp[i] = dp[i - 1] + dp[i - 2];
        return dp[n];
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println(climbStairs(Integer.parseInt(sc.nextLine().trim())));
    }
}`,
      CPP: `#include <iostream>
#include <vector>
using namespace std;

int climbStairs(int n) {
    if (n <= 2) return n;
    vector<int> dp(n + 1);
    dp[1] = 1;
    dp[2] = 2;
    for (int i = 3; i <= n; i++) dp[i] = dp[i - 1] + dp[i - 2];
    return dp[n];
}

int main() {
    int n;
    cin >> n;
    cout << climbStairs(n) << endl;
    return 0;
}`,
    },
  },

  "valid-palindrome": {
    title: "Valid Palindrome",
    description:
      "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Given a string s, return true if it is a palindrome, or false otherwise.",
    difficulty: "EASY",
    tags: ["String", "Two Pointers"],
    constraints:
      "1 <= s.length <= 2 * 10^5\ns consists only of printable ASCII characters.",
    hints:
      "Consider using two pointers, one from the start and one from the end, moving towards the center.",
    editorial:
      "Use two pointers approach. One pointer starts from the beginning and the other from the end, skipping non-alphanumeric characters and comparing lowercase versions.",
    testCases: [
      { input: "A man, a plan, a canal: Panama", output: "true" },
      { input: "race a car", output: "false" },
      { input: " ", output: "true" },
    ],
    examples: {
      JAVASCRIPT: {
        input: 's = "A man, a plan, a canal: Panama"',
        output: "true",
        explanation: '"amanaplanacanalpanama" is a palindrome.',
      },
      PYTHON: {
        input: 's = "A man, a plan, a canal: Panama"',
        output: "true",
        explanation: '"amanaplanacanalpanama" is a palindrome.',
      },
      JAVA: {
        input: 's = "A man, a plan, a canal: Panama"',
        output: "true",
        explanation: '"amanaplanacanalpanama" is a palindrome.',
      },
      CPP: {
        input: 's = "A man, a plan, a canal: Panama"',
        output: "true",
        explanation: '"amanaplanacanalpanama" is a palindrome.',
      },
    },
    codeSnippets: {
      JAVASCRIPT: `function isPalindrome(s) {
  // Write your code here
}

const lines = [];
process.stdin.on('data', d => lines.push(...d.toString().split('\\n')));
process.stdin.on('end', () => {
  console.log(isPalindrome(lines[0]) ? "true" : "false");
});`,
      PYTHON: `import sys

def isPalindrome(s):
    # Write your code here
    pass

s = sys.stdin.readline().strip()
print(str(isPalindrome(s)).lower())`,
      JAVA: `import java.util.Scanner;

public class Main {
    public static boolean isPalindrome(String s) {
        // Write your code here
        return false;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println(isPalindrome(sc.nextLine()) ? "true" : "false");
    }
}`,
      CPP: `#include <iostream>
#include <string>
using namespace std;

bool isPalindrome(string s) {
    // Write your code here
    return false;
}

int main() {
    string s;
    getline(cin, s);
    cout << (isPalindrome(s) ? "true" : "false") << endl;
    return 0;
}`,
    },
    referenceSolutions: {
      JAVASCRIPT: `function isPalindrome(s) {
  s = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  let l = 0, r = s.length - 1;
  while (l < r) {
    if (s[l] !== s[r]) return false;
    l++; r--;
  }
  return true;
}

const lines = [];
process.stdin.on('data', d => lines.push(...d.toString().split('\\n')));
process.stdin.on('end', () => {
  console.log(isPalindrome(lines[0]) ? "true" : "false");
});`,
      PYTHON: `import sys

def isPalindrome(s):
    filtered = [c.lower() for c in s if c.isalnum()]
    return filtered == filtered[::-1]

print(str(isPalindrome(sys.stdin.readline().strip())).lower())`,
      JAVA: `import java.util.Scanner;

public class Main {
    public static boolean isPalindrome(String s) {
        s = s.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
        int l = 0, r = s.length() - 1;
        while (l < r) {
            if (s.charAt(l) != s.charAt(r)) return false;
            l++; r--;
        }
        return true;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println(isPalindrome(sc.nextLine()) ? "true" : "false");
    }
}`,
      CPP: `#include <iostream>
#include <string>
#include <cctype>
using namespace std;

bool isPalindrome(string s) {
    string filtered;
    for (char c : s) {
        if (isalnum(c)) filtered += tolower(c);
    }
    int l = 0, r = filtered.length() - 1;
    while (l < r) {
        if (filtered[l] != filtered[r]) return false;
        l++; r--;
    }
    return true;
}

int main() {
    string s;
    getline(cin, s);
    cout << (isPalindrome(s) ? "true" : "false") << endl;
    return 0;
}`,
    },
  },

  "two-sum": {
    title: "Two Sum",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
    difficulty: "EASY",
    tags: ["Array", "Hash Map"],
    constraints:
      "2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9\nOnly one valid answer exists.",
    hints:
      "Try using a hash map to store each number and its index. For each number, check if (target - number) already exists in the map.",
    editorial:
      "Use a hash map. For each element nums[i], check if target - nums[i] exists in the map. If yes, return both indices. This gives O(n) time complexity.",
    testCases: [
      { input: "4\n2 7 11 15\n9", output: "0 1" },
      { input: "3\n3 2 4\n6", output: "1 2" },
      { input: "2\n3 3\n6", output: "0 1" },
    ],
    examples: {
      JAVASCRIPT: {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "nums[0] + nums[1] == 9, return [0, 1].",
      },
      PYTHON: {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
        explanation: "nums[1] + nums[2] == 6, return [1, 2].",
      },
      JAVA: {
        input: "nums = [3,3], target = 6",
        output: "[0,1]",
        explanation: "nums[0] + nums[1] == 6, return [0, 1].",
      },
      CPP: {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "nums[0] + nums[1] == 9, return [0, 1].",
      },
    },
    codeSnippets: {
      JAVASCRIPT: `function twoSum(nums, target) {
  // Write your code here
}

const lines = [];
process.stdin.on('data', d => lines.push(...d.toString().split('\\n')));
process.stdin.on('end', () => {
  const n = parseInt(lines[0]);
  const nums = lines[1].trim().split(' ').map(Number);
  const target = parseInt(lines[2]);
  console.log(twoSum(nums, target).join(' '));
});`,
      PYTHON: `import sys

def twoSum(nums, target):
    # Write your code here
    pass

lines = sys.stdin.read().split('\\n')
n = int(lines[0])
nums = list(map(int, lines[1].split()))
target = int(lines[2])
print(' '.join(map(str, twoSum(nums, target))))`,
      JAVA: `import java.util.*;

public class Main {
    public static int[] twoSum(int[] nums, int target) {
        // Write your code here
        return new int[]{};
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        String[] parts = sc.nextLine().trim().split(" ");
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = Integer.parseInt(parts[i]);
        int target = Integer.parseInt(sc.nextLine().trim());
        int[] result = twoSum(nums, target);
        System.out.println(result[0] + " " + result[1]);
    }
}`,
      CPP: `#include <iostream>
#include <vector>
#include <sstream>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    // Write your code here
    return {};
}

int main() {
    int n, target;
    cin >> n;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    cin >> target;
    vector<int> result = twoSum(nums, target);
    cout << result[0] << " " << result[1] << endl;
    return 0;
}`,
    },
    referenceSolutions: {
      JAVASCRIPT: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) return [map.get(complement), i];
    map.set(nums[i], i);
  }
}

const lines = [];
process.stdin.on('data', d => lines.push(...d.toString().split('\\n')));
process.stdin.on('end', () => {
  const n = parseInt(lines[0]);
  const nums = lines[1].trim().split(' ').map(Number);
  const target = parseInt(lines[2]);
  console.log(twoSum(nums, target).join(' '));
});`,
      PYTHON: `import sys

def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i

lines = sys.stdin.read().split('\\n')
n = int(lines[0])
nums = list(map(int, lines[1].split()))
target = int(lines[2])
print(' '.join(map(str, twoSum(nums, target))))`,
      JAVA: `import java.util.*;

public class Main {
    public static int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) return new int[]{map.get(complement), i};
            map.put(nums[i], i);
        }
        return new int[]{};
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        String[] parts = sc.nextLine().trim().split(" ");
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = Integer.parseInt(parts[i]);
        int target = Integer.parseInt(sc.nextLine().trim());
        int[] result = twoSum(nums, target);
        System.out.println(result[0] + " " + result[1]);
    }
}`,
      CPP: `#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (seen.count(complement)) return {seen[complement], i};
        seen[nums[i]] = i;
    }
    return {};
}

int main() {
    int n, target;
    cin >> n;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    cin >> target;
    vector<int> result = twoSum(nums, target);
    cout << result[0] << " " << result[1] << endl;
    return 0;
}`,
    },
  },

  "best-time-to-buy-stock": {
    title: "Best Time to Buy and Sell Stock",
    description:
      "You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and a different day in the future to sell that stock. Return the maximum profit you can achieve. If you cannot achieve any profit, return 0.",
    difficulty: "EASY",
    tags: ["Array", "Dynamic Programming", "Greedy"],
    constraints: "1 <= prices.length <= 10^5\n0 <= prices[i] <= 10^4",
    hints:
      "Keep track of the minimum price seen so far. For each price, calculate the profit if you sold at that price.",
    editorial:
      "Single pass approach: track the minimum price and maximum profit. For each price, update minimum if lower, otherwise calculate profit and update maximum.",
    testCases: [
      { input: "6\n7 1 5 3 6 4", output: "5" },
      { input: "5\n7 6 4 3 1", output: "0" },
      { input: "3\n1 2 3", output: "2" },
    ],
    examples: {
      JAVASCRIPT: {
        input: "prices = [7,1,5,3,6,4]",
        output: "5",
        explanation:
          "Buy at price=1 (day 2), sell at price=6 (day 5). Profit = 5.",
      },
      PYTHON: {
        input: "prices = [7,6,4,3,1]",
        output: "0",
        explanation: "No profitable transaction possible.",
      },
      JAVA: {
        input: "prices = [1,2,3]",
        output: "2",
        explanation: "Buy at price=1, sell at price=3. Profit = 2.",
      },
      CPP: {
        input: "prices = [7,1,5,3,6,4]",
        output: "5",
        explanation:
          "Buy at price=1 (day 2), sell at price=6 (day 5). Profit = 5.",
      },
    },
    codeSnippets: {
      JAVASCRIPT: `function maxProfit(prices) {
  // Write your code here
}

const lines = [];
process.stdin.on('data', d => lines.push(...d.toString().split('\\n')));
process.stdin.on('end', () => {
  const n = parseInt(lines[0]);
  const prices = lines[1].trim().split(' ').map(Number);
  console.log(maxProfit(prices));
});`,
      PYTHON: `import sys

def maxProfit(prices):
    # Write your code here
    pass

lines = sys.stdin.read().split('\\n')
n = int(lines[0])
prices = list(map(int, lines[1].split()))
print(maxProfit(prices))`,
      JAVA: `import java.util.*;

public class Main {
    public static int maxProfit(int[] prices) {
        // Write your code here
        return 0;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        String[] parts = sc.nextLine().trim().split(" ");
        int[] prices = new int[n];
        for (int i = 0; i < n; i++) prices[i] = Integer.parseInt(parts[i]);
        System.out.println(maxProfit(prices));
    }
}`,
      CPP: `#include <iostream>
#include <vector>
using namespace std;

int maxProfit(vector<int>& prices) {
    // Write your code here
    return 0;
}

int main() {
    int n;
    cin >> n;
    vector<int> prices(n);
    for (int i = 0; i < n; i++) cin >> prices[i];
    cout << maxProfit(prices) << endl;
    return 0;
}`,
    },
    referenceSolutions: {
      JAVASCRIPT: `function maxProfit(prices) {
  let minPrice = Infinity;
  let maxProfit = 0;
  for (const price of prices) {
    if (price < minPrice) minPrice = price;
    else if (price - minPrice > maxProfit) maxProfit = price - minPrice;
  }
  return maxProfit;
}

const lines = [];
process.stdin.on('data', d => lines.push(...d.toString().split('\\n')));
process.stdin.on('end', () => {
  const n = parseInt(lines[0]);
  const prices = lines[1].trim().split(' ').map(Number);
  console.log(maxProfit(prices));
});`,
      PYTHON: `import sys

def maxProfit(prices):
    min_price = float('inf')
    max_profit = 0
    for price in prices:
        if price < min_price:
            min_price = price
        elif price - min_price > max_profit:
            max_profit = price - min_price
    return max_profit

lines = sys.stdin.read().split('\\n')
n = int(lines[0])
prices = list(map(int, lines[1].split()))
print(maxProfit(prices))`,
      JAVA: `import java.util.*;

public class Main {
    public static int maxProfit(int[] prices) {
        int minPrice = Integer.MAX_VALUE;
        int maxProfit = 0;
        for (int price : prices) {
            if (price < minPrice) minPrice = price;
            else if (price - minPrice > maxProfit) maxProfit = price - minPrice;
        }
        return maxProfit;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        String[] parts = sc.nextLine().trim().split(" ");
        int[] prices = new int[n];
        for (int i = 0; i < n; i++) prices[i] = Integer.parseInt(parts[i]);
        System.out.println(maxProfit(prices));
    }
}`,
      CPP: `#include <iostream>
#include <vector>
#include <climits>
using namespace std;

int maxProfit(vector<int>& prices) {
    int minPrice = INT_MAX;
    int maxProfit = 0;
    for (int price : prices) {
        if (price < minPrice) minPrice = price;
        else if (price - minPrice > maxProfit) maxProfit = price - minPrice;
    }
    return maxProfit;
}

int main() {
    int n;
    cin >> n;
    vector<int> prices(n);
    for (int i = 0; i < n; i++) cin >> prices[i];
    cout << maxProfit(prices) << endl;
    return 0;
}`,
    },
  },

  "reverse-string": {
    title: "Reverse String",
    description:
      "Write a function that reverses a string. Read a single line string from stdin and print it reversed.",
    difficulty: "EASY",
    tags: ["String", "Two Pointers"],
    constraints: "1 <= s.length <= 10^5\ns[i] is a printable ASCII character.",
    hints:
      "Use two pointers — one at the start and one at the end. Swap characters and move both pointers inward.",
    editorial:
      "Two-pointer approach works in O(n) time and O(1) space. Place one pointer at index 0 and another at n-1. Swap, then move inward until they meet.",
    testCases: [
      { input: "hello", output: "olleh" },
      { input: "Hannah", output: "hannaH" },
      { input: "abcde", output: "edcba" },
    ],
    examples: {
      JAVASCRIPT: {
        input: 's = "hello"',
        output: '"olleh"',
        explanation: "hello reversed is olleh.",
      },
      PYTHON: {
        input: 's = "Hannah"',
        output: '"hannaH"',
        explanation: "Hannah reversed is hannaH.",
      },
      JAVA: {
        input: 's = "abcde"',
        output: '"edcba"',
        explanation: "abcde reversed is edcba.",
      },
      CPP: {
        input: 's = "hello"',
        output: '"olleh"',
        explanation: "hello reversed is olleh.",
      },
    },
    codeSnippets: {
      JAVASCRIPT: `function reverseString(s) {
  // Write your code here
}

const lines = [];
process.stdin.on('data', d => lines.push(...d.toString().split('\\n')));
process.stdin.on('end', () => {
  console.log(reverseString(lines[0].trim()));
});`,
      PYTHON: `import sys

def reverseString(s):
    # Write your code here
    pass

s = sys.stdin.readline().strip()
print(reverseString(s))`,
      JAVA: `import java.util.*;

public class Main {
    public static String reverseString(String s) {
        // Write your code here
        return "";
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println(reverseString(sc.nextLine()));
    }
}`,
      CPP: `#include <iostream>
#include <string>
using namespace std;

string reverseString(string s) {
    // Write your code here
    return "";
}

int main() {
    string s;
    getline(cin, s);
    cout << reverseString(s) << endl;
    return 0;
}`,
    },
    referenceSolutions: {
      JAVASCRIPT: `function reverseString(s) {
  return s.split('').reverse().join('');
}

const lines = [];
process.stdin.on('data', d => lines.push(...d.toString().split('\\n')));
process.stdin.on('end', () => {
  console.log(reverseString(lines[0].trim()));
});`,
      PYTHON: `import sys

def reverseString(s):
    return s[::-1]

print(reverseString(sys.stdin.readline().strip()))`,
      JAVA: `import java.util.*;

public class Main {
    public static String reverseString(String s) {
        return new StringBuilder(s).reverse().toString();
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println(reverseString(sc.nextLine()));
    }
}`,
      CPP: `#include <iostream>
#include <string>
#include <algorithm>
using namespace std;

string reverseString(string s) {
    reverse(s.begin(), s.end());
    return s;
}

int main() {
    string s;
    getline(cin, s);
    cout << reverseString(s) << endl;
    return 0;
}`,
    },
  },

  "maximum-subarray": {
    title: "Maximum Subarray",
    description:
      "Given an integer array nums, find the subarray with the largest sum, and return its sum.",
    difficulty: "MEDIUM",
    tags: ["Array", "Dynamic Programming", "Divide and Conquer"],
    constraints: "1 <= nums.length <= 10^5\n-10^4 <= nums[i] <= 10^4",
    hints:
      "Think about what happens at each position: should you extend the previous subarray or start a new one?",
    editorial:
      "Use Kadane's Algorithm. currentSum = max(nums[i], currentSum + nums[i]). Update maxSum = max(maxSum, currentSum) at each step.",
    testCases: [
      { input: "9\n-2 1 -3 4 -1 2 1 -5 4", output: "6" },
      { input: "1\n1", output: "1" },
      { input: "5\n5 4 -1 7 8", output: "23" },
    ],
    examples: {
      JAVASCRIPT: {
        input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
        output: "6",
        explanation: "Subarray [4,-1,2,1] has largest sum = 6.",
      },
      PYTHON: {
        input: "nums = [1]",
        output: "1",
        explanation: "Subarray [1] has largest sum = 1.",
      },
      JAVA: {
        input: "nums = [5,4,-1,7,8]",
        output: "23",
        explanation: "Subarray [5,4,-1,7,8] has largest sum = 23.",
      },
      CPP: {
        input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
        output: "6",
        explanation: "Subarray [4,-1,2,1] has largest sum = 6.",
      },
    },
    codeSnippets: {
      JAVASCRIPT: `function maxSubArray(nums) {
  // Write your code here
}

const lines = [];
process.stdin.on('data', d => lines.push(...d.toString().split('\\n')));
process.stdin.on('end', () => {
  const n = parseInt(lines[0]);
  const nums = lines[1].trim().split(' ').map(Number);
  console.log(maxSubArray(nums));
});`,
      PYTHON: `import sys

def maxSubArray(nums):
    # Write your code here
    pass

lines = sys.stdin.read().split('\\n')
n = int(lines[0])
nums = list(map(int, lines[1].split()))
print(maxSubArray(nums))`,
      JAVA: `import java.util.*;

public class Main {
    public static int maxSubArray(int[] nums) {
        // Write your code here
        return 0;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        String[] parts = sc.nextLine().trim().split(" ");
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = Integer.parseInt(parts[i]);
        System.out.println(maxSubArray(nums));
    }
}`,
      CPP: `#include <iostream>
#include <vector>
using namespace std;

int maxSubArray(vector<int>& nums) {
    // Write your code here
    return 0;
}

int main() {
    int n;
    cin >> n;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    cout << maxSubArray(nums) << endl;
    return 0;
}`,
    },
    referenceSolutions: {
      JAVASCRIPT: `function maxSubArray(nums) {
  let maxSum = nums[0];
  let currentSum = nums[0];
  for (let i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }
  return maxSum;
}

const lines = [];
process.stdin.on('data', d => lines.push(...d.toString().split('\\n')));
process.stdin.on('end', () => {
  const n = parseInt(lines[0]);
  const nums = lines[1].trim().split(' ').map(Number);
  console.log(maxSubArray(nums));
});`,
      PYTHON: `import sys

def maxSubArray(nums):
    max_sum = nums[0]
    current_sum = nums[0]
    for num in nums[1:]:
        current_sum = max(num, current_sum + num)
        max_sum = max(max_sum, current_sum)
    return max_sum

lines = sys.stdin.read().split('\\n')
n = int(lines[0])
nums = list(map(int, lines[1].split()))
print(maxSubArray(nums))`,
      JAVA: `import java.util.*;

public class Main {
    public static int maxSubArray(int[] nums) {
        int maxSum = nums[0];
        int currentSum = nums[0];
        for (int i = 1; i < nums.length; i++) {
            currentSum = Math.max(nums[i], currentSum + nums[i]);
            maxSum = Math.max(maxSum, currentSum);
        }
        return maxSum;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        String[] parts = sc.nextLine().trim().split(" ");
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = Integer.parseInt(parts[i]);
        System.out.println(maxSubArray(nums));
    }
}`,
      CPP: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int maxSubArray(vector<int>& nums) {
    int maxSum = nums[0];
    int currentSum = nums[0];
    for (int i = 1; i < nums.size(); i++) {
        currentSum = max(nums[i], currentSum + nums[i]);
        maxSum = max(maxSum, currentSum);
    }
    return maxSum;
}

int main() {
    int n;
    cin >> n;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    cout << maxSubArray(nums) << endl;
    return 0;
}`,
    },
  },

  "longest-common-prefix": {
    title: "Longest Common Prefix",
    description:
      'Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string "". The first line of input is n (number of strings), followed by n strings each on a new line.',
    difficulty: "EASY",
    tags: ["String", "Trie"],
    constraints:
      "1 <= strs.length <= 200\n0 <= strs[i].length <= 200\nstrs[i] consists of only lowercase English letters.",
    hints:
      "Start with the first string as the prefix. Then trim it down by comparing with each subsequent string.",
    editorial:
      "Take the first string as the initial prefix. For each remaining string, trim the prefix from the right until the current string starts with it. If prefix becomes empty, return ''.",
    testCases: [
      { input: "3\nflower\nflow\nflight", output: "fl" },
      { input: "3\ndog\nracecar\ncar", output: "" },
      { input: "2\ninterspecies\ninterstellar", output: "inters" },
    ],
    examples: {
      JAVASCRIPT: {
        input: 'strs = ["flower","flow","flight"]',
        output: '"fl"',
        explanation: "The longest common prefix is fl.",
      },
      PYTHON: {
        input: 'strs = ["dog","racecar","car"]',
        output: '""',
        explanation: "There is no common prefix.",
      },
      JAVA: {
        input: 'strs = ["interspecies","interstellar"]',
        output: '"inters"',
        explanation: "The longest common prefix is inters.",
      },
      CPP: {
        input: 'strs = ["flower","flow","flight"]',
        output: '"fl"',
        explanation: "The longest common prefix is fl.",
      },
    },
    codeSnippets: {
      JAVASCRIPT: `function longestCommonPrefix(strs) {
  // Write your code here
}

const lines = [];
process.stdin.on('data', d => lines.push(...d.toString().split('\\n')));
process.stdin.on('end', () => {
  const n = parseInt(lines[0]);
  const strs = lines.slice(1, n + 1).map(s => s.trim());
  console.log(longestCommonPrefix(strs));
});`,
      PYTHON: `import sys

def longestCommonPrefix(strs):
    # Write your code here
    pass

lines = sys.stdin.read().split('\\n')
n = int(lines[0])
strs = [lines[i + 1].strip() for i in range(n)]
print(longestCommonPrefix(strs))`,
      JAVA: `import java.util.*;

public class Main {
    public static String longestCommonPrefix(String[] strs) {
        // Write your code here
        return "";
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        String[] strs = new String[n];
        for (int i = 0; i < n; i++) strs[i] = sc.nextLine().trim();
        System.out.println(longestCommonPrefix(strs));
    }
}`,
      CPP: `#include <iostream>
#include <vector>
#include <string>
using namespace std;

string longestCommonPrefix(vector<string>& strs) {
    // Write your code here
    return "";
}

int main() {
    int n;
    cin >> n;
    cin.ignore();
    vector<string> strs(n);
    for (int i = 0; i < n; i++) getline(cin, strs[i]);
    cout << longestCommonPrefix(strs) << endl;
    return 0;
}`,
    },
    referenceSolutions: {
      JAVASCRIPT: `function longestCommonPrefix(strs) {
  if (!strs.length) return "";
  let prefix = strs[0];
  for (let i = 1; i < strs.length; i++) {
    while (!strs[i].startsWith(prefix)) {
      prefix = prefix.slice(0, -1);
      if (!prefix) return "";
    }
  }
  return prefix;
}

const lines = [];
process.stdin.on('data', d => lines.push(...d.toString().split('\\n')));
process.stdin.on('end', () => {
  const n = parseInt(lines[0]);
  const strs = lines.slice(1, n + 1).map(s => s.trim());
  console.log(longestCommonPrefix(strs));
});`,
      PYTHON: `import sys

def longestCommonPrefix(strs):
    if not strs:
        return ""
    prefix = strs[0]
    for s in strs[1:]:
        while not s.startswith(prefix):
            prefix = prefix[:-1]
            if not prefix:
                return ""
    return prefix

lines = sys.stdin.read().split('\\n')
n = int(lines[0])
strs = [lines[i + 1].strip() for i in range(n)]
print(longestCommonPrefix(strs))`,
      JAVA: `import java.util.*;

public class Main {
    public static String longestCommonPrefix(String[] strs) {
        if (strs.length == 0) return "";
        String prefix = strs[0];
        for (int i = 1; i < strs.length; i++) {
            while (!strs[i].startsWith(prefix)) {
                prefix = prefix.substring(0, prefix.length() - 1);
                if (prefix.isEmpty()) return "";
            }
        }
        return prefix;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        String[] strs = new String[n];
        for (int i = 0; i < n; i++) strs[i] = sc.nextLine().trim();
        System.out.println(longestCommonPrefix(strs));
    }
}`,
      CPP: `#include <iostream>
#include <vector>
#include <string>
using namespace std;

string longestCommonPrefix(vector<string>& strs) {
    if (strs.empty()) return "";
    string prefix = strs[0];
    for (int i = 1; i < strs.size(); i++) {
        while (strs[i].find(prefix) != 0) {
            prefix = prefix.substr(0, prefix.length() - 1);
            if (prefix.empty()) return "";
        }
    }
    return prefix;
}

int main() {
    int n;
    cin >> n;
    cin.ignore();
    vector<string> strs(n);
    for (int i = 0; i < n; i++) getline(cin, strs[i]);
    cout << longestCommonPrefix(strs) << endl;
    return 0;
}`,
    },
  },
};

const PROBLEM_OPTIONS = [
  { value: "climbing-stairs", label: "Climbing Stairs (DP)" },
  { value: "valid-palindrome", label: "Valid Palindrome (String)" },
  { value: "two-sum", label: "Two Sum (Array)" },
  { value: "best-time-to-buy-stock", label: "Best Time to Buy Stock (Array)" },
  { value: "reverse-string", label: "Reverse String (String)" },
  { value: "maximum-subarray", label: "Maximum Subarray (DP)" },
  { value: "longest-common-prefix", label: "Longest Common Prefix (String)" },
];

// Language display names for the UI
const LANGUAGE_DISPLAY_NAMES = {
  JAVASCRIPT: "JavaScript",
  PYTHON: "Python",
  JAVA: "Java",
  CPP: "C++",
};

// Monaco editor language mapping
const MONACO_LANGUAGE_MAP = {
  JAVASCRIPT: "javascript",
  PYTHON: "python",
  JAVA: "java",
  CPP: "cpp",
};

// ============================================================
// CODE EDITOR COMPONENT
// ============================================================
const CodeEditor = ({ value, onChange, language = "javascript" }) => {
  return (
    <div className="border rounded-md bg-slate-950 text-slate-50">
      <div className="px-4 py-2 bg-slate-800 border-b text-sm font-mono">
        {language}
      </div>
      <div className="h-[300px] w-full">
        <Editor
          height="300px"
          defaultLanguage={language.toLowerCase()}
          theme="vs-dark"
          value={value}
          onChange={onChange}
          options={{
            minimap: { enabled: false },
            fontSize: 18,
            lineNumbers: "on",
            readOnly: false,
            wordWrap: "on",
            formatOnPaste: true,
            formatOnType: true,
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  );
};

// ============================================================
// MAIN FORM COMPONENT
// ============================================================
const CreateProblemForm = () => {
  const router = useRouter();
  const [selectedProblem, setSelectedProblem] = useState("climbing-stairs");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      testCases: [{ input: "", output: "" }],
      tags: [""],
      examples: {
        JAVASCRIPT: { input: "", output: "", explanation: "" },
        PYTHON: { input: "", output: "", explanation: "" },
        JAVA: { input: "", output: "", explanation: "" },
        CPP: { input: "", output: "", explanation: "" },
      },
      codeSnippets: {
        JAVASCRIPT: "function solution() {\n  // Write your code here\n}",
        PYTHON: "def solution():\n    # Write your code here\n    pass",
        JAVA: "public class Main {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}",
        CPP: "#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}",
      },
      referenceSolutions: {
        JAVASCRIPT:
          "// Add your reference solution here (full runnable file with I/O boilerplate)",
        PYTHON:
          "# Add your reference solution here (full runnable file with I/O boilerplate)",
        JAVA: "// Add your reference solution here (full runnable file with I/O boilerplate)",
        CPP: "// Add your reference solution here (full runnable file with I/O boilerplate)",
      },
    },
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  const {
    fields: testCaseFields,
    append: appendTestCase,
    remove: removeTestCase,
    replace: replaceTestCases,
  } = useFieldArray({ control, name: "testCases" });

  const {
    fields: tagFields,
    append: appendTag,
    remove: removeTag,
    replace: replaceTags,
  } = useFieldArray({ control, name: "tags" });

  const onSubmit = async (values) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/create-problem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to create problem");
      toast.success(data.message || "Problem created successfully");
      router.push("/problems");
    } catch (error) {
      console.error("Error creating problem:", error);
      toast.error(error.message || "Failed to create problem");
    } finally {
      setIsLoading(false);
    }
  };

  const loadSampleData = () => {
    const sampleData = SAMPLE_PROBLEMS[selectedProblem];
    if (!sampleData) return;
    replaceTags(sampleData.tags.map((tag) => tag));
    replaceTestCases(sampleData.testCases.map((tc) => tc));
    reset(sampleData);
    toast.success(`Loaded: ${sampleData.title}`);
  };

  const LANGUAGES = ["JAVASCRIPT", "PYTHON", "JAVA", "CPP"];

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <Card className="shadow-xl">
        <CardHeader className="pb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle className="text-3xl flex items-center gap-3">
              <FileText className="w-8 h-8 text-amber-600" />
              Create Problem
            </CardTitle>
            <div className="flex flex-col md:flex-row gap-3">
              <Select
                value={selectedProblem}
                onValueChange={setSelectedProblem}
              >
                <SelectTrigger className="w-[260px]">
                  <SelectValue placeholder="Select a sample problem" />
                </SelectTrigger>
                <SelectContent>
                  {PROBLEM_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={loadSampleData}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Load Sample
              </Button>
            </div>
          </div>
          <Separator />
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label htmlFor="title" className="text-lg font-semibold">
                  Title
                </Label>
                <Input
                  id="title"
                  {...register("title")}
                  placeholder="Enter problem title"
                  className="mt-2 text-lg"
                />
                {errors.title && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="description" className="text-lg font-semibold">
                  Description
                </Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Enter problem description"
                  className="mt-2 min-h-32 text-base resize-y"
                />
                {errors.description && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="difficulty" className="text-lg font-semibold">
                  Difficulty
                </Label>
                <Controller
                  name="difficulty"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EASY">
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-800"
                          >
                            Easy
                          </Badge>
                        </SelectItem>
                        <SelectItem value="MEDIUM">
                          <Badge
                            variant="secondary"
                            className="bg-amber-100 text-amber-800"
                          >
                            Medium
                          </Badge>
                        </SelectItem>
                        <SelectItem value="HARD">
                          <Badge
                            variant="secondary"
                            className="bg-red-100 text-red-800"
                          >
                            Hard
                          </Badge>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.difficulty && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.difficulty.message}
                  </p>
                )}
              </div>
            </div>

            {/* Tags */}
            <Card className="bg-amber-50 dark:bg-amber-950/20">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-amber-600" /> Tags
                  </CardTitle>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => appendTag("")}
                    className="gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add Tag
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tagFields.map((field, index) => (
                    <div key={field.id} className="flex gap-2 items-center">
                      <Input
                        {...register(`tags.${index}`)}
                        placeholder="Enter tag"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTag(index)}
                        disabled={tagFields.length === 1}
                        className="p-2"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
                {errors.tags && (
                  <p className="text-sm text-red-500 mt-2">
                    {errors.tags.message}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Test Cases */}
            <Card className="bg-green-50 dark:bg-green-950/20">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" /> Test
                    Cases
                  </CardTitle>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => appendTestCase({ input: "", output: "" })}
                    className="gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add Test Case
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {testCaseFields.map((field, index) => (
                  <Card key={field.id} className="bg-background">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">
                          Test Case #{index + 1}
                        </CardTitle>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTestCase(index)}
                          disabled={testCaseFields.length === 1}
                          className="text-red-500 gap-2"
                        >
                          <Trash2 className="w-4 h-4" /> Remove
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label className="font-medium">Input</Label>
                          <Textarea
                            {...register(`testCases.${index}.input`)}
                            placeholder="Enter test case input"
                            className="mt-2 min-h-24 resize-y font-mono"
                          />
                          {errors.testCases?.[index]?.input && (
                            <p className="text-sm text-red-500 mt-1">
                              {errors.testCases[index].input.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label className="font-medium">Expected Output</Label>
                          <Textarea
                            {...register(`testCases.${index}.output`)}
                            placeholder="Enter expected output"
                            className="mt-2 min-h-24 resize-y font-mono"
                          />
                          {errors.testCases?.[index]?.output && (
                            <p className="text-sm text-red-500 mt-1">
                              {errors.testCases[index].output.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {errors.testCases && !Array.isArray(errors.testCases) && (
                  <p className="text-sm text-red-500">
                    {errors.testCases.message}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Code Editor Sections */}
            {LANGUAGES.map((language) => (
              <Card key={language} className="bg-slate-50 dark:bg-slate-950/20">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-slate-600" />{" "}
                    {LANGUAGE_DISPLAY_NAMES[language]}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Starter Code Template
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Controller
                        name={`codeSnippets.${language}`}
                        control={control}
                        render={({ field }) => (
                          <CodeEditor
                            value={field.value}
                            onChange={field.onChange}
                            language={MONACO_LANGUAGE_MAP[language]}
                          />
                        )}
                      />
                      {errors.codeSnippets?.[language] && (
                        <p className="text-sm text-red-500 mt-2">
                          {errors.codeSnippets[language].message}
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        Reference Solution
                        <span className="text-xs font-normal text-muted-foreground">
                          (full runnable file — must include I/O boilerplate)
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Controller
                        name={`referenceSolutions.${language}`}
                        control={control}
                        render={({ field }) => (
                          <CodeEditor
                            value={field.value}
                            onChange={field.onChange}
                            language={MONACO_LANGUAGE_MAP[language]}
                          />
                        )}
                      />
                      {errors.referenceSolutions?.[language] && (
                        <p className="text-sm text-red-500 mt-2">
                          {errors.referenceSolutions[language].message}
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Example</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label className="font-medium">Input</Label>
                          <Textarea
                            {...register(`examples.${language}.input`)}
                            placeholder="Example input"
                            className="mt-2 min-h-20 resize-y font-mono"
                          />
                          {errors.examples?.[language]?.input && (
                            <p className="text-sm text-red-500 mt-1">
                              {errors.examples[language].input.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label className="font-medium">Output</Label>
                          <Textarea
                            {...register(`examples.${language}.output`)}
                            placeholder="Example output"
                            className="mt-2 min-h-20 resize-y font-mono"
                          />
                          {errors.examples?.[language]?.output && (
                            <p className="text-sm text-red-500 mt-1">
                              {errors.examples[language].output.message}
                            </p>
                          )}
                        </div>
                        <div className="md:col-span-2">
                          <Label className="font-medium">Explanation</Label>
                          <Textarea
                            {...register(`examples.${language}.explanation`)}
                            placeholder="Explain the example"
                            className="mt-2 min-h-24 resize-y"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            ))}

            {/* Additional Information */}
            <Card className="bg-amber-50 dark:bg-amber-950/20">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-600" /> Additional
                  Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="font-medium">Constraints</Label>
                  <Textarea
                    {...register("constraints")}
                    placeholder="Enter problem constraints"
                    className="mt-2 min-h-24 resize-y font-mono"
                  />
                  {errors.constraints && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.constraints.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="font-medium">Hints (Optional)</Label>
                  <Textarea
                    {...register("hints")}
                    placeholder="Enter hints for solving the problem"
                    className="mt-2 min-h-24 resize-y"
                  />
                </div>
                <div>
                  <Label className="font-medium">Editorial (Optional)</Label>
                  <Textarea
                    {...register("editorial")}
                    placeholder="Enter problem editorial/solution explanation"
                    className="mt-2 min-h-32 resize-y"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex justify-end mt-6">
              <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                className="gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Create Problem
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateProblemForm;
