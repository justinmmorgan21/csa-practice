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
};

export function getReview(topic, tier) {
  return REVIEWS[`${topic}-${tier}`] || null;
}
