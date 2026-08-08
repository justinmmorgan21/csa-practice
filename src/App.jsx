import { useState, useEffect, useCallback } from "react";
import { loadRoster, saveRoster, loadStudentRaw, saveStudent, deleteStudent } from "./storage";
import { hashPassword, loadTeacherPasswordHash, saveTeacherPasswordHash } from "./auth";
import {
  CheckCircle2,
  XCircle,
  Flag,
  Lock,
  Unlock,
  ChevronRight,
  Users,
  GraduationCap,
  RotateCcw,
  Plus,
  Trash2,
  Loader2,
  Download,
  KeyRound,
  LogOut,
} from "lucide-react";

// ===========================================================================
// COURSE / SECTION / UNIT / SEGMENT / TOPIC STRUCTURE
// ===========================================================================
const COURSES = {
  csa: { id: "csa", label: "AP Computer Science A", sections: ["1A", "3A", "4A", "1B"] },
  cs3: { id: "cs3", label: "Computer Science 3 (Data Structures)", sections: ["3B", "4B"] },
};

// Each unit has an ordered list of Segments (matching AP Classroom "Parts").
// Each Segment has an ordered list of Topics. Students auto-advance through
// tiers and topics within a Segment, then STOP and wait for a teacher unlock
// at every Segment boundary and every Unit boundary.
const UNITS = {
  csa: [
    {
      id: "u1",
      label: "Unit 1: Using Objects and Methods",
      segments: [
        { id: "u1sA", label: "Segment A (Topics 1.1-1.4)", topics: ["1.1", "1.2", "1.3", "1.4"] },
        // Segment B (1.5-1.9) and Segment C (1.10-1.15) will be added here later.
      ],
    },
    // Units 2-4 will be added here later.
  ],
  cs3: [
    // No content yet.
  ],
};

const TOPIC_LABELS = {
  "1.1": "Intro to Algorithms & Compilers",
  "1.2": "Variables & Data Types",
  "1.3": "Expressions & Output",
  "1.4": "Assignment Statements & Input",
};

const TIER_ORDER = ["basic", "intermediate", "complex"];
const DISPLAY_STAGES = ["basic", "intermediate", "complex", "mastered"];
const TIER_LABELS = { basic: "Basic", intermediate: "Intermediate", complex: "Complex", mastered: "Mastered" };
const TIER_COLORS = {
  basic: "bg-sky-100 text-sky-800 border-sky-300",
  intermediate: "bg-indigo-100 text-indigo-800 border-indigo-300",
  complex: "bg-violet-100 text-violet-800 border-violet-300",
  mastered: "bg-emerald-100 text-emerald-800 border-emerald-300",
};

// ---------------------------------------------------------------------------
// Structure helpers
// ---------------------------------------------------------------------------
function getUnit(course, unitId) {
  return (UNITS[course] || []).find((u) => u.id === unitId) || null;
}
function getSegment(course, unitId, segmentId) {
  const u = getUnit(course, unitId);
  return u ? u.segments.find((s) => s.id === segmentId) || null : null;
}
function resolveNextTopic(course, unitId, segmentId, currentTopic) {
  const seg = getSegment(course, unitId, segmentId);
  if (!seg) return null;
  const idx = seg.topics.indexOf(currentTopic);
  if (idx >= 0 && idx + 1 < seg.topics.length) {
    return { unitId, segmentId, topic: seg.topics[idx + 1] };
  }
  return null;
}
// Where should a student go after finishing every topic in a Segment?
// Used both to preview (for messaging) and to actually apply an unlock.
function resolveNextSegmentOrUnit(course, unitId, segmentId) {
  const unit = getUnit(course, unitId);
  if (!unit) return null;
  const segIdx = unit.segments.findIndex((s) => s.id === segmentId);
  if (segIdx >= 0 && segIdx + 1 < unit.segments.length) {
    const nextSeg = unit.segments[segIdx + 1];
    return { unitId, segmentId: nextSeg.id, topic: nextSeg.topics[0] };
  }
  const units = UNITS[course] || [];
  const unitIdx = units.findIndex((u) => u.id === unitId);
  if (unitIdx >= 0 && unitIdx + 1 < units.length) {
    const nextUnit = units[unitIdx + 1];
    const nextSeg = nextUnit.segments[0];
    return { unitId: nextUnit.id, segmentId: nextSeg.id, topic: nextSeg.topics[0] };
  }
  return null; // nothing further configured yet
}

// ===========================================================================
// ITEM BANK -- currently CSA Unit 1 / Segment A (Topics 1.1-1.4) only.
// All items are original; none are reused from official AP Classroom
// Progress Check assessments, which remain reserved for actual quizzes.
// ===========================================================================
const ITEM_BANK = [
  // ---- 1.1 ----
  { id: "1.1-b1", course: "csa", topic: "1.1", tier: "basic", lo: "1.1.A", prompt: "Which of the following best describes sequencing in an algorithm?",
    choices: ["Repeating a step until a condition is met", "Completing the steps of a process in a specific order, one at a time", "Choosing between two different steps based on a condition", "Skipping steps that are not needed"],
    answer: 1, explanation: "Sequencing means completing the steps of a process in a specific order, one at a time." },
  { id: "1.1-b2", course: "csa", topic: "1.1", tier: "basic", lo: "1.1.B", prompt: "What is the primary role of a compiler?",
    choices: ["To execute a program and display its output", "To translate code into a diagram representing its logic", "To check code for certain types of errors before the program runs", "To fix logic errors automatically before a program runs"],
    answer: 2, explanation: "A compiler checks code for certain types of errors (syntax errors) before the program is allowed to run." },
  { id: "1.1-b3", course: "csa", topic: "1.1", tier: "basic", lo: "1.1.C", prompt: "A student writes a program, but it fails to compile because a semicolon is missing at the end of a statement. What type of error is this?",
    choices: ["Syntax error", "Logic error", "Run-time error", "Exception"],
    answer: 0, explanation: "A missing semicolon breaks the rules of the language's syntax, so the compiler catches it as a syntax error." },
  { id: "1.1-b4", course: "csa", topic: "1.1", tier: "basic", lo: "1.1.A", prompt: "A recipe for baking a cake is written in plain English, listing each step in order (mix dry ingredients, add wet ingredients, pour into pan, bake). Which of the following best describes this recipe?",
    choices: ["It cannot be an algorithm because it is not written in a programming language like Java.", "It is an algorithm, because it defines a step-by-step process to accomplish a task, and algorithms do not need to be written in a specific programming language.", "It is an algorithm only once someone translates it into Java code.", "It is a compiler, because it converts instructions into a result."],
    answer: 1, explanation: "Algorithms are step-by-step processes and can be represented in written language or diagrams -- they don't need to be written in a programming language." },
  { id: "1.1-b5", course: "csa", topic: "1.1", tier: "basic", lo: "1.1.B", prompt: "A student writes a Java program but forgets to include a closing curly brace } at the end of a class. What will happen when the student tries to run the program?",
    choices: ["The program will run normally, ignoring the missing brace.", "The program will run but produce an incorrect result.", "The compiler will detect an error, and the student must fix it before the program can run.", "The program will run and then crash partway through with an exception."],
    answer: 2, explanation: "A missing brace is a syntax error, which the compiler detects. It must be fixed before the program can be run." },
  { id: "1.1-b6", course: "csa", topic: "1.1", tier: "basic", lo: "1.1.C", prompt: "A program is supposed to print the larger of two numbers, but due to a mistake in the code's conditional logic, it sometimes prints the smaller number instead. The program compiles and runs without crashing. What type of error is this?",
    choices: ["Syntax error", "Logic error", "Run-time error", "Exception"],
    answer: 1, explanation: "The program runs without crashing but produces an incorrect result -- that's a logic error, found by testing." },
  { id: "1.1-b7", course: "csa", topic: "1.1", tier: "basic", lo: "1.1.C", prompt: "A program compiles with no errors. While running, it attempts to access the 10th element of a list that only has 5 elements, and the program crashes immediately with an error message. What type of error is this?",
    choices: ["Syntax error", "Logic error", "Run-time error (exception)", "Compiler error"],
    answer: 2, explanation: "This is a run-time error (specifically an exception) -- it occurs during execution and was not caught by the compiler." },
  { id: "1.1-i1", course: "csa", topic: "1.1", tier: "intermediate", lo: "1.1.A", prompt: "A student wants to write an algorithm to determine how many identical square tiles, each covering exactly one square foot, are needed to completely cover a rectangular floor. Which of the following algorithms correctly determines this?",
    choices: ["Step 1: Add the floor's length and width. Step 2: Multiply the result by 2.", "Step 1: Multiply the floor's length by its width.", "Step 1: Add the floor's length and width.", "Step 1: Subtract the floor's width from its length. Step 2: Multiply the result by 2."],
    answer: 1, explanation: "The number of unit tiles needed equals the floor's area, which is found by multiplying its length by its width." },
  { id: "1.1-i2", course: "csa", topic: "1.1", tier: "intermediate", lo: "1.1.A", prompt: "A painter wants an algorithm to determine the total amount of paint, in gallons, needed to cover two rectangular walls. Each wall requires paint equal to its height multiplied by its width, and one gallon covers exactly one square foot. Which of the following algorithms correctly determines the total gallons needed?",
    choices: ["Step 1: Multiply wall1's height by wall2's height. Step 2: Multiply wall1's width by wall2's width. Step 3: Add the results.", "Step 1: Multiply wall1's height by wall1's width. Step 2: Multiply wall2's height by wall2's width. Step 3: Add the results.", "Step 1: Add wall1's height and width. Step 2: Add wall2's height and width. Step 3: Multiply the results.", "Step 1: Add wall1's height to wall2's height. Step 2: Add wall1's width to wall2's width. Step 3: Multiply the results."],
    answer: 1, explanation: "Each wall's paint need is its own height x width. Adding the two individual amounts gives the total gallons needed." },
  { id: "1.1-i3", course: "csa", topic: "1.1", tier: "intermediate", lo: "1.1.C", prompt: "A student wrote a program that is supposed to determine whether a number entered by the user is even or odd. The program compiles and runs without crashing, but it sometimes labels even numbers as odd. Which of the following strategies is most likely to help the student identify the source of the error?",
    choices: ["Rewriting the entire program from scratch without examining the current code", "Inserting print statements to display the value of key variables at different points in the program", "Assuming the compiler will flag the mistake the next time the program is compiled", "Running the program again without making any changes, hoping the error does not reoccur"],
    answer: 1, explanation: "Print statements reveal what the program is doing as it runs, which helps pinpoint exactly where the incorrect result is introduced." },
  { id: "1.1-c1", course: "csa", topic: "1.1", tier: "complex", lo: "1.1.A", prompt: "A student is designing an algorithm to determine the largest of three numbers, a, b, and c. Which sequence of steps correctly accomplishes this task for all possible values of a, b, and c?",
    choices: ["Step 1: Compare a and b, keep the larger. Step 2: Compare the result to c, keep the larger.", "Step 1: Compare a and b, keep the larger. Step 2: Compare a and c, keep the larger.", "Step 1: Add a, b, and c. Step 2: Divide by 3.", "Step 1: Compare b and c, keep the smaller. Step 2: Compare the result to a, keep the smaller."],
    answer: 0, explanation: "Only option A correctly carries the running largest value into the second comparison for every case." },
  { id: "1.1-c2", course: "csa", topic: "1.1", tier: "complex", lo: "1.1.B", prompt: "A student's program compiles with no errors, but every time it runs, it closes unexpectedly partway through and displays a message referring to a \"NullPointerException.\" Which of the following best explains this situation?",
    choices: ["The compiler failed to catch a syntax error, causing this behavior.", "This is a logic error, since the program produced an unexpected outcome.", "This is a run-time error called an exception, which occurs during execution and was not caught by the compiler.", "This is not a real error; the program is working as intended."],
    answer: 2, explanation: "An exception is a run-time error that occurs during execution and interrupts the program -- it isn't something the compiler could have caught." },
  { id: "1.1-c3", course: "csa", topic: "1.1", tier: "complex", lo: "1.1.C", prompt: "A program compiles and runs to completion without crashing, but it consistently calculates an incorrect average for a list of test scores. Which type of error is most likely present, and how would it most likely be found?",
    choices: ["Syntax error; found by the compiler before the program runs.", "Logic error; found by testing the program with known input and checking the output.", "Run-time error; found because the program terminates abnormally.", "Exception; found because the program displays an error message during execution."],
    answer: 1, explanation: "The program runs to completion but gives a wrong result -- a logic error, which is found by testing with known inputs." },
  { id: "1.1-c4", course: "csa", topic: "1.1", tier: "complex", lo: "1.1.A", prompt: "A programmer wants to find the average of a list of numbers. She first writes out the steps in plain English: \"Add all the numbers together. Divide the sum by how many numbers there are.\" She later translates these steps into Java code. Which of the following is true about the relationship between her plain-English steps and her Java code?",
    choices: ["The plain-English steps are not a real algorithm until they are written in Java.", "Both the plain-English steps and the Java code represent the same algorithm; Java is just one way to implement it.", "The Java code is the algorithm, and the plain-English steps are just documentation.", "An algorithm can only exist once it has been compiled."],
    answer: 1, explanation: "The plain-English steps already form the algorithm. Java is simply one language used to implement that same algorithm." },
  { id: "1.1-c5", course: "csa", topic: "1.1", tier: "complex", lo: "1.1.B", prompt: "A student writes two separate code segments. Segment 1 is missing a semicolon at the end of a statement. Segment 2 has all correct syntax, but divides a number by a variable that turns out to be 0 when the program runs. Which of the following correctly describes what will happen with each segment?",
    choices: ["Both segments will fail to compile.", "Segment 1 will fail to compile; Segment 2 will compile but may cause a run-time error when executed.", "Segment 1 will compile and run correctly; Segment 2 will fail to compile.", "Both segments will compile and run without any errors."],
    answer: 1, explanation: "Segment 1 has a syntax error, caught at compile time. Segment 2 is syntactically valid but can trigger a run-time error (division by zero) only once it executes." },
  { id: "1.1-c6", course: "csa", topic: "1.1", tier: "complex", lo: "1.1.C", prompt: "Situation 1: The program will not compile because a variable name is misspelled in one place. Situation 2: The program compiles and runs to completion, but consistently gives the wrong answer for a calculation. Situation 3: The program compiles, runs, and unexpectedly stops partway through with a \"division by zero\" message. Which of the following correctly identifies the error type for each situation?",
    choices: ["1: Logic error, 2: Syntax error, 3: Run-time error", "1: Syntax error, 2: Logic error, 3: Run-time error (exception)", "1: Run-time error, 2: Syntax error, 3: Logic error", "1: Syntax error, 2: Run-time error, 3: Logic error"],
    answer: 1, explanation: "1 is a syntax error (caught by the compiler). 2 is a logic error (wrong result, found by testing). 3 is a run-time error / exception (crashes during execution)." },

  // ---- 1.2 ----
  { id: "1.2-b1", course: "csa", topic: "1.2", tier: "basic", lo: "1.2.A", prompt: "Which of the following best distinguishes a primitive data type from a reference data type in Java?",
    choices: ["Primitive types can only store whole numbers, while reference types can store decimals.", "Primitive types directly store a value of that type, while reference types are used to define objects that are not primitive types.", "Primitive types are used only for text, while reference types are used only for numbers.", "There is no meaningful difference between primitive and reference types."],
    answer: 1, explanation: "A primitive type directly stores a value of that type. A reference type is used to define objects that are not primitive types." },
  { id: "1.2-b2", course: "csa", topic: "1.2", tier: "basic", lo: "1.2.A", prompt: "A programmer needs a variable to store a person's exact age in whole years. Which category of data type is most appropriate?",
    choices: ["Reference type, because age is a property of a person object", "Primitive type, because the value is a number", "Neither, since age does not need to be stored", "Reference type, because ages can be compared using =="],
    answer: 1, explanation: "A whole number like age is best represented with a primitive numeric type." },
  { id: "1.2-b3", course: "csa", topic: "1.2", tier: "basic", lo: "1.2.B", prompt: "Which of the following correctly declares and initializes an int variable named count with the value 10?",
    choices: ["int count = 10;", "double count = 10;", "int count = \"10\";", "count int = 10;"],
    answer: 0, explanation: "int count = 10; correctly declares an int variable and initializes it with the integer value 10." },
  { id: "1.2-b4", course: "csa", topic: "1.2", tier: "basic", lo: "1.2.B", prompt: "A variable needs to store a temperature reading that may include decimal values, such as 98.6. Which data type is most appropriate for this variable?",
    choices: ["int", "boolean", "double", "String"],
    answer: 2, explanation: "double is the primitive type used for real numbers, including decimal values." },
  { id: "1.2-b5", course: "csa", topic: "1.2", tier: "basic", lo: "1.2.B", prompt: "Which of the following values could correctly be stored in a variable declared as boolean isReady;?",
    choices: ["1", "\"true\"", "true", "0"],
    answer: 2, explanation: "A boolean variable can only store the values true or false, not the numbers 1/0 or the String \"true\"." },
  { id: "1.2-b6", course: "csa", topic: "1.2", tier: "basic", lo: "1.2.B", prompt: "Which of the following best describes a variable in Java?",
    choices: ["A fixed value that cannot be changed once the program starts running", "A storage location that holds a value, which can change while the program runs, and has a name and an associated data type", "A type of method used to perform calculations", "A keyword used only to declare classes"],
    answer: 1, explanation: "A variable is a storage location with a name and data type, whose value can change while the program runs." },
  { id: "1.2-i1", course: "csa", topic: "1.2", tier: "intermediate", lo: "1.2.A", prompt: "A program needs variables to represent whether a package has been delivered and the number of days it has been in transit. Which of the following pairs of variable declarations is most appropriate?",
    choices: ["boolean delivered; boolean daysInTransit;", "int delivered; int daysInTransit;", "boolean delivered; int daysInTransit;", "int delivered; boolean daysInTransit;"],
    answer: 2, explanation: "Whether something is true/false fits boolean; a count of days fits int." },
  { id: "1.2-i2", course: "csa", topic: "1.2", tier: "intermediate", lo: "1.2.B", prompt: "A student declares a variable using the statement: double price = 20; Which of the following is true about this statement?",
    choices: ["It causes a compile-time error because 20 is not a decimal literal.", "It is valid; the int value 20 is automatically converted to the double value 20.0 when stored in price.", "It is valid, but price will store the value 20 as an int.", "It is valid only if 20 is written as 20.0."],
    answer: 1, explanation: "An int literal can be assigned to a double variable; it is automatically converted (widened) to 20.0." },
  { id: "1.2-i3", course: "csa", topic: "1.2", tier: "intermediate", lo: "1.2.A", prompt: "A class named Robot is used to create Robot objects. Which of the following statements about a variable declared as Robot myRobot; is true?",
    choices: ["myRobot is a primitive type variable that stores a Robot value directly.", "myRobot is a reference type variable, since Robot is not one of the primitive types used in this course.", "myRobot can only store the values true or false.", "myRobot must be declared using the keyword int."],
    answer: 1, explanation: "Robot is not one of the three primitive types (int, double, boolean), so myRobot is a reference type variable." },
  { id: "1.2-c1", course: "csa", topic: "1.2", tier: "complex", lo: "1.2.A", prompt: "Consider the following variable declarations: int score; boolean isPassing; String name; double average; Which of these variables is a reference type?",
    choices: ["score", "isPassing", "name", "average"],
    answer: 2, explanation: "String is not one of the three primitive types in this course, so name is a reference type. The others are primitive types." },
  { id: "1.2-c2", course: "csa", topic: "1.2", tier: "complex", lo: "1.2.B", prompt: "A program needs to track a student's exact exam score (which may include decimal points, such as 87.5) and whether the student passed the exam. Which pair of declarations is most appropriate?",
    choices: ["int examScore; boolean passed;", "double examScore; boolean passed;", "double examScore; int passed;", "boolean examScore; double passed;"],
    answer: 1, explanation: "A decimal score needs double; a true/false result needs boolean." },
  { id: "1.2-c3", course: "csa", topic: "1.2", tier: "complex", lo: "1.2.B", prompt: "A student attempts to declare a variable as follows: float temperature = 98.6f; Which of the following best explains why this is problematic in the context of this course?",
    choices: ["float is not a valid keyword in Java.", "The value 98.6f is not a valid literal.", "float is not one of the three primitive data types (int, double, boolean) covered in this course; double should be used instead.", "Variables cannot store decimal values in Java."],
    answer: 2, explanation: "Only int, double, and boolean are the primitive types used in this course; float is outside its scope." },
  { id: "1.2-c4", course: "csa", topic: "1.2", tier: "complex", lo: "1.2.A", prompt: "A parking garage program needs to track: the number of open parking spots (a whole number), and whether the garage is currently full. Which of the following declarations is most appropriate?",
    choices: ["double openSpots; boolean isFull;", "int openSpots; boolean isFull;", "boolean openSpots; int isFull;", "int openSpots; double isFull;"],
    answer: 1, explanation: "A whole-number count fits int; a true/false condition fits boolean." },
  { id: "1.2-c5", course: "csa", topic: "1.2", tier: "complex", lo: "1.2.B", prompt: "Which of the following code segments will NOT compile?",
    choices: ["int x = 5;", "double y = 5;", "boolean b = 1;", "double z = 5.0;"],
    answer: 2, explanation: "A boolean variable cannot be assigned an int value like 1 -- it must be assigned true or false." },

  // ---- 1.3 ----
  { id: "1.3-b1", course: "csa", topic: "1.3", tier: "basic", lo: "1.3.A", prompt: "What is the difference between System.out.print and System.out.println?",
    choices: ["print displays text in red; println displays text in black.", "println moves the cursor to a new line after displaying its output; print does not.", "print can only display numbers; println can only display text.", "There is no difference; they behave identically."],
    answer: 1, explanation: "println moves the cursor to a new line after displaying its output, while print does not." },
  { id: "1.3-b2", course: "csa", topic: "1.3", tier: "basic", lo: "1.3.A", prompt: "What is printed as a result of executing the following code segment?\nSystem.out.print(\"A\");\nSystem.out.println(\"B\");\nSystem.out.print(\"C\");",
    choices: ["ABC", "A\nBC", "AB\nC", "A B C (each on its own line)"],
    answer: 2, explanation: "print(\"A\") and println(\"B\") produce \"AB\" followed by a new line, then print(\"C\") continues on the next line." },
  { id: "1.3-b3", course: "csa", topic: "1.3", tier: "basic", lo: "1.3.B", prompt: "Which of the following is a string literal?",
    choices: ["count", "25", "\"Hello\"", "true"],
    answer: 2, explanation: "A string literal is a sequence of characters enclosed in double quotes, such as \"Hello\"." },
  { id: "1.3-b4", course: "csa", topic: "1.3", tier: "basic", lo: "1.3.B", prompt: "Which of the following escape sequences causes a new line to be printed within a string?",
    choices: ["\\t", "\\n", "\\\\", "\\\""],
    answer: 1, explanation: "The escape sequence \\n represents a newline." },
  { id: "1.3-b5", course: "csa", topic: "1.3", tier: "basic", lo: "1.3.C", prompt: "What is the result of the expression 7 / 2 in Java, where both values are int literals?",
    choices: ["3.5", "3", "4", "3.0"],
    answer: 1, explanation: "Dividing two int values gives only the integer portion of the quotient, so 7 / 2 evaluates to 3." },
  { id: "1.3-b6", course: "csa", topic: "1.3", tier: "basic", lo: "1.3.C", prompt: "What is the result of the expression 7.0 / 2 in Java?",
    choices: ["3", "3.5", "4", "3.0"],
    answer: 1, explanation: "When at least one value is a double, the division evaluates to the full quotient: 3.5." },
  { id: "1.3-b7", course: "csa", topic: "1.3", tier: "basic", lo: "1.3.C", prompt: "What is the value of the expression 10 % 3?",
    choices: ["3", "1", "0", "3.33"],
    answer: 1, explanation: "The remainder operator gives the remainder after division: 10 divided by 3 leaves a remainder of 1." },
  { id: "1.3-i1", course: "csa", topic: "1.3", tier: "intermediate", lo: "1.3.C", prompt: "What is the value of x after the following code segment executes?\nint x = 2 + 3 * 4;",
    choices: ["20", "14", "24", "9"],
    answer: 1, explanation: "Multiplication has precedence over addition: 3 * 4 = 12, then 2 + 12 = 14." },
  { id: "1.3-i2", course: "csa", topic: "1.3", tier: "intermediate", lo: "1.3.C", prompt: "What is the value of result after the following code executes?\ndouble result = 5 + 3 / 2;",
    choices: ["6.5", "6.0", "4.0", "6"],
    answer: 1, explanation: "3 / 2 is int division, giving 1. Then 5 + 1 = 6, widened to the double value 6.0 when stored in result." },
  { id: "1.3-i3", course: "csa", topic: "1.3", tier: "intermediate", lo: "1.3.B", prompt: "What is printed as a result of executing the following statement?\nSystem.out.println(\"She said \\\"hello\\\".\");",
    choices: ["She said hello.", "She said \"hello\".", "She said \\\"hello\\\".", "An error occurs because quotes cannot be used inside a string."],
    answer: 1, explanation: "The escape sequence \\\" prints an actual double-quote character." },
  { id: "1.3-c1", course: "csa", topic: "1.3", tier: "complex", lo: "1.3.C", prompt: "What happens when the following code segment executes?\nint a = 10;\nint b = 0;\nint result = a / b;\nSystem.out.print(result);",
    choices: ["The code prints 0.", "The code prints Infinity.", "The code throws an ArithmeticException at run time.", "The code fails to compile."],
    answer: 2, explanation: "Dividing an int by the int value 0 throws an ArithmeticException at run time." },
  { id: "1.3-c2", course: "csa", topic: "1.3", tier: "complex", lo: "1.3.C", prompt: "What is the value of x after the following code executes?\nint x = (2 + 3) * 4 % 5;",
    choices: ["0", "20", "4", "1"],
    answer: 0, explanation: "(2 + 3) = 5, then 5 * 4 = 20, then 20 % 5 = 0." },
  { id: "1.3-c3", course: "csa", topic: "1.3", tier: "complex", lo: "1.3.C", prompt: "Consider the expression: 9 / 2 * 1.0. Which best describes how this expression is evaluated, and what is its final value?",
    choices: ["The entire expression is treated as a double from the start, giving 4.5.", "9 / 2 is evaluated first as int division, giving 4; then 4 * 1.0 gives 4.0.", "2 * 1.0 is evaluated first, giving 2.0; then 9 / 2.0 gives 4.5.", "The expression does not compile because int and double values cannot be mixed."],
    answer: 1, explanation: "Operators of equal precedence evaluate left to right: 9 / 2 (int division) = 4 first, then 4 * 1.0 = 4.0." },
  { id: "1.3-c4", course: "csa", topic: "1.3", tier: "complex", lo: "1.3.A", prompt: "What is printed as a result of executing the following code segment?\nSystem.out.print(\"Score: \");\nSystem.out.println(100);\nSystem.out.print(\"Done\");",
    choices: ["Score: 100 Done", "Score: 100\nDone", "Score: \n100Done", "Score:100Done"],
    answer: 1, explanation: "print keeps the cursor on the same line, then println moves to a new line before Done is printed." },
  { id: "1.3-c5", course: "csa", topic: "1.3", tier: "complex", lo: "1.3.C", prompt: "What is the value of y after the following code executes?\nint y = 17 % 5 + 17 / 5;",
    choices: ["5", "3.4", "2", "8.4"],
    answer: 0, explanation: "17 % 5 = 2, and 17 / 5 = 3 (int division). 2 + 3 = 5." },
  { id: "1.3-c6", course: "csa", topic: "1.3", tier: "complex", lo: "1.3.C", prompt: "Which of the following expressions will cause an ArithmeticException when evaluated?",
    choices: ["5 / 2", "5 / 0", "5.0 / 0", "5 % 2"],
    answer: 1, explanation: "Dividing an int by the int value 0 throws an ArithmeticException. Dividing a double by 0 does not." },

  // ---- 1.4 ----
  { id: "1.4-b1", course: "csa", topic: "1.4", tier: "basic", lo: "1.4.A", prompt: "What does the assignment operator = do in a statement like x = 5;?",
    choices: ["It checks whether x is equal to 5.", "It stores the value of the expression on the right side into the variable on the left side.", "It declares a new variable named x.", "It compares x to 5 and returns true or false."],
    answer: 1, explanation: "The assignment operator stores the value of the right-hand expression into the variable on the left." },
  { id: "1.4-b2", course: "csa", topic: "1.4", tier: "basic", lo: "1.4.A", prompt: "Which of the following best describes when a variable must be assigned a value in Java?",
    choices: ["A variable never needs to be assigned a value.", "A variable must be assigned a value before it can be used in an expression.", "A variable is automatically assigned a value of 0 and never needs explicit assignment.", "A variable only needs a value if it is a boolean."],
    answer: 1, explanation: "Every variable must be assigned a value before it can be used in an expression." },
  { id: "1.4-b3", course: "csa", topic: "1.4", tier: "basic", lo: "1.4.A", prompt: "Which of the following is true about the value null in Java?",
    choices: ["null can be assigned to any primitive type, such as int or double.", "null can be assigned to a reference type to indicate it is not associated with any object.", "null is a keyword used only inside loops.", "null automatically converts to the value 0."],
    answer: 1, explanation: "null is a special value used to indicate that a reference type variable is not associated with any object." },
  { id: "1.4-b4", course: "csa", topic: "1.4", tier: "basic", lo: "1.4.A", prompt: "During program execution, what does an expression like 3 + 4 evaluate to?",
    choices: ["Nothing; expressions are only used for output.", "A single value, which has a type based on how the expression was evaluated.", "A method call.", "A variable declaration."],
    answer: 1, explanation: "An expression is evaluated to produce a single value, and that value has a type based on the evaluation." },
  { id: "1.4-b5", course: "csa", topic: "1.4", tier: "basic", lo: "1.4.B", prompt: "Which class is commonly used in this course to obtain text input from the keyboard?",
    choices: ["System", "Scanner", "String", "Math"],
    answer: 1, explanation: "The Scanner class is one way to obtain text input from the keyboard." },
  { id: "1.4-b6", course: "csa", topic: "1.4", tier: "basic", lo: "1.4.A", prompt: "What is the value of y after the following code executes?\nint x = 4;\nint y = x;\nx = 10;",
    choices: ["4", "10", "0", "14"],
    answer: 0, explanation: "y is assigned the value of x (4) at that moment. Changing x afterward does not affect y." },
  { id: "1.4-i1", course: "csa", topic: "1.4", tier: "intermediate", lo: "1.4.A", prompt: "What is printed as a result of executing the following code segment?\nint a = 5;\na = a + 3;\na = a * 2;\nSystem.out.print(a);",
    choices: ["8", "16", "13", "5"],
    answer: 1, explanation: "a becomes 5 + 3 = 8, then 8 * 2 = 16." },
  { id: "1.4-i2", course: "csa", topic: "1.4", tier: "intermediate", lo: "1.4.A", prompt: "Consider the following code segment:\nString name = null;\nSystem.out.print(name);\nWhich of the following best describes what happens?",
    choices: ["The code fails to compile because null cannot be assigned to a String.", "The code compiles and runs, printing the word null.", "The code throws an exception at compile time.", "The code compiles but prints nothing at all."],
    answer: 1, explanation: "String is a reference type, so it can be assigned null. Printing a null reference displays the word null." },
  { id: "1.4-i3", course: "csa", topic: "1.4", tier: "intermediate", lo: "1.4.A", prompt: "Consider the following code segment:\nint p = 3;\nint q = 8;\nint temp = p;\np = q;\nq = temp;\nSystem.out.println(p);\nSystem.out.println(q);\nWhat is printed?",
    choices: ["3 then 8", "8 then 3", "3 then 3", "8 then 8"],
    answer: 1, explanation: "This swaps the values: p becomes 8 (q's original value) and q becomes 3 (saved in temp)." },
  { id: "1.4-c1", course: "csa", topic: "1.4", tier: "complex", lo: "1.4.A", prompt: "Consider the following code segment:\nint total;\nSystem.out.print(total);\nWhich of the following best describes the result of executing this code?",
    choices: ["It prints 0, since int variables default to 0.", "It fails to compile, since total is used before it has been assigned a value.", "It prints null.", "It throws a run-time exception, but the program continues."],
    answer: 1, explanation: "A local variable must be assigned a value before it can be used in an expression; using it first causes a compile-time error." },
  { id: "1.4-c2", course: "csa", topic: "1.4", tier: "complex", lo: "1.4.A", prompt: "Consider the following code segment:\nString message = \"Hello\";\nmessage = null;\nmessage = \"Goodbye\";\nSystem.out.println(message);\nWhat is printed?",
    choices: ["Hello", "null", "Goodbye", "The code fails to compile because message was set to null."],
    answer: 2, explanation: "A reference variable can be reassigned multiple times. The final assignment, \"Goodbye\", is what is printed." },
  { id: "1.4-c3", course: "csa", topic: "1.4", tier: "complex", lo: "1.4.A", prompt: "Which of the following assignment statements will NOT compile, given the declaration int count = 0;?",
    choices: ["count = 5;", "count = count + 1;", "count = 2.5;", "count = count * 2;"],
    answer: 2, explanation: "Assigning a double literal like 2.5 to an int variable without an explicit cast causes a compile-time error." },
  { id: "1.4-c4", course: "csa", topic: "1.4", tier: "complex", lo: "1.4.B", prompt: "A program needs to read a line of text typed by the user at the keyboard. Which of the following best describes an appropriate approach in this course?",
    choices: ["Use the Math class to retrieve keyboard input.", "Use a Scanner object to obtain input from the keyboard.", "Input from the keyboard is outside the scope of Java entirely.", "Use the System.out class to read input."],
    answer: 1, explanation: "A Scanner object is used to obtain text input from the keyboard." },
  { id: "1.4-c5", course: "csa", topic: "1.4", tier: "complex", lo: "1.4.A", prompt: "What is printed as a result of executing the following code segment?\nint a = 2;\nint b = 5;\na = b;\nb = a + 3;\nSystem.out.println(a);\nSystem.out.println(b);",
    choices: ["2 then 5", "5 then 8", "5 then 5", "2 then 8"],
    answer: 1, explanation: "a is reassigned to b's value, 5. Then b is reassigned to a + 3 = 5 + 3 = 8." },
];

function itemsForTopicTier(course, topic, tier) {
  return ITEM_BANK.filter((it) => it.course === course && it.topic === topic && it.tier === tier);
}

// Returns an [unit, segment, topic, tier] index tuple for ordering students by
// how far along they are. Lower = earlier/less progress. Used to sort the
// Teacher dashboard roster.
function positionTuple(course, data) {
  if (!data || !data.unitId) return [-1, -1, -1, -1];
  const units = UNITS[course] || [];
  const unitIdx = units.findIndex((u) => u.id === data.unitId);
  const unit = units[unitIdx];
  const segmentIdx = unit ? unit.segments.findIndex((s) => s.id === data.segmentId) : -1;
  const segment = unit ? unit.segments[segmentIdx] : null;
  const topicIdx = segment ? segment.topics.indexOf(data.topic) : -1;
  const tierIdx = DISPLAY_STAGES.indexOf(data.tier);
  return [unitIdx, segmentIdx, topicIdx, tierIdx];
}
function compareTuples(a, b) {
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return a[i] - b[i];
  }
  return 0;
}

function slugify(name) {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").slice(0, 40) || "student";
}
function sample(arr, n) {
  const pool = [...arr];
  const out = [];
  while (out.length < n && pool.length > 0) {
    const idx = Math.floor(Math.random() * pool.length);
    out.push(pool.splice(idx, 1)[0]);
  }
  return out;
}

function generatePin() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

function emptyStudent(displayName, course) {
  const firstUnit = (UNITS[course] || [])[0] || null;
  const firstSegment = firstUnit ? firstUnit.segments[0] : null;
  const firstTopic = firstSegment ? firstSegment.topics[0] : null;
  return {
    displayName,
    pin: generatePin(),
    unitId: firstUnit ? firstUnit.id : null,
    segmentId: firstSegment ? firstSegment.id : null,
    topic: firstTopic,
    tier: firstTopic ? TIER_ORDER[0] : null,
    misses: 0,
    flagged: false,
    locked: false,
    lockedAt: null,
    masteredTopics: [],
    history: [],
    createdAt: Date.now(),
  };
}

// Backfills a PIN for any student record created before PINs existed.
function ensurePin(data) {
  if (data && !data.pin) data.pin = generatePin();
  return data;
}

function accuracy(history) {
  if (!history || history.length === 0) return null;
  const correct = history.filter((h) => h.correct).length;
  return Math.round((correct / history.length) * 100);
}

// ---------------------------------------------------------------------------
// Storage helpers now live in ./storage.js (Firestore-backed) and are
// imported at the top of this file.
// ---------------------------------------------------------------------------

async function exportAllData() {
  const result = { exportedAt: new Date().toISOString(), courses: {} };
  for (const courseId of Object.keys(COURSES)) {
    result.courses[courseId] = {};
    for (const sectionId of COURSES[courseId].sections) {
      const roster = await loadRoster(courseId, sectionId);
      const students = {};
      for (const name of roster) {
        const data = await loadStudentRaw(courseId, sectionId, slugify(name));
        students[name] = data || emptyStudent(name, courseId);
      }
      result.courses[courseId][sectionId] = { roster, students };
    }
  }
  return result;
}

function downloadJson(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ---------------------------------------------------------------------------
// Visual pipeline pieces
// ---------------------------------------------------------------------------
function TopicRow({ course, unitId, segmentId, currentTopic, masteredTopics }) {
  const seg = getSegment(course, unitId, segmentId);
  if (!seg) return null;
  return (
    <div className="flex items-center gap-1.5 mb-3">
      {seg.topics.map((t) => {
        const done = masteredTopics.includes(t);
        const active = t === currentTopic && !done;
        return (
          <div key={t} className={`flex-1 text-center py-1.5 rounded-md text-xs font-mono border ${
            done ? "bg-emerald-500 border-emerald-500 text-white"
              : active ? "bg-indigo-600 border-indigo-600 text-white"
              : "bg-white border-slate-200 text-slate-400"
          }`}>
            {done ? <CheckCircle2 size={12} className="inline mb-0.5" /> : null} {t}
          </div>
        );
      })}
    </div>
  );
}

function TierTrack({ tier, flagged }) {
  const currentIdx = DISPLAY_STAGES.indexOf(tier);
  return (
    <div className="w-full">
      <div className="grid" style={{ gridTemplateColumns: `repeat(${DISPLAY_STAGES.length}, 1fr)` }}>
        {DISPLAY_STAGES.map((s, i) => {
          const isMasteredStage = s === "mastered";
          const done = i < currentIdx;
          const active = i === currentIdx;
          const filled = done || (active && isMasteredStage); // reaching Mastered counts as "achieved", not "in progress"
          let circleStyle = "border-slate-300 bg-white text-slate-400";
          if (flagged && active && !isMasteredStage) circleStyle = "border-rose-500 bg-rose-100 text-rose-700";
          else if (filled) circleStyle = "border-emerald-500 bg-emerald-500 text-white";
          else if (active) circleStyle = "border-indigo-500 bg-indigo-500 text-white";
          return (
            <div key={s} className="flex items-center">
              <div className={`h-0.5 flex-1 ${i === 0 ? "opacity-0" : i - 1 < currentIdx ? "bg-emerald-500" : "bg-slate-200"}`} />
              <div className={`flex items-center justify-center w-7 h-7 rounded-full border-2 shrink-0 font-mono text-xs ${circleStyle}`}>
                {flagged && active && !isMasteredStage ? <Flag size={14} /> : filled ? <CheckCircle2 size={16} /> : i + 1}
              </div>
              <div className={`h-0.5 flex-1 ${i === DISPLAY_STAGES.length - 1 ? "opacity-0" : i < currentIdx ? "bg-emerald-500" : "bg-slate-200"}`} />
            </div>
          );
        })}
      </div>
      <div className="grid mt-2" style={{ gridTemplateColumns: `repeat(${DISPLAY_STAGES.length}, 1fr)` }}>
        {DISPLAY_STAGES.map((s) => (
          <div key={s} className="text-center font-mono text-[10px] text-slate-400 uppercase tracking-wide">{TIER_LABELS[s]}</div>
        ))}
      </div>
    </div>
  );
}

function MiniTierStrip({ tier }) {
  const idx = DISPLAY_STAGES.indexOf(tier);
  const short = { basic: "Basic", intermediate: "Interm", complex: "Complex", mastered: "Master" };
  return (
    <div className="inline-flex rounded-md border border-slate-200 overflow-hidden">
      {DISPLAY_STAGES.map((s, i) => {
        const active = i === idx;
        const past = i < idx;
        return (
          <div
            key={s}
            title={TIER_LABELS[s]}
            className={`px-5 py-1 text-[10px] font-mono leading-none ${i > 0 ? "border-l border-slate-200" : ""} ${
              active ? "bg-indigo-600 text-white font-semibold"
                : past ? "bg-emerald-100 text-emerald-700"
                : "bg-white text-slate-300"
            }`}
          >
            {short[s]}
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Course / Section selector (shared header control)
// ---------------------------------------------------------------------------
function CourseSectionBar({ course, section, onCourse, onSection }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <select value={course} onChange={(e) => onCourse(e.target.value)}
        className="px-2 py-1.5 rounded-lg border border-slate-200 bg-white font-mono text-xs">
        {Object.values(COURSES).map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
      </select>
      <select value={section} onChange={(e) => onSection(e.target.value)}
        className="px-2 py-1.5 rounded-lg border border-slate-200 bg-white font-mono text-xs">
        {COURSES[course].sections.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Student practice view
// ---------------------------------------------------------------------------
function StudentView({ course, section, roster }) {
  const [selectedName, setSelectedName] = useState("");
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  const [round, setRound] = useState(null);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [roundResult, setRoundResult] = useState(null);
  const [checkingFlag, setCheckingFlag] = useState(false);
  const [stillFlagged, setStillFlagged] = useState(false);

  useEffect(() => { setSelectedName(""); setStudentData(null); setUnlocked(false); setPinInput(""); setPinError(false); setRound(null); setRoundResult(null); }, [course, section]);

  const selectStudent = useCallback(async (name) => {
    setSelectedName(name);
    setLoading(true);
    setUnlocked(false);
    setPinInput("");
    setPinError(false);
    setRound(null);
    setRoundResult(null);
    const slug = slugify(name);
    let data = await loadStudentRaw(course, section, slug);
    if (!data) { data = emptyStudent(name, course); await saveStudent(course, section, slug, data); }
    else if (!data.pin) { data = ensurePin(data); await saveStudent(course, section, slug, data); }
    setStudentData(data);
    setLoading(false);
  }, [course, section]);

  const submitPin = () => {
    if (pinInput === studentData.pin) {
      setUnlocked(true);
      setPinError(false);
    } else {
      setPinError(true);
      setPinInput("");
    }
  };

  const switchStudent = () => {
    setSelectedName(""); setStudentData(null); setUnlocked(false); setPinInput(""); setPinError(false);
    setCheckingFlag(false); setStillFlagged(false);
  };

  const startRound = () => {
    const pool = itemsForTopicTier(course, studentData.topic, studentData.tier);
    const items = sample(pool, Math.min(3, pool.length));
    setRound({ items, index: 0, answers: [] });
    setSelectedChoice(null);
    setShowFeedback(false);
    setRoundResult(null);
  };

  const submitAnswer = () => { if (selectedChoice !== null) setShowFeedback(true); };

  const nextQuestion = async () => {
    const item = round.items[round.index];
    const correct = selectedChoice === item.answer;
    const newAnswers = [...round.answers, { itemId: item.id, topic: item.topic, tier: item.tier, correct, chosen: selectedChoice, timestamp: Date.now() }];

    if (round.index + 1 < round.items.length) {
      setRound({ ...round, index: round.index + 1, answers: newAnswers });
      setSelectedChoice(null);
      setShowFeedback(false);
      return;
    }

    const score = newAnswers.filter((a) => a.correct).length;
    const passed = score >= 2;
    let updated = { ...studentData, history: [...studentData.history, ...newAnswers] };
    let topicAdvancedTo = null;
    let segmentLocked = false;

    if (passed) {
      updated.misses = 0;
      const tierIdx = TIER_ORDER.indexOf(studentData.tier);
      if (tierIdx + 1 < TIER_ORDER.length) {
        updated.tier = TIER_ORDER[tierIdx + 1];
      } else {
        // Just finished Complex -- rest at "mastered" for this topic. The
        // actual move to the next topic happens when the student clicks
        // "Continue to Topic X", via advanceTopic() below.
        updated.tier = "mastered";
        updated.masteredTopics = [...new Set([...updated.masteredTopics, studentData.topic])];
        const next = resolveNextTopic(course, studentData.unitId, studentData.segmentId, studentData.topic);
        if (next) {
          topicAdvancedTo = next.topic;
        } else {
          updated.locked = true;
          updated.lockedAt = { unitId: studentData.unitId, segmentId: studentData.segmentId };
          segmentLocked = true;
        }
      }
    } else {
      updated.misses = (studentData.misses || 0) + 1;
      if (updated.misses >= 2) updated.flagged = true;
    }

    setStudentData(updated);
    await saveStudent(course, section, slugify(updated.displayName), updated);
    setRoundResult({ score, passed, flagged: updated.flagged, topicAdvancedTo, segmentLocked });
    setRound(null);
  };

  const advanceTopic = async () => {
    const next = resolveNextTopic(course, studentData.unitId, studentData.segmentId, studentData.topic);
    if (!next) return;
    const updated = { ...studentData, topic: next.topic, tier: TIER_ORDER[0] };
    setStudentData(updated);
    await saveStudent(course, section, slugify(updated.displayName), updated);
  };

  const checkFlagStatus = async () => {
    setCheckingFlag(true);
    setStillFlagged(false);
    const fresh = await loadStudentRaw(course, section, slugify(studentData.displayName));
    setCheckingFlag(false);
    if (fresh && !fresh.flagged) {
      setStudentData(fresh);
    } else {
      setStillFlagged(true);
    }
  };

  if (!selectedName) {
    return (
      <div className="max-w-md mx-auto mt-10">
        <h2 className="font-mono text-lg text-slate-700 mb-3">Who are you?</h2>
        {roster.length === 0 ? (
          <p className="text-slate-500 text-sm">No students on the roster for this section yet. Ask your teacher to add you from the Teacher tab.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {roster.map((name) => (
              <button key={name} onClick={() => selectStudent(name)}
                className="text-left px-4 py-3 rounded-lg border border-slate-200 bg-white hover:border-indigo-400 hover:bg-indigo-50 transition-colors">
                {name}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (loading || !studentData) {
    return <div className="flex items-center justify-center mt-16 text-slate-400"><Loader2 className="animate-spin mr-2" size={18} /> Loading...</div>;
  }

  if (!unlocked) {
    return (
      <div className="max-w-sm mx-auto mt-10 p-6 rounded-xl bg-white border border-slate-200 text-center">
        <p className="text-slate-500 text-sm mb-1">Hi, {studentData.displayName}</p>
        <p className="font-mono text-xs text-slate-400 mb-4">Enter your 4-digit PIN</p>
        <input
          type="tel"
          inputMode="numeric"
          maxLength={4}
          value={pinInput}
          onChange={(e) => { setPinInput(e.target.value.replace(/\D/g, "").slice(0, 4)); setPinError(false); }}
          onKeyDown={(e) => e.key === "Enter" && submitPin()}
          autoFocus
          className={`w-32 text-center text-2xl font-mono tracking-widest px-3 py-2 rounded-lg border ${pinError ? "border-rose-400 bg-rose-50" : "border-slate-300"} focus:outline-none focus:ring-2 focus:ring-indigo-300 mb-3`}
          placeholder="----"
        />
        <div>
          <button onClick={submitPin} disabled={pinInput.length !== 4}
            className="px-5 py-2 rounded-lg bg-indigo-600 text-white font-medium disabled:opacity-40 hover:bg-indigo-700 transition-colors">
            Unlock
          </button>
        </div>
        {pinError && <p className="text-rose-600 text-xs mt-3">That PIN doesn't match. Ask your teacher if you're not sure.</p>}
        <button onClick={switchStudent} className="mt-4 text-xs text-slate-400 hover:text-slate-600 font-mono">
          not {studentData.displayName}?
        </button>
      </div>
    );
  }

  if (!studentData.topic && !studentData.locked) {
    return (
      <div className="max-w-lg mx-auto mt-10 p-6 rounded-xl bg-white border border-slate-200 text-center">
        <p className="text-slate-500 text-sm">Your teacher hasn't added any practice content for {COURSES[course].label} yet.</p>
      </div>
    );
  }

  const unit = getUnit(course, studentData.unitId);
  const segment = getSegment(course, studentData.unitId, studentData.segmentId);
  const isFlagged = studentData.flagged;
  const isLocked = studentData.locked;
  const liveNext = isLocked ? resolveNextSegmentOrUnit(course, studentData.lockedAt.unitId, studentData.lockedAt.segmentId) : null;

  return (
    <div className="max-w-lg mx-auto mt-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-slate-400 font-mono">{unit ? unit.label : ""}{segment ? ` \u00b7 ${segment.label}` : ""}</p>
          <h2 className="text-xl font-semibold text-slate-800">{studentData.displayName}</h2>
        </div>
        <button onClick={switchStudent} title="Log out"
          className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <LogOut size={13} /> Logout
        </button>
      </div>

      <div className="mb-6 p-4 bg-white rounded-xl border border-slate-200">
        <TopicRow course={course} unitId={studentData.unitId} segmentId={studentData.segmentId} currentTopic={studentData.topic} masteredTopics={studentData.masteredTopics} />
        <TierTrack tier={studentData.tier} flagged={isFlagged} />
      </div>

      {isLocked && (
        <div className="p-6 rounded-xl bg-indigo-50 border border-indigo-200 text-center">
          <Lock className="mx-auto text-indigo-600 mb-2" size={28} />
          <p className="font-semibold text-indigo-800">{segment ? `${segment.label} complete!` : "Segment complete!"}</p>
          <p className="text-sm text-indigo-700 mt-1">
            {liveNext ? "Nice work -- waiting for your teacher to unlock the next part." : "You've finished everything currently available here. Great work -- check with your teacher about what's next."}
          </p>
        </div>
      )}

      {!isLocked && isFlagged && (
        <div className="p-6 rounded-xl bg-rose-50 border border-rose-200 text-center mt-4">
          <Flag className="mx-auto text-rose-600 mb-2" size={28} />
          <p className="font-semibold text-rose-800">Flagged for small-group help</p>
          <p className="text-sm text-rose-700 mt-1">You've missed this tier twice in a row. Sit tight -- your teacher will pull you for a quick small-group session.</p>
          <button onClick={checkFlagStatus} disabled={checkingFlag}
            className="mt-4 px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-60 transition-colors inline-flex items-center gap-2">
            {checkingFlag ? <Loader2 size={16} className="animate-spin" /> : <ChevronRight size={16} />} Continue
          </button>
          {stillFlagged && <p className="text-rose-600 text-xs mt-3">Not yet -- your teacher hasn't cleared you for this tier.</p>}
        </div>
      )}

      {!isLocked && !isFlagged && !round && !roundResult && studentData.tier === "mastered" && (
        <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
          <CheckCircle2 className="mx-auto text-emerald-600 mb-2" size={28} />
          <p className="font-semibold text-emerald-800">Topic {studentData.topic} mastered!</p>
          <button onClick={advanceTopic} className="mt-4 px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors inline-flex items-center gap-2">
            Continue to Topic {resolveNextTopic(course, studentData.unitId, studentData.segmentId, studentData.topic)?.topic} <ChevronRight size={16} />
          </button>
        </div>
      )}

      {!isLocked && !isFlagged && !round && !roundResult && studentData.tier !== "mastered" && (
        <div className="p-6 rounded-xl bg-white border border-slate-200 text-center">
          <p className="text-sm text-slate-500 mb-4 font-mono">
            Current tier: <span className={`px-2 py-0.5 rounded border ${TIER_COLORS[studentData.tier]}`}>{TIER_LABELS[studentData.tier]}</span>
          </p>
          <button onClick={startRound} className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors inline-flex items-center gap-2">
            Start round <ChevronRight size={16} />
          </button>
        </div>
      )}

      {!isLocked && !isFlagged && roundResult && (
        <div className={`p-6 rounded-xl border text-center ${roundResult.passed ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200"}`}>
          <p className={`font-semibold ${roundResult.passed ? "text-emerald-800" : "text-amber-800"}`}>{roundResult.score} / 3 correct</p>
          <p className={`text-sm mt-1 ${roundResult.passed ? "text-emerald-700" : "text-amber-700"}`}>
            {roundResult.segmentLocked ? "Segment complete! Waiting for your teacher to unlock the next part."
              : roundResult.topicAdvancedTo ? "Topic mastered! Ready to move on when you are."
              : roundResult.passed ? "Great work -- advancing to the next tier."
              : "Not quite there yet -- let's try this tier again."}
          </p>
          {!roundResult.segmentLocked && (
            <button onClick={() => setRoundResult(null)} className="mt-4 px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors inline-flex items-center gap-2">
              Continue <ChevronRight size={16} />
            </button>
          )}
        </div>
      )}

      {round && (
        <div className="p-6 rounded-xl bg-white border border-slate-200">
          <p className="text-xs font-mono text-slate-400 mb-3">
            Question {round.index + 1} of {round.items.length} &middot; Topic {round.items[round.index].topic} &middot; {TIER_LABELS[round.items[round.index].tier]}
          </p>
          <p className="text-slate-800 mb-4 whitespace-pre-wrap">{round.items[round.index].prompt}</p>
          <div className="flex flex-col gap-2 mb-4">
            {round.items[round.index].choices.map((choice, i) => {
              const isCorrect = i === round.items[round.index].answer;
              const isChosen = i === selectedChoice;
              let style = "border-slate-200 hover:border-indigo-300";
              if (showFeedback) {
                if (isCorrect) style = "border-emerald-400 bg-emerald-50";
                else if (isChosen) style = "border-rose-400 bg-rose-50";
              } else if (isChosen) style = "border-indigo-400 bg-indigo-50";
              return (
                <button key={i} disabled={showFeedback} onClick={() => setSelectedChoice(i)}
                  className={`text-left px-4 py-2.5 rounded-lg border ${style} transition-colors text-sm flex items-start gap-2`}>
                  {showFeedback && isCorrect && <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />}
                  {showFeedback && isChosen && !isCorrect && <XCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />}
                  <span className="whitespace-pre-wrap">{choice}</span>
                </button>
              );
            })}
          </div>
          {showFeedback && (
            <div className="mb-4 p-3 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-600">
              {round.items[round.index].explanation}
            </div>
          )}
          {!showFeedback ? (
            <button onClick={submitAnswer} disabled={selectedChoice === null}
              className="px-5 py-2 rounded-lg bg-indigo-600 text-white font-medium disabled:opacity-40 hover:bg-indigo-700 transition-colors">
              Check answer
            </button>
          ) : (
            <button onClick={nextQuestion} className="px-5 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors inline-flex items-center gap-2">
              {round.index + 1 < round.items.length ? "Next question" : "See round result"} <ChevronRight size={16} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Teacher dashboard
// ---------------------------------------------------------------------------
function TeacherView({ course, section, roster, onRosterChange, onLock }) {
  const [students, setStudents] = useState({});
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [loadErrors, setLoadErrors] = useState([]);
  const [bulkMsg, setBulkMsg] = useState("");
  const [exporting, setExporting] = useState(false);

  const handleExportAll = async () => {
    setExporting(true);
    try {
      const data = await exportAllData();
      downloadJson(data, `adaptive-practice-export-${new Date().toISOString().slice(0, 10)}.json`);
    } catch (e) {
      console.error("Export failed", e);
    }
    setExporting(false);
  };

  const refresh = useCallback(async () => {
    setLoading(true);
    const entries = await Promise.all(
      roster.map(async (name) => {
        const slug = slugify(name);
        let raw = await loadStudentRaw(course, section, slug);
        if (!raw) raw = emptyStudent(name, course);
        else if (!raw.pin) { raw = ensurePin(raw); await saveStudent(course, section, slug, raw); }
        return [name, raw];
      })
    );
    setStudents(Object.fromEntries(entries));
    setLoadErrors([]);
    setLoading(false);
  }, [roster, course, section]);

  useEffect(() => { refresh(); setBulkMsg(""); }, [refresh]);

  const addStudent = async () => {
    const name = newName.trim();
    if (!name || roster.includes(name)) return;
    const updated = [...roster, name];
    await saveRoster(course, section, updated);
    onRosterChange(updated);
    setNewName("");
  };

  const removeStudent = async (name) => {
    const updated = roster.filter((n) => n !== name);
    await saveRoster(course, section, updated);
    onRosterChange(updated);
    await deleteStudent(course, section, slugify(name));
  };

  const clearFlag = async (name) => {
    const slug = slugify(name);
    const data = await loadStudentRaw(course, section, slug);
    if (!data) return;
    const updated = { ...data, flagged: false, misses: 0 };
    await saveStudent(course, section, slug, updated);
    setStudents((s) => ({ ...s, [name]: updated }));
  };

  const unlockStudent = async (name) => {
    const slug = slugify(name);
    const data = await loadStudentRaw(course, section, slug);
    if (!data || !data.locked) return;
    const next = resolveNextSegmentOrUnit(course, data.lockedAt.unitId, data.lockedAt.segmentId);
    if (!next) return; // nothing to unlock into yet
    const updated = { ...data, unitId: next.unitId, segmentId: next.segmentId, topic: next.topic, tier: TIER_ORDER[0], locked: false, lockedAt: null };
    await saveStudent(course, section, slug, updated);
    setStudents((s) => ({ ...s, [name]: updated }));
  };

  const unlockAllWaiting = async () => {
    let unlocked = 0, skipped = 0;
    for (const name of roster) {
      const data = students[name];
      if (!data || !data.locked) continue;
      const next = resolveNextSegmentOrUnit(course, data.lockedAt.unitId, data.lockedAt.segmentId);
      if (!next) { skipped++; continue; }
      const updated = { ...data, unitId: next.unitId, segmentId: next.segmentId, topic: next.topic, tier: TIER_ORDER[0], locked: false, lockedAt: null };
      await saveStudent(course, section, slugify(name), updated);
      setStudents((s) => ({ ...s, [name]: updated }));
      unlocked++;
    }
    setBulkMsg(unlocked === 0 && skipped === 0 ? "No students are currently waiting."
      : `Unlocked ${unlocked} student${unlocked === 1 ? "" : "s"}.` + (skipped > 0 ? ` ${skipped} waiting but no further content is configured yet.` : ""));
  };

  const resetStudent = async (name) => {
    const slug = slugify(name);
    const fresh = emptyStudent(name, course);
    await saveStudent(course, section, slug, fresh);
    setStudents((s) => ({ ...s, [name]: fresh }));
  };

  const regeneratePin = async (name) => {
    const slug = slugify(name);
    const data = await loadStudentRaw(course, section, slug);
    if (!data) return;
    const updated = { ...data, pin: generatePin() };
    await saveStudent(course, section, slug, updated);
    setStudents((s) => ({ ...s, [name]: updated }));
  };

  const anyWaiting = Object.values(students).some((d) => d && d.locked);

  return (
    <div className="max-w-3xl mx-auto mt-6">
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <input value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addStudent()}
          placeholder="Add student (e.g. Jane D.)" className="flex-1 min-w-[160px] px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        <button onClick={addStudent} className="px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors inline-flex items-center gap-1 text-sm">
          <Plus size={16} /> Add
        </button>
        <button onClick={refresh} title="Refresh progress data" className="px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors inline-flex items-center gap-1 text-sm text-slate-500">
          <RotateCcw size={14} /> Refresh
        </button>
        <button onClick={unlockAllWaiting} disabled={!anyWaiting}
          className="px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-1 text-sm">
          <Unlock size={14} /> Unlock waiting students
        </button>
        <button onClick={handleExportAll} disabled={exporting}
          className="px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition-colors inline-flex items-center gap-1 text-sm text-slate-500">
          {exporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />} Export all data
        </button>
        <button onClick={onLock} title="Lock the Teacher tab"
          className="ml-auto px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors inline-flex items-center gap-1 text-sm text-slate-500">
          <Lock size={14} /> Lock
        </button>
      </div>

      {bulkMsg && <div className="mb-4 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 font-mono">{bulkMsg}</div>}
      {loadErrors.length > 0 && (
        <div className="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-700 font-mono">
          Couldn't load saved progress for: {loadErrors.join(", ")}. Try Refresh again.
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-10 text-slate-400"><Loader2 className="animate-spin mr-2" size={18} /> Loading roster...</div>
      ) : roster.length === 0 ? (
        <p className="text-slate-400 text-sm text-center py-10 font-mono">No students in this section yet -- add one above.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {[...roster].sort((nameA, nameB) => {
            const a = students[nameA], b = students[nameB];
            if (!a || !b) return 0;
            const flagDiff = (a.flagged ? 0 : 1) - (b.flagged ? 0 : 1);
            if (flagDiff !== 0) return flagDiff;
            return compareTuples(positionTuple(course, a), positionTuple(course, b));
          }).map((name) => {
            const data = students[name];
            if (!data) return null;
            const acc = accuracy(data.history);
            const isOpen = expanded === name;
            const unit = data.unitId ? getUnit(course, data.unitId) : null;
            const segment = data.unitId && data.segmentId ? getSegment(course, data.unitId, data.segmentId) : null;
            const lockedNext = data.locked ? resolveNextSegmentOrUnit(course, data.lockedAt.unitId, data.lockedAt.segmentId) : null;
            return (
              <div key={name} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                <div className="flex items-center justify-between p-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-medium text-slate-800">{data.displayName}</span>
                      {data.locked ? (
                        <>
                          <span className="text-xs px-2 py-0.5 rounded border border-indigo-300 bg-indigo-100 text-indigo-700 inline-flex items-center gap-1">
                            <Lock size={10} /> Waiting to unlock
                          </span>
                          <MiniTierStrip tier={data.tier} />
                        </>
                      ) : data.topic ? (
                        <>
                          <span className="text-xs px-2 py-0.5 rounded border border-slate-300 bg-slate-100 text-slate-600 font-mono">{unit ? unit.id : ""}{segment ? ` \u00b7 ${segment.label}` : ""}</span>
                          <span className="text-xs px-2 py-0.5 rounded border border-slate-300 bg-slate-100 text-slate-600 font-mono">Topic {data.topic}</span>
                          <MiniTierStrip tier={data.tier} />
                        </>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded border border-slate-300 bg-slate-100 text-slate-500 font-mono">No content yet</span>
                      )}
                      {data.flagged && (
                        <span className="text-xs px-2 py-0.5 rounded border border-rose-300 bg-rose-100 text-rose-700 inline-flex items-center gap-1">
                          <Flag size={10} /> flagged
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">
                      {data.history.length} attempts{acc !== null ? ` \u00b7 ${acc}% overall accuracy` : ""}
                      {data.masteredTopics.length > 0 ? ` \u00b7 mastered: ${data.masteredTopics.join(", ")}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => regeneratePin(name)} title="Click to generate a new PIN"
                      className="text-xs px-2 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors inline-flex items-center gap-1 font-mono text-slate-500">
                      <KeyRound size={12} /> {data.pin || "----"}
                    </button>
                    {data.flagged && (
                      <button onClick={() => clearFlag(name)} className="text-xs px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors">
                        Clear flag
                      </button>
                    )}
                    {data.locked && (
                      <button onClick={() => unlockStudent(name)} disabled={!lockedNext} title={!lockedNext ? "No further content configured yet" : ""}
                        className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-1">
                        <Unlock size={12} /> Unlock
                      </button>
                    )}
                    <button onClick={() => setExpanded(isOpen ? null : name)} className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                      {isOpen ? "Hide" : "History"}
                    </button>
                    <button onClick={() => resetStudent(name)} title="Reset progress" className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-slate-400">
                      <RotateCcw size={14} />
                    </button>
                    <button onClick={() => removeStudent(name)} title="Remove student" className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 transition-colors text-slate-400 hover:text-rose-500">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                {isOpen && (
                  <div className="border-t border-slate-100 bg-slate-50 p-4">
                    {data.history.length === 0 ? (
                      <p className="text-xs text-slate-400 font-mono">No attempts yet.</p>
                    ) : (
                      <div className="flex flex-col gap-1.5">
                        {data.history.slice().reverse().map((h, i) => {
                          const item = ITEM_BANK.find((it) => it.id === h.itemId);
                          return (
                            <div key={i} className="flex items-center gap-2 text-xs">
                              {h.correct ? <CheckCircle2 size={14} className="text-emerald-500 shrink-0" /> : <XCircle size={14} className="text-rose-500 shrink-0" />}
                              <span className="px-1.5 py-0.5 rounded border border-slate-200 bg-white font-mono text-slate-500">{h.topic}</span>
                              <span className={`px-1.5 py-0.5 rounded border font-mono ${TIER_COLORS[h.tier]}`}>{TIER_LABELS[h.tier]}</span>
                              <span className="text-slate-500 truncate">{item ? item.prompt.split("\n")[0] : h.itemId}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Teacher password gate -- separate from student PINs, since this guards
// roster management, unlocking, and data export. First-ever visit lets you
// set the password; every visit after that requires it.
// ---------------------------------------------------------------------------
function TeacherGate({ onUnlock }) {
  const [loading, setLoading] = useState(true);
  const [hasPassword, setHasPassword] = useState(false);
  const [pw, setPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    loadTeacherPasswordHash().then((hash) => { setHasPassword(!!hash); setLoading(false); });
  }, []);

  const handleSetup = async () => {
    if (pw.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (pw !== confirmPw) { setError("Passwords don't match."); return; }
    setBusy(true);
    await saveTeacherPasswordHash(await hashPassword(pw));
    setBusy(false);
    onUnlock();
  };

  const handleLogin = async () => {
    setBusy(true);
    const [inputHash, storedHash] = await Promise.all([hashPassword(pw), loadTeacherPasswordHash()]);
    setBusy(false);
    if (inputHash === storedHash) onUnlock();
    else { setError("Incorrect password."); setPw(""); }
  };

  if (loading) {
    return <div className="flex items-center justify-center mt-16 text-slate-400"><Loader2 className="animate-spin mr-2" size={18} /> Loading...</div>;
  }

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 rounded-xl bg-white border border-slate-200">
      {hasPassword ? (
        <>
          <p className="text-sm font-semibold text-slate-700 mb-1">Teacher access</p>
          <p className="text-xs text-slate-400 mb-4 font-mono">Enter the teacher password</p>
          <input type="password" value={pw} autoFocus
            onChange={(e) => { setPw(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 mb-3"
            placeholder="Password" />
          <button onClick={handleLogin} disabled={busy || !pw}
            className="w-full px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium disabled:opacity-40 hover:bg-indigo-700 transition-colors">
            {busy ? "Checking..." : "Unlock"}
          </button>
        </>
      ) : (
        <>
          <p className="text-sm font-semibold text-slate-700 mb-1">Set up teacher access</p>
          <p className="text-xs text-slate-400 mb-4 font-mono">No password is set yet. Create one now (8+ characters) -- you'll enter this every time you open the Teacher tab.</p>
          <input type="password" value={pw}
            onChange={(e) => { setPw(e.target.value); setError(""); }}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 mb-2"
            placeholder="New password" />
          <input type="password" value={confirmPw}
            onChange={(e) => { setConfirmPw(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleSetup()}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 mb-3"
            placeholder="Confirm password" />
          <button onClick={handleSetup} disabled={busy || !pw || !confirmPw}
            className="w-full px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium disabled:opacity-40 hover:bg-indigo-700 transition-colors">
            {busy ? "Saving..." : "Set password"}
          </button>
        </>
      )}
      {error && <p className="text-rose-600 text-xs mt-3 text-center">{error}</p>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Root app
// ---------------------------------------------------------------------------
export default function App() {
  const [mode, setMode] = useState("student");
  const [teacherAuthed, setTeacherAuthed] = useState(false);
  const [course, setCourse] = useState("csa");
  const [section, setSection] = useState(COURSES.csa.sections[0]);
  const [roster, setRoster] = useState([]);
  const [rosterLoaded, setRosterLoaded] = useState(false);

  const changeCourse = (newCourse) => {
    setCourse(newCourse);
    setSection(COURSES[newCourse].sections[0]);
  };

  useEffect(() => {
    setRosterLoaded(false);
    loadRoster(course, section).then((r) => { setRoster(r); setRosterLoaded(true); });
  }, [course, section]);

  return (
    <div className="min-h-screen bg-slate-50" style={{ backgroundImage: "radial-gradient(circle, #e2e8f0 1px, transparent 1px)", backgroundSize: "18px 18px" }}>
      <div className="max-w-3xl mx-auto px-4 pt-6 pb-16">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div>
            <p className="font-mono text-[11px] text-slate-400 tracking-widest uppercase">Adaptive Practice</p>
            <h1 className="font-mono text-lg font-semibold text-slate-800">{COURSES[course].label} &middot; {section}</h1>
          </div>
          <div className="flex gap-1 bg-white rounded-lg border border-slate-200 p-1">
            <button onClick={() => setMode("student")} className={`px-3 py-1.5 rounded-md text-sm font-medium inline-flex items-center gap-1.5 transition-colors ${mode === "student" ? "bg-indigo-600 text-white" : "text-slate-500 hover:bg-slate-50"}`}>
              <GraduationCap size={15} /> Student
            </button>
            <button onClick={() => setMode("teacher")} className={`px-3 py-1.5 rounded-md text-sm font-medium inline-flex items-center gap-1.5 transition-colors ${mode === "teacher" ? "bg-indigo-600 text-white" : "text-slate-500 hover:bg-slate-50"}`}>
              <Users size={15} /> Teacher
            </button>
          </div>
        </div>

        <div className="mb-6">
          <CourseSectionBar course={course} section={section} onCourse={changeCourse} onSection={setSection} />
        </div>

        {!rosterLoaded ? (
          <div className="flex items-center justify-center mt-16 text-slate-400"><Loader2 className="animate-spin mr-2" size={18} /> Loading...</div>
        ) : mode === "student" ? (
          <StudentView course={course} section={section} roster={roster} />
        ) : !teacherAuthed ? (
          <TeacherGate onUnlock={() => setTeacherAuthed(true)} />
        ) : (
          <TeacherView course={course} section={section} roster={roster} onRosterChange={setRoster} onLock={() => setTeacherAuthed(false)} />
        )}
      </div>
    </div>
  );
}
