// Tutorial review content shown to a flagged student while they wait for
// small-group help. Keyed by "topic-tier". Each entry: a short concept
// explanation, one or two worked examples, and a common-mistake callout
// pitched at that tier's difficulty level.
export const REVIEWS = {
  "1.1-basic": {
    title: "Algorithms & Sequencing",
    concept: "An algorithm is a step-by-step process for solving a problem or completing a task. It doesn't have to be written in a programming language -- plain English or a diagram counts too. Sequencing means the steps happen in a specific order, and that order matters.",
    examples: [
      { text: "Making a sandwich is an algorithm: (1) get two slices of bread, (2) spread peanut butter on one slice, (3) put the other slice on top. Swap steps 1 and 2, and you have nothing to spread the peanut butter on yet." },
    ],
    commonMistake: "Don't assume an algorithm has to be code. A recipe, driving directions, or a flowchart can all be algorithms.",
  },
  "1.1-intermediate": {
    title: "Designing Algorithms & Debugging Strategy",
    concept: "When designing an algorithm for a real task, check that your steps work for *every* possible input, not just the example in your head. When a program gives the wrong answer but still runs, inserting print statements at key points is the standard way to see what's actually happening at each step.",
    examples: [
      { text: "To find the larger of two numbers x and y: compare them, and keep whichever is bigger. A common bug is writing an algorithm that only works when x happens to be bigger -- always double-check the case where y is bigger too." },
    ],
    commonMistake: "If your program compiles and runs but gives a wrong answer, that's a logic error -- the fix is testing with different inputs and tracing through your steps, not looking for a compiler error message (there won't be one).",
  },
  "1.1-complex": {
    title: "Error Types & Multi-Step Algorithm Design",
    concept: "There are three error types to tell apart: a syntax error is caught by the compiler before the program runs; a logic error lets the program run but gives a wrong result, found by testing; a run-time error (exception) crashes the program mid-execution, often only for certain inputs.",
    examples: [
      { text: "A program that divides by a variable which is sometimes 0 will compile fine (no syntax error) and may run fine most of the time -- it only crashes with an exception on the specific input that makes the divisor 0." },
    ],
    commonMistake: "Don't assume every bug is a 'compiler error.' If the program successfully starts running, the compiler already accepted it -- the problem is a logic error or a run-time error, not a syntax error.",
  },

  "1.2-basic": {
    title: "Variables & Data Types",
    concept: "This course uses three primitive types: int (whole numbers), double (decimals), and boolean (true/false). Anything else -- like String or a class you've made -- is a reference type. A variable is a named storage location with a type, and its value can change while the program runs.",
    examples: [
      { text: "int count = 3; -- a primitive int.\ndouble price = 19.99; -- a primitive double.\nString name = \"Alex\"; -- a reference type, since String isn't one of the three primitives." },
    ],
    commonMistake: "boolean can only ever be true or false -- not 1, 0, or \"true\" (that's a String, not a boolean).",
  },
  "1.2-intermediate": {
    title: "Choosing the Right Type",
    concept: "Pick int for whole-number counts, double for anything that might include a decimal, and boolean for a yes/no condition. When an int value is assigned to a double variable, it's automatically widened (converted) -- no cast needed.",
    examples: [
      { text: "double price = 20; -- valid. The int literal 20 is automatically widened to the double value 20.0." },
    ],
    commonMistake: "Going the other direction -- assigning a double value like 20.5 to an int variable -- is NOT automatic and causes a compile-time error without an explicit cast.",
  },
  "1.2-complex": {
    title: "Primitive vs. Reference, and Type Traps",
    concept: "When given a list of variable declarations, identify reference types by elimination: if it isn't int, double, or boolean, it's a reference type (String, or any class). Watch for declarations that look reasonable but use a type outside this course's primitive set, like float, long, or char.",
    examples: [
      { text: "int score; boolean isPassing; String name; double average;\nOnly name is a reference type here -- the other three are primitives." },
    ],
    commonMistake: "float and long are real Java types, but they're outside this course's scope -- if you see one in an answer choice, it's almost certainly a trap, not a valid option.",
  },

  "1.3-basic": {
    title: "Print, println, and Basic Arithmetic",
    concept: "print keeps the cursor on the same line; println moves to a new line afterward. A string literal is text in double quotes. Dividing two ints gives an int result (the decimal part is dropped); % gives the remainder of division.",
    examples: [
      { text: "System.out.print(\"A\"); System.out.println(\"B\"); System.out.print(\"C\");\nprints:\nAB\nC" },
      { text: "7 / 2 evaluates to 3 (int division). 7 % 2 evaluates to 1 (the remainder)." },
    ],
    commonMistake: "7 / 2 is NOT 3.5 in Java when both numbers are int literals -- the decimal part is thrown away, not rounded.",
  },
  "1.3-intermediate": {
    title: "Operator Precedence & Escape Sequences",
    concept: "Multiplication, division, and % happen before addition and subtraction, and operators of equal precedence evaluate left to right. The escape sequence \\n prints a new line, and \\\" prints an actual quotation mark inside a string.",
    examples: [
      { text: "int x = 2 + 3 * 4; -- multiplication first: 3*4=12, then 2+12=14, not 20." },
    ],
    commonMistake: "When a double is involved partway through a mixed expression, only the operation using the double gets double-precision -- earlier int-only operations already lost their decimal part before the double ever gets involved.",
  },
  "1.3-complex": {
    title: "Tricky Expressions & Division by Zero",
    concept: "Dividing an int by the int value 0 throws an ArithmeticException at run time (dividing a double by 0.0 does not throw -- it's outside this course's exclusions, but worth knowing the int case cold). When tracing multi-operator expressions, work strictly left to right through equal-precedence operators after handling higher-precedence ones and parentheses first.",
    examples: [
      { text: "int x = (2 + 3) * 4 % 5;\nParentheses first: 2+3=5. Then left to right: 5*4=20, 20%5=0. x is 0." },
    ],
    commonMistake: "Casting the RESULT of an int division (e.g. (double)(a/b)) is different from casting one operand BEFORE dividing (e.g. (double)a/b) -- the first has already lost precision by the time the cast happens.",
  },

  "1.4-basic": {
    title: "Assignment, Initialization, and null",
    concept: "The assignment operator = evaluates the right side first, then stores that value in the variable on the left. A variable must be assigned a value before it's used in an expression. null can only be assigned to reference types (like String), never to int, double, or boolean.",
    examples: [
      { text: "int x = 4;\nint y = x; -- y gets a COPY of x's value (4). Changing x afterward doesn't change y." },
    ],
    commonMistake: "You cannot assign null to a primitive type -- boolean flag = null; will not compile.",
  },
  "1.4-intermediate": {
    title: "Tracing Reassignment",
    concept: "When a variable is reassigned multiple times, trace through the statements one at a time, in order, updating your mental picture of each variable's value as you go. A reference variable (like String) can be reassigned freely, including through null and back to a real value.",
    examples: [
      { text: "int p = 3; int q = 8; int temp = p; p = q; q = temp;\nStep by step: temp becomes 3, p becomes 8, q becomes 3. This is the classic swap pattern." },
    ],
    commonMistake: "In a swap using a temp variable, the ORDER of the three assignment lines matters -- if you assign p = q before saving p's original value into temp, that original value is lost.",
  },
  "1.4-complex": {
    title: "The Arithmetic Swap & Definite Assignment",
    concept: "Two variables can be swapped without a third variable using a += / -= sequence, though it only works for numeric types. Java also enforces that a local variable must be definitely assigned a value along every possible code path before it's used -- if there's any path where it might not be assigned, that's a compile-time error, not a run-time surprise.",
    examples: [
      { text: "int a = 4, b = 7;\na = a + b; // a is 11\nb = a - b; // b is 11-7 = 4\na = a - b; // a is 11-4 = 7\nFinal: a=7, b=4 -- swapped." },
    ],
    commonMistake: "If a variable is only assigned inside one branch of an if/else (not both, and no default value beforehand), using it afterward is a compile-time error -- Java can't guarantee it has a value.",
  },

  "1.5-basic": {
    title: "Casting & Integer Range",
    concept: "(int) converts a double to an int by truncating (chopping off) the decimal part -- it does not round. Assigning an int to a double widens it automatically. Integer.MAX_VALUE and Integer.MIN_VALUE are the largest and smallest values an int can hold; going past either end is called integer overflow.",
    examples: [
      { text: "(int) 7.9 is 7, not 8 -- truncation always rounds toward zero, not to the nearest whole number." },
    ],
    commonMistake: "To actually round a non-negative double to the nearest int, you need (int)(x + 0.5) -- plain (int) x always truncates down.",
  },
  "1.5-intermediate": {
    title: "Casting Placement & Rounding",
    concept: "Where you place a cast changes the result. Casting one operand to double BEFORE a division makes the whole division happen in double precision. Casting the RESULT of an already-completed int division just converts an already-truncated number.",
    examples: [
      { text: "int total = 17, count = 5;\ndouble result = (double) total / count; // casts total first -> 3.4\ndouble result2 = (double) (total / count); // int division happens first -> 3.0" },
    ],
    commonMistake: "double avg = sum / count; (with sum and count both int) computes int division FIRST, then widens the already-wrong truncated answer -- it does NOT give you the precise decimal average.",
  },
  "1.5-complex": {
    title: "Overflow, Round-off, and Cast Order Traps",
    concept: "Integer overflow doesn't crash your program or throw an exception -- it silently wraps to some other valid-but-wrong int value. Round-off error happens because doubles have limited precision, especially with repeating decimals. Both are worth checking for specifically when a calculation \"shouldn't\" be wrong but is.",
    examples: [
      { text: "int a = 5, b = 2;\nint x = (int) a + (int) b; // casts happen BEFORE adding: 5 + 2 = 7\nint y = (int) (a + b); // adds first, then casts an already-int value: still 7 here, but the order matters more with doubles" },
    ],
    commonMistake: "Don't assume a math error will \"throw something\" -- overflow is silent, and round-off just quietly gives you an imprecise (not obviously wrong-looking) decimal.",
  },

  "1.6-basic": {
    title: "Compound Assignment & Increment/Decrement",
    concept: "+=, -=, *=, /=, and %= are shorthand for \"do this operation to myself and store the result back.\" x++ and x-- add or subtract 1 from x. This course only covers the postfix form (x++), not prefix (++x).",
    examples: [
      { text: "int x = 10;\nx += 5; // x is now 15\nx *= 2; // x is now 30" },
    ],
    commonMistake: "x += 5; is NOT the same as x = 5; -- it means x = x + 5, using x's current value.",
  },
  "1.6-intermediate": {
    title: "Order of Evaluation in Compound Assignment",
    concept: "In x += (expression), the ENTIRE right-hand expression is evaluated first, using x's current value, and only then added to x. Post-increment (x++) returns x's value BEFORE incrementing -- the increment itself happens as a side effect after that value is used.",
    examples: [
      { text: "int x = 6;\nx *= 2 + 3; // right side first: 2+3=5, then x = 6*5 = 30 (NOT (x*2)+3)" },
      { text: "int x = 5;\nint y = x++; // y gets 5 (x's value before incrementing); x becomes 6 afterward" },
    ],
    commonMistake: "x *= 2 + 3; is not the same as doing x *= 2 and then adding 3 -- the whole \"2 + 3\" is computed first, as one unit.",
  },
  "1.6-complex": {
    title: "Tricky Increment/Decrement Combinations",
    concept: "When the same variable appears more than once in an expression involving ++ or --, work through it strictly left to right, applying the side effect (the actual increment/decrement) at the exact moment that operator is evaluated -- not before, not after.",
    examples: [
      { text: "int x = 5;\nint y = x++ + x; // first x++ gives 5 and bumps x to 6; the second x is read AFTER that bump, so y = 5 + 6 = 11" },
      { text: "int x = 5;\nx = x++; // x++ evaluates to 5, but the explicit \"x = \" then overwrites x with that value (5) -- the intermediate bump to 6 gets erased. x ends up as 5, not 6." },
    ],
    commonMistake: "Combining explicit assignment with post-increment on the same variable (x = x++;) is a classic trap -- the assignment overwrites whatever the increment just did.",
  },

  "1.7-basic": {
    title: "Libraries, APIs, Attributes & Behaviors",
    concept: "A library is a collection of classes; an API specification tells you how to use them without needing to see their internal code. A class's attributes are its data (stored in variables); its behaviors are what it can do (defined by methods).",
    examples: [
      { text: "A Backpack class might have a capacity variable (an attribute) and an open() method (a behavior)." },
    ],
    commonMistake: "Don't classify by what something is ABOUT -- classify by whether it's a variable (attribute) or a method (behavior), regardless of the topic.",
  },
  "1.7-intermediate": {
    title: "Applying Attribute vs. Behavior",
    concept: "Given a class specification listing some variables and some methods, sort them correctly: every variable listed is an attribute, and every method listed is a behavior -- no exceptions based on what they're named or what they do.",
    examples: [
      { text: "A Camera class has resolution and batteryLevel variables, and takePhoto() and zoom() methods.\nresolution, batteryLevel -> attributes. takePhoto, zoom -> behaviors." },
    ],
    commonMistake: "A behavior can change an attribute's value (like a recharge() method changing batteryLevel) -- that doesn't make the attribute itself a behavior. Categorize by variable-vs-method, not by cause-and-effect.",
  },
  "1.7-complex": {
    title: "Categorization Traps & Procedural Abstraction",
    concept: "Procedural abstraction means you can correctly use a method just by knowing what it does (its documented behavior), without ever seeing how it's implemented internally. Watch for questions that try to blur the attribute/behavior line by pointing at what something relates to, rather than what it actually is (variable or method).",
    examples: [
      { text: "\"balance is an attribute, and so is deposit(), since it deals with money\" -- this is WRONG. deposit() is a method, so it's a behavior, no matter what it's about." },
    ],
    commonMistake: "A reference-type attribute (like an Album storing a list of Song objects) is still just an attribute -- attributes aren't limited to primitive types.",
  },

  "1.8-basic": {
    title: "Comments, Preconditions & Postconditions",
    concept: "Comments (//, /* */, and Javadoc /** */) are ignored by the compiler and never affect how a program runs -- they're purely for humans. A precondition is something that must be true BEFORE a method runs correctly; a postcondition is something guaranteed to be true AFTER it finishes.",
    examples: [
      { text: "/** Precondition: y is not equal to 0. */\nThis tells the CALLER what they must ensure -- the method itself isn't expected to check it." },
    ],
    commonMistake: "Methods are not expected to verify their own preconditions -- if a precondition is violated, the method's behavior simply isn't guaranteed (it might crash, might not).",
  },
  "1.8-intermediate": {
    title: "Reasoning About Preconditions",
    concept: "When a method has a documented precondition, the responsibility for satisfying it falls on whoever calls the method -- not on the method itself. If the precondition isn't met, don't expect a helpful error message; expect undefined or incorrect behavior.",
    examples: [
      { text: "A method's precondition says \"index must be valid within the list.\" Calling it with an out-of-range index isn't guaranteed to fail gracefully -- it's simply not guaranteed to work at all." },
    ],
    commonMistake: "Just because a method doesn't crash on bad input doesn't mean it \"handled\" that input correctly -- outside its precondition, its behavior isn't defined either way.",
  },
  "1.8-complex": {
    title: "Preconditions, Postconditions, and Whose Fault It Is",
    concept: "If a precondition is violated by the caller and something goes wrong, that's the caller's error, not a flaw in the method. But if the precondition WAS satisfied and the postcondition still doesn't hold afterward, that points to a bug in the method's own implementation.",
    examples: [
      { text: "A sort() method's postcondition promises the list will be sorted afterward. If you call it correctly (precondition met) and the list still isn't sorted, that's a bug in sort() itself." },
    ],
    commonMistake: "Don't blame the method for a failure that happened because YOU (the caller) didn't satisfy its precondition -- and don't excuse a method's bug just because it \"mostly\" works.",
  },

  "1.9-basic": {
    title: "Methods, Parameters, and Signatures",
    concept: "A method is a named block of code that runs only when called. A parameter is a variable in the method's header. A method's signature is its name plus its ordered list of parameter types. A void method has no return value and can't be used in an expression; a non-void method returns a value matching its declared return type.",
    examples: [
      { text: "public void printMessage(String text) -- signature: printMessage(String)\npublic int getTotal() -- signature: getTotal() (empty parameter list, but still a real signature)" },
    ],
    commonMistake: "A method's signature does NOT include its return type -- only its name and parameter types.",
  },
  "1.9-intermediate": {
    title: "Applying Signatures & Call by Value",
    concept: "Arguments passed to a method must match the parameter list in number, order, and compatible type. Java uses call by value -- a parameter starts out as a COPY of whatever was passed in, so changes made to the parameter inside the method never affect the original variable back at the call site.",
    examples: [
      { text: "public void updateScore(int points) { points = points + 10; }\nCalling updateScore(myScore) does NOT change myScore -- points only ever held a copy." },
    ],
    commonMistake: "Passing too many, too few, or wrong-type arguments compared to a method's parameter list is a compile-time error, not something that silently \"just works.\"",
  },
  "1.9-complex": {
    title: "Overloading & Call by Value with Objects",
    concept: "Overloaded methods share a name but have different signatures (different parameter types and/or counts) -- a different return type ALONE is never enough to make a valid overload. For reference-type parameters (like an object), call by value copies the REFERENCE itself, not the object's data -- so changes made through that reference to the object's own attributes are still visible outside the method, even though the reference variable itself was only copied.",
    examples: [
      { text: "public int compute(int x) and public double compute(int x) -- same name, same parameters, only return type differs. This does NOT compile as a valid overload." },
    ],
    commonMistake: "Don't assume passing an object into a method fully protects it from changes -- call by value protects the reference variable, not the object's own internal state.",
  },

  "2.1-basic": {
    title: "Algorithms: Sequencing, Selection, Repetition",
    concept: "Every algorithm can be built from three building blocks: sequencing (steps in order), selection (a choice based on true/false), and repetition (repeating until a desired outcome is reached). These can be described in plain language or diagrams -- they don't require actual code.",
    examples: [
      { text: "\"First put on socks, then shoes\" is sequencing. \"If it's raining, bring an umbrella\" is selection. \"Keep knocking until someone answers\" is repetition." },
    ],
    commonMistake: "Don't assume an algorithm has to be written as code -- a recipe or a set of directions can be a perfectly valid algorithm.",
  },
  "2.1-intermediate": {
    title: "Combining Selection and Repetition",
    concept: "Real algorithms usually combine multiple building blocks. A repeated process (repetition) often contains a decision inside it (selection), and the order of steps can change the outcome -- especially when one step's result feeds into a later step.",
    examples: [
      { text: "\"Review a flashcard. If you got it wrong, put it back in the pile. Keep going until the pile is empty\" combines selection (checking if wrong) with repetition (continuing until empty)." },
    ],
    commonMistake: "When identifying building blocks in a scenario, look for the true/false decision (selection) separately from the repeated action (repetition) -- they often appear together but are still distinct concepts.",
  },
  "2.1-complex": {
    title: "Verifying Algorithm Correctness and Order",
    concept: "A tricky algorithm-design skill is checking whether a sequence of steps produces the CORRECT result for every possible input, not just the case you happen to picture first. Order of operations matters a lot -- especially when one step's condition should be checked before another step changes the data it depends on.",
    examples: [
      { text: "A two-step \"sort three numbers\" algorithm (compare x,y then compare y,z) can leave x and y out of order again after the second swap -- a third comparison is needed to guarantee full sorting." },
    ],
    commonMistake: "Don't assume an algorithm is correct just because it works for one example -- check whether an earlier step's result could be undone or invalidated by a later step.",
  },

  "2.2-basic": {
    title: "Boolean Expressions & Relational Operators",
    concept: "Relational operators (==, !=, <, >, <=, >=) compare two values and always produce a Boolean (true/false) result. == checks equality; = is assignment, a completely different operator, and a very common point of confusion.",
    examples: [
      { text: "5 > 3 evaluates to true. 4 == 4 evaluates to true. Writing x = 5 assigns 5 to x -- it does NOT compare x to 5." },
    ],
    commonMistake: "Don't confuse = (assignment) with == (comparison) -- this is one of the most common early mistakes, and Java treats them very differently.",
  },
  "2.2-intermediate": {
    title: "Evaluating Relational Expressions with Variables",
    concept: "When a relational expression involves variables and arithmetic, the arithmetic is computed first, and THEN compared. Work through the math one step at a time before applying the comparison.",
    examples: [
      { text: "int x = 7; int y = 3; boolean result = (x - y) > y; -- first x-y is computed (4), then 4 > 3 is checked, giving true." },
    ],
    commonMistake: "Always finish evaluating the arithmetic on each side of a relational operator BEFORE applying the comparison -- don't compare partway through a calculation.",
  },
  "2.2-complex": {
    title: "Reference Comparison, Precision, and Division Traps",
    concept: "For primitives, == compares actual values. For reference types (objects, Strings), == compares whether two variables point to the SAME object, not whether their contents match. Also watch for int division truncating before a comparison happens, and division by zero throwing an exception before any comparison can occur.",
    examples: [
      { text: "Point p1 = new Point(3,4); Point p2 = new Point(3,4); -- p1 == p2 is false, even though their coordinates match, since they're two separate objects." },
      { text: "int a = 5, b = 2; boolean result = (a / b) == 2.5; -- a/b is int division, giving 2 (not 2.5), so result is false -- the precision was already lost before the comparison." },
    ],
    commonMistake: "Don't assume == compares content for objects -- two separately created objects are never == to each other, no matter how similar their data is.",
  },

  "2.3-basic": {
    title: "if and if-else Statements",
    concept: "A one-way if statement runs its body only when its condition is true -- otherwise, nothing happens. A two-way if-else provides an alternate body that runs specifically when the condition is false. Exactly one branch of an if-else ever runs, never both.",
    examples: [
      { text: "if (x > 5) { println(\"big\"); } else { println(\"small\"); } -- if x is 3, this prints \"small\", since the else branch runs when the condition is false." },
    ],
    commonMistake: "Don't think both branches of an if-else can run together -- exactly one of them executes, based on whether the condition is true or false.",
  },
  "2.3-intermediate": {
    title: "Tracing if/if-else with Changing Variables",
    concept: "When tracing code with an if statement, check the condition using the variables' CURRENT values at that point in the program, then follow only the branch that applies. Statements after the if (outside its braces) always run regardless of the condition.",
    examples: [
      { text: "int x = 6; if (x > 10) { x += 100; } x += 1; -- x > 10 is false, so x += 100 is skipped, but x += 1 still runs since it's outside the if. Final x = 7." },
    ],
    commonMistake: "Watch carefully for which statements are actually INSIDE the if's braces versus just placed after it -- statements after the closing brace always run, condition or not.",
  },
  "2.3-complex": {
    title: "Syntax Traps: Braces, Semicolons, and =",
    concept: "Without braces, only the single next statement belongs to an if -- later lines run regardless of the condition, no matter how they're indented. A stray semicolon right after an if's condition creates an empty body. And x = true (assignment) is different from x == true (comparison) -- though when both sides are already boolean, an assignment like flag = true is legal and evaluates to the assigned value.",
    examples: [
      { text: "if (x > 0)\\n  println(\"positive\");\\n  println(\"done\");\\n-- only \"positive\" is conditional; \"done\" always runs, regardless of indentation, since it's a separate statement." },
      { text: "if (a == b);\\n{ println(\"equal\"); }\\n-- the semicolon creates an empty if body; the braced block below runs unconditionally, regardless of a and b." },
    ],
    commonMistake: "Indentation is just for humans -- Java only cares about braces. A statement that LOOKS nested by its spacing may not actually be inside the if at all.",
  },

  "2.4-basic": {
    title: "Nested if and Multiway Selection",
    concept: "A nested if is an if-type statement placed inside another one -- the inner condition is only checked if the outer condition is true. An if-else-if chain checks conditions in order and runs AT MOST ONE matching branch; a trailing else catches everything else.",
    examples: [
      { text: "if (score >= 90) { print(\"A\"); } else if (score >= 80) { print(\"B\"); } else { print(\"C\"); } -- for score=85, only \"B\" prints, even though score also satisfies neither \"A\" nor \"C\"'s conditions." },
    ],
    commonMistake: "In an if-else-if chain, only the FIRST matching condition's branch runs -- later conditions are never even checked once an earlier one matches.",
  },
  "2.4-intermediate": {
    title: "Tracing Nested Conditions and Chains",
    concept: "When a condition is nested inside another, the inner check only happens if you actually enter the outer branch first. If the outer condition is false, the inner if is never reached at all -- its value doesn't matter.",
    examples: [
      { text: "if (age >= 18) { if (hasLicense) { print(\"Can drive\"); } else { print(\"Needs a license\"); } } else { print(\"Too young\"); }\\nIf age is 16, the outer else runs -- hasLicense's value is never even checked." },
    ],
    commonMistake: "Don't check the inner condition's value if the outer condition is already false -- the inner if is simply never reached in that case.",
  },
  "2.4-complex": {
    title: "else-if Chains vs. Separate ifs, and Dangling else",
    concept: "An else-if chain stops after the first true condition -- separate, independent if statements each get checked regardless of earlier results, so multiple could apply. Without braces, Java matches each else to the NEAREST unmatched if, which can produce surprising results when if statements are nested without braces.",
    examples: [
      { text: "if (score>=90) print A; if (score>=80) print B; if (score>=70) print C; -- for score=95, ALL THREE print, since these are independent statements, not a chain." },
      { text: "if (x>5) if (x>20) print(\"big\"); else print(\"medium\"); else print(\"small\");\\nWithout braces, the else pairs with the nearest if (x>20), not the outer one -- a classic \"dangling else\" trap." },
    ],
    commonMistake: "If you want MULTIPLE messages able to print for multiple true conditions, use separate if statements, not else-if -- else-if is specifically for \"only one of these should happen.\"",
  },

  "2.5-basic": {
    title: "Compound Booleans: !, &&, ||",
    concept: "! reverses a Boolean value. && (AND) is true only when BOTH sides are true. || (OR) is true when AT LEAST ONE side is true. Precedence order is ! first, then &&, then ||.",
    examples: [
      { text: "true && false is false (both must be true). true || false is true (only one needs to be true). !true is false." },
    ],
    commonMistake: "Remember && requires BOTH conditions, while || only needs ONE -- mixing these up is one of the most common mistakes with compound expressions.",
  },
  "2.5-intermediate": {
    title: "Evaluating Compound Expressions with Precedence",
    concept: "When an expression mixes &&, ||, and !, precedence determines the order: ! happens first, then &&, then ||. When in doubt, mentally add parentheses around the && parts first.",
    examples: [
      { text: "true || false && false -- && binds tighter, so this is true || (false && false) = true || false = true." },
    ],
    commonMistake: "Don't evaluate a mixed &&/|| expression strictly left to right -- && groups with its neighbors first, regardless of where it appears in the expression.",
  },
  "2.5-complex": {
    title: "Short-Circuit Evaluation",
    concept: "For a && b, if a is already false, b is never evaluated at all -- the result must be false regardless. For a || b, if a is already true, b is never evaluated -- the result must be true regardless. This is called short-circuit evaluation, and it's often used deliberately to avoid errors.",
    examples: [
      { text: "if (x != 0 && (10 / x) > 1) -- if x is 0, x != 0 is false, so (10/x) is NEVER evaluated, safely avoiding a division-by-zero crash." },
      { text: "if (s != null && s.length() > 0) -- if s is null, the second part (which would crash) is never reached, thanks to short-circuiting." },
    ],
    commonMistake: "Don't assume both sides of && or || always get evaluated -- if a method call on the right side has an important side effect (like printing or logging), short-circuiting might skip it entirely.",
  },

  "2.6-basic": {
    title: "Equivalent Expressions & De Morgan's Law",
    concept: "Two Boolean expressions are equivalent if they produce the same result in EVERY possible case. De Morgan's law gives a way to rewrite negated compound expressions: !(a && b) becomes !a || !b, and !(a || b) becomes !a && !b.",
    examples: [
      { text: "!(a && b) is equivalent to !a || !b. !(a || b) is equivalent to !a && !b -- notice the operator (&&/||) flips each time." },
    ],
    commonMistake: "Don't mix up the two forms of De Morgan's law -- negating an && expression produces an || (not another &&), and vice versa.",
  },
  "2.6-intermediate": {
    title: "Applying De Morgan's Law & Basic Reference Comparison",
    concept: "To apply De Morgan's law, distribute the negation across both sides and flip the operator. For object references, == checks whether two variables point to the exact same object -- assigning one reference variable to another (b = a) makes them refer to the SAME object.",
    examples: [
      { text: "!(x >= 10 && y <= 20) becomes x < 10 || y > 20, by negating each side and flipping && to ||." },
      { text: "Robot r1 = new Robot(); Robot r2 = r1; -- r1 == r2 is true, since r2 was assigned r1's exact reference." },
    ],
    commonMistake: "When negating a relational operator as part of De Morgan's law, make sure to flip it correctly: > becomes <=, >= becomes <, and so on -- not just to its opposite-sounding word.",
  },
  "2.6-complex": {
    title: "equals() vs ==, and Safe Null-Checking",
    concept: "== compares object identity (are they the literal same object?); equals() (when properly defined) compares meaningful content. Two separately created objects with matching data are equal by equals() but NOT == to each other. When checking for null, always put null on the safe side of the comparison to avoid a NullPointerException.",
    examples: [
      { text: "String s1 = new String(\"hi\"); String s2 = new String(\"hi\"); -- s1 == s2 is false (different objects), but s1.equals(s2) is true (same content)." },
      { text: "if (obj.equals(null)) is risky -- if obj itself is null, this throws a NullPointerException. obj == null is the safe way to check." },
    ],
    commonMistake: "Don't call a method (like .equals()) on something that might be null -- checking == null (or != null) first is always safer.",
  },
};

export function getReview(topic, tier) {
  return REVIEWS[`${topic}-${tier}`] || null;
}
