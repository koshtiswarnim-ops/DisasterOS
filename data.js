// data.js - CareerNexus Central Data Store

const JOBS_DATA = [
  {
    id: "job-1",
    title: "Software Engineer I (Frontend)",
    company: "Google",
    location: "Bengaluru, India (Hybrid)",
    type: "Full-time",
    salary: "₹18,00,000 - ₹24,00,000 / year",
    experience: "0-2 years",
    postedDate: "2 days ago",
    logoColor: "#4285F4",
    skills: ["JavaScript", "React", "CSS3", "HTML5", "Data Structures"],
    description: "Google is looking for a Software Engineer to join the Core UX and Search Web Platform teams. In this role, you will build responsive, lightning-fast user interfaces that reach billions of users worldwide.",
    requirements: [
      "Bachelor's degree in Computer Science, a related technical field, or equivalent practical experience.",
      "Experience with modern JavaScript frameworks (React, Vue, or Angular) and CSS styling systems.",
      "Strong understanding of data structures, algorithms, and web optimization techniques.",
      "Ability to write clean, maintainable, and testable code."
    ],
    benefits: [
      "Comprehensive medical, dental, and vision coverage.",
      "Free gourmet meals and snack bars in office campuses.",
      "Generous retirement plan matching and equity grants.",
      "Dedicated learning and development budget."
    ]
  },
  {
    id: "job-2",
    title: "SDE-2 (Backend Services)",
    company: "Amazon",
    location: "Hyderabad, India (Remote)",
    type: "Full-time",
    salary: "₹28,00,000 - ₹36,00,000 / year",
    experience: "2-5 years",
    postedDate: "1 week ago",
    logoColor: "#FF9900",
    skills: ["Java", "Spring Boot", "AWS", "Microservices", "System Design"],
    description: "Amazon Web Services (AWS) is seeking a Software Development Engineer II to build scalable and highly available distributed systems. You will design, build, and deploy services that power AWS Cloud storage solutions.",
    requirements: [
      "2+ years of professional software development experience.",
      "Strong proficiency in Java, C++, or Go, and OOP concepts.",
      "Hands-on experience with cloud infrastructures (AWS/Azure/GCP) and containerization.",
      "Deep understanding of database technologies (SQL, DynamoDB/NoSQL) and scaling."
    ],
    benefits: [
      "Competitive base salary with sign-on bonuses and restricted stock units (RSUs).",
      "Flexible work from home options and home-office setups.",
      "Mental health and wellness support packages.",
      "Unlimited career growth opportunities in global teams."
    ]
  },
  {
    id: "job-3",
    title: "Graduate Software Engineer",
    company: "Microsoft",
    location: "Noida, India (Hybrid)",
    type: "Full-time",
    salary: "₹14,00,000 - ₹18,00,000 / year",
    experience: "Fresher",
    postedDate: "Just now",
    logoColor: "#00A4EF",
    skills: ["C#", "C++", ".NET", "SQL Server", "Algorithms"],
    description: "Microsoft is hiring university graduates for the development teams in Azure Core Infrastructure. You will work alongside industry veterans to deploy security patches, implement virtualization features, and optimize memory allocations.",
    requirements: [
      "B.Tech / M.Tech in CSE, ECE or related engineering disciplines graduating in 2026.",
      "CGPA of 8.0/10.0 or above with no active backlogs.",
      "Excellent debugging and problem-solving skills in C#, C++, or Java.",
      "Good team communication and collaboration spirit."
    ],
    benefits: [
      "Fully covered gym memberships and sports facilities.",
      "Employee stock purchase program (ESPP).",
      "Paid parental leave and family support policies.",
      "Relocation package and temporary housing allowance."
    ]
  },
  {
    id: "job-4",
    title: "Systems Engineer (Entry Level)",
    company: "TCS",
    location: "Pune, India (On-site)",
    type: "Full-time",
    salary: "₹3,50,000 - ₹7,00,000 / year",
    experience: "Fresher",
    postedDate: "3 days ago",
    logoColor: "#1B365D",
    skills: ["Java", "Python", "SQL", "HTML/CSS", "SDLC"],
    description: "TCS is seeking talented graduates for the Systems Engineer role via the National Qualifier Test (NQT). Selected candidates will be trained on cutting-edge enterprise technologies and deployed on global client projects.",
    requirements: [
      "B.E./B.Tech/M.E./M.Tech/MCA/M.Sc degree holders from 2025/2026 batch.",
      "Minimum 60% marks throughout 10th, 12th, and Graduation.",
      "Basic programming logic in Python, Java, or C.",
      "Good analytical and logical reasoning skills."
    ],
    benefits: [
      "Comprehensive employee health insurance scheme.",
      "TCS Xplore training program with certification rewards.",
      "Structured career path with internal promotions (TCS Digital/Innovator).",
      "Stable work culture with strong job security."
    ]
  },
  {
    id: "job-5",
    title: "Full Stack Engineer (Intern)",
    company: "Meta",
    location: "Bengaluru, India (Hybrid)",
    type: "Internship",
    salary: "₹80,000 - ₹1,00,000 / month",
    experience: "Student",
    postedDate: "Yesterday",
    logoColor: "#0668E1",
    skills: ["React", "Node.js", "Python", "GraphQL", "TypeScript"],
    description: "Meta is looking for a Full Stack Software Engineering Intern to join our Instagram Product Engineering team. You will build interface components, integrate graphql endpoints, and run A/B testing models.",
    requirements: [
      "Currently enrolled in a Bachelor's or Master's degree in Computer Science or related fields.",
      "Prior personal projects or open-source contributions utilizing React, GraphQL, or Node.js.",
      "Strong algorithm and data structure fundamentals (Big O analysis).",
      "Able to work hybrid from Bengaluru for 6 months."
    ],
    benefits: [
      "Industry-leading intern monthly stipend.",
      "Return offer potential based on internship performance evaluation.",
      "Corporate housing subsidy or free housing during the internship.",
      "Meta merchandise and free high-end laptop kit."
    ]
  }
];

const PREP_DATA = {
  aptitude: {
    title: "Aptitude & Reasoning Prep",
    topics: [
      {
        id: "apt-1",
        name: "Time and Work",
        summary: "Important formulas and short-cuts for calculating working durations, efficiencies, and pipes & cisterns problems.",
        notes: `
### Core Formulas
1. **Work Done = Time Taken &times; Rate of Work**
2. If a person can do a piece of work in $n$ days, then that person's 1 day's work = $\\frac{1}{n}$.
3. If $A$'s 1 day's work = $\\frac{1}{n}$, then $A$ can finish the whole work in $n$ days.
4. **Efficiency Ratio:** If $A$ is thrice as good a workman as $B$, then:
   - Ratio of work done by $A$ and $B$ in same time = $3 : 1$.
   - Ratio of times taken by $A$ and $B$ to finish same work = $1 : 3$.

### The Chain Rule Formula
$$\\frac{M_1 \\cdot D_1 \\cdot H_1}{W_1} = \\frac{M_2 \\cdot D_2 \\cdot H_2}{W_2}$$
Where:
- $M$ = Number of men
- $D$ = Number of days
- $H$ = Working hours per day
- $W$ = Total Work done / Wages earned

### Pipes and Cisterns
- If a pipe fills a tank in $x$ hours, then the part filled in 1 hour = $\\frac{1}{x}$.
- If a pipe empties a tank in $y$ hours, then the part emptied in 1 hour = $\\frac{1}{y}$.
- If both pipes are open, net work done in 1 hour = $\\frac{1}{x} - \\frac{1}{y}$.
        `,
        quiz: [
          {
            q: "A can do a piece of work in 10 days, and B can do the same work in 15 days. How long will they take if they work together?",
            options: ["5 days", "6 days", "8 days", "7.5 days"],
            answer: 1,
            explanation: "A's 1 day work = 1/10, B's 1 day work = 1/15. Together 1 day work = 1/10 + 1/15 = (3 + 2)/30 = 5/30 = 1/6. Therefore, they take 6 days working together."
          },
          {
            q: "A is twice as efficient as B and takes 10 days less than B to complete a job. In how many days can B complete the job alone?",
            options: ["10 days", "15 days", "20 days", "30 days"],
            answer: 2,
            explanation: "Let time taken by A be x days. B takes 2x days. Since A takes 10 days less than B: 2x - x = 10 => x = 10. B takes 2x = 20 days."
          },
          {
            q: "12 men can complete a project in 8 days. How many days will it take for 16 men to complete the same project?",
            options: ["6 days", "5 days", "7 days", "4 days"],
            answer: 0,
            explanation: "Using M1 * D1 = M2 * D2: 12 * 8 = 16 * D2 => D2 = (12 * 8) / 16 = 6 days."
          }
        ]
      },
      {
        id: "apt-2",
        name: "Percentages and Profit & Loss",
        summary: "Understand fractions, percentages, cost price, selling price, markups, discounts, and successive changes.",
        notes: `
### Profit & Loss Definitions
- **Cost Price (CP):** The price at which an article is purchased.
- **Selling Price (SP):** The price at which an article is sold.
- **Profit / Gain:** If $SP > CP$, then $\\text{Profit} = SP - CP$.
- **Loss:** If $CP > SP$, then $\\text{Loss} = CP - SP$.

### Key Formulas
1. $\\text{Profit \\%} = \\left( \\frac{\\text{Profit}}{CP} \\times 100 \\right)\\%$
2. $\\text{Loss \\%} = \\left( \\frac{\\text{Loss}}{CP} \\times 100 \\right)\\%$
3. $SP = \\left( \\frac{100 + \\text{Profit \\%}}{100} \\right) \\times CP$
4. $SP = \\left( \\frac{100 - \\text{Loss \\%}}{100} \\right) \\times CP$
5. **Discount:** Always calculated on Marked Price (MP).
   - $SP = MP - \\text{Discount}$
   - $\\text{Discount \\%} = \\left( \\frac{\\text{Discount}}{MP} \\times 100 \\right)\\%$
   - $SP = MP \\times \\left( 1 - \\frac{\\text{Discount \\%}}{100} \\right)$
        `,
        quiz: [
          {
            q: "An article is sold for ₹300 at a profit of 20%. What was its Cost Price?",
            options: ["₹240", "₹250", "₹260", "₹280"],
            answer: 1,
            explanation: "SP = CP * (1 + Profit%). 300 = CP * 1.20 => CP = 300 / 1.2 = ₹250."
          },
          {
            q: "A merchant allows a 10% discount on the marked price of ₹800, and still makes a 20% profit. What is the Cost Price?",
            options: ["₹600", "₹640", "₹550", "₹580"],
            answer: 0,
            explanation: "Discounted SP = 800 - 10% of 800 = 800 - 80 = ₹720. 720 represents 120% of CP. So, CP = 720 / 1.20 = ₹600."
          }
        ]
      },
      {
        id: "apt-3",
        name: "Logical Reasoning - Syllogisms",
        summary: "Master Euler diagrams and rules of deduction to evaluate logical statements and conclusions.",
        notes: `
### Syllogism Fundamentals
Syllogism questions consist of two or more statements, followed by conclusions. You must take the given statements to be true, even if they variance from common facts.

### Standard Deductions
- **All A are B:** A is subset of B.
- **Some A are B:** Overlapping circles.
- **No A is B:** Disjoint sets of circles.
- **Some A are not B:** A part of circle A is outside B.

### Rule of 'Either-Or' Case
For an 'Either-Or' condition, two conclusions must satisfy:
1. Both conclusions must be false independently.
2. They must contain the same subject and predicate (e.g. 'Some pens are pencils', 'No pen is pencil').
3. One must be positive (+) and the other negative (-).
        `,
        quiz: [
          {
            q: "Statements: All bags are pockets. All pockets are boxes. Conclusions: I. All bags are boxes. II. Some boxes are bags.",
            options: ["Only conclusion I follows", "Only conclusion II follows", "Both I and II follow", "Neither I nor II follows"],
            answer: 2,
            explanation: "Since Bags are inside Pockets, and Pockets are inside Boxes, Bags are entirely inside Boxes (All bags are boxes - I follows). Also, since Boxes contain Bags, the region of Boxes that overlaps with Bags makes 'Some boxes are bags' true (II follows)."
          }
        ]
      }
    ]
  },
  technical: {
    title: "Core CS Subjects Prep",
    topics: [
      {
        id: "tech-1",
        name: "Database Management Systems (DBMS)",
        summary: "Deep dive into SQL, Normalization, ACID transactions, ER diagrams, indexing, and joins.",
        notes: `
### ACID Properties
- **Atomicity:** Entire transaction completes or none does ('All or Nothing').
- **Consistency:** Transactions must transition the database from one valid state to another.
- **Isolation:** Concurrent execution of transactions yields the same state as sequential execution.
- **Durability:** Once committed, transaction effects survive power losses or system crashes.

### SQL Joins
- **Inner Join:** Returns records with matching values in both tables.
- **Left (Outer) Join:** Returns all records from the left table and matched from the right table.
- **Right (Outer) Join:** Returns all records from the right table and matched from the left table.
- **Full (Outer) Join:** Returns all records when there is a match in either table.

### Normalization Forms
- **1NF:** Cell values must be atomic; no multi-valued attributes.
- **2NF:** Must be in 1NF, and all non-key attributes must be fully functionally dependent on the primary key (No partial dependency).
- **3NF:** Must be in 2NF, and no non-key attribute is transitively dependent on the primary key (No transitive dependency).
- **BCNF:** For any functional dependency $X \\rightarrow Y$, $X$ must be a super key.
        `,
        quiz: [
          {
            q: "Which normal form is designed to eliminate partial functional dependency?",
            options: ["1NF", "2NF", "3NF", "BCNF"],
            answer: 1,
            explanation: "Second Normal Form (2NF) removes partial dependencies. This means no non-prime attribute should depend on a proper subset of any candidate key."
          },
          {
            q: "In ACID properties, what does 'Atomicity' guarantee?",
            options: ["Data is encrypted", "Transactions occur simultaneously", "All operations in a transaction succeed or fail together", "Database updates are stored on disk permanently"],
            answer: 2,
            explanation: "Atomicity ensures that a transaction is treated as a single, indivisible unit of work. Either all operations are applied, or none are."
          }
        ]
      },
      {
        id: "tech-2",
        name: "Operating Systems (OS)",
        summary: "Process scheduling, thread management, deadlocks, virtual memory, paging, and disk scheduling.",
        notes: `
### Process States
A process transitions through these states:
$$\\text{New} \\rightarrow \\text{Ready} \\leftrightarrow \\text{Running} \\rightarrow \\text{Terminated}$$
- **Waiting/Blocked:** Waiting for an I/O event or signal.

### CPU Scheduling Algorithms
- **First-Come, First-Served (FCFS):** Non-preemptive, simple, prone to Convoy Effect.
- **Shortest Job First (SJF):** Optimal average waiting time (Preemptive SJF is Shortest Remaining Time First).
- **Round Robin (RR):** Preemptive, relies on Time Quantum, excellent for time-sharing systems.

### Deadlocks
Occur when processes hold resources while waiting for others. **Four Necessary Conditions (Coffman Conditions):**
1. **Mutual Exclusion:** Only one process can use a resource at a time.
2. **Hold and Wait:** A process holding allocated resources can request additional ones.
3. **No Preemption:** Resources cannot be forcibly taken from a process.
4. **Circular Wait:** A closed loop of processes where each waits for a resource held by the next.
        `,
        quiz: [
          {
            q: "Which CPU scheduling algorithm is prone to the 'Convoy Effect'?",
            options: ["Round Robin", "Shortest Job First", "First-Come First-Served", "Priority Scheduling"],
            answer: 2,
            explanation: "FCFS can cause a Convoy Effect where small processes wait behind a massive CPU-bound process, spiking the average waiting time."
          },
          {
            q: "Which of the following is NOT a necessary condition for a deadlock to occur?",
            options: ["Hold and Wait", "Preemption", "Mutual Exclusion", "Circular Wait"],
            answer: 1,
            explanation: "NO preemption is required. If resources can be preempted (taken away), deadlocks can be resolved or prevented."
          }
        ]
      }
    ]
  },
  hr: {
    title: "HR Interview Prep",
    questions: [
      {
        q: "Tell me about yourself.",
        framework: "Present-Past-Future Formula",
        description: "Focus on your current state (studies/recent projects), past achievements (internships/hackathons), and future aspirations (how you fit this role). Keep it under 2 minutes.",
        keywords: ["passion", "project", "problem solving", "skills", "experience"],
        sampleAnswer: "I am a senior CS student specializing in frontend web technologies. Recently, I built a collaborative code-editor which handles live updates. Before this, I interned at Tech Corp where I redesigned their billing module, improving page speed by 25%. Looking ahead, I am eager to apply my interface engineering and performance optimization skills to a full-time role at Google, where high-scale UX is critical."
      },
      {
        q: "What are your strengths and weaknesses?",
        framework: "Sincere + Actionable Strategy",
        description: "For strengths, provide a concrete example. For weaknesses, state a genuine but non-critical skill gaps and immediately explain the concrete steps you are actively taking to overcome it.",
        keywords: ["learning", "communication", "adaptable", "improvement", "feedback"],
        sampleAnswer: "My greatest strength is my adaptability. During my hackathon, our backend developer dropped out, so I picked up Node.js overnight and completed the project. For my weakness, I sometimes struggle to delegate tasks because I want to ensure absolute detail, which led to working overtime. To counter this, I have started using Jira dashboards and assigning tasks early to build team trust."
      },
      {
        q: "Why should we hire you?",
        framework: "Value Proposition Matching",
        description: "Align your skills, experiences, and soft traits with the core requirements of the job description. Show how hiring you directly solves their immediate team challenges.",
        keywords: ["alignment", "fit", "deliver value", "contribution", "goals"],
        sampleAnswer: "You should hire me because I offer a unique combination of strong core engineering fundamentals and practical frontend UI experience. Your job description emphasizes React performance tuning. Having built three production-grade SPAs with responsive code, I can step in with zero ramp-up time. Plus, my collaborative nature fits well with your Agile teams."
      }
    ]
  }
};

const DSA_SHEET_DATA = [
  {
    topic: "Arrays & Hashing",
    problems: [
      {
        id: "dsa-1",
        title: "Two Sum",
        difficulty: "Easy",
        platform: "LeetCode",
        link: "https://leetcode.com/problems/two-sum/",
        description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.",
        starterCode: `function twoSum(nums, target) {
  // Write your code here
  let map = new Map();
  for (let i = 0; i < nums.length; i++) {
    let complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
        testCase: {
          input: "nums = [2,7,11,15], target = 9",
          output: "[0,1]",
          validate: (codeStr) => {
            try {
              const fn = new Function('nums', 'target', codeStr + "\nreturn twoSum(nums, target);");
              const res = fn([2,7,11,15], 9);
              if (Array.isArray(res) && res.includes(0) && res.includes(1)) {
                return { success: true, message: "Test Case Passed! twoSum([2,7,11,15], 9) -> " + JSON.stringify(res) };
              }
              return { success: false, message: "Failed. Expected indices [0,1], got " + JSON.stringify(res) };
            } catch (err) {
              return { success: false, message: "Runtime error: " + err.message };
            }
          }
        }
      },
      {
        id: "dsa-2",
        title: "Contains Duplicate",
        difficulty: "Easy",
        platform: "LeetCode",
        link: "https://leetcode.com/problems/contains-duplicate/",
        description: "Given an integer array `nums`, return `true` if any value appears at least twice in the array, and return `false` if every element is distinct.",
        starterCode: `function containsDuplicate(nums) {
  // Write your code here
  const numSet = new Set(nums);
  return numSet.size !== nums.length;
}`,
        testCase: {
          input: "nums = [1,2,3,1]",
          output: "true",
          validate: (codeStr) => {
            try {
              const fn = new Function('nums', codeStr + "\nreturn containsDuplicate(nums);");
              const res1 = fn([1,2,3,1]);
              const res2 = fn([1,2,3,4]);
              if (res1 === true && res2 === false) {
                return { success: true, message: "All tests passed! containsDuplicate([1,2,3,1]) -> true, containsDuplicate([1,2,3,4]) -> false." };
              }
              return { success: false, message: "Failed. Got res1=" + res1 + ", res2=" + res2 };
            } catch (err) {
              return { success: false, message: "Runtime error: " + err.message };
            }
          }
        }
      },
      {
        id: "dsa-3",
        title: "Valid Anagram",
        difficulty: "Easy",
        platform: "LeetCode",
        link: "https://leetcode.com/problems/valid-anagram/",
        description: "Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.",
        starterCode: `function isAnagram(s, t) {
  // Write your code here
  if(s.length !== t.length) return false;
  return s.split('').sort().join('') === t.split('').sort().join('');
}`,
        testCase: {
          input: "s = 'anagram', t = 'nagaram'",
          output: "true",
          validate: (codeStr) => {
            try {
              const fn = new Function('s', 't', codeStr + "\nreturn isAnagram(s, t);");
              const res = fn('anagram', 'nagaram');
              if (res === true) {
                return { success: true, message: "Passed! 'anagram' and 'nagaram' match." };
              }
              return { success: false, message: "Failed. Expected true, got " + res };
            } catch(e) {
              return { success: false, message: "Error: " + e.message };
            }
          }
        }
      }
    ]
  },
  {
    topic: "Two Pointers & Sliding Window",
    problems: [
      {
        id: "dsa-4",
        title: "Valid Palindrome",
        difficulty: "Easy",
        platform: "LeetCode",
        link: "https://leetcode.com/problems/valid-palindrome/",
        description: "Given a string `s`, return `true` if it is a palindrome, or `false` otherwise, after converting all uppercase letters into lowercase and removing all non-alphanumeric characters.",
        starterCode: `function isPalindrome(s) {
  // Write your code here
  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  return clean === clean.split('').reverse().join('');
}`,
        testCase: {
          input: "s = 'A man, a plan, a canal: Panama'",
          output: "true",
          validate: (codeStr) => {
            try {
              const fn = new Function('s', codeStr + "\nreturn isPalindrome(s);");
              const res = fn("A man, a plan, a canal: Panama");
              if (res === true) {
                return { success: true, message: "Passed! 'A man, a plan, a canal: Panama' recognized as a palindrome." };
              }
              return { success: false, message: "Failed. Expected true, Got " + res };
            } catch(e) {
              return { success: false, message: "Error: " + e.message };
            }
          }
        }
      },
      {
        id: "dsa-5",
        title: "Best Time to Buy and Sell Stock",
        difficulty: "Easy",
        platform: "LeetCode",
        link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
        description: "You are given an array `prices` where `prices[i]` is the price of a given stock on the `i`th day. Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return `0`.",
        starterCode: `function maxProfit(prices) {
  // Write your code here
  let minPrice = Infinity;
  let maxP = 0;
  for(let i = 0; i < prices.length; i++) {
    if(prices[i] < minPrice) {
      minPrice = prices[i];
    } else if(prices[i] - minPrice > maxP) {
      maxP = prices[i] - minPrice;
    }
  }
  return maxP;
}`,
        testCase: {
          input: "prices = [7,1,5,3,6,4]",
          output: "5",
          validate: (codeStr) => {
            try {
              const fn = new Function('prices', codeStr + "\nreturn maxProfit(prices);");
              const res = fn([7,1,5,3,6,4]);
              if (res === 5) {
                return { success: true, message: "Passed! maxProfit([7,1,5,3,6,4]) returned 5." };
              }
              return { success: false, message: "Failed. Expected 5, Got " + res };
            } catch(e) {
              return { success: false, message: "Error: " + e.message };
            }
          }
        }
      }
    ]
  },
  {
    topic: "Linked Lists & Trees",
    problems: [
      {
        id: "dsa-6",
        title: "Reverse Linked List",
        difficulty: "Easy",
        platform: "LeetCode",
        link: "https://leetcode.com/problems/reverse-linked-list/",
        description: "Given the `head` of a singly linked list, reverse the list, and return the reversed list.",
        starterCode: `function reverseList(head) {
  // Write your code here
  let prev = null;
  let curr = head;
  while (curr !== null) {
    let nextTemp = curr.next;
    curr.next = prev;
    prev = curr;
    curr = nextTemp;
  }
  return prev;
}`,
        testCase: {
          input: "head = [1,2,3]",
          output: "[3,2,1]",
          validate: (codeStr) => {
            try {
              const node3 = { val: 3, next: null };
              const node2 = { val: 2, next: node3 };
              const head = { val: 1, next: node2 };
              const fn = new Function('head', codeStr + "\nreturn reverseList(head);");
              const res = fn(head);
              if (res && res.val === 3 && res.next && res.next.val === 2 && res.next.next && res.next.next.val === 1) {
                return { success: true, message: "Passed! List successfully reversed from 1->2->3 to 3->2->1." };
              }
              return { success: false, message: "Failed. Reversal links are incorrect." };
            } catch(e) {
              return { success: false, message: "Error: " + e.message };
            }
          }
        }
      },
      {
        id: "dsa-7",
        title: "Maximum Depth of Binary Tree",
        difficulty: "Easy",
        platform: "LeetCode",
        link: "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
        description: "Given the `root` of a binary tree, return its maximum depth.",
        starterCode: `function maxDepth(root) {
  // Write your code here
  if(root === null) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`,
        testCase: {
          input: "root = [3,9,20,null,null,15,7]",
          output: "3",
          validate: (codeStr) => {
            try {
              const node15 = { val: 15, left: null, right: null };
              const node7 = { val: 7, left: null, right: null };
              const node20 = { val: 20, left: node15, right: node7 };
              const node9 = { val: 9, left: null, right: null };
              const root = { val: 3, left: node9, right: node20 };
              const fn = new Function('root', codeStr + "\nreturn maxDepth(root);");
              const res = fn(root);
              if (res === 3) {
                return { success: true, message: "Passed! Depth of tree is 3." };
              }
              return { success: false, message: "Failed. Expected depth 3, Got " + res };
            } catch(e) {
              return { success: false, message: "Error: " + e.message };
            }
          }
        }
      }
    ]
  },
  {
    topic: "Dynamic Programming & Recursion",
    problems: [
      {
        id: "dsa-8",
        title: "Climbing Stairs",
        difficulty: "Easy",
        platform: "LeetCode",
        link: "https://leetcode.com/problems/climbing-stairs/",
        description: "You are climbing a staircase. It takes `n` steps to reach the top. Each time you can either climb `1` or `2` steps. In how many distinct ways can you climb to the top?",
        starterCode: `function climbStairs(n) {
  // Write your code here
  if (n <= 2) return n;
  let first = 1, second = 2;
  for(let i = 3; i <= n; i++) {
    let third = first + second;
    first = second;
    second = third;
  }
  return second;
}`,
        testCase: {
          input: "n = 5",
          output: "8",
          validate: (codeStr) => {
            try {
              const fn = new Function('n', codeStr + "\nreturn climbStairs(n);");
              const res = fn(5);
              if (res === 8) {
                return { success: true, message: "Passed! climbStairs(5) returned 8." };
              }
              return { success: false, message: "Failed. Expected 8, Got " + res };
            } catch(e) {
              return { success: false, message: "Error: " + e.message };
            }
          }
        }
      }
    ]
  }
];

const COMPANIES_DATA = [
  {
    name: "Google",
    tagline: "Do Cool Things That Matter",
    logoColor: "#4285F4",
    difficulty: "Hard",
    eligibility: {
      gpa: "7.5+ CGPA",
      backlogs: "0 Active Backlogs",
      branches: "B.Tech/M.Tech in CS / IT / Related fields"
    },
    examPattern: [
      { round: "Round 1: Resume Screening", detail: "Shortlisting based on GPA, projects, open-source work, and competitive programming profiles." },
      { round: "Round 2: Online Assessment (OA)", detail: "2 coding questions on advanced DSA (graphs, dynamic programming) to be solved in 90 minutes." },
      { round: "Round 3: Technical Interviews (3-4 Rounds)", detail: "45-minute sessions covering advanced problem solving, time complexity, and edge-case validation. Includes one 'Googlyness' round focusing on behavioral alignment." }
    ],
    syllabus: [
      "Advanced Graphs (Dijkstra, MST, Strongly Connected Components)",
      "Dynamic Programming (Multi-dimensional, Bitmasking, Knapsack)",
      "Segment Trees & Fenwick Trees",
      "System Design (Scalability, Caching, Load Balancers, Distributed DBs)"
    ],
    experiences: [
      {
        candidate: "Ananya Sharma",
        role: "Software Engineer Intern",
        feedback: "The interviewer was extremely welcoming. We spent 5 minutes discussing my project, then moved to a question on binary trees which transitioned into a dynamic programming problem on tree paths. Always talk through your approach and compute Big O time and space complexities before typing your solution."
      },
      {
        candidate: "Rahul Verma",
        role: "MTS Frontend",
        feedback: "Focused heavily on raw JS performance, DOM architecture, micro-tasks vs macro-tasks, and styling frameworks. The second round was system design where I had to outline Google Docs collaboration."
      }
    ]
  },
  {
    name: "Amazon",
    tagline: "Work Hard. Have Fun. Make History.",
    logoColor: "#FF9900",
    difficulty: "Medium-Hard",
    eligibility: {
      gpa: "6.5+ CGPA",
      backlogs: "No active backlogs at time of joining",
      branches: "Open to all engineering branches, with preference for CS/IT"
    },
    examPattern: [
      { round: "Round 1: Online Assessment (OA)", detail: "2 coding questions + Work Style Simulation (assessing Amazon Leadership Principles) - 120 minutes." },
      { round: "Round 2: Technical Interview 1", detail: "Problem solving on trees, arrays, or heaps. Heavy focus on Amazon Leadership Principles (e.g. Customer Obsession)." },
      { round: "Round 3: Technical Interview 2 & Bar Raiser", detail: "Deep dive into system architectures, concurrency, and hard behavioral questions where you must demonstrate performance under constraints." }
    ],
    syllabus: [
      "Heaps and Priority Queues",
      "Trees & Graphs DFS/BFS traversal",
      "Amazon Leadership Principles (all 16 principles)",
      "Low Level Design (LLD) - Class structures, Design Patterns"
    ],
    experiences: [
      {
        candidate: "Rohit Krishnan",
        role: "SDE I",
        feedback: "Make sure you structure all your behavioral answers using the STAR format (Situation, Task, Action, Result). They care about leadership principles as much as your code optimization. My coding question was 'Sliding Window Maximum'."
      }
    ]
  },
  {
    name: "Microsoft",
    tagline: "Empower Every Person on the Planet",
    logoColor: "#00A4EF",
    difficulty: "Medium-Hard",
    eligibility: {
      gpa: "7.0+ CGPA",
      backlogs: "No active backlogs",
      branches: "B.Tech/M.Tech in CS/IT/ECE/EEE"
    },
    examPattern: [
      { round: "Round 1: Codility OA", detail: "2-3 coding problems on arrays, strings, and dynamic programming - 90 minutes." },
      { round: "Round 2: Technical Round 1", detail: "Focused on core DSA (Linked Lists, Stacks, Trees) and system programming concepts (threads, lock structures)." },
      { round: "Round 3: Technical & Design Round 2", detail: "High-level design scenarios, database schemas, and deep debugging puzzles." },
      { round: "Round 4: Director/HM Round", detail: "Core behavioral discussion, alignment with Microsoft culture, and project walkthroughs." }
    ],
    syllabus: [
      "Linked Lists (Reversal, Loop detection, Intersection)",
      "Trie and String parsing algorithms",
      "Operating System fundamentals (Multithreading, Semaphores)",
      "High Level Design (Design WhatsApp, TinyURL)"
    ],
    experiences: [
      {
        candidate: "Siddharth Jain",
        role: "Graduate Engineer",
        feedback: "Microsoft interviewers test for fundamental correctness. They asked me to reverse a linked list in groups of K, and then we had a deep discussion about how memory is allocated for nodes in heap vs stack."
      }
    ]
  },
  {
    name: "TCS",
    tagline: "Building on Belief",
    logoColor: "#1B365D",
    difficulty: "Easy-Medium",
    eligibility: {
      gpa: "60% or 6.0 CGPA in 10th, 12th, and B.Tech",
      backlogs: "Maximum 1 active backlog allowed at the time of exam",
      branches: "All Engineering Branches, MCA, M.Sc"
    },
    examPattern: [
      { round: "Round 1: TCS NQT Exam", detail: "Section A: Foundation Section (Aptitude, Verbal, Logical). Section B: Advanced Section (Advanced Quant, Coding - 2 questions in 45 minutes)." },
      { round: "Round 2: Technical Interview", detail: "Basic questions on OOPs, DBMS (SQL queries), SDLC phases, and programming languages (Java/Python/C++)." },
      { round: "Round 3: MR & HR Interview", detail: "Managerial situational scenarios, night shift flexibility, location preferences, and background checks." }
    ],
    syllabus: [
      "Quantitative Aptitude (Time, Speed, Profit & Loss, Percentages)",
      "Object-Oriented Programming (Polymorphism, Inheritance, Encapsulation)",
      "Basic SQL Queries (Joins, Group By, Aggregate Functions)",
      "Standard Coding (String manipulations, Array sorting, Prime checks)"
    ],
    experiences: [
      {
        candidate: "Neha Patel",
        role: "Systems Engineer (Digital)",
        feedback: "If you clear the advanced coding section in the NQT, you get called for the TCS Digital interview which pays double. My interview focused heavily on SQL joins and my final year machine learning project."
      }
    ]
  }
];

// Attach variables to global window object so other scripts can access them directly
window.JOBS_DATA = JOBS_DATA;
window.PREP_DATA = PREP_DATA;
window.DSA_SHEET_DATA = DSA_SHEET_DATA;
window.COMPANIES_DATA = COMPANIES_DATA;
