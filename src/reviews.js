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
};

export function getReview(topic, tier) {
  return REVIEWS[`${topic}-${tier}`] || null;
}
