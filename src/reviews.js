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
  "2.7-basic": {
    title: "The while Loop: Repeating Code",
    concept: "A while loop repeats a block of code as long as its Boolean condition is true. Before every single pass through the loop body, including the very first, Java checks the condition; if it is false from the start, the body never runs at all (zero times). Each time through the loop, some variable used in the condition must change, or the loop will never stop.",
    examples: [
      { text: "int count = 1;\nwhile (count < 4)\n{\n    System.out.print(count);\n    count++;\n}\n// prints 123, then stops because count < 4 is false when count is 4" },
    ],
    commonMistake: "Forgetting to update the loop control variable inside the body, which causes the condition to stay true forever and produces an infinite loop.",
  },
  "2.7-intermediate": {
    title: "Tracing while Loops Precisely",
    concept: "Because the Boolean condition is rechecked before every iteration, small details like using < instead of <=, or placing an update statement before versus after the rest of the body, change exactly which values get processed. To trace a while loop correctly, update one variable at a time in order and re-check the full condition after each full pass through the body, not just at the end.",
    examples: [
      { text: "int i = 1;\nint total = 0;\nwhile (i <= 4)\n{\n    i++;\n    total += i;\n}\n// i++ happens before total += i, so the values added are 2,3,4,5 (total = 14), not 1,2,3,4" },
    ],
    commonMistake: "Assuming statement order inside the loop body doesn't matter, when incrementing a variable before using it (instead of after) shifts every value used in that iteration.",
  },
  "2.7-complex": {
    title: "Infinite Loops, Overflow, and Loop Equivalence",
    concept: "The trickiest while loop errors happen when a variable's update skips right over the exact value the condition is checking (like x != 0 when x steps by 3 from 10), or when an int variable overflows: Java wraps overflowed values silently instead of throwing an error, which can make a loop that was supposed to terminate run forever or produce a wildly wrong result. When comparing two loops for true equivalence, trace both completely rather than assuming similar-looking code behaves the same way.",
    examples: [
      { text: "int x = 10;\nwhile (x != 0)\n{\n    x -= 3;\n}\n// x goes 10,7,4,1,-2,-5,... and never equals exactly 0, so this loop never terminates" },
    ],
    commonMistake: "Assuming int overflow will throw an exception or otherwise stop the loop, when in Java it silently wraps to an unexpected value and can cause the loop to run far longer than intended, or forever.",
  },
  "2.8-basic": {
    title: "The for Loop: Header, Order, and Counting",
    concept: "A for loop header has three parts separated by semicolons: the initialization (runs once, before anything else), the Boolean expression (checked before every potential iteration, including the very first), and the update (runs after the loop body finishes, right before the Boolean expression is checked again). Whether a loop runs 0, 1, or many times depends entirely on these three parts working together, and whether the bound uses < or <= changes exactly which values the loop control variable takes.",
    examples: [
      { text: "for (int i = 0; i < 5; i++)\n{\n    System.out.print(i);\n}\nprints 01234 -- five values, since i stops as soon as i < 5 is false (at i = 5)." },
      { text: "for (int i = 1; i <= 5; i++)\n{\n    System.out.print(i);\n}\nprints 12345 -- also five values, but starting at 1 and including 5 because of the <= bound." },
    ],
    commonMistake: "Confusing < and <= at the loop bound, which silently adds or removes one iteration (an off-by-one error).",
  },
  "2.8-intermediate": {
    title: "Stepping, Counting Down, and Filtering Inside a Loop",
    concept: "The update in a for loop is not limited to i++ -- it can add or subtract any amount (i += 3, i -= 2) to skip values or count backward, and the loop still stops the instant its Boolean expression becomes false. When the body contains an if statement, only some of the values the loop control variable takes actually get printed or counted, so tracing carefully requires separating \"which values does i take\" from \"which of those values pass the if condition.\"",
    examples: [
      { text: "for (int i = 20; i > 0; i -= 5)\n{\n    System.out.print(i);\n}\nprints 2015105 -- i counts down by 5 (20, 15, 10, 5) and stops once i > 0 becomes false at i = 0, so the digits concatenate with no separators." },
      { text: "for (int i = 1; i <= 12; i++)\n{\n    if (i % 5 == 0)\n    {\n        System.out.print(i);\n    }\n}\nprints 510 -- i still takes every value from 1 to 12, but only multiples of 5 are printed." },
    ],
    commonMistake: "Miscounting how many terms a stepped loop produces (e.g., assuming (stop - start) alone gives the count, instead of also accounting for the step size and whether the bound is inclusive).",
  },
  "2.8-complex": {
    title: "for/while Equivalence Traps and Boundary Reasoning",
    concept: "Any for loop can be rewritten as a while loop by moving the initialization before the loop, using the same Boolean expression as the while condition, and placing the update as the very last statement inside the loop body -- get that placement wrong (update first instead of last, or a mismatched bound) and the two loops silently produce different output despite looking almost identical. At this level, also watch for loop control variables reassigned inside the body (the header's update still fires afterward), compound Boolean conditions in the header, and bounds built from expressions or other variables.",
    examples: [
      { text: "for (int i = 1; i <= 3; i++)\n{\n    System.out.print(i);\n}\nprints 123.\nint i = 1;\nwhile (i <= 3)\n{\n    i++;\n    System.out.print(i);\n}\nprints 234 instead -- moving the update before the print shifts every value and adds an extra pass, so the two are NOT equivalent." },
      { text: "for (int i = 1; i <= 10 && i % 3 != 0; i++)\n{\n    System.out.print(i);\n}\nprints 12 -- the loop stops the moment i = 3 makes i % 3 != 0 false, even though i <= 10 is still true." },
    ],
    commonMistake: "When converting a for loop to a while loop, placing the update statement at the start of the loop body instead of the end, which shifts every printed value and can add or remove an iteration.",
  },
  "2.9-basic": {
    title: "The Five Standard Algorithms with Primitive Values",
    concept: "Before arrays are introduced, several common problems are solved using only int variables and loops: checking divisibility with %, pulling out digits with % and /, counting how many loop values meet a test, tracking a running minimum or maximum, and computing a sum or average. Each pattern uses an accumulator variable (a count, a sum, or a min/max) that is initialized before the loop and updated once per iteration.",
    examples: [
      { text: "Checking divisibility:\nif (num % 4 == 0)\n{\n    count++;\n}\nExtracting the last digit:\nint lastDigit = num % 10;" },
      { text: "Running sum over a fixed range:\nint sum = 0;\nfor (int k = 1; k <= 10; k++)\n{\n    sum += k;\n}\n// sum is now 1 + 2 + ... + 10" },
    ],
    commonMistake: "Confusing % (which gives a remainder, used for both divisibility and digit extraction) with / (which gives a truncated quotient, used to discard a digit or advance a count).",
  },
  "2.9-intermediate": {
    title: "Loop Bounds, Accumulator Initialization, and Integer Division",
    concept: "The same five algorithms appear inside loops whose bounds are easy to get subtly wrong: using < instead of <=, or comparing the accumulator itself to the limit instead of the loop counter. Sum and average problems add another trap: if both the sum and the divisor are declared as int, dividing them truncates any decimal part before it is ever stored in a double, so the cast to double must happen before the division, not after.",
    examples: [
      { text: "Off-by-one in a range sum:\nint sum = 0;\nfor (int k = low; k < high; k++)\n{\n    sum += k;\n}\n// This omits high itself; use k <= high to include it." },
      { text: "Integer division before the cast:\nint sum = 17;\nint count = 5;\ndouble average = sum / count;\n// average is 3.0, not 3.4, because sum / count truncates first.\ndouble correctAverage = sum / (double) count;\n// correctAverage is 3.4" },
    ],
    commonMistake: "Writing k < n instead of k <= n (or vice versa) so the loop processes one value too few or too many, especially when n itself would satisfy the criterion being counted or summed.",
  },
  "2.9-complex": {
    title: "Verifying Near-Miss Implementations Against a Specification",
    concept: "At this level you are often given a documented method (with a precondition and postcondition) and two or three candidate implementations, and must decide which ones actually satisfy the specification for every valid input, not just for one traced example. Classic failure points include initializing max to 0 instead of to the first computed value (which fails whenever every value in the range is negative), using a strict bound like temp > 10 that undercounts whenever a running value lands exactly on a power of ten, and forgetting to add back a boundary term (like high) after a loop that only ran through high - 1.",
    examples: [
      { text: "A max-tracking loop that fails on all-negative data:\nint max = 0;\nfor (int k = 1; k <= 3; k++)\n{\n    int value = -k * k;\n    if (value > max)\n    {\n        max = value;\n    }\n}\n// max stays 0, but the true maximum (-1) is never stored." },
      { text: "A digit-count loop with a boundary trap:\nint count = 1;\nint temp = 105;\nwhile (temp > 10)\n{\n    temp /= 10;\n    count++;\n}\nSystem.out.println(count);\n// Prints 2, but 105 actually has 3 digits -- the condition temp > 10 stops one step too early because temp lands exactly on 10." },
    ],
    commonMistake: "Assuming an algorithm that works correctly on one traced example (like a typical num = 12345) must be correct in general, instead of checking boundary cases such as num = 0, all-negative ranges, or values that land exactly on a loop's bound.",
  },
  "2.10-basic": {
    title: "String Basics: charAt, substring, and indexOf",
    concept: "Standard string algorithms are built from a small set of String methods: charAt(i) gets one character at a position, substring(from, to) extracts a range of characters (from is included, to is excluded), and indexOf(str) searches for a substring and returns its starting position or -1 if it is not found. Simple loops walk through a string one index at a time (using length() to know where to stop) to build a new string, count matches, or test whether a pattern appears. equals() and compareTo() compare whole strings rather than single characters.",
    examples: [
      { text: "String str = \"LEMON\";\nSystem.out.println(str.charAt(1));\n// prints E, since indexing starts at 0" },
      { text: "String str = \"LEMON\";\nSystem.out.println(str.substring(1, 4));\n// prints EMO: characters at indices 1, 2, and 3 (index 4 is excluded)" },
    ],
    commonMistake: "Forgetting that substring's second argument is exclusive, so students often include one character too many or too few at the boundary.",
  },
  "2.10-intermediate": {
    title: "Building a Result String in a Loop",
    concept: "Many string algorithms build up an answer by looping through a string and repeatedly concatenating (+=) a small piece onto a result variable that starts as the empty string. Getting the loop bounds exactly right matters: using i < str.length() versus i <= str.length(), or str.length() versus str.length() - 1, changes whether the last character is included or whether the code crashes with an invalid index. When comparing two implementations meant to do the same thing, check the very first and very last iterations first, since off-by-one errors almost always show up at the boundaries.",
    examples: [
      { text: "String str = \"CAB\";\nString result = \"\";\nfor (int i = str.length() - 1; i >= 0; i--)\n{\n    result += str.charAt(i);\n}\n// result becomes \"C\", then \"CB\", then \"CBA\" -- walking backward from the last index and appending each character reverses the string" },
    ],
    commonMistake: "Writing a loop bound like i <= str.length() (instead of i < str.length()) or i > 0 (instead of i >= 0), which either causes a runtime exception on an invalid index or silently skips the first or last character.",
  },
  "2.10-complex": {
    title: "Reversal, Counting, and Boundary Traps",
    concept: "Reversal algorithms walk a string from the last index to the first, appending characters one at a time; small changes to the starting index or stopping condition can shift the whole result, skip a character, or throw an exception. Counting algorithms that search for a substring with indexOf must decide whether to advance one character at a time (to catch overlapping matches) or jump past the whole match (to count only non-overlapping matches) -- these two choices give different answers on strings like \"aaaa\". Always check boundary cases separately: an empty string (length 0), a string of length 1, and what happens when indexOf never finds a match and returns -1, since forgetting to handle -1 can cause an infinite loop or a crash.",
    examples: [
      { text: "int pos = str.indexOf(\"ab\");\nwhile (pos != -1)\n{\n    count++;\n    str = str.substring(pos + 1); // advances by 1 char: finds overlapping matches\n    pos = str.indexOf(\"ab\");\n}" },
    ],
    commonMistake: "Advancing the search position incorrectly after a match (for example, not moving forward at all, or using substring(pos) instead of substring(pos + 1)), which leaves the same match in place and causes the loop to run forever.",
  },
  "2.11-basic": {
    title: "Nested Loops: The Inner Loop Finishes First",
    concept: "A nested loop is a loop placed inside the body of another loop. Each time the outer loop's body runs once, the entire inner loop must run through all of its iterations before the outer loop is allowed to move to its next iteration. When both loops have a fixed, simple bound, the total number of times the inner statement executes is the number of outer iterations multiplied by the number of inner iterations.",
    examples: [
      { text: "for (int i = 0; i < 3; i++)\n{\n    for (int j = 0; j < 4; j++)\n    {\n        System.out.print(\"*\");\n    }\n}\nThis prints 3 * 4 = 12 asterisks total, because the inner loop runs 4 times for each of the 3 outer iterations." },
    ],
    commonMistake: "Students often add the two loop bounds instead of multiplying them, incorrectly guessing 3 + 4 = 7 instead of 3 * 4 = 12.",
  },
  "2.11-intermediate": {
    title: "Triangular Patterns: When the Inner Bound Depends on the Outer Variable",
    concept: "In many nested loops, the inner loop's starting or ending bound is written in terms of the outer loop's control variable (such as j <= i) rather than a fixed number. This makes the inner loop run a different number of times on each pass of the outer loop, producing triangular or staircase patterns in the output, and it means the total iteration count must be found by adding up a changing amount for each outer iteration rather than by simple multiplication.",
    examples: [
      { text: "for (int i = 1; i <= 4; i++)\n{\n    for (int j = 1; j <= i; j++)\n    {\n        System.out.print(\"*\");\n    }\n    System.out.println();\n}\nThis prints:\n*\n**\n***\n****\nbecause the inner loop runs i times on each row, so the total number of asterisks is 1 + 2 + 3 + 4 = 10." },
    ],
    commonMistake: "Students often use j < i instead of j <= i (or vice versa), which shifts every row's length by one and produces a pattern that starts or ends with the wrong number of characters.",
  },
  "2.11-complex": {
    title: "Debugging Triangular Patterns and Reasoning About When a Nested Loop Runs at All",
    concept: "At this depth, you need to compare several nearly-identical nested loop implementations to determine which one exactly matches a target output, spot subtle off-by-one bugs in the inner loop's bound (such as j <= i + 1 instead of j <= i), and reason about the exact conditions two variables must satisfy for a nested loop's body to execute even a single time -- the outer loop's condition must be true for at least one value, and the inner loop's condition must also be true during that pass.",
    examples: [
      { text: "for (int i = 0; i < n; i++)\n{\n    for (int j = i; j < m; j++)\n    {\n        count++;\n    }\n}\ncount is guaranteed to increase at least once only if n > 0 (so the outer loop runs) AND m > 0 (so that on the first pass, when i is 0, the inner loop's condition j < m is true)." },
    ],
    commonMistake: "Students frequently assume that the outer loop's condition being true is enough to guarantee the inner loop executes, forgetting to check the inner loop's own condition separately.",
  },
  "2.12-basic": {
    title: "Counting Executions in a Single Loop",
    concept: "A statement execution count is simply the number of times a statement (or method call) actually runs during a loop. To find it, list or trace the values the loop variable takes and count how many there are, paying close attention to whether the loop uses < or <= and whether it counts up or down. If the statement is inside an if inside the loop, only count the passes where the condition is actually true.",
    examples: [
      { text: "for (int i = 1; i <= 5; i++)\n{\n    doTask();\n}\ndoTask() runs 5 times, once for each value i = 1, 2, 3, 4, 5." },
      { text: "for (int i = 1; i <= 8; i++)\n{\n    if (i % 4 == 0)\n    {\n        count++;\n    }\n}\ncount++ runs only 2 times, when i is 4 and 8." },
    ],
    commonMistake: "Students often miscount the boundary value, forgetting that <= includes the final value or that < stops one short of it.",
  },
  "2.12-intermediate": {
    title: "Counting Executions in Nested Loops with Fixed Bounds",
    concept: "When a loop is nested inside another loop and the inner loop always runs the same number of times no matter what the outer loop variable is, the total number of executions is simply the outer loop's iteration count multiplied by the inner loop's iteration count. Trace each loop separately first, then multiply.",
    examples: [
      { text: "for (int i = 0; i < 4; i++)\n{\n    for (int j = 1; j <= 5; j++)\n    {\n        doStep();\n    }\n}\nThe outer loop runs 4 times and the inner loop always runs 5 times, so doStep() executes 4 x 5 = 20 times." },
    ],
    commonMistake: "Adding the outer and inner counts together (or forgetting to multiply at all) instead of correctly multiplying them.",
  },
  "2.12-complex": {
    title: "Counting Executions When the Inner Bound Depends on the Outer Variable",
    concept: "Sometimes the inner loop's bound changes based on the current value of the outer loop variable, so you cannot just multiply a single inner count by the outer count. Instead, trace the inner loop's execution count separately for each outer iteration and add all those counts together (this often produces a triangular-number pattern like 1 + 2 + 3 + ...). A related complex pattern is a loop with a non-trivial step, such as incrementing by 2 or counting down, combined with a conditional (like a modulus check) that only counts some of the loop's iterations.",
    examples: [
      { text: "for (int i = 1; i <= 4; i++)\n{\n    for (int j = 1; j <= i; j++)\n    {\n        mark();\n    }\n}\nThe inner loop runs 1, 2, 3, then 4 times as i goes from 1 to 4, so mark() executes 1 + 2 + 3 + 4 = 10 times total, not 4 x 4." },
      { text: "for (int i = 1; i <= 10; i = i + 2)\n{\n    if (i % 3 == 0)\n    {\n        count++;\n    }\n}\nThe loop only visits i = 1, 3, 5, 7, 9, and among those only 3 and 9 are divisible by 3, so count++ executes 2 times." },
    ],
    commonMistake: "Multiplying the outer loop's count by a single 'typical' inner count instead of summing the different inner counts produced by each outer iteration.",
  },
  "3.1-basic": {
    title: "Abstraction, Attributes, and Behaviors",
    concept: "Abstraction means focusing on the essential idea of something while hiding details that are not relevant right now. In class design, data abstraction lets us name a piece of information (like an account's balance) without worrying about how it is stored, while procedural abstraction lets us name an action (like calculating interest) without worrying about how the calculation works internally. Every class is made of attributes (data, declared outside any method) and behaviors (methods, which perform actions). An instance variable holds a value unique to each object, while a class variable holds one value shared by every object of the class.",
    examples: [
      { text: "public class Dog\n{\n    private String name;\n    private int age;\n}\nname and age are attributes: pieces of data stored by every Dog object, each with its own values." },
      { text: "A method bark() that prints a sound is a behavior (an action), not an attribute, even though it is part of the Dog class." },
    ],
    commonMistake: "Students often mislabel a method that returns or reports a value (like getAge()) as an attribute simply because it deals with data, when it is actually a behavior.",
  },
  "3.1-intermediate": {
    title: "Designing Attribute and Behavior Sets",
    concept: "Good class design requires choosing not just what data and actions a class needs, but the most appropriate data type for each attribute and making sure methods and data are not confused with each other. Class diagrams often use a shorthand where '-' marks a private attribute or method and '+' marks a public one; a private attribute is typically paired with public getter (and sometimes setter) methods so other classes can access it safely. Parameters let a single method be reused for many different input values instead of writing nearly identical methods for each case, and instance variables versus class variables should be chosen based on whether a value is unique per object or shared by all objects.",
    examples: [
      { text: "public class Ticket\n{\n    - double price\n    + double getPrice()\n}\nprice is private so it cannot be changed directly from outside the class, while getPrice() gives read-only access." },
      { text: "public double applyDiscount(double price, double percentOff)\nUsing percentOff as a parameter lets one method handle any discount percentage instead of writing a separate method for each one." },
    ],
    commonMistake: "Students often pick a data type that technically works but hides meaning, such as using a String to store a numeric price or a combined String instead of separate, correctly typed attributes.",
  },
  "3.1-complex": {
    title: "Full Class Design, Decomposition, and Abstraction Trade-offs",
    concept: "At an advanced level, class design requires evaluating an entire proposed set of attributes and behaviors at once, checking that each piece of data has an appropriate type, that data and actions are not swapped, and that instance variables versus class variables are chosen correctly based on whether values are unique per object or shared across all objects. Procedural abstraction also allows a method's internal implementation to be changed or improved (for accuracy, efficiency, or storage) as long as its signature and documented behavior stay the same, so no code that calls the method needs to change. Method decomposition, splitting one large method into several focused methods, improves testability, maintainability, and the potential for reusing individual pieces, though it does not by itself guarantee fewer bugs or faster performance.",
    examples: [
      { text: "public double calculateFare(double miles, double minutes)\nThe formula inside this method can be completely rewritten (e.g., to add surge pricing) without changing any code that calls calculateFare(miles, minutes), because the signature and what it computes stay the same." },
      { text: "Splitting one long runGameTurn() method into readMove(), validateMove(), updateBoard(), and checkWin() lets each part be tested on its own and lets validateMove() potentially be reused elsewhere, such as for a hint feature." },
    ],
    commonMistake: "Students often assume that decomposing a method or applying abstraction automatically makes a program faster or bug-free, when the real benefits are clarity, maintainability, testability, and reuse.",
  },
  "3.2-basic": {
    title: "System Reliability, Software Impact, and Licensing Basics",
    concept: "Well-designed software should work correctly under the range of conditions it's likely to encounter, and programmers build this reliability by testing broadly rather than narrowly. Every program that solves a real-world problem can also create effects beyond what its creators intended, and those effects can be helpful, harmful, or both. When a program reuses someone else's code, legal and ethical rules about ownership apply: code published under an open-source license may generally be used according to its stated terms, but anything else usually requires the original owner's permission.",
    examples: [
      { text: "A weather app tested only on sunny-day data crashes the first time it processes a hurricane alert." },
      { text: "A free scheduling tool ends up being used in ways its creators never expected, some helpful and some not." },
      { text: "A student uses a code snippet from a public repository that is licensed for free reuse as long as the original author is credited." },
    ],
    commonMistake: "Students often assume that if a program was created with good intentions or offered for free, it cannot cause harm or cannot require permission to reuse -- but reliability depends on testing and legal use of code depends on licensing terms, not on intent or price.",
  },
  "3.2-intermediate": {
    title: "Weighing Reliability, Impact, and IP Tradeoffs",
    concept: "At this level, program-design decisions usually involve balancing two competing considerations rather than applying a single rule. A team might weigh faster time-to-market against more thorough testing, knowing that skipped tests leave certain conditions completely unverified. A beneficial program can simultaneously produce a real unintended harm, so recognizing both effects at once, rather than picking only one, is essential. Similarly, reused code might be technically free to use, but that freedom is often conditioned on requirements like attribution, and failing to meet those conditions is still a licensing violation even though no money changed hands.",
    examples: [
      { text: "A city's flood-alert software works fine on ordinary days but was never tested under the exact stormy conditions when accurate warnings matter most." },
      { text: "A popular recommendation algorithm boosts sales for some independent artists while subtly reshaping what kind of music gets made." },
      { text: "A developer uses an open-source library within its license's rules but forgets the required attribution, technically violating its terms despite the code being free." },
    ],
    commonMistake: "Students often pick the single 'good' or 'bad' framing of a scenario instead of recognizing that a program can have both a genuine benefit and a genuine unintended harm at the same time, or that 'free to use' code can still carry binding conditions like attribution.",
  },
  "3.2-complex": {
    title: "Multi-Factor Judgment: Reliability, Ethics, and Licensing Together",
    concept: "The most advanced scenarios combine reliability, societal or economic impact, and intellectual-property concerns within a single situation, requiring you to identify every real issue present and choose the response that addresses all of them, not just the most obvious one. Overreactions, such as abandoning a whole project, and underreactions, such as ignoring a problem or applying a cosmetic fix, are both worse choices than direct action: investigating licensing status, obtaining permission where required, and testing the specific untested condition that caused a failure. Recognizing which combination of concrete next steps actually resolves the underlying problems, rather than just sounding responsible, is the key skill at this tier.",
    examples: [
      { text: "An app with both an unlicensed reused component and an untested edge case draws complaints about a bug and a question about permission on the same day, requiring the team to address both issues directly rather than just one." },
      { text: "A financial program shows an unintended pattern of unequal outcomes across groups, prompting leadership to investigate and adjust the software rather than deny the problem or scrap it entirely." },
      { text: "A student project reuses forum code with no stated license and also fails under an untested condition; the right response fixes both the licensing question and the reliability gap instead of picking just one or neither." },
    ],
    commonMistake: "Students often select an answer that only fixes one of several problems present, such as addressing the bug but ignoring the licensing question, or reacts to a bad outcome by overreacting (discontinuing the whole project) rather than diagnosing and resolving the specific, addressable causes.",
  },
  "3.3-basic": {
    title: "Public vs. Private: The Basics of Encapsulation",
    concept: "Encapsulation means hiding a class's implementation details from other classes. The keywords public and private control this: private restricts access to only the declaring class, while public allows access from outside classes too. In this course, class headers and constructors are always written as public, but instance variables should almost always be private so that other classes cannot read or change them directly. Any instance variable declared public can be accessed with dot notation (like myObject.fieldName) from anywhere, which breaks encapsulation.",
    examples: [
      { text: "public class Coupon\n{\n    private double discount;\n    public String code;\n}\n// In another class, with a properly instantiated Coupon object myCoupon:\ndouble d = myCoupon.discount;\n// does NOT compile - discount is private\nString c = myCoupon.code;\n// compiles fine - code is public" },
    ],
    commonMistake: "Students often assume that if a variable exists and has been assigned a value, any class can read it with dot notation, forgetting that private strictly blocks that access regardless of whether the value has been set.",
  },
  "3.3-intermediate": {
    title: "Mixing Public and Private Members in a Class",
    concept: "A realistic class combines a public constructor, private instance variables, and a mix of public and private methods. Public methods are the class's interface: they can be called both from inside and outside the class, and they are the intended way for other classes to interact with an object's private data. Private methods act as internal helpers; they can only be called by other code inside the same class, never directly from outside. When tracing code, check each member's access level individually, since a class can have some public and some private members at the same time.",
    examples: [
      { text: "public class Kettle\n{\n    private double waterTemp;\n    public Kettle(double t)\n    {\n        waterTemp = t;\n    }\n    private void heatUp()\n    {\n        waterTemp = waterTemp + 5.0;\n    }\n    public void boil()\n    {\n        heatUp();\n        heatUp();\n    }\n}\n// Outside the class: kettle.boil() compiles (public)\n// kettle.heatUp() does NOT compile (private)" },
    ],
    commonMistake: "Students often think that if a public method calls a private method internally, the whole method call chain becomes inaccessible from outside; in reality, only the direct call to the private method from outside the class fails, while calling the public method that wraps it works fine.",
  },
  "3.3-complex": {
    title: "Designing and Debugging Fully Encapsulated Classes",
    concept: "At this level, encapsulation questions ask you to evaluate or fix an entire class design against a specification: which members should be public, which private, and why. A key nuance is that private restricts access to the declaring class as a whole, not to a single object; so a method inside a class can access the private instance variables of any object of that same class, including one passed in as a parameter. When debugging a class that fails to compile, look for external code trying to use dot notation directly on a private field or private method instead of going through a public accessor or public method.",
    examples: [
      { text: "public class Coin\n{\n    private int value;\n    public Coin(int v)\n    {\n        value = v;\n    }\n    public boolean isWorthMoreThan(Coin other)\n    {\n        return value > other.value;\n        // allowed: other.value is accessed from inside the Coin class\n    }\n}" },
    ],
    commonMistake: "Students often believe that accessing other.value inside a method of the same class is illegal because value is private, not realizing that private access is restricted by class, not by object instance.",
  },
  "3.4-basic": {
    title: "Constructors and Default Values",
    concept: "A constructor is a special block of code that runs when an object is created with new, and its job is to set the initial state of the object by giving values to its instance variables. If a class has no constructor written at all, Java automatically supplies a no-argument default constructor. That default constructor sets every instance variable to its type's default value: 0 for int, 0.0 for double, false for boolean, and null for any reference type such as String or a user-defined class.",
    examples: [
      { text: "public class Marble\n{\n    private String color;\n    public Marble(String startColor)\n    {\n        color = startColor;\n    }\n}\nMarble m = new Marble(\"blue\");\n// m's color is now \"blue\"" },
      { text: "public class Timer\n{\n    private int seconds;\n}\nTimer t = new Timer();\n// no constructor was written, so seconds defaults to 0" },
    ],
    commonMistake: "Students often assume an unset int or boolean field is left undefined, or that an unset String defaults to an empty string \"\", rather than remembering that Java always assigns 0, 0.0, false, or null automatically.",
  },
  "3.4-intermediate": {
    title: "Matching Parameters to Instance Variables",
    concept: "Many constructor bugs come from confusing a constructor's parameters with the class's instance variables, especially when an assignment statement goes in the wrong direction, such as writing parameter = parameter instead of instanceVariable = parameter. A class can also define more than one constructor with different parameter lists, called overloading; Java chooses which constructor to run based on the number, order, and types of the arguments in the new call. Once a class defines any constructor of its own, the automatic no-argument default constructor is no longer available.",
    examples: [
      { text: "public class Pet\n{\n    private String name;\n    private int age;\n    public Pet(String petName, int petAge)\n    {\n        name = petName;\n        petAge = age;\n    }\n}\nPet p = new Pet(\"Rex\", 4);\n// name becomes \"Rex\", but age stays 0 because petAge = age assigns backwards" },
    ],
    commonMistake: "Students frequently write the assignment in the wrong direction, assigning the instance variable's default value to the parameter, or give a parameter the exact same name as its instance variable, which causes a self-assignment that leaves the instance variable at its default.",
  },
  "3.4-complex": {
    title: "Defensive Copying and Tracing Object State",
    concept: "When a constructor parameter is a mutable object, such as a user-defined class with mutator methods, simply assigning the instance variable to that parameter (instanceVariable = parameter) makes the instance variable an alias for the original object. Any later change made through the original reference will also be visible through the instance variable, and vice versa. To prevent this, a constructor should build a brand-new object using the parameter's current values, such as instanceVariable = new SomeClass(parameter.getX(), parameter.getY()), so the instance variable refers to an independent copy instead of the original object.",
    examples: [
      { text: "public class Point2D\n{\n    private int x;\n    public Point2D(int startX)\n    {\n        x = startX;\n    }\n    public int getX()\n    {\n        return x;\n    }\n    public void setX(int newX)\n    {\n        x = newX;\n    }\n}\npublic class Container\n{\n    private Point2D corner;\n    public Container(Point2D p)\n    {\n        corner = new Point2D(p.getX());\n    }\n}\n// corner is now an independent copy, not an alias of p" },
    ],
    commonMistake: "Students often assume that assigning instanceVariable = parameter automatically makes a copy, when in fact it only copies the reference, leaving the instance variable aliased to the original mutable object so that later changes to either one affect both.",
  },
  "3.5-basic": {
    title: "Void vs. Non-Void Methods and the return Statement",
    concept: "Every method header either uses the keyword void or names a real return type, such as int, double, boolean, or String, and this choice determines what the method is allowed to do. A void method performs an action but sends no value back to whatever code called it, so it never has a return statement that provides a value; at most it may use a bare return; to exit early. A non-void method must include a return statement whose expression matches (or is compatible with) the declared return type, and that value is handed back to the caller the moment the return statement executes. As soon as any return statement runs, the method stops immediately: any statements written after it in the same method never execute during that call.",
    examples: [
      { text: "public class Robot\n{\n    private int batteryLevel;\n    public Robot(int startLevel)\n    {\n        batteryLevel = startLevel;\n    }\n    public void beep()\n    {\n        System.out.println(\"Beep!\");\n    }\n    public int getBatteryLevel()\n    {\n        return batteryLevel;\n    }\n}\n// beep() is void: it performs an action and returns nothing\n// getBatteryLevel() is non-void: it returns an int value to the caller" },
      { text: "public String describeLevel(int level)\n{\n    if (level > 75)\n    {\n        return \"high\";\n    }\n    return \"low\";\n}\n// once return \"high\"; runs, the method exits immediately\n// return \"low\"; only runs when level is 75 or less" },
    ],
    commonMistake: "Students often write a return statement with a value inside a method declared void, or forget the return statement entirely inside a method that declares a real return type, both of which cause a compile error. Another frequent mistake is assuming that code written after a return statement will still run, when in reality returning immediately hands control back to the caller and skips every remaining line in that method call.",
  },
  "3.5-intermediate": {
    title: "Accessors, Mutators, and Parameters",
    concept: "An accessor method lets other classes obtain a copy of the value stored in an instance variable; accessors are non-void methods, commonly named getSomething(), that read data without changing it. A mutator (or modifier) method changes the value of one or more instance variables and is often written as a void method, commonly named setSomething(newValue) or a similarly descriptive action name. Parameters are the mechanism both kinds of methods use to receive outside information: a mutator typically uses a parameter to know what new value to store, while an accessor may occasionally use a parameter to help format or calculate the value it returns. A single class can, and usually does, mix public accessors, public mutators, and a constructor together.",
    examples: [
      { text: "public class Thermostat\n{\n    private double targetTemp;\n    public Thermostat(double startTemp)\n    {\n        targetTemp = startTemp;\n    }\n    public double getTargetTemp()\n    {\n        return targetTemp;\n    }\n    public void setTargetTemp(double newTemp)\n    {\n        targetTemp = newTemp;\n    }\n}\n// getTargetTemp() is an accessor: non-void, returns a copy of targetTemp\n// setTargetTemp(double newTemp) is a mutator: void, changes targetTemp using its parameter" },
    ],
    commonMistake: "A common error is writing a mutator that returns a value, such as public double setTargetTemp(double newTemp), when a mutator that only updates state should typically be void; another is forgetting that an accessor must actually return a value with a return statement rather than simply printing it, since printing inside the class does not let other classes obtain and use the value themselves.",
  },
  "3.5-complex": {
    title: "Debugging Method Bodies and Pass-by-Value with Primitives",
    concept: "At this level, questions often present a method that fails to compile or does not behave as intended, and the task is to locate the precise bug. Frequent culprits include: returning an undeclared or wrong variable inside an accessor (such as returning a constructor parameter's old name instead of the matching instance variable), declaring a method void while still trying to return a value, forgetting to include a return statement in a non-void method, and redeclaring a variable inside a method body so it shadows an instance variable of the same name instead of updating it. A second major theme is return-by-value with primitive parameters: when an int, double, or boolean argument is passed into a method, the parameter holds an independent copy of that value, so any reassignment made to the parameter inside the method body never affects the variable back in the calling code, even though changes made to an instance variable through that same method call are permanent.",
    examples: [
      { text: "public class Odometer\n{\n    private int miles;\n    public Odometer(int startMiles)\n    {\n        miles = startMiles;\n    }\n    public int getMiles()\n    {\n        return startMiles;\n        // BUG: startMiles is a constructor parameter, not visible here;\n        // should return miles, the instance variable, instead\n    }\n}" },
      { text: "public class Wallet\n{\n    private double balance;\n    public Wallet(double startBalance)\n    {\n        balance = startBalance;\n    }\n    public void addFunds(double amount)\n    {\n        amount = amount + 100;\n        balance += amount;\n    }\n}\n// Wallet w = new Wallet(50.0);\n// double bonus = 20.0;\n// w.addFunds(bonus);\n// bonus is still 20.0 after the call (primitive pass-by-value),\n// but balance has permanently changed to 50.0 + 120.0 = 170.0" },
    ],
    commonMistake: "The most persistent misconception at this level is believing that reassigning a primitive parameter inside a method (like amount = amount + 100;) changes the caller's original argument; in fact only the method's local copy changes, while the instance variable the method also updates is permanently altered because it belongs to the object itself, not to the parameter.",
  },
  "3.6-basic": {
    title: "Passing Objects: Copying the Reference, Not the Object",
    concept: "When an argument passed to a method is a primitive value, such as an int, double, or boolean, the parameter receives a copy of that value, so changes made to the parameter inside the method never affect the caller's variable. When an argument is instead an object reference, such as a user-defined class or a String, the parameter receives a copy of the reference itself, not a copy of the object's data and not a brand-new object. This means the parameter and the caller's variable both refer to the exact same object in memory. If a method calls a mutator on that parameter, the change is made to the one shared object, so it is visible through every variable that refers to it, including the caller's original variable.",
    examples: [
      { text: "public class Jar\n{\n    private int cookieCount;\n\n    public Jar(int startCount)\n    {\n        cookieCount = startCount;\n    }\n\n    public void addCookie()\n    {\n        cookieCount = cookieCount + 1;\n    }\n\n    public int getCookieCount()\n    {\n        return cookieCount;\n    }\n}\npublic void fillJar(Jar j)\n{\n    j.addCookie();\n}\nJar myJar = new Jar(3);\nfillJar(myJar);\n// myJar.getCookieCount() is now 4, since j and myJar refer to the same Jar object" },
      { text: "public void resetCount(int count)\n{\n    count = 0;\n}\nint total = 5;\nresetCount(total);\n// total is still 5, since count only received a copy of the int value" },
    ],
    commonMistake: "Students often assume that passing an object into a method automatically makes an independent copy of it, just like passing a primitive does, and are then surprised when a mutator called through the parameter changes the object the caller can still see. The key distinction to remember is that only the reference is copied, not the object itself, so the parameter and the caller's variable are aliases pointing to one shared object.",
  },
  "3.6-intermediate": {
    title: "Returning Object References and Good Practice with Mutable Parameters",
    concept: "When a method's return expression evaluates to an object reference, the method returns that reference itself, not a new copy of the object. If a method returns one of its own parameters, or a value read from an instance variable that was never reassigned to a new object, the returned reference is an alias for that same original object; mutating it through the returned variable mutates the original. In contrast, a method can also construct a brand-new object with new and return a reference to that new object, in which case the result is completely independent of any object passed in as an argument. Because passing an object reference gives a method the power to mutate the caller's actual object, good practice is to avoid modifying a mutable object parameter with a mutator method unless the specification explicitly calls for it; methods that only need to read data should rely on accessor methods instead.",
    examples: [
      { text: "public class Ticket\n{\n    private int price;\n\n    public Ticket(int startPrice)\n    {\n        price = startPrice;\n    }\n\n    public int getPrice()\n    {\n        return price;\n    }\n}\npublic class BoxOffice\n{\n    public Ticket cheaperTicket(Ticket a, Ticket b)\n    {\n        if (a.getPrice() < b.getPrice())\n        {\n            return a;\n        }\n        return b;\n    }\n\n    public Ticket makeDuplicate(Ticket t)\n    {\n        Ticket copy = new Ticket(t.getPrice());\n        return copy;\n    }\n}\n// cheaperTicket returns an alias for a or b\n// makeDuplicate always returns a reference to a brand-new, independent Ticket" },
    ],
    commonMistake: "Students often assume that any value returned from a method must be a freshly created, independent copy, especially when the returned type is an object rather than a primitive. In reality, unless a method explicitly builds a new object with new, a returned object reference is usually an alias for an object that already existed, so mutating the returned reference can unexpectedly change the original object the caller still has access to.",
  },
  "3.6-complex": {
    title: "Aliasing Chains, Private Access Across Classes, and Reference Timing",
    concept: "At this level, questions require tracing multiple variables that may reference the same object through several layers of assignment, method parameters, and getters, and identifying exactly which mutations are visible from which variable. A reassignment such as bag = newBag only changes what one variable or field refers to going forward; it does not affect any other variable that already held a reference to the old object, and any reference obtained before the reassignment (such as a value already returned from a getter) still points to the original object. Private access is governed strictly by which class the code is written in, not by which object is involved: a method inside a class may freely access the private fields of any parameter of that same class type, including through a chain of accessor calls, but a method in any other class must go through public accessors, no matter how the object was obtained.",
    examples: [
      { text: "public class Wick\n{\n    private double lengthCm;\n\n    public Wick(double startLength)\n    {\n        lengthCm = startLength;\n    }\n\n    public void burn(double amount)\n    {\n        lengthCm = lengthCm - amount;\n    }\n}\npublic class Candle\n{\n    private Wick core;\n\n    public Candle(Wick startCore)\n    {\n        core = startCore;\n    }\n\n    public Wick getCore()\n    {\n        return core;\n    }\n}\nWick fuse = new Wick(10.0);\nCandle taper = new Candle(fuse);\ntaper.getCore().burn(3.0);\n// this mutates fuse itself, since getCore() returns the same reference stored in core" },
      { text: "public class Coordinate\n{\n    private int xPos;\n    private int yPos;\n\n    public Coordinate(int startX, int startY)\n    {\n        xPos = startX;\n        yPos = startY;\n    }\n\n    public Coordinate(Coordinate source)\n    {\n        xPos = source.xPos;\n        yPos = source.yPos;\n        // legal: this constructor is defined inside Coordinate\n    }\n}" },
    ],
    commonMistake: "At the complex tier, students often lose track of a reassignment that happens midway through a program, continuing to assume two variables are still aliased to the same object even after one of them (or a field inside an object) has been reassigned to point somewhere else, or after one reference was captured earlier through a getter before the reassignment occurred. Students also frequently assume that private access depends on some notion of object identity or on how an object was obtained (for example, through a chain of getter calls), rather than correctly recognizing that private access depends only on which class the accessing code is physically written in.",
  },
  "3.7-basic": {
    title: "Static: Class Variables vs. Instance Variables",
    concept: "The keyword static marks a variable or method as belonging to the class itself rather than to any one object. A class (static) variable has exactly one shared copy that every object of the class reads and writes, unlike an instance variable, which gives each object its own independent copy. A public static variable or method can be accessed from outside the class using the class name and the dot operator, such as ClassName.variableName or ClassName.methodName(), without ever creating an object. A class (static) method can access and change class variables freely, but it cannot access or change an instance variable, or call an instance method, unless it is given an object of the class as a parameter, since a static method does not run in the context of any particular object.",
    examples: [
      { text: "public class Team\n{\n    private static int teamCount = 0;\n    public Team()\n    {\n        teamCount++;\n    }\n}\nTeam t1 = new Team();\nTeam t2 = new Team();\n// teamCount is now 2, shared by every Team object" },
      { text: "public class Robot\n{\n    private int battery;\n    public static void resetAll()\n    {\n        battery = 0;\n    }\n}\n// does NOT compile - resetAll is static and cannot access the instance variable battery" },
    ],
    commonMistake: "Students often assume that a static method can reach into any object's instance variables directly, forgetting that a static method has no implicit object to work with; without a parameter supplying a specific instance, referencing an instance variable or calling an instance method from inside a static method is always a compile-time error.",
  },
  "3.7-intermediate": {
    title: "Combining Static and Instance Members in One Class",
    concept: "A realistic class often mixes class variables with instance variables, and mixes class methods with instance methods, so tracing code correctly means keeping track of which variables are shared and which belong to a single object. A common pattern is a static counter that is incremented inside the constructor: because the counter is a class variable, it keeps accumulating across every object ever created, even though each object also has its own private instance data recorded separately. When a static variable is also declared final, such as public static final int MAX_SIZE = 10;, it becomes a single shared constant that every object can read but that can never be reassigned anywhere in the program.",
    examples: [
      { text: "public class Passenger\n{\n    private static int boardedCount = 0;\n    private String name;\n    public Passenger(String n)\n    {\n        name = n;\n        boardedCount++;\n    }\n}\nPassenger p1 = new Passenger(\"Rae\");\nPassenger p2 = new Passenger(\"Sam\");\n// boardedCount is 2 after both objects are created, shared by all Passenger objects" },
    ],
    commonMistake: "Students often trace a static counter as if it resets or restarts for each new object, similar to how an instance variable's initial value is reapplied by the constructor each time; in reality, a static variable keeps whatever shared value it already had before the constructor runs, and the constructor simply adds to that same running total.",
  },
  "3.7-complex": {
    title: "Tracing Shared State and Debugging Static/Instance Errors",
    concept: "At this level, questions trace a class variable's value across several object instantiations and method calls, sometimes interleaving static method calls (like ClassName.updateSomething()) between instance method calls on different objects, so the shared value must be tracked in the exact order the code executes, not per object. Other questions present a class that fails to compile and ask you to identify or fix the violation of 3.7.A.1: look for a method declared static that references an instance variable or calls an instance method directly, and recognize that the fix is either to remove static from that method (if it genuinely needs one object's data) or to have it operate only on class variables and other class methods. Also watch for private static variables: even though they are static, being private still blocks any outside class from accessing them directly with ClassName.variableName; only public static members, or public static methods that return a static variable's value, can be reached from outside.",
    examples: [
      { text: "public class Ledger\n{\n    private String owner;\n    private static double rate = 1.0;\n    public Ledger(String o)\n    {\n        owner = o;\n    }\n    public static void setRate(double r)\n    {\n        rate = r;\n    }\n    public double apply(double amount)\n    {\n        return amount * rate;\n    }\n}\nLedger a = new Ledger(\"A\");\nLedger b = new Ledger(\"B\");\ndouble x = a.apply(10.0);\nLedger.setRate(2.0);\ndouble y = b.apply(10.0);\n// x is 10.0, then rate changes for every Ledger, so y is 20.0" },
      { text: "public class Sensor2\n{\n    private double reading;\n    private static int sensorCount = 0;\n    public static void calibrate()\n    {\n        reading = 0.0;\n    }\n}\n// does NOT compile - calibrate is static but reading is an instance variable" },
    ],
    commonMistake: "On multi-step traces, students often apply a static update, like Ledger.setRate(2.0), only to objects created after that point, when in reality every object, including ones created earlier, shares the exact same single copy of the variable and is affected immediately, since there is no such thing as a per-object snapshot of a class variable.",
  },
  "3.8-basic": {
    title: "Local Variables, Parameters, and Scope",
    concept: "A local variable is any variable declared inside the body of a constructor or method, including the parameters listed in that constructor's or method's header. Local variables only exist, and can only be used, within the block of code where they are declared: once the enclosing method, constructor, loop, or if/else block finishes running, its local variables disappear and can no longer be referenced. This is different from instance variables, which are declared in the class body outside any method and last for as long as the object exists. A key rule that trips up many students: local variables and parameters can never be given an access modifier such as public or private. Only members declared at the class level, like instance variables and methods, can be public or private; attaching either keyword to a variable declared inside a method or constructor body is always a compile-time error.",
    examples: [
      { text: "public class Timer\n{\n    private int seconds;\n    public void addTime(int extraSeconds)\n    {\n        int newTotal = seconds + extraSeconds;\n        seconds = newTotal;\n    }\n}\n// extraSeconds (a parameter) and newTotal are both local variables\n// they exist only while addTime is running" },
      { text: "public void printCode()\n{\n    private int code = 7;\n    System.out.println(code);\n}\n// does NOT compile - a local variable like code can never be declared private" },
    ],
    commonMistake: "Students often forget that a method's parameters count as local variables, mistakenly treating them as if they behaved like instance variables that persist after the method ends. Just as common is assuming that a local variable can be marked public or private for extra protection or extra access, when in fact Java simply does not allow any access modifier on a variable declared inside a method, constructor, or block body.",
  },
  "3.8-intermediate": {
    title: "Shadowing: When a Local Name Hides an Instance Variable",
    concept: "Shadowing happens when a local variable or a parameter is given the exact same name as an instance variable of the class. Inside the block where that local variable or parameter is declared, every plain use of that name refers to the local one, not the instance variable; the instance variable still exists, but it becomes temporarily unreachable by that name for the rest of the block. This is a legal thing to do in Java, so it never causes a compile error, but it is a very common source of bugs: a method that looks like it is updating an object's data may actually only be updating a local copy that disappears the moment the method returns, leaving the instance variable completely unchanged. Recognizing shadowing means checking, for every use of a variable name inside a method, whether a local variable or parameter with that same name has been declared anywhere in an enclosing block; if so, that is the variable actually being used.",
    examples: [
      { text: "public class Kettle\n{\n    private double waterTemp;\n    public Kettle(double startTemp)\n    {\n        waterTemp = startTemp;\n    }\n    public void heat(double waterTemp)\n    {\n        waterTemp = waterTemp + 10.0;\n    }\n}\nKettle k = new Kettle(70.0);\nk.heat(5.0);\n// the instance variable waterTemp is still 70.0\n// heat's parameter waterTemp shadowed it and was discarded when heat() returned" },
    ],
    commonMistake: "Students frequently assume that because a method reassigns a variable with the same name as an instance variable, the instance variable itself must have changed. When a parameter or a locally declared variable shares that exact name, the assignment only affects the local copy for the rest of that method, and the instance variable is left completely untouched, which is easy to miss when tracing code by eye instead of carefully checking where each name was declared.",
  },
  "3.8-complex": {
    title: "Tracing Multi-Layer Shadowing and Scope Boundaries",
    concept: "At this level, a single method can contain more than one layer of shadowing at once: a parameter might shadow one instance variable for the entire method, while a for loop's control variable shadows a different instance variable, but only for the duration of the loop. Once the loop finishes, its loop variable goes out of scope, so any code after the loop that uses that same name reverts to referring to the instance variable again. Tracing this kind of code carefully, statement by statement, and tracking which declaration is currently \"in charge\" of a name at each point in the method, is essential. This same idea explains classic \"why doesn't this work as intended\" bugs: a method meant to update an object's data instead declares a brand-new local variable with the same name inside its body, so the calculation happens correctly but the result is thrown away when the method ends, leaving the instance variable at its original or default value. The fix in such cases is to remove the local declaration entirely so the name refers to the existing instance variable, or, in classes that use the this keyword, to explicitly qualify the instance variable so it cannot be confused with the local one.",
    examples: [
      { text: "public class ComputeBox\n{\n    private int limit;\n    private int val;\n    public ComputeBox()\n    {\n        limit = 5;\n        val = 8;\n    }\n    public int total(int limit)\n    {\n        int sum = 0;\n        for (int val = 0; val < limit; val++)\n        {\n            sum += val;\n        }\n        sum += val;\n        return sum;\n    }\n}\nComputeBox c = new ComputeBox();\nSystem.out.println(c.total(3));\n// the parameter limit shadows the instance variable limit for the whole method\n// the loop's val shadows the instance variable val only inside the loop, summing 0+1+2=3\n// once the loop ends, val refers back to the instance variable (8), so the result is 3+8=11" },
    ],
    commonMistake: "The most common error at this level is forgetting that a loop variable's shadowing effect ends the moment the loop finishes, so students often continue using the loop's final counter value in code that runs after the loop, when Java actually reverts to whichever instance variable that name belonged to before the loop began. A closely related mistake is assuming that any method which appears to reassign an object's data must have succeeded, without checking whether that method secretly declared its own local variable with the same name, silently shadowing the instance variable and discarding the computed result instead of storing it.",
  },
  "3.9-basic": {
    title: "The this Keyword and Fixing Shadowed Parameters",
    concept: "Within an instance method or constructor, the keyword this is a special variable that always refers to the current object, meaning the specific object whose method or constructor is running. This becomes especially useful when a constructor or method parameter is given the exact same name as an instance variable, which is common practice and often makes code more readable. When that happens, the parameter name alone refers only to the parameter inside that block, so a plain assignment like field = field; is a self-assignment that never touches the instance variable, leaving it at its default value. Writing this.field = field; fixes the problem by explicitly telling Java that the left side refers to the current object's instance variable, while the right side, without this, still refers to the parameter. Class (static) methods do not have a this reference at all, since they are not called on any particular object.",
    examples: [
      { text: "public class Wallet\n{\n    private double balance;\n    public Wallet(double balance)\n    {\n        this.balance = balance;\n    }\n}\nWallet w = new Wallet(50.0);\n// this.balance = balance; sets the instance variable to 50.0" },
      { text: "public class Badge\n{\n    private String code;\n    public Badge(String code)\n    {\n        code = code;\n    }\n}\nBadge b = new Badge(\"A1\");\n// code = code; is a self-assignment on the parameter only\n// the instance variable code stays null" },
    ],
    commonMistake: "Students often write field = field; when a parameter shares a name with an instance variable, not realizing that both sides of that statement refer to the parameter, so the instance variable silently keeps its default value (0, 0.0, false, or null). They also sometimes reverse the fix, writing field = this.field;, which backwards-assigns the instance variable's old value into the parameter instead of storing the parameter's value into the instance variable.",
  },
  "3.9-intermediate": {
    title: "Comparing the Current Object to Another Object of the Same Type",
    concept: "A very common use of this is inside a method that takes a parameter of the same class type, so the method can compare the current object to another object of that same type. Inside such a method, this refers to the object the method was called on, while the parameter name refers to the other object that was passed in. Because instance variables are usually private, the method typically must use accessor methods, such as this.getScore() and other.getScore(), or may access a field directly, such as this.value and other.value, since code inside a class can access the private fields of any object of that class, not just the one the method was called on. The keyword this can also be passed as an argument into another method or constructor, which hands a reference to the current object over to that other code so it can store or use that same object.",
    examples: [
      { text: "public class Vault\n{\n    private int amount;\n    public Vault(int amount)\n    {\n        this.amount = amount;\n    }\n    public int getAmount()\n    {\n        return amount;\n    }\n    public boolean hasMoreThan(Vault other)\n    {\n        return this.amount > other.getAmount();\n    }\n}\nVault v1 = new Vault(200);\nVault v2 = new Vault(150);\nv1.hasMoreThan(v2); // true, since this refers to v1 and other refers to v2" },
      { text: "public class Contestant\n{\n    public void enter(Tournament t)\n    {\n        t.addContestant(this);\n    }\n}\n// passes a reference to the current Contestant into addContestant" },
    ],
    commonMistake: "Students frequently mix up which object this represents and which object the parameter represents, especially when the method is called in reverse order, such as v2.hasMoreThan(v1) instead of v1.hasMoreThan(v2); swapping the calling object and the argument swaps the roles of this and other and can change the result. Some students also assume this.field cannot be compared to other.getField() because one is a field and the other is a method call, when in fact both simply evaluate to values that can be compared normally.",
  },
  "3.9-complex": {
    title: "Reference Identity (this == other) versus Value Equality, and Passing this as an Argument",
    concept: "When a method contains the expression this == other, it is testing reference identity, meaning it checks whether this and the parameter other point to the exact same object in memory, not whether the two objects merely have equal-looking fields. Two separately constructed objects can have identical field values yet still be different objects, so this == other would be false for them, while an expression like this.field == other.getField() compares the actual data and would be true. If a variable is assigned another existing object, such as Cart c3 = c1;, then c3 and c1 refer to the identical object, so this == other is true for any method call comparing them, and any change made through one variable is visible through the other. The keyword this can also be threaded through several method or constructor calls, such as one object registering itself with another object by passing this as an argument, which creates a live link between the two objects rather than a copy.",
    examples: [
      { text: "public class Parcel\n{\n    private int weight;\n    public Parcel(int weight)\n    {\n        this.weight = weight;\n    }\n    public int getWeight()\n    {\n        return weight;\n    }\n    public boolean sameObject(Parcel other)\n    {\n        return this == other;\n    }\n}\nParcel p1 = new Parcel(10);\nParcel p2 = new Parcel(10);\nParcel p3 = p1;\np1.sameObject(p2); // false, different objects with equal weight\np1.sameObject(p3); // true, p3 refers to the same object as p1" },
      { text: "public class Note\n{\n    public void attachTo(Board b)\n    {\n        b.pin(this);\n    }\n}\n// b's pinned field becomes an alias for the current Note object,\n// so later changes to the Note are visible through b as well" },
    ],
    commonMistake: "The most common error is assuming that this == other checks whether two objects have equal field values, when it actually checks whether they are literally the same object in memory; two distinct objects built with identical constructor arguments will still make this == other evaluate to false. Students also sometimes forget that when this is passed into another method or constructor and stored there, that stored reference becomes an alias for the original object, so a later change made through the original variable will unexpectedly also show up through the stored reference.",
  },
  "4.1-basic": {
    title: "Privacy, Bias, and Data Quality: The Basics",
    concept: "Whenever a program collects or exposes personal data, programmers have a responsibility to safeguard user privacy, which includes making sure users are genuinely informed about how their data will be used. A common privacy risk in class design comes from declaring an instance variable public: if that public field is later used as an argument to a method that returns other, private information, outside code can supply the known public value to that method and extract data that was never meant to be accessible. Separately, when a program relies on a data set to draw conclusions, the method used to collect that data matters. A self-selected or voluntary sample, such as an online poll that only interested visitors choose to complete, can introduce algorithmic or sampling bias by overrepresenting certain kinds of respondents. A data set can also be incomplete or contain inaccurate values, which causes a program using that data to work incorrectly. Finally, a data set collected for one purpose often cannot answer a completely different question, since it may simply not contain the information needed.",
    examples: [
      { text: "public class MembershipCard\n{\n    public String memberID;\n    private String homeAddress;\n    public String lookupAddress(String id)\n    {\n        if (id.equals(memberID))\n        {\n            return homeAddress;\n        }\n        return \"No match\";\n    }\n}\n// memberID is public, so outside code can read it and pass it to lookupAddress to get the private homeAddress" },
      { text: "An app posts a poll only on its own social media page and counts only the replies that come in. Because only people who already follow the account and choose to respond are included, the results may not represent the wider population at all." },
    ],
    commonMistake: "Students at this level often think that as long as the sensitive data itself (like homeAddress or salary) is declared private, the class is automatically safe, missing that a public field used as a lookup key can still expose that private data through an accessor method. On the data-collection side, students commonly assume that any data set with a large number of entries must be trustworthy and representative, without considering how the data was actually collected or whether some records are missing or wrong.",
  },
  "4.1-intermediate": {
    title: "Comparing Designs and Weighing Data-Quality Tradeoffs",
    concept: "At this level, students must go beyond spotting an isolated risk and instead weigh two or more candidate explanations against each other. This might mean comparing two class designs to determine which one poses the greater privacy risk (for example, one version of a class declares a lookup key private while another leaves it public), or comparing two data-collection methods to decide which is more likely to produce a representative sample (for example, a random selection from an entire population versus a voluntary, self-selected sample). It can also mean examining a data set that contains a plausible-but-wrong explanation alongside the real issue, such as assuming a large total sample size guarantees reliable results when the true problem is how participants were recruited, or assuming a data set that answers one question can automatically answer a related but distinct question, such as using trip data to determine riders' income.",
    examples: [
      { text: "Design A: public String voterIDNumber; (used as a lookup key in a method that returns private data)\nDesign B: private String voterIDNumber; (used the same way)\n// Design A poses the greater privacy risk, since its lookup key can be read directly from outside the class" },
      { text: "Method 1: randomly select 200 students from the full enrollment list and require them to respond.\nMethod 2: let any student who wants to fill out a survey do so voluntarily.\n// Method 1 produces a more representative sample because it avoids the self-selection bias present in Method 2" },
    ],
    commonMistake: "A frequent error is treating a large sample size as proof that a data-collection method is unbiased, when in fact bias comes from how participants were selected, not simply how many responded. Students also sometimes assume that if a data set contains any related field, it must be able to answer any related question, rather than checking carefully whether the specific information needed is actually present in the data set.",
  },
  "4.1-complex": {
    title: "Evaluating Multiple Claims About Privacy, Bias, and Data Quality at Once",
    concept: "The most demanding items describe an elaborate program, class design, or data-collection process and then present a battery of Roman-numeral statements (I, II, III, IV) that must each be judged true or false, often combining more than one essential-knowledge point in a single scenario, such as a data set that is both biased in how it was collected and incomplete in what it recorded. Success requires carefully checking each statement independently against the scenario rather than assuming they all follow the same pattern: some statements will correctly describe a real privacy, bias, or data-quality issue, while at least one will typically be a tempting but false claim, such as asserting that good intentions eliminate the possibility of bias, that a large data set is immune to error, or that combining two data sets by a shared key is enough to prove one variable caused a change in another.",
    examples: [
      { text: "I. A public lookup key lets outside code retrieve private data through an accessor method. (true)\nII. Declaring the sensitive fields private fully protects them no matter what else is public. (false \u2014 the public key still exposes them)\nIII. Making the lookup key private removes this risk for code that does not already know the key. (true)" },
      { text: "I. Recruiting participants only from an existing social-media following introduces sampling bias. (true)\nII. Because a university is running the study, bias and privacy concerns do not apply. (false \u2014 affiliation does not exempt a study from these concerns)" },
    ],
    commonMistake: "Students often fall for at least one statement in the battery that sounds authoritative or reassuring, such as claiming a large sample size, a respected institution, or good intentions automatically rules out bias or privacy risk, when none of those factors actually eliminates the underlying issue. Students also sometimes mark an entire battery true or false based on a general impression of the scenario rather than testing each Roman-numeral statement individually against the specific details given.",
  },
  "4.2-basic": {
    title: "What Is a Data Set?",
    concept: "A data set is simply a collection of specific pieces of information, usually organized by category into columns or fields, such as a list of products each with a name and a price. Data sets exist so that a question can be answered: to get useful information out of one, its values are accessed one at a time and processed in whatever way the question requires, such as counting, adding, or comparing. Before writing any code, it often helps to sketch the data set as a small chart or table with one row per item and one column per piece of information, since seeing the data laid out this way makes it much easier to plan how an algorithm will need to move through it. At the basic level, data sets are small, with only two to four columns, and the key skill is recognizing exactly which columns exist and matching that to what can realistically be figured out from them.",
    examples: [
      { text: "A pet adoption center keeps a data set with the columns petName, species, and daysInShelter for each animal available for adoption. From this alone, the center can determine which animal has been waiting the longest, but not the animal's medical history." },
      { text: "A parking garage keeps a data set with the columns spotNumber and isOccupied for each spot. From this, the number of currently open spots can be counted, but the identity of the driver in any occupied spot cannot." },
    ],
    commonMistake: "The most common basic-level mistake is assuming that any question asked about a topic can be answered as long as the data set is generally related to that topic, without actually checking whether the specific column needed is one of the ones listed. Students also sometimes confuse a single data value, like one score or one date, with an entire data set, forgetting that a data set refers to the whole collection of such values gathered together.",
  },
  "4.2-intermediate": {
    title: "Determining What Is (and Isn't) Answerable From a Data Set",
    concept: "As data sets grow richer, with four to six columns and sometimes a small sample table showing a few actual rows, the central skill becomes carefully separating what those columns can support from what merely sounds related to the topic. A conclusion is determinable only if it can be computed directly from the columns that are actually listed; if it requires a piece of information, such as a total population, a rating scale, or a demographic detail, that was never included, it cannot be determined no matter how reasonable the question sounds. This level also introduces combining two data sets: when one data set alone is missing a needed column, a second data set that shares a common identifier, such as a customerID or playerID, can be joined to it so that the two together supply everything the question requires.",
    examples: [
      { text: "A ride-share company's data set has columns driverID, tripDate, tripDistance, and fare for each completed trip. The company can determine each driver's total monthly earnings, but not each driver's customer satisfaction rating, since no rating column exists." },
      { text: "Data set 1 lists customerID and membershipTier; Data set 2 lists customerID, purchaseDate, and purchaseAmount. Combining the two by customerID lets an analyst compare average purchase amounts across membership tiers, something neither data set could show alone." },
    ],
    commonMistake: "Students at this level often assume a conclusion is determinable simply because it feels like the kind of thing the data set 'should' be able to show, rather than checking column by column whether the needed information is actually present. When combining two data sets, a related mistake is picking a pair that both sound relevant to the topic but do not actually share a common field to join on, or that together still leave out the one column the question truly depends on.",
  },
  "4.2-complex": {
    title: "Multi-Data-Set Reasoning and Roman-Numeral Determinability",
    concept: "At the complex level, scenarios typically involve three or more described data sets, or a Roman-numeral battery of several claims (I, II, III, IV) about what can or cannot be concluded from one elaborate data set. Success here depends on tracking, with precision, exactly which columns belong to which data set, since a claim that would be true if two columns happened to live in the same place is false if those columns are actually split across two data sets with no way to connect them. When three or more data sets are involved, one of them is often a 'linking' data set whose sole job is to map one identifier to another, such as mapping a trailID to a parkID; without that linking data set, two otherwise relevant data sets cannot actually be joined together, even though both mention the topic in question.",
    examples: [
      { text: "Given claims I-IV about a delivery-service data set with columns driverID, deliveryDate, deliveryTime, and customerZipCode, a battery might correctly conclude that average delivery time by zip code is determinable, while the driver's years of experience is not, since no such column exists in this particular data set." },
      { text: "Data set 1 has schoolID and averageTestScore; Data set 2 has classroomID and schoolID; Data set 3 has classroomID and teacherYearsExperience. Determining whether more experienced teachers' schools have higher average test scores requires all three data sets, since Data set 2 is the only link connecting classrooms (and their teachers) to schools." },
    ],
    commonMistake: "The most common complex-level mistake is checking only whether two data sets sound topically related, without verifying that they actually share a common identifier column that allows them to be joined. A closely related mistake is stopping at two data sets when a third, purely as a linking table connecting two identifiers, is required to bridge the gap between them, leading students to incorrectly conclude a question is unanswerable or to pick an incomplete combination.",
  },
  "4.3-basic": {
    title: "Creating Arrays and Default Values",
    concept: "An array is a single object that stores multiple values, all of the same declared type, whether that type is a primitive like int or double or a reference type like String or a user-defined class. An array can be created with the keyword new by specifying its element type and size in square brackets, in which case every element is automatically set to a default value: 0 for int, 0.0 for double, false for boolean, and null for any reference type. An array can also be created and filled at the same time using an initializer list, a comma-separated set of values inside curly braces, in which case the array's length is determined by how many values appear in the list. Either way, the array's length is fixed the moment it is created and can be read at any time through its length attribute.",
    examples: [
      { text: "int[] laps = new int[4];\n// laps is created with new, so every element defaults to 0\n// laps currently holds {0, 0, 0, 0}" },
      { text: "String[] colors = {\"red\", \"green\", \"blue\"};\n// colors is created with an initializer list\n// colors.length is 3, since three values were listed" },
    ],
    commonMistake: "Students often assume that an array element created with new but never explicitly assigned is left undefined or contains garbage, when Java always assigns a predictable default value based on the element's type. A related mistake is assuming a String array element defaults to an empty string \"\" rather than the reference value null, or assuming a numeric array's unset elements are some placeholder like -1 instead of 0 or 0.0.",
  },
  "4.3-intermediate": {
    title: "Indexing, the length Attribute, and Compound Assignment",
    concept: "Square brackets are used to both read and modify a single element of an array by its index, and the valid index values for any array run from 0 through one less than the array's length, inclusive. Because the last valid index is always one less than the length, expressions like arrayName.length - 1 are the standard way to reference the final element regardless of the array's size. Elements can be reassigned directly, such as arrayName[i] = value;, or updated relative to their current value using a compound assignment operator, such as arrayName[i] += value;, arrayName[i] -= value;, or arrayName[i] *= value;, each of which first reads the element's current value before applying the operation and storing the result back at that same index.",
    examples: [
      { text: "int[] steps = {2000, 5400, 3100};\nint last = steps[steps.length - 1];\n// last is 3100, the value at the final valid index, steps.length - 1" },
      { text: "int[] steps = {2000, 5400, 3100};\nsteps[1] += 500;\n// steps[1] is read as 5400, then 500 is added\n// steps now holds {2000, 5900, 3100}" },
    ],
    commonMistake: "Students frequently write arrayName[arrayName.length] when they intend to access the last element, forgetting to subtract 1, which produces an ArrayIndexOutOfBoundsException since arrayName.length is always one past the last valid index. Another common error is misreading a compound assignment like arrayName[i] *= 2 as replacing the element with the literal value 2, rather than correctly multiplying the element's existing value by 2 and storing the result back in the same slot.",
  },
  "4.3-complex": {
    title: "ArrayIndexOutOfBoundsException, Reference Semantics, and Declaration Pitfalls",
    concept: "Using an index value outside the valid range of 0 through length - 1, whether the index is too large, too small, or negative, causes a runtime ArrayIndexOutOfBoundsException rather than a compile-time error, so this kind of bug often surfaces only when a program actually executes the offending line, such as inside an off-by-one calculation or a hard-coded index that no longer matches an array's true size. Because an array is an object, passing it as a parameter to a method passes a reference to that same array, so any element a method changes through arrayName[index] = value or a compound assignment is visible to the caller after the method returns, and assigning one array variable to another, such as arr2 = arr1;, makes both variables refer to the identical array rather than creating an independent copy. Declaration and initializer-list syntax also has subtle rules: a bare {...} list can only appear as part of a declaration statement or alongside new type[]{...}, never combined with an explicit size like new type[4]{...}, and the values inside the braces must be assignment-compatible with the declared element type.",
    examples: [
      { text: "public static void resetElement(int[] data, int index)\n{\n    data[index] = 0;\n}\nint[] scores = {12, 45, 30};\nresetElement(scores, 1);\n// scores is a reference type, so the method modifies the caller's array directly\n// scores now holds {12, 0, 30}" },
      { text: "int[] scores = {12, 45, 30};\nint value = scores[3];\n// scores.length is 3, so valid indices are only 0 through 2\n// index 3 is out of range, so this line throws an ArrayIndexOutOfBoundsException" },
    ],
    commonMistake: "Students often assume arrays are passed to methods by value, like a primitive int or double, and expect changes made to an array parameter inside a method to disappear once the method returns, when in fact the method operates on the same array object the caller has, so the change persists. Students also frequently misjudge which array declarations compile, especially assuming that specifying both a size and an initializer list, such as new int[4]{1, 2, 3, 4}, is legal, when Java requires the size to be omitted whenever an initializer list is provided alongside new.",
  },
  "4.4-basic": {
    title: "Traversing an Array with Indexed and Enhanced For Loops",
    concept: "Traversing an array means using a repetition statement to access all, or an ordered sequence of, its elements. An indexed for loop or a while loop traverses by using an explicit index variable, typically starting at 0 and stopping once the index reaches the array's length, so that every valid index from 0 through arr.length - 1 is visited exactly once. An enhanced for loop traverses the same elements but hides the index entirely: its header declares an enhanced for loop variable that is assigned a copy of each element, in order, on every iteration, without ever exposing which index that element came from.",
    examples: [
      { text: "int[] scoreList = {70, 82, 91, 65};\nfor (int i = 0; i < scoreList.length; i++)\n{\n    System.out.println(scoreList[i]);\n}\n// prints 70, 82, 91, then 65, using the index i to access each element" },
      { text: "int[] scoreList = {70, 82, 91, 65};\nfor (int score : scoreList)\n{\n    System.out.println(score);\n}\n// prints 70, 82, 91, then 65, without ever using an index" },
    ],
    commonMistake: "Students often write the indexed for loop's condition using <= instead of <, which attempts to access an invalid index one past the end of the array and throws an ArrayIndexOutOfBoundsException. Students also sometimes assume an enhanced for loop gives access to the current index, when in fact its variable only ever holds a copy of the element's value.",
  },
  "4.4-intermediate": {
    title: "The Enhanced For Loop Variable Is Only a Copy",
    concept: "The enhanced for loop variable is assigned a copy of each array element for that iteration, not a direct reference back into the array. This means that reassigning the enhanced for loop variable, such as writing val = val + 1, only changes that temporary local copy; it never changes the value actually stored in the array. To genuinely modify the array's contents, code must assign directly to an indexed element, such as arr[i] = arr[i] + 1, which requires an indexed for loop or a while loop instead of an enhanced for loop. A traversal can also cover only part of an array by choosing a starting or stopping bound other than 0 or arr.length, such as beginning at arr.length / 2 to process only the second half.",
    examples: [
      { text: "int[] speeds = {30, 45, 60};\nfor (int s : speeds)\n{\n    s = s + 10;\n}\n// speeds is still {30, 45, 60}; s was only a local copy\nfor (int i = 0; i < speeds.length; i++)\n{\n    speeds[i] = speeds[i] + 10;\n}\n// speeds is now {40, 55, 70}; assigning speeds[i] modifies the array" },
      { text: "int[] readings = {5, 10, 15, 20};\nfor (int i = readings.length / 2; i < readings.length; i++)\n{\n    readings[i] = 0;\n}\n// only indices 2 and 3 are visited, so readings becomes {5, 10, 0, 0}" },
    ],
    commonMistake: "Students very often assume that reassigning the enhanced for loop variable inside the loop body changes the corresponding element in the array, when in fact the array is left completely unmodified because the loop variable is only a local copy of that element's value, never a live link back into the array itself.",
  },
  "4.4-complex": {
    title: "Traversal Bugs, Object-Reference Arrays, and Loop Equivalence",
    concept: "At this level, traversal questions ask you to find and fix subtle bugs: an off-by-one bound such as i <= arr.length causes an ArrayIndexOutOfBoundsException, a missing index update inside a while loop causes an infinite loop, and starting an index at the wrong value can cause a negative or otherwise invalid index reference on the very first iteration. When an array stores object references, calling a mutator method on the enhanced for loop variable, such as obj.setValue(5), does change the object's state, since the loop variable still refers to the very same object stored in the array; but reassigning the loop variable itself to a brand-new object, such as obj = new SomeClass(), never changes which object reference the array holds. Finally, an enhanced for loop can only be rewritten as an indexed for loop, or vice versa, when the traversal does not need to reference a different index, such as the previous or next element; if it does, an explicit index is required and the enhanced for loop cannot be used at all.",
    examples: [
      { text: "public class Account\n{\n    private double balance;\n    public Account(double startBalance)\n    {\n        balance = startBalance;\n    }\n    public void deposit(double amount)\n    {\n        balance = balance + amount;\n    }\n}\nAccount[] accounts = {new Account(100.0), new Account(200.0)};\nfor (Account a : accounts)\n{\n    a.deposit(50.0);\n    // changes the actual Account object's balance, since a refers to the same object in accounts\n    a = new Account(0.0);\n    // only reassigns the local copy a; accounts is unaffected by this line\n}" },
      { text: "int[] counts = {1, 2, 3};\nint i = 0;\nwhile (i < counts.length)\n{\n    counts[i] = counts[i] * 2;\n    // missing i++ here causes an infinite loop, since i never advances\n}" },
    ],
    commonMistake: "The most common error at this level is conflating a mutator call on an enhanced for loop variable with a reassignment of that variable: students correctly recognize that obj.setValue(5) changes the object stored in the array, but then incorrectly assume that obj = new SomeClass(...) also changes the array, when reassignment only redirects the local copy of the reference and never touches the array itself.",
  },
  "4.5-basic": {
    title: "Standard Array Traversal Algorithms: Min/Max, Sum/Average, and Property Checks",
    concept: "Many array problems boil down to a small set of standard traversal algorithms rather than one-off logic. To find a maximum or minimum, a variable is initialized to the first element and then updated only when a later element beats it in comparison. To compute a sum, an accumulator variable starts at 0 and adds in every element as the loop runs; dividing that sum by the array's length gives the average, though care must be taken with integer division. To determine whether at least one element has a property, a boolean variable starts false and is set to true, and never reset back, whenever a qualifying element is found, or the method can return true immediately upon finding one. To determine whether all elements share a property, the opposite pattern is used: return false immediately when an element fails the test, and only return true after the entire array has been checked without failure. Counting how many elements satisfy a property uses an int counter that starts at 0 and is incremented, never overwritten, each time the condition is met.",
    examples: [
      { text: "public static int findMax(int[] values)\n{\n    int max = values[0];\n    for (int i = 1; i < values.length; i++)\n    {\n        if (values[i] > max)\n        {\n            max = values[i];\n        }\n    }\n    return max;\n}" },
      { text: "public static boolean anyNegative(int[] values)\n{\n    boolean found = false;\n    for (int i = 0; i < values.length; i++)\n    {\n        if (values[i] < 0)\n        {\n            found = true;\n        }\n    }\n    return found;\n}" },
    ],
    commonMistake: "Students frequently initialize a maximum-finding variable to 0 instead of the array's first element, which fails whenever every value in the array happens to be negative, and similarly forget that a running sum divided by an int length using int division truncates any decimal portion of an average. Another very common error is treating a boolean flag like an ordinary variable that gets reassigned every iteration, for example writing found = (values[i] < 0); instead of found = found || (values[i] < 0);, which erases progress from earlier iterations and leaves the flag reflecting only the most recently checked element.",
  },
  "4.5-intermediate": {
    title: "Debugging Standard Algorithms and Comparing Candidate Implementations",
    concept: "At this level, questions often present an almost-correct implementation of a standard algorithm, such as finding a minimum, counting matches, checking for duplicates, or shifting elements, and ask you to identify the exact line that causes incorrect behavior. Typical bugs include comparing a value to the wrong variable, such as comparing an array value to an index instead of to another array value, using the wrong comparison operator, < instead of >, or vice versa, failing to initialize an accumulator or boolean flag correctly, or overwriting a boolean or counter variable instead of accumulating into it across the whole traversal. Another recurring theme is comparing two or three candidate implementations of the same algorithm side by side, where the differences may affect correctness, one version throws an exception or returns the wrong value, rather than affecting efficiency.",
    examples: [
      { text: "public static int countMatches(int[] data, int target)\n{\n    int count = 0;\n    for (int i = 0; i < data.length; i++)\n    {\n        if (data[i] == target)\n        {\n            count = 1;\n        }\n    }\n    return count;\n}\n// BUG: count = 1; should be count++;\n// overwriting count discards every match except the fact that at least one occurred" },
    ],
    commonMistake: "The single most common bug at this level is overwriting an accumulator or boolean flag instead of accumulating into it, such as writing count = 1; instead of count++;, or result = (condition); instead of result = result || (condition);. This kind of bug is easy to miss during a quick read because the code compiles and often produces a plausible-looking value, but it silently discards information from every iteration except the most recent one that met the condition.",
  },
  "4.5-complex": {
    title: "Evaluating Multi-Candidate Algorithm Implementations for Correctness and Efficiency",
    concept: "The most challenging array-algorithm questions ask you to evaluate several candidate implementations at once, sometimes labeled I through V, and determine which ones are correct, which throw an exception, and which merely differ in efficiency. A common pattern involves an off-by-one loop bound: an implementation that accesses index i + 1 must stop its loop one element early, using length - 1, to avoid an ArrayIndexOutOfBoundsException, while an implementation that accesses index i - 1 must start its loop one element later, or otherwise avoid index -1 entirely. Another common pattern compares a correct-but-slower implementation, such as one using a nested loop to recompute a running sum from scratch on every outer iteration, against a correct-and-faster implementation that accumulates a single running total as it goes; both may be correct, but only one is efficient. A third pattern asks you to reason about termination: a while loop whose index variable is never updated inside the loop body can run forever under certain data conditions, even though it looks like ordinary traversal code.",
    examples: [
      { text: "for (int i = 0; i < prices.length; i++)\n{\n    totals[i] = totals[i - 1] + prices[i];\n}\n// BUG: when i is 0, totals[i - 1] accesses index -1\n\nint runningTotal = 0;\nfor (int i = 0; i < prices.length; i++)\n{\n    runningTotal = runningTotal + prices[i];\n    totals[i] = runningTotal;\n}\n// correct and efficient: a single accumulator avoids both\n// the negative index and any repeated inner summation" },
    ],
    commonMistake: "Students often assume that if two implementations of the same algorithm both compile and both look reasonable, they must both be correct, without carefully tracing the loop bounds against every array access inside the loop body. In reality, a single off-by-one error in either the loop's starting value, its ending condition, or an index expression like i + 1 or i - 1 can cause an ArrayIndexOutOfBoundsException on just one specific iteration, often the very first or very last, even though every other iteration would have worked perfectly fine.",
  },
  "4.6-basic": {
    title: "Connecting to a Text File with File and Scanner",
    concept: "A file is storage for data that persists even when a program is not running, which makes it useful for saving information between separate runs of a program. To read from a text file in Java, a program first creates a File object using the constructor File(String str), where str is the pathname of the file, and then connects a Scanner to that File using the constructor Scanner(File f). Both File and IOException belong to the java.io package and must be imported, while Scanner belongs to java.util and must be imported separately. Because opening a file can fail, any method that constructs a Scanner from a File must indicate what to do if the file cannot be opened, most simply by adding throws IOException to the method header. Once connected, a Scanner provides methods such as nextInt(), nextDouble(), nextBoolean(), next(), and nextLine() to read data out of the file one token or one line at a time, and hasNext() to check whether any more data remains.",
    examples: [
      { text: "import java.io.File;\nimport java.io.IOException;\nimport java.util.Scanner;\npublic void readFirstValue() throws IOException\n{\n    File dataFile = new File(\"data.txt\");\n    Scanner input = new Scanner(dataFile);\n    int first = input.nextInt();\n    input.close();\n}" },
    ],
    commonMistake: "Students often forget that File and IOException require an import from java.io while Scanner requires a separate import from java.util, or they forget to add throws IOException to a method header that constructs a Scanner from a File, both of which cause compile errors. Students also sometimes confuse next(), which reads a single whitespace-separated token, with nextLine(), which reads an entire line at once, and are surprised when one returns much less text than the other.",
  },
  "4.6-intermediate": {
    title: "Reading an Entire File with while (hasNext())",
    concept: "When a program does not know in advance how many tokens a file contains, the standard pattern is a while loop with hasNext() as its condition, since hasNext() returns true as long as another token remains and false once the file is exhausted. Inside the loop, each call to a reading method such as nextInt() or nextDouble() consumes exactly one token from the file, so it is essential to read each value exactly once per iteration, typically by storing it in a temporary variable before testing or using it. A very common bug is calling a reading method twice within the same iteration, for example once inside an if condition to test a value and again inside the block to use it; this consumes two separate tokens per qualifying iteration instead of one, causing values to be skipped or the wrong value to be processed. Another common pattern to trace carefully is a loop that reassigns a variable every iteration without accumulating, which leaves that variable holding only the last value read from the file rather than a sum, count, or first value.",
    examples: [
      { text: "File tempFile = new File(\"readings.txt\");\nScanner input = new Scanner(tempFile);\nint total = 0;\nwhile (input.hasNext())\n{\n    int value = input.nextInt();\n    total = total + value;\n}\ninput.close();\n// value is read once per iteration and safely reused for the sum" },
    ],
    commonMistake: "Students frequently write code that calls a Scanner method like nextInt() or nextDouble() twice inside the same loop iteration, such as once in an if condition and again inside the block, not realizing that each call consumes a new, separate token from the file rather than rereading the same value. This causes the loop to silently skip values or add in the wrong value, producing an incorrect final result even though the code compiles and runs without throwing any exception.",
  },
  "4.6-complex": {
    title: "Debugging and Verifying Multi-Step File-Reading Algorithms",
    concept: "At this level, file-reading problems combine several ideas at once: import statements for File and IOException from java.io and for Scanner from java.util, a throws IOException declaration to satisfy the checked exception thrown by Scanner(File), a while (hasNext()) loop that correctly reads one token per iteration, and a call to close() once reading is finished. Tracing these programs requires carefully following nested if/else-if logic, multiple accumulator variables, or String methods such as indexOf, charAt, length, and compareTo applied to tokens read from the file. When comparing several candidate implementations that are each meant to accomplish the same task, look specifically for whether a reading method is called the correct number of times per iteration, whether a loop bound or condition is off by one (which can throw a NoSuchElementException by trying to read past the end of the file), and whether a variable is initialized before the loop when the algorithm depends on an initial value, such as tracking a running maximum or minimum.",
    examples: [
      { text: "File bidFile = new File(\"bids.txt\");\nScanner input = new Scanner(bidFile);\nint maxBid = input.nextInt();\nwhile (input.hasNext())\n{\n    int bid = input.nextInt();\n    if (bid > maxBid)\n    {\n        maxBid = bid;\n    }\n}\ninput.close();\n// maxBid is initialized from the first value, then compared exactly once per remaining value" },
    ],
    commonMistake: "Students often assume that any code segment which compiles and runs to completion without throwing an exception must be producing the correct result, overlooking subtler logic bugs such as a loop condition that is off by one token, a value that is read and discarded an extra time inside the loop body, or an accumulator that is initialized incorrectly. Another frequent error is confusing whether omitting close() causes a compile-time error (it does not) with whether omitting throws IOException causes one (it does), when in fact only the unhandled checked exception from Scanner(File) prevents compilation, while forgetting to close a file is purely a resource-management concern.",
  },
  "4.7-basic": {
    title: "Wrapper Classes: Integer, Double, and Converting Strings",
    concept: "The Integer class and Double class, both part of java.lang, are wrapper classes that let a primitive int or double value be stored and treated as an object. An Integer object or a Double object is immutable: once it is created, its stored value cannot change. Autoboxing is the automatic conversion Java performs from a primitive value to its wrapper type, which happens when a primitive is assigned to a wrapper-typed variable or passed to a parameter expecting the wrapper type. The static method Integer.parseInt(String s) converts a String holding a whole number into an int, and the static method Double.parseDouble(String s) converts a String holding a decimal number into a double; both are essential whenever numeric-looking data arrives as a String, such as from user input.",
    examples: [
      { text: "String input = \"42\";\nint count = Integer.parseInt(input);\n// count now holds the int value 42\nInteger boxedCount = count;\n// autoboxing: count is automatically wrapped into an Integer object" },
      { text: "String priceText = \"3.99\";\ndouble price = Double.parseDouble(priceText);\n// price now holds the double value 3.99" },
    ],
    commonMistake: "Students often try to assign a String directly to an int or double variable, or attempt to cast a String using (int) or (double), instead of remembering that Integer.parseInt and Double.parseDouble are the only correct ways to convert a numeric String into the matching primitive type.",
  },
  "4.7-intermediate": {
    title: "Autoboxing and Unboxing in Method Calls and Arithmetic",
    concept: "Autoboxing and unboxing happen automatically at assignment and method-call boundaries, and this conversion never causes a compile error: a primitive int or double can be passed to a method expecting an Integer or Double, and a wrapper object can be passed to a method expecting the matching primitive, without the programmer writing any explicit conversion code. A very common student misconception is assuming that passing an Integer or Double object to a method with a primitive parameter fails to compile; in reality, Java silently unboxes the object into its primitive value first, so the method runs exactly as if a primitive had been passed directly. This same silent conversion also applies whenever a wrapper object is used inside an arithmetic expression or a comparison.",
    examples: [
      { text: "public static double addFee(double amount)\n{\n    return amount + 2.50;\n}\nDouble total = new Double(10.00);\nSystem.out.println(addFee(total));\n// compiles and prints 12.5, since total is automatically unboxed to a double before the call" },
      { text: "String token = \"7\";\nint value = Integer.parseInt(token) + 3;\n// value is 10, since parseInt must run before addition is possible" },
    ],
    commonMistake: "Students frequently predict that a program will fail to compile whenever a wrapper object, such as an Integer or Double, is passed to a method that declares a primitive parameter, when in fact Java automatically unboxes the object and the code compiles and runs normally.",
  },
  "4.7-complex": {
    title: "Integer Caching, Immutability, and Reference vs. Value Comparisons",
    concept: "Java caches Integer objects created by autoboxing for values from -128 to 127; two Integer variables autoboxed from an equal value in that range refer to the same cached object, so comparing them with == returns true. Outside that cached range, autoboxing two equal values creates two separate Integer objects, so comparing them with == compares references and returns false, even though the values are equal; the equals method must be used instead to correctly compare the stored values. Because Integer and Double objects are immutable, code that appears to modify one, such as reassigning a variable after arithmetic, is never mutating the original object; it is unboxing the old value, computing a new value, autoboxing that new value into a brand-new object, and reassigning the variable to reference that new object, leaving the original object untouched.",
    examples: [
      { text: "Integer a = 50;\nInteger b = 50;\nInteger c = 200;\nInteger d = 200;\nSystem.out.println(a == b);\n// true, both cached since 50 is within -128 to 127\nSystem.out.println(c == d);\n// false, both outside the cached range, so different objects\nSystem.out.println(c.equals(d));\n// true, equals compares stored values correctly" },
      { text: "Integer total = 10;\ntotal = total + 5;\n// total is unboxed, 15 is computed, then autoboxed into a brand-new Integer object\n// the original Integer object storing 10 is never changed" },
    ],
    commonMistake: "Students often assume that == always correctly compares the values of two Integer objects, not realizing that outside the small cached range of -128 to 127, == compares object references instead, which can make two Integer objects holding the same value incorrectly appear unequal; the fix is to always use .equals() to compare wrapper object values.",
  },
  "4.8-basic": {
    title: "ArrayList Basics: Declaring, Constructing, and Core Methods",
    concept: "An ArrayList object is mutable in size and stores object references rather than the objects themselves. Java allows the generic type ArrayList<E>, where E specifies the type of element the list will hold; ArrayList<E> is preferred over a raw ArrayList because the compiler can then catch type errors, such as trying to add the wrong kind of object. Because E must be a reference type, a primitive type like int cannot be used directly as the generic type; a wrapper class such as Integer or Double must be used instead. ArrayList is part of the java.util package, so a program that uses it needs the statement import java.util.ArrayList; near the top of the file. The no-argument constructor ArrayList() always constructs an empty list. Once elements are stored, valid indices run from 0 to size() - 1, and five methods handle nearly all basic list mechanics: size() returns the current number of elements; add(E obj) appends a value to the end of the list; add(int index, E obj) inserts a value at a given index, shifting the element currently at that index and every element after it one position to the right; get(int index) returns the element stored at a given index; set(int index, E obj) replaces the element at a given index with a new value and returns the OLD value that was previously there; and remove(int index) deletes the element at a given index, shifting all later elements one position to the left, and returns the REMOVED value.",
    examples: [
      { text: "ArrayList<String> pets = new ArrayList<String>();\npets.add(\"Fido\");\npets.add(\"Milo\");\n// pets is now [\"Fido\", \"Milo\"]\nString first = pets.get(0);\n// first is \"Fido\"" },
      { text: "ArrayList<Integer> nums = new ArrayList<Integer>();\nnums.add(10);\nnums.add(20);\nnums.add(1, 15);\n// add(1, 15) inserts 15 at index 1, shifting 20 to index 2\n// nums is now [10, 15, 20]" },
    ],
    commonMistake: "Students often try to access or change an ArrayList element with array-style square brackets, such as writing nums[0] or nums[0] = 5, when Java requires the get and set methods instead, since ArrayList is a class with methods, not a built-in language feature like arrays. Another frequent mistake is writing ArrayList<int> or ArrayList<double>, forgetting that the generic type must always be a reference type such as Integer or Double, and assuming that a newly constructed ArrayList() somehow starts with placeholder elements rather than truly containing zero elements.",
  },
  "4.8-intermediate": {
    title: "Tracing Multi-Call ArrayList Sequences",
    concept: "At this level, questions chain together several add, get, set, and remove calls in a row, and getting the right answer requires updating the list's contents, and its size, after every single call rather than jumping straight to the end. The two calls that change the list's length, add(int index, E obj) and remove(int index), each shift every element from the affected index onward: inserting shifts everything at that index and later one position right, and removing shifts everything after that index one position left. Because indices shift as the list grows and shrinks, a later call's index argument refers to whatever element currently occupies that position, not to where an element used to be. When a call like set(index, list.get(otherIndex)) or add(index, list.get(otherIndex)) appears, the get call inside it must be evaluated using the list's state at that exact moment in the sequence, which may differ from the list's state at the start.",
    examples: [
      { text: "ArrayList<Integer> nums = new ArrayList<Integer>();\nnums.add(3);\nnums.add(2);\nnums.add(1);\n// nums is [3, 2, 1]\nnums.add(0, 4);\n// nums is [4, 3, 2, 1]\nnums.set(3, 9);\n// index 3 held 1; it is replaced with 9\n// nums is [4, 3, 2, 9]\nnums.remove(1);\n// index 1 (3) is removed and later elements shift left\n// nums is [4, 2, 9]" },
    ],
    commonMistake: "Students frequently trace only the elements' values and forget that add(int, E) and remove(int) also change the list's size and shift every subsequent index, so a later call's index argument ends up pointing at the wrong element. This is especially common when a get call is nested inside a later add or set call: students often evaluate that get call using the list's original contents instead of its updated contents at that point in the sequence.",
  },
  "4.8-complex": {
    title: "ArrayList Overload Traps and Precondition Reasoning",
    concept: "ArrayList<Integer> has two versions of remove that look deceptively similar but behave very differently: remove(int index) removes the element AT the given index, while remove(Object o) removes the first element EQUAL TO the given value. Because ArrayList<Integer> autoboxes int values into Integer objects, Java must decide which overload a given remove call matches, and it does so based on the compile-time type of the argument, not its value: passing a primitive int literal, such as list.remove(4), always resolves to the index-based remove(int index), while passing an Integer object, such as list.remove(Integer.valueOf(4)), resolves to the value-based remove(Object o). This distinction is one of the most commonly tested ArrayList gotchas. A second complex-tier skill is precondition reasoning: when a method chains several get, add, and remove calls together, each call's validity depends on the list's size at that exact moment, so determining what must be true about the list before the method runs requires tracing how each call changes the size and checking that every index used, including expressions like size() - 1, stays within the valid range from 0 to size() - 1 at the time it is used.",
    examples: [
      { text: "ArrayList<Integer> nums = new ArrayList<Integer>();\nnums.add(7);\nnums.add(4);\nnums.add(4);\nnums.add(9);\n// nums is [7, 4, 4, 9]\nnums.remove(4);\n// 4 is a primitive int literal, so this resolves to remove(int index)\n// the element at index 4 does not exist, but suppose nums instead had 5 elements:\n// [7, 4, 4, 9, 2] would become [7, 4, 4, 9] after removing index 4 (the value 2)\nnums.remove(Integer.valueOf(4));\n// an Integer object is passed, so this resolves to remove(Object o)\n// the first element equal to 4 is removed" },
    ],
    commonMistake: "The single most common mistake is assuming that list.remove(4) on an ArrayList<Integer> removes the value 4 from the list; in reality, because 4 is a primitive int literal, Java resolves the call to the index-based remove(int index) overload, which removes whatever element happens to be sitting at index 4, regardless of its value. Students also commonly forget, when reasoning about preconditions, that a list's size can change partway through a method, so an index that was valid at the start of a method, such as size() - 1, might no longer be valid by the time a later statement in the same method executes.",
  },
  "4.9-basic": {
    title: "Traversing an ArrayList and Valid Index Ranges",
    concept: "Traversing an ArrayList means using a loop to visit all (or an ordered sequence) of its elements. An indexed for loop, written as for (int i = 0; i < list.size(); i++), visits every valid index from 0 up to size() - 1; an enhanced for loop, written as for (Type var : list), reads each element in order without ever exposing an index at all. Both are useful for read-only traversals, such as summing, counting, or printing values. A critical fact underlying every traversal is that the only valid indices for a list are 0 through size() - 1; calling get() (or set(), or remove()) with any index outside that range, including a negative index or an index equal to size(), throws an IndexOutOfBoundsException.",
    examples: [
      { text: "ArrayList<Integer> vals = new ArrayList<Integer>();\nvals.add(4);\nvals.add(9);\nvals.add(2);\nint sum = 0;\nfor (int i = 0; i < vals.size(); i++)\n{\n    sum += vals.get(i);\n}\nSystem.out.println(sum);\n// prints 15, since the loop visits indices 0, 1, and 2" },
      { text: "for (int val : vals)\n{\n    System.out.println(val);\n}\n// enhanced for loop: prints 4, then 9, then 2, with no index used at all\nvals.get(3);\n// throws IndexOutOfBoundsException, since valid indices are only 0 through 2" },
    ],
    commonMistake: "Students often write a loop condition like i <= list.size() instead of i < list.size(), assuming size() itself is a valid index; since the last valid index is always size() - 1, this off-by-one mistake causes the final call to get() to throw an IndexOutOfBoundsException on the last iteration.",
  },
  "4.9-intermediate": {
    title: "Removing Elements While Traversing: The Index-Shift Problem",
    concept: "Removing an element from an ArrayList during a forward traversal shifts every later element one position to the left, which changes what each remaining index refers to. If a loop increments its index unconditionally after a removal, as in a plain i++ or a while loop's j++, the element that just shifted into the current index is never rechecked, and it gets skipped, specifically when two matching elements sit in adjacent positions. There are two standard fixes: after a removal, decrement the loop's index (i--) so the same index is rechecked on the next pass, or traverse backward from the last index down to 0, since removals then only affect indices that have already been visited. A loop that increments its index only when nothing was removed, common in while loop versions, achieves the same safe effect as the i-- fix.",
    examples: [
      { text: "// buggy: skips the second adjacent negative value\nfor (int i = 0; i < vals.size(); i++)\n{\n    if (vals.get(i) < 0)\n    {\n        vals.remove(i);\n    }\n}" },
      { text: "// fixed: rechecks the same index after a removal\nfor (int i = 0; i < vals.size(); i++)\n{\n    if (vals.get(i) < 0)\n    {\n        vals.remove(i);\n        i--;\n    }\n}\n// alternative fix: traverse backward instead\nfor (int i = vals.size() - 1; i >= 0; i--)\n{\n    if (vals.get(i) < 0)\n    {\n        vals.remove(i);\n    }\n}" },
    ],
    commonMistake: "Students often assume the unfixed forward-removal loop always works because it happened to work correctly when they traced it on a list where the matching values were spread apart; the bug only appears when two matching values are in strictly adjacent positions, so a single successful trace on the wrong list can hide a real, general bug.",
  },
  "4.9-complex": {
    title: "Elaborate Traversal Bugs, ConcurrentModificationException, and Off-by-One Errors",
    concept: "At this level, questions require carefully tracing several candidate loop implementations, and often asking for which specific list contents a given implementation produces an incorrect (or non-terminating) result, since the same code can behave correctly on one list but fail on another depending on exactly how matching elements are arranged. A second major idea is that an enhanced for loop must never be used to add or remove elements from the ArrayList it is traversing, even indirectly through a helper method call, because doing so structurally modifies the list mid-iteration and throws a ConcurrentModificationException; this happens regardless of whether the loop body only sometimes performs the modification. A third recurring idea is that an off-by-one error in a loop's starting index or bound, such as starting at size() instead of size() - 1, or looping while i <= size(), causes an IndexOutOfBoundsException, and this exception is independent of, and can occur alongside, the index-shift skipping bug.",
    examples: [
      { text: "// throws ConcurrentModificationException: removing while traversing with enhanced for\nfor (String tag : tags)\n{\n    if (tag.equals(\"blue\"))\n    {\n        tags.remove(tag);\n    }\n}" },
      { text: "// off-by-one: index starts one past the last valid index\nfor (int index = list.size(); index >= 0; index--)\n{\n    if (list.get(index) == target)\n    {\n        list.remove(index);\n    }\n}\n// throws IndexOutOfBoundsException on the very first access" },
    ],
    commonMistake: "Students often generalize from a single traced example, concluding a loop \"works\" or \"doesn't work\" for removal without checking whether the specific arrangement of matching values in that one list happens to include (or avoid) strictly adjacent duplicates; a rigorous answer requires checking each candidate list's adjacency pattern individually rather than relying on one trace.",
  },
  "4.10-basic": {
    title: "Standard ArrayList Algorithms: Basic Traversal Patterns",
    concept: "Many common tasks on an ArrayList are built from the same handful of standard traversal patterns. Finding a minimum or maximum starts a running value at the first element and replaces it whenever a better element is found. Computing a sum or average accumulates a total in a variable that starts at 0 (or 0.0) and adds every element exactly once, then divides by size() for an average. Determining whether at least one element has a property, or whether all elements have a property, uses a boolean flag that starts false or true and is updated only in the direction that matches the question being asked, without ever being reset back. Inserting an element uses add(int index, E obj) to place a new value at a specific position and shift every later element back one spot, while deleting uses remove(int index) or remove(Object obj) to take an element out and shift every later element forward one spot.",
    examples: [
      { text: "ArrayList<Integer> scores = new ArrayList<Integer>();\nscores.add(72);\nscores.add(95);\nscores.add(88);\nint maxScore = scores.get(0);\nfor (int i = 1; i < scores.size(); i++)\n{\n    if (scores.get(i) > maxScore)\n    {\n        maxScore = scores.get(i);\n    }\n}\n// maxScore ends up storing 95, the largest value in scores" },
      { text: "ArrayList<Integer> ranks = new ArrayList<Integer>();\nranks.add(3);\nranks.add(9);\nranks.add(14);\nint value = 8;\nint i = 0;\nwhile (i < ranks.size() && ranks.get(i) < value)\n{\n    i += 1;\n}\nranks.add(i, value);\n// ranks becomes [3, 8, 9, 14], since 8 is inserted right before the first element that is not smaller than it" },
    ],
    commonMistake: "The most common basic-level error is initializing an accumulator incorrectly for the situation at hand, such as starting a maximum search at 0 instead of at the list's first element (which fails whenever every element is negative), or starting a sum at the first element's value instead of at 0 and then double-counting it in the loop. A close second is writing the loop bound or insertion index off by one, such as looping only to size() - 1 and silently ignoring the last element, or inserting one position earlier or later than intended.",
  },
  "4.10-intermediate": {
    title: "Diagnosing Bugs in ArrayList Algorithm Implementations",
    concept: "At the intermediate level, the challenge shifts from writing a standard algorithm from scratch to recognizing when an attempted implementation has a bug, or comparing two or three candidate implementations of the same named algorithm to decide which (if any) are correct. Common bug patterns include an inverted or backward condition (setting a flag to false when it should be set to true, or vice versa), comparing every element to a fixed reference point instead of updating a running comparison value (such as always comparing to the first element instead of to the previous element in a consecutive-pairs algorithm), and confusing get(index) with remove(index) in a rotation, which duplicates an element instead of moving it. Insertion and rotation bugs frequently come from using add(E obj), which appends to the end, when add(int index, E obj) was needed to place a value at a specific position, or the reverse.",
    examples: [
      { text: "public static int countPairs2(ArrayList<Integer> readings)\n{\n    int count = 0;\n    int first = readings.get(0);\n    for (int i = 1; i < readings.size(); i++)\n    {\n        if (readings.get(i) == first)\n        {\n            count += 1;\n        }\n    }\n    return count;\n}\n// bug: every element is compared only to the fixed first element,\n// instead of to the element immediately before it" },
      { text: "public static void rotateLeftB(ArrayList<Integer> list)\n{\n    int first = list.get(0);\n    list.add(first);\n}\n// bug: get(0) does not remove the first element before it is re-added,\n// so the list grows by one element instead of rotating" },
    ],
    commonMistake: "Students often assume that if two candidate implementations both \"look reasonable\" and use similar-looking code, they must produce the same result; the most reliable way to catch a bug is to trace the exact code, line by line, on a specific short example rather than reasoning about the algorithm only in the abstract. A second common mistake is fixing the surface symptom rather than the actual bug, such as concluding a loop bound is wrong when the real problem is an inverted comparison, which leads to a proposed fix that does not actually resolve the issue.",
  },
  "4.10-complex": {
    title: "Comparing ArrayList Algorithm Implementations for Correctness and Efficiency",
    concept: "Correctness and efficiency are independent questions about the same algorithm implementation: two methods can be traced to produce identical output on every input, and yet one can still be meaningfully slower than the other. This most often comes down to how each method uses add and remove: add(E obj) appends to the end of an ArrayList in O(1) amortized time, but add(int index, E obj) and remove(int index) must shift every element at or after the given index by one position, which is an O(n) operation. A method that repeatedly inserts or removes at the front or in the middle of a growing list, even if its final result exactly matches a faster method's result, is doing meaningfully more work. This tier also covers standard algorithms applied across multiple ArrayList objects at once, such as merging two already-sorted lists into one sorted list by advancing two indices simultaneously and always taking the smaller of the two current elements.",
    examples: [
      { text: "public static ArrayList<Integer> buildA(int n)\n{\n    ArrayList<Integer> result = new ArrayList<Integer>();\n    for (int k = 0; k < n; k++)\n    {\n        result.add(k);\n    }\n    return result;\n}\npublic static ArrayList<Integer> buildB(int n)\n{\n    ArrayList<Integer> result = new ArrayList<Integer>();\n    for (int k = n - 1; k >= 0; k--)\n    {\n        result.add(0, k);\n    }\n    return result;\n}\n// buildA and buildB always return the same contents, but buildB is slower,\n// since add(0, k) must shift every existing element on every call" },
      { text: "int i = 0;\nint j = 0;\nwhile (i < listA.size() && j < listB.size())\n{\n    if (listA.get(i) <= listB.get(j))\n    {\n        result.add(listA.get(i));\n        i += 1;\n    }\n    else\n    {\n        result.add(listB.get(j));\n        j += 1;\n    }\n}\n// merges two sorted ArrayLists by advancing two indices simultaneously,\n// always taking the smaller of the two current elements" },
    ],
    commonMistake: "Students frequently assume that because two implementations produce the same output, they must also run equally fast, overlooking that add(int index, E obj) and remove(int index) carry a hidden O(n) shifting cost that add(E obj) at the end does not. Another frequent error when analyzing multi-list simultaneous-traversal algorithms, such as merging two sorted lists, is forgetting that the loop advancing both indices together will stop as soon as either list is exhausted, and mistakenly assuming any remaining elements in the other list are simply lost rather than needing a separate step to append them.",
  },
  "4.11-basic": {
    title: "2D Array Basics: Declaration, Dimensions, and Access",
    concept: "A 2D array is stored as an array of arrays and is created with two bracket pairs, such as int[][] grid = new int[3][5];, where the first size gives the number of rows and the second gives the number of columns; every 2D array in this course is rectangular, meaning every row has the same length. A single element is accessed with [row][column], and an entire single row can be accessed with just one bracket pair, such as grid[1], which returns a one-dimensional array. The number of rows is given by arr.length, and the number of columns is given by arr[0].length (or the length of any row); valid row indices run from 0 to arr.length - 1 and valid column indices run from 0 to arr[0].length - 1, and using new to create the array initializes every element to its type's default value: 0 for int, 0.0 for double, false for boolean, and null for any reference type.",
    examples: [
      { text: "int[][] board = new int[2][4];\nSystem.out.println(board.length);\n// prints 2, the number of rows\nSystem.out.println(board[0].length);\n// prints 4, the number of columns\nSystem.out.println(board[1][3]);\n// prints 0, the default value for int" },
      { text: "int[][] vals = { {1, 2}, {3, 4}, {5, 6} };\nSystem.out.println(vals[2][0]);\n// prints 5, the first element of the third row\nint[] row = vals[1];\nSystem.out.println(row[1]);\n// prints 4, the second element of the second row, accessed with one bracket pair" },
    ],
    commonMistake: "Students often confuse arr.length (the number of rows) with arr[0].length (the number of columns), or assume an out-of-range row or column index like arr[arr.length] is still valid, forgetting that valid indices only run from 0 up to length - 1.",
  },
  "4.11-intermediate": {
    title: "Tracing Nested Loops, Row Aliasing, and Index Traps",
    concept: "A nested for loop with an outer variable for the row and an inner variable for the column, using arr.length and arr[r].length as the bounds, visits every element of a 2D array exactly once in row-major order; swapping the loop variables' roles (looping columns on the outside) still visits every element, but in column-major order instead. Because [row][column] order matters, accidentally swapping the two indices, such as writing arr[c][r] instead of arr[r][c], accesses a different element than intended, and can even throw an ArrayIndexOutOfBoundsException if the swapped index falls outside the valid range for that dimension. A single row obtained with one bracket pair, such as int[] row = arr[i];, is a reference to the actual row stored inside arr, not a copy, so modifying an element of row also changes the corresponding element of arr.",
    examples: [
      { text: "int[][] data = { {1, 2, 3}, {4, 5, 6} };\nint total = 0;\nfor (int r = 0; r < data.length; r++)\n{\n    for (int c = 0; c < data[r].length; c++)\n    {\n        total += data[r][c];\n    }\n}\n// total ends at 21, the sum of all six elements, visited in row-major order" },
      { text: "int[][] arr = { {10, 20}, {30, 40} };\nint[] firstRow = arr[0];\nfirstRow[1] = 99;\nSystem.out.println(arr[0][1]);\n// prints 99, since firstRow is a reference to arr's actual first row, not a copy" },
    ],
    commonMistake: "Students often assume a method's bug, like computing arr.length + arr[0].length instead of arr.length * arr[0].length for a total element count, is close enough or a minor issue, when addition and multiplication give completely different (and usually very different) results; they also frequently assume that changing a value through a variable obtained from arr[i] only affects that local variable, missing that it is an alias for the real row inside arr.",
  },
  "4.11-complex": {
    title: "Multi-Step 2D Array Reasoning: Matching, Bugs, and Reference Semantics",
    concept: "At this level, questions often require holding several facts in mind at once: matching a target array's exact contents to the one correct initializer-list declaration among several similar-looking candidates, reasoning through I/II/III-style statements about valid row and column bounds simultaneously, or tracing a multi-line bug where a loop bound or an accumulation index uses the wrong dimension (such as using arr.length where arr[0].length, the column count, was needed, or vice versa) for a non-square array. Reference semantics become more intricate too: because arr[i] returns the actual row stored inside a 2D array rather than a copy, two separately named variables can end up aliasing the exact same row, so whichever assignment happens last is the one whose effect persists, and swapping two rows can be done efficiently by swapping references with a temporary variable rather than copying every individual element.",
    examples: [
      { text: "int[][] table = { {1, 2}, {3, 4} };\nint[] a = table[0];\nint[] b = table[0];\na[1] = 50;\nb[1] = 60;\nSystem.out.println(table[0][1]);\n// prints 60, since a and b both alias the same row, and the later assignment wins" },
      { text: "public int totalElements(int[][] arr)\n{\n    return arr.length + arr[0].length;\n}\n// bug: for a 4-row, 6-column array this returns 10 instead of the correct 24,\n// since total elements requires arr.length * arr[0].length, not addition" },
    ],
    commonMistake: "Students frequently trace only one candidate implementation or declaration far enough to look plausible and stop, rather than checking every candidate (or every statement in an I/II/III item) against the exact same concrete array, which is the only way to catch a subtle row/column swap, an off-by-one bound like r <= arr.length, or an aliasing effect where the last assignment made through any alias of a row silently overwrites an earlier one.",
  },
  "4.12-basic": {
    title: "Traversing 2D Arrays with Nested Loops",
    concept: "A 2D array is traversed with a loop nested inside another loop, since each element needs both a row index and a column index. Row-major order visits every element of a row before moving to the next row (outer loop over rows, inner loop over columns), while column-major order visits every element of a column before moving to the next column (outer loop over columns, inner loop over rows). For a rectangular 2D array named arr, arr.length gives the number of rows and arr[0].length gives the number of columns in each row. A nested enhanced for loop can also traverse a 2D array: the outer loop variable must be declared as a 1D array (matching one row), and the inner loop variable must match the type of the individual elements stored in that row. This course only works with rectangular 2D arrays, where every row has the same number of columns.",
    examples: [
      { text: "int[][] grid = {{1, 2, 3}, {4, 5, 6}};\nfor (int r = 0; r < grid.length; r++)\n{\n    for (int c = 0; c < grid[0].length; c++)\n    {\n        System.out.print(grid[r][c] + \" \");\n    }\n}\n// row-major order prints: 1 2 3 4 5 6" },
      { text: "int[][] grid = {{1, 2, 3}, {4, 5, 6}};\nfor (int[] row : grid)\n{\n    for (int val : row)\n    {\n        System.out.print(val + \" \");\n    }\n}\n// the outer variable row is declared int[] to match each row of grid\n// the inner variable val is declared int to match each element of a row" },
    ],
    commonMistake: "Students often confuse which loop should be outer and which should be inner, mixing up row-major order (rows outer, columns inner) with column-major order (columns outer, rows inner), or they forget that arr.length is the number of rows while arr[0].length is the number of columns, and swap the two when setting loop bounds.",
  },
  "4.12-intermediate": {
    title: "Tracing Row-Major, Column-Major, and Fixed-Index Traversals",
    concept: "Tracing a 2D array traversal means carefully following the order in which the outer and inner loop variables change to determine exactly which elements are visited and in what sequence. A traversal can also target a single fixed row (loop only over columns, with the row index held constant) or a single fixed column (loop only over rows, with the column index held constant), and some traversals move through the array in a non-default order, such as visiting rows in reverse using an index like arr.length - 1 - k. A very common trap involves a nested enhanced for loop: the inner loop variable (such as int val : row) holds only a copy of each primitive element, so reassigning it (val = val * 2) never changes the value actually stored in the array, because the assignment never reaches back into the array itself.",
    examples: [
      { text: "int[][] m = {{5, 1}, {10, 2}, {15, 3}};\nint total = 0;\nfor (int k = 0; k < m.length; k++)\n{\n    total = total + m[m.length - 1 - k][1];\n}\n// visits column 1 across rows in reverse order: 3, 2, 1, so total is 6" },
      { text: "for (int[] row : data)\n{\n    for (int val : row)\n    {\n        val = 0;\n        // this reassignment is discarded; data is completely unchanged\n    }\n}" },
    ],
    commonMistake: "Students often assume that reassigning an enhanced for loop's variable (like val = val * 2) updates the array it came from, when in fact val is only a copy of a primitive value, so the array itself is left completely unmodified after the loop finishes.",
  },
  "4.12-complex": {
    title: "Debugging Multi-Concept Traversal Bugs and Comparing Implementations",
    concept: "At this level, questions often present a nested loop with a subtle bug and ask you to identify precisely why it fails: a loop bound that uses the wrong dimension (such as using arr.length, the number of rows, where arr[0].length, the number of columns, is needed), an off-by-one bound using <= instead of <, or swapped row and column indices (arr[c][r] instead of arr[r][c]) that silently traverses the transpose or throws an exception once the swapped index exceeds the wrong dimension's bound. Comparing multiple candidate implementations side by side (row-major vs. column-major sums, or an enhanced for loop vs. an indexed for loop) requires recognizing that different traversal orders can still produce the same correct final result when the underlying operation, like addition, does not depend on order, while a genuinely different bug, like indexing an accumulator array with the wrong loop variable, produces an incorrect result regardless of traversal order. Fixing an enhanced-for reassignment bug requires switching to an indexed for loop that writes through row[c] = ..., since row is itself an alias for the real one-dimensional array stored in the 2D array, unlike the primitive-copy variable val.",
    examples: [
      { text: "public static int[] sumRows(int[][] table)\n{\n    int[] rowSums = new int[table.length];\n    for (int r = 0; r < table.length; r++)\n    {\n        int sum = 0;\n        for (int c = 0; c < table.length; c++)\n        // BUG: should be c < table[0].length\n        {\n            sum = sum + table[r][c];\n        }\n        rowSums[r] = sum;\n    }\n    return rowSums;\n}\n// if table has more columns than rows, every row's sum is incomplete" },
      { text: "for (int r = 0; r < board.length; r++)\n{\n    for (int[] row : board)\n    {\n        row[r] = 0;\n        // row is an alias for the real array, so this correctly zeros board\n        // (valid for a square board, since board.length also equals the number of columns)\n    }\n}" },
    ],
    commonMistake: "Students frequently misdiagnose which loop bound is wrong when a nested traversal produces an incomplete result instead of an exception, forgetting that using a smaller-than-needed bound (like the row count where the column count belongs) simply causes the loop to stop early without ever throwing an ArrayIndexOutOfBoundsException, which only occurs when a bound is too large, not too small.",
  },
  "4.13-basic": {
    title: "Standard 2D Array Algorithms: Recognizing the Basic Patterns",
    concept: "Topic 4.13 takes the 2D array traversal mechanics from 4.12 and applies them to a small set of standard algorithm patterns, each of which can be aimed at an entire 2D array or at just one designated row, column, or diagonal. The core patterns are: finding a minimum or maximum, computing a sum or average, checking whether at least one element has a property (exists), checking whether every element has a property (all), counting elements with a property, comparing consecutive pairs, detecting duplicates, shifting or rotating a row or column, and reversing a row or column. Each pattern uses the same basic shape every time: an accumulator variable (a running max, min, sum, count, or boolean flag) is initialized before the loop and updated by exactly one rule inside the loop body.",
    examples: [
      { text: "int max = arr[0][0];\nfor (int r = 0; r < arr.length; r++)\n{\n    for (int c = 0; c < arr[r].length; c++)\n    {\n        if (arr[r][c] > max)\n        {\n            max = arr[r][c];\n        }\n    }\n}\nThis nested-loop pattern finds the maximum value across an entire 2D array by comparing every element to the running max." },
      { text: "boolean allEven = true;\nfor (int r = 0; r < vals.length; r++)\n{\n    if (vals[r][2] % 2 != 0)\n    {\n        allEven = false;\n    }\n}\nRestricting the loop to a single column index (here, column 2) applies the same all-elements pattern to just one designated column instead of the whole array." },
    ],
    commonMistake: "Students often confuse the exists pattern with the all pattern: exists starts a boolean flag at false and flips it to true the moment a qualifying element is found, while all starts the flag at true and flips it to false the moment a disqualifying element is found. Mixing up the starting value or the flip condition produces a method that always returns the same answer no matter what the array contains.",
  },
  "4.13-intermediate": {
    title: "Tracing 2D Array Algorithms Over Subsections and Larger Arrays",
    concept: "At this level, the same standard patterns from the basic tier are applied to designated subsections of a rectangular 2D array, such as a specific range of rows, a single column examined across every row, a submatrix bounded by both row and column ranges, or one of the two diagonals. Tracing this code correctly requires paying close attention to which index (row or column) is held fixed, which index varies, and what the loop bounds actually include or exclude, since a subsection algorithm only differs from a whole-array algorithm in its loop bounds and index expressions, not in its underlying accumulator logic. Multi-step patterns such as consecutive pairs, duplicate detection, shifting, and reversing also start to combine index arithmetic (like arr.length - 1 - r for a reversal) with the traversal itself.",
    examples: [
      { text: "int min = arr[1][0];\nfor (int r = 1; r < 3; r++)\n{\n    for (int c = 0; c < arr[r].length; c++)\n    {\n        if (arr[r][c] < min)\n        {\n            min = arr[r][c];\n        }\n    }\n}\nBounding the outer loop with r starting at 1 and running while r < 3 restricts the minimum-value search to rows 1 and 2 only, skipping row 0 and any rows beyond index 2." },
      { text: "int[] reversedCol = new int[arr.length];\nfor (int r = 0; r < arr.length; r++)\n{\n    reversedCol[r] = arr[arr.length - 1 - r][1];\n}\nUsing arr.length - 1 - r as the row index while holding the column index fixed at 1 reverses the top-to-bottom order of a single designated column." },
    ],
    commonMistake: "Students often forget to reset an accumulator (such as a running comparison value like prev in a consecutive-pairs algorithm) between structurally separate parts of a traversal, or misidentify which array dimension a loop bound is supposed to restrict, especially when a row-based subsection and a column-based subsection appear in the same problem set and get mentally swapped.",
  },
  "4.13-complex": {
    title: "Debugging Subtle Bugs and Index Traps in 2D Array Algorithms",
    concept: "At the complex tier, questions present a 2D array algorithm that looks correct at a glance but contains a subtle bug: an inner loop bound that is off by one and silently skips the last element of every row, a row/column index swap that corrupts the wrong row or column instead of throwing an error, a diagonal computed with the wrong index expression (n - 1 - i instead of i, mixing up the main diagonal with the anti-diagonal), a duplicate-detection or all/exists check that compares an element to itself or returns too early, or an in-place reversal whose loop runs over the full array instead of just the first half, silently undoing itself. Multi-statement (I/II/III) items at this level often combine a correctness claim with a claim about integer division, exception behavior, or what would happen if one line of the code were changed, all of which must be traced and reasoned about independently.",
    examples: [
      { text: "public int maxInColumn(int[][] arr, int col)\n{\n    int max = arr[0][col];\n    for (int r = 1; r < arr.length - 1; r++)\n    {\n        if (arr[r][col] > max)\n        {\n            max = arr[r][col];\n        }\n    }\n    return max;\n}\nThe condition r < arr.length - 1 stops one row too early, so the true maximum in the last row of the column is never checked and the method silently returns a smaller, incorrect value." },
      { text: "int len = arr[row].length;\nfor (int c = 0; c < len; c++)\n{\n    int temp = arr[row][c];\n    arr[row][c] = arr[row][len - 1 - c];\n    arr[row][len - 1 - c] = temp;\n}\nRunning this swap loop for the entire row instead of only its first half swaps every pair of elements twice, so the row ends up completely unchanged instead of reversed." },
    ],
    commonMistake: "Students often assume that a bug in a 2D array algorithm must either cause a crash or produce an obviously wrong answer, missing the more common case where a subtle off-by-one bound, an index swap, or a double-swap makes the code silently compute a plausible-looking but incorrect result (or even leave the array unchanged) without ever throwing an exception.",
  },
  "4.14-basic": {
    title: "Linear Search: Checking Elements One at a Time",
    concept: "Linear search (also called sequential search) checks the elements of an array or ArrayList one at a time, in order, until the target value is found or every element has been examined; it can begin from either end of the collection, scanning forward from index 0 or backward from the last index, and it never requires the data to be sorted. A linear search that reports whether and where a target was found follows a strict convention: if the target is located, the search reports the index at which it was found, and if the target is not present anywhere, it reports a sentinel value, almost always -1, since -1 can never be confused with a real index. Applying linear search to a rectangular 2D array means treating it as a collection of rows: an outer loop accesses each row in turn, and an inner loop performs a linear search across that row's elements, so that every element of the 2D array eventually gets checked.",
    examples: [
      { text: "int[] nums = {12, 7, 25, 4, 18};\nint target = 25;\nint foundIndex = -1;\nfor (int i = 0; i < nums.length; i++)\n{\n    if (nums[i] == target)\n    {\n        foundIndex = i;\n    }\n}\nforundIndex ends at 2, the index where 25 is stored; if target had instead been 50 (not present), foundIndex would remain -1, the sentinel value." },
      { text: "int[][] grid = { {4, 9}, {2, 7}, {6, 1} };\nboolean found = false;\nfor (int r = 0; r < grid.length; r++)\n{\n    for (int c = 0; c < grid[r].length; c++)\n    {\n        if (grid[r][c] == 7)\n        {\n            found = true;\n        }\n    }\n}\nThe outer loop accesses each row of the 2D array, and the inner loop linearly searches within that row, so every element gets compared to the target." },
    ],
    commonMistake: "Students often assume an unset int or boolean field used as a search result defaults sensibly, or forget that a value like 0 is a genuine valid index and therefore a poor choice for a not-found sentinel; -1 is used precisely because it can never be a real array or ArrayList index.",
  },
  "4.14-intermediate": {
    title: "Tracing Linear Search: Direction, Sub-Ranges, and Nested 2D Search",
    concept: "Tracing a linear search carefully requires paying attention to exactly which indices the loop actually visits: a loop that starts partway through an array or stops before the last index searches only a sub-range, not the whole collection, and a loop that scans backward (from the last index toward 0) still finds a present target, but if the search does not exit early, later overwrites of a stored result reflect whichever match was checked last in the loop's own order, not necessarily the first match in the original array order. A search written with an early return (or a while loop condition that checks a found flag) stops examining elements the moment a match occurs, so later elements, including later duplicates of the target, are never reached. Applying nested linear search to a rectangular 2D array means an outer loop moves row by row while an inner loop scans each row's elements; whether the first match found gets \"locked in\" (and never overwritten) depends on whether the if condition includes a guard, such as checking that the result variable still holds its initial sentinel value.",
    examples: [
      { text: "int[] data = {6, 15, 8, 15, 3, 9};\nint result = -1;\nfor (int i = 4; i >= 1; i--)\n{\n    if (data[i] == 15)\n    {\n        result = i;\n    }\n}\nThis loop only checks indices 4 down to 1 (a sub-range), and since it does not exit early, later overwrites mean result ends at 1, the last match found while scanning backward through that range, not the first 15 encountered." },
      { text: "int[][] seats = { {0, 1, 0}, {1, 1, 0}, {0, 0, 1} };\nint rowFound = -1;\nint colFound = -1;\nfor (int r = 0; r < seats.length; r++)\n{\n    for (int c = 0; c < seats[r].length; c++)\n    {\n        if (seats[r][c] == 1 && rowFound == -1)\n        {\n            rowFound = r;\n            colFound = c;\n        }\n    }\n}\nBecause the if condition includes the guard rowFound == -1, only the very first match encountered while scanning row by row gets recorded, at (0, 1), and every later match is skipped." },
    ],
    commonMistake: "Students often assume that a linear search loop checks the entire array or ArrayList by default, without noticing when the loop's starting index, ending bound, or direction actually restricts it to a sub-range, or without noticing whether a guard condition is present to \"lock in\" the first match versus letting every later match overwrite the stored result.",
  },
  "4.14-complex": {
    title: "Debugging Linear Search: Off-by-One Bugs, Direction Bugs, and Premature Exits",
    concept: "The most common linear search bugs come from an incorrect loop bound or starting index that causes one element to be silently skipped: starting a forward loop at i = 1 skips index 0, using a condition like i < arr.length - 1 skips the last index, and using i > 0 in a backward loop skips index 0; each of these can cause a search to incorrectly report a present target as not found. In nested 2D linear search, the same kind of off-by-one bug can appear in either the outer loop (skipping an entire row) or the inner loop (skipping one column in every row), and a return statement placed incorrectly, such as inside an else branch that runs on the very first mismatch, can cause the method to quit before ever reaching the row or column that actually contains the target. Reversing a search's direction changes which occurrence of a duplicated value is found first (the earliest occurrence going forward versus the latest occurrence going forward, which is the first one reached going backward), but it does not change whether a present target is correctly detected, as long as the loop bounds themselves are correct and the entire range is actually visited. Finally, a sentinel value that overlaps a valid index, such as initializing a result variable to 0 instead of -1, makes it impossible to distinguish a genuine match at index 0 from a target that was never found at all.",
    examples: [
      { text: "public static int findBackward(int[] arr, int target)\n{\n    for (int i = arr.length - 1; i > 0; i--)\n    {\n        if (arr[i] == target)\n        {\n            return i;\n        }\n    }\n    return -1;\n}\nFor arr = {8, 3, 5, 3}, findBackward(arr, 8) incorrectly returns -1: the condition i > 0 stops the loop before it ever checks index 0, which is the only place 8 is stored." },
      { text: "public static boolean contains2D(int[][] grid, int target)\n{\n    for (int r = 0; r < grid.length - 1; r++)\n    {\n        for (int c = 0; c < grid[r].length; c++)\n        {\n            if (grid[r][c] == target)\n            {\n                return true;\n            }\n        }\n    }\n    return false;\n}\nFor grid = { {1, 2}, {3, 4}, {5, 6} } and target = 5, the outer loop's bound r < grid.length - 1 never visits row index 2, so contains2D incorrectly returns false even though 5 is present in that last row." },
    ],
    commonMistake: "Students often trust that a loop checks \"the whole array\" or \"the whole 2D array\" without carefully verifying the exact starting index, ending bound, and direction against the array's actual valid indices, and they often assume that reversing a search's direction can never change the correctness of a found/not-found result, when in fact it only changes correctness if the reversed loop's bounds also introduce a new off-by-one error, though it always can change which duplicate is reported.",
  },
  "4.15-basic": {
    title: "Selection Sort and Insertion Sort: The Basics",
    concept: "Selection sort and insertion sort are both iterative algorithms that sort an array or ArrayList by repeatedly working through an unsorted portion of the data. Selection sort repeatedly scans the entire remaining unsorted portion to find its smallest (or, for a descending sort, largest) value, then swaps that value into the next open slot of the sorted portion, placing it in its final position for the rest of the sort. Insertion sort instead takes the next unsorted element and shifts elements of the already-sorted portion to the right, one at a time, until it finds the correct spot to insert that element relative to the values already sorted; because a later pass can still shift an already-inserted element further right, insertion sort does not guarantee an element is in its true final position the moment it is placed. Both algorithms can be implemented on either an array (using [] and a length field) or an ArrayList (using get(int), set(int, E), and size()). Neither selection sort nor insertion sort uses recursion; a recursive sorting algorithm, such as merge sort, is a completely different approach reserved for later study.",
    examples: [
      { text: "public static void selectionSort(int[] arr)\n{\n    for (int i = 0; i < arr.length - 1; i++)\n    {\n        int minIndex = i;\n        for (int j = i + 1; j < arr.length; j++)\n        {\n            if (arr[j] < arr[minIndex])\n            {\n                minIndex = j;\n            }\n        }\n        int temp = arr[i];\n        arr[i] = arr[minIndex];\n        arr[minIndex] = temp;\n    }\n}\n// each pass finds the minimum of the unsorted portion and swaps it into its final position" },
      { text: "public static void insertionSort(int[] arr)\n{\n    for (int i = 1; i < arr.length; i++)\n    {\n        int temp = arr[i];\n        int j = i;\n        while (j > 0 && arr[j - 1] > temp)\n        {\n            arr[j] = arr[j - 1];\n            j--;\n        }\n        arr[j] = temp;\n    }\n}\n// each pass shifts larger sorted elements right to make room for temp at its correct spot" },
    ],
    commonMistake: "Students often mix up which algorithm places elements in their final position versus which one only shifts them into a temporarily correct position: selection sort's swapped element is done moving for the rest of the sort, while insertion sort's inserted element can still be shifted further right by a later pass. Students also sometimes assume merge sort is covered by this topic since it is also a sorting algorithm, forgetting that this topic's two algorithms, selection sort and insertion sort, are purely iterative and never use a recursive method call.",
  },
  "4.15-intermediate": {
    title: "Tracing and Completing Selection and Insertion Sort",
    concept: "Tracing selection sort and insertion sort by hand requires working through the nested-loop structure one pass at a time and keeping careful track of the array's contents after each pass, not just at the very end. In selection sort, each pass's inner loop scans indices i + 1 through the end of the array, updating minIndex whenever a smaller value is found, and the swap (using a temp variable) happens only once, after the inner loop finishes. In insertion sort, each pass's while loop condition must check both that a valid index remains to compare against (j > 0) and that the element there is greater than temp (arr[j - 1] > temp); getting either part of this condition wrong, or shifting from the wrong index, breaks the algorithm. Both algorithms translate directly to ArrayList by replacing arr[k] with list.get(k) and assignments to arr[k] with list.set(k, value), without needing add or remove at all, since neither algorithm changes the number of elements. When two arrays are meant to stay parallel, such as a grades array and a names array describing the same people, every swap performed on one array during selection sort must be mirrored with the identical swap on the other array.",
    examples: [
      { text: "// selection sort inner loop, scanning only the unsorted portion\nfor (int j = i + 1; j < arr.length; j++)\n{\n    if (arr[j] < arr[minIndex])\n    {\n        minIndex = j;\n    }\n}\n// starting at i (instead of i + 1) or 0 would incorrectly rescan or ignore parts of the array" },
      { text: "// insertion sort while condition, checking bounds and value together\nwhile (j > 0 && arr[j - 1] > temp)\n{\n    arr[j] = arr[j - 1];\n    j--;\n}\n// omitting j > 0, or comparing arr[j] instead of arr[j - 1], causes incorrect shifting or an out-of-bounds access" },
    ],
    commonMistake: "When tracing multiple passes by hand, students often accidentally apply the next pass's logic to the array's original contents instead of to the array as it stood after the previous pass finished, producing an incorrect intermediate state. Students also frequently forget that a pass whose minimum (or insertion point) is already in the correct place still 'executes' fully, even though it produces no visible change to the array, which can make students think a pass was skipped when it actually just had no effect.",
  },
  "4.15-complex": {
    title: "Counting Operations, Diagnosing Bugs, and Comparing Selection and Insertion Sort",
    concept: "The most advanced questions on selection sort and insertion sort ask you to count the exact number of comparisons, swaps, or shifts that occur across an entire sort, which requires tracing every single pass rather than just the final sorted result. Selection sort's total number of comparisons is fixed by the array's size alone (for n elements, it is (n - 1) + (n - 2) + ... + 1), since its inner loop always scans the full remaining unsorted portion no matter what the data looks like; adding an if (i != minIndex) check can reduce the number of swaps performed, but never the number of comparisons. Insertion sort's total number of shifts, by contrast, depends heavily on the data: it is smallest (zero) when the array is already sorted and largest when the array is in reverse order, since every new element must then shift past every element already placed. Common bugs to watch for include: an inner-loop bound that excludes the very last index from ever being considered, which leaves the final element stuck in place; a swapped comparison operator (> instead of <) that silently sorts in the opposite of the intended order; and a shift statement that copies from the wrong neighboring index, which can silently duplicate one value while permanently losing another instead of throwing a compile-time error.",
    examples: [
      { text: "// selection sort with a bug: the inner loop stops one index too early\nfor (int j = i + 1; j < arr.length - 1; j++)\n{\n    if (arr[j] < arr[minIndex])\n    {\n        minIndex = j;\n    }\n}\n// the very last index of the array is never examined, so it can never become minIndex and never gets moved into its correct place" },
      { text: "// insertion sort with a bug: shifting from the wrong side\nwhile (j > 0 && arr[j - 1] > temp)\n{\n    arr[j] = arr[j + 1];\n    j--;\n}\n// copying arr[j + 1] instead of arr[j - 1] overwrites data with a value from the wrong direction, silently duplicating one value while losing another" },
    ],
    commonMistake: "Students frequently assume that any inner-loop or comparison-operator bug will cause a compile error or an obviously wrong (e.g., empty or crashed) result, when in fact these bugs often still produce a plausible-looking array that is merely incorrect in a subtle way, such as one element stuck out of place, the whole array sorted backwards, or a value silently duplicated while another disappears. When counting operations, students also often confuse the number of comparisons performed with the number of shifts or swaps that actually execute, forgetting that a comparison can evaluate to false (contributing to the comparison count but not the shift or swap count) or that short-circuit evaluation (as in j > 0 && ...) can prevent a comparison from being evaluated at all once the loop's index bound is reached.",
  },
  "4.16-basic": {
    title: "Recognizing Base Cases and Recursive Calls",
    concept: "A recursive method is simply a method that calls itself. Every correctly written recursive method needs at least one base case, a condition that is checked (usually with an if statement) and, once true, lets the method return or stop without making another call to itself, and at least one recursive call, the statement where the method invokes itself again, typically with an argument that is closer to satisfying the base case than the current call was. Because writing recursive code from scratch is outside the scope of this course, questions at this level simply hand you an already-written recursive method and ask you to point to which line is the base case, which line is the recursive call, or how many recursive calls appear in the method's body. Each recursive call also gets its own independent copy of the method's parameters, so a parameter that decreases by one with every call plays a role very similar to a loop control variable, tracking how much progress has been made toward the base case.",
    examples: [
      { text: "public static int countdown(int n)\n{\n    if (n <= 0)\n    {\n        return 0;\n    }\n    System.out.println(n);\n    return countdown(n - 1);\n}\nif (n <= 0) is the base case; countdown(n - 1) is the recursive call." },
      { text: "public static int fib(int n)\n{\n    if (n <= 1)\n    {\n        return n;\n    }\n    return fib(n - 1) + fib(n - 2);\n}\nThis method's body contains two recursive calls, fib(n - 1) and fib(n - 2), inside a single return statement." },
    ],
    commonMistake: "Students often confuse the recursive call with the base case, especially when a method's base case and recursive call both appear inside the same if/return structure, or they forget that a method can contain more than one recursive call (as in a Fibonacci-style method), miscounting how many times the method invokes itself.",
  },
  "4.16-intermediate": {
    title: "Tracing Recursive Calls to Find a Return Value or Printed Output",
    concept: "At this level, you are given a complete, already-written recursive method and asked to trace a specific call all the way down to its base case and then back up, determining exactly what value is returned or what output is printed. The key technique is to unwind the recursion one call at a time: each call either satisfies the base case and returns directly, or it computes something using the result of one or more recursive calls that must themselves be traced first before the outer call's expression can be evaluated. A particularly tricky pattern involves a method that prints something both before and after its recursive call; because the call in the middle must fully finish (including all of its own nested recursion) before the statement after it runs, the values printed before the recursive call appear in the order the calls were first made, while the values printed after the recursive call appear only as each call returns, in the reverse order.",
    examples: [
      { text: "public static int sum(int n)\n{\n    if (n == 0)\n    {\n        return 0;\n    }\n    return n + sum(n - 1);\n}\nsum(4) traces as 4 + sum(3), then 3 + sum(2), then 2 + sum(1), then 1 + sum(0), where sum(0) returns 0, giving 4 + 3 + 2 + 1 + 0 = 10." },
      { text: "public static void mystery(int n)\n{\n    if (n > 0)\n    {\n        System.out.print(n % 10);\n        mystery(n / 10);\n        System.out.print(n % 10);\n    }\n}\nCalling mystery(1234) prints 4, 3, 2, 1 as the recursion descends (before each recursive call), then 1, 2, 3, 4 as the calls return (after each recursive call), producing 43211234 overall." },
    ],
    commonMistake: "A very common error is tracing only the first print statement in a method and forgetting that code placed after a recursive call does not run until that entire recursive call (and everything nested inside it) has completely finished, which causes students to miss the second half of the output or to assume the printed digits appear only in one order instead of tracking both the pre-call and post-call prints separately.",
  },
  "4.16-complex": {
    title: "Missing or Flawed Base Cases, General Behavior, and Convergence",
    concept: "At the most advanced level, questions ask you to reason about a recursive method's behavior at a deeper level instead of tracing one specific call. This includes determining, in general, what a recursive method computes for any valid input (such as recognizing that a method peeling one character off a String and adding 1 each time is really computing the String's length), and evaluating whether a method is even guaranteed to terminate. A method with no base case at all, or with a base case condition that the recursive step can skip right past (for example, decreasing by 2 from an odd starting value while checking only for exactly 0), never satisfies its stopping condition and recurses forever, which in practice causes the program to crash with a StackOverflowError once the call stack is exhausted. A base case that is checked too late, or a recursive argument that changes in a way that misses the intended stopping point entirely, can instead let an invalid operation slip through, such as division by zero (causing an ArithmeticException) or an array or String index one step out of bounds (causing an IndexOutOfBoundsException). Because any recursive solution can be rewritten iteratively and vice versa, some questions also ask you to match a recursive method to an equivalent loop-based version, and some ask what initial arguments a recursive helper method requires in order to behave correctly when it is first called.",
    examples: [
      { text: "public static int sumEven(int n)\n{\n    if (n == 0)\n    {\n        return 0;\n    }\n    return n + sumEven(n - 2);\n}\nCalling sumEven(5) produces n = 5, 3, 1, -1, -3, and so on; n never equals exactly 0, so the base case is never reached and the program eventually fails with a StackOverflowError." },
      { text: "public static int divideChain(int n)\n{\n    if (n < 0)\n    {\n        return 0;\n    }\n    return 100 / n + divideChain(n - 1);\n}\nThe base case checks n < 0, but n = 0 is not less than 0, so the call divideChain(0) still evaluates 100 / n with n equal to 0, throwing an ArithmeticException before the base case is ever reached." },
    ],
    commonMistake: "Students often assume that if a recursive method's argument is changing at all with each call, the method is guaranteed to eventually reach its base case and terminate safely, without checking whether that changing argument can actually skip past, or arrive too late at, the exact value the base case is testing for; they also frequently misidentify what a general recursive method computes by only tracing one small example instead of recognizing the overall pattern that holds for every valid input.",
  },
  "4.17-basic": {
    title: "Recursive Search Basics: Traversal, Binary Search, and Merge Sort",
    concept: "Recursion can traverse a String, an array, or an ArrayList by having each recursive call handle one element (or one character) and then pass along a slightly smaller version of the problem, such as index + 1 or a shorter substring, until a base case is reached that stops the recursion. A recursive search method conventionally returns -1 (for an int-returning search) or false (for a boolean-returning search) once the base case confirms every element has been checked without a match. Binary search is a different kind of recursive search: it only works correctly on data that is already sorted, and each call compares the target to the middle element of the current range, eliminating about half of the remaining elements with every comparison, which is why it is typically far more efficient than linear search on large collections. Merge sort is a recursive sorting algorithm that repeatedly divides an array in half until every subarray holds a single (trivially sorted) element, and then merges those subarrays back together by repeatedly comparing their front elements.",
    examples: [
      { text: "public int linearSearch(int[] arr, int index, int target)\n{\n    if (index == arr.length)\n    {\n        return -1;\n    }\n    if (arr[index] == target)\n    {\n        return index;\n    }\n    return linearSearch(arr, index + 1, target);\n}\nThe base case index == arr.length means every element has been checked with no match, so -1 is returned." },
      { text: "int mid = (low + high) / 2;\nif (arr[mid] == target)\n{\n    return mid;\n}\nBinary search compares the target only to the middle element of the current range, never to every element, which is why it requires the array to already be sorted." },
    ],
    commonMistake: "Students often forget that binary search requires sorted data before it can work correctly, or they assume a recursive traversal method automatically stops on its own without carefully identifying the exact base case condition (such as index == arr.length or str.length() == 0) that must be present to prevent infinite recursion.",
  },
  "4.17-intermediate": {
    title: "Tracing Recursive Search Calls to Find Return Values and Call Counts",
    concept: "At this level, tracing a recursive search or sort method requires following the exact sequence of recursive calls it makes for a specific input, not just recognizing the algorithm's general behavior. For linear search and simple String or ArrayList traversal, this means stepping through each index or substring one at a time until a match is found or the base case is reached. For binary search, this means recomputing mid at each step using integer division, comparing it to the target, and following whichever branch narrows the range correctly, since a single miscalculation of mid or a wrong choice of branch changes the entire rest of the trace. Some questions also ask how many total recursive calls occur (including the initial call) before a result is returned, which requires counting every call in the chain, not just identifying the final answer. For merge sort, tracing at this level can also mean determining how many levels of splitting occur for an array of a given size, or what the array looks like after one specific round of merging.",
    examples: [
      { text: "binarySearch(arr, 0, 7, 20), where arr stores {2, 5, 8, 11, 14, 17, 20, 23}:\nCall 1: mid = 3, arr[3] = 11 < 20, so recurse with (4, 7).\nCall 2: mid = 5, arr[5] = 17 < 20, so recurse with (6, 7).\nCall 3: mid = 6, arr[6] = 20, match found, return 6.\nThis trace takes exactly 3 total calls, including the initial one." },
      { text: "An 8-element array takes 3 levels of splitting in merge sort (8 to 4, 4 to 2, 2 to 1), and after the very first round of merges, adjacent single-element pairs like {5} and {2} combine into sorted pairs like {2, 5}." },
    ],
    commonMistake: "Students often lose track of the current low and high values partway through a binary search trace, especially forgetting that mid + 1 or mid - 1 (not mid itself) becomes the new bound, which throws off every remaining step of the trace, or they miscount the total number of recursive calls by forgetting to include the initial call in the total.",
  },
  "4.17-complex": {
    title: "Bugs, Preconditions, and Recursion-Tree Counting in Recursive Search and Sort",
    concept: "The most advanced recursive search and sort questions involve subtle bugs hidden in otherwise-plausible code, or require reasoning about the full recursion tree rather than a single trace. A common bug is an off-by-one base case, such as stopping one index too early (missing the last valid element entirely) or one index too late (causing an out-of-bounds array access). Another common bug is a recursive call that fails to narrow the search range correctly, such as passing mid instead of mid + 1, or passing the same low and high values instead of updating them, which causes infinite recursion and an eventual StackOverflowError rather than a wrong answer. A missing return keyword before a recursive call is a distinct bug: the recursive result gets computed but discarded, so the method silently falls through to whatever statement comes after it. Precondition violations are also tested here: calling binary search on unsorted data, or with low already greater than high, does not crash the program, but it can silently produce an incorrect result or an immediate, uninformative return value. Finally, complex-tier merge sort questions often require counting every call in the full recursion tree, distinguishing between the number of times the merge (combine) helper itself is called versus the total number of calls to the recursive sorting method, including the base-case calls that never split further.",
    examples: [
      { text: "if (low >= high)\n{\n    return -1;\n}\nThis base case is buggy: it should be low > high. When low and high are both equal to the last valid index, this triggers the base case before that final single element can ever be compared to the target, silently making a genuine match unreachable." },
      { text: "For an 8-element array, mergeSort makes 15 total recursive calls (1 + 2 + 4 + 8, one call per node of the full splitting tree), but merge itself is only called 7 times, once for each internal node where two subarrays are actually combined, since the 8 single-element base-case calls never call merge." },
    ],
    commonMistake: "Students often assume that a bug in a recursive search method will always cause a crash or an infinite loop, when many bugs (like an off-by-one base case or a missing return before a recursive call) instead cause the method to terminate normally but silently return an incorrect result, such as -1 or false, even though the target value is genuinely present in the collection.",
  },
};

export function getReview(topic, tier) {
  return REVIEWS[`${topic}-${tier}`] || null;
}
