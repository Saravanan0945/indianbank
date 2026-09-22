package com.ne;

public class Print {
	
	public static void main(String[] args) {
		// Basic println with different data types
		System.out.println("=== Testing Basic println with Different Data Types ===");
		int intValue = 42;
		double doubleValue = 3.14159;
		boolean boolValue = true;
		char charValue = 'A';
		String stringValue = "Hello, World!";
		
		System.out.println("Integer: " + intValue);
		System.out.println("Double: " + doubleValue);
		System.out.println("Boolean: " + boolValue);
		System.out.println("Character: " + charValue);
		System.out.println("String: " + stringValue);
		
		// Empty print statement
		System.out.println();
		
		// String concatenation examples
		System.out.println("=== Testing String Concatenation ===");
		System.out.println("Concatenating strings: " + "Hello" + " " + "Java");
		System.out.println("Mixing types: " + intValue + " + " + doubleValue + " = " + (intValue + doubleValue));
		System.out.println("Boolean in string: " + "Is Java fun? " + boolValue);
		
		System.out.println();
		
		// Print without newline
		System.out.println("=== Testing print() without newline ===");
		System.out.print("This ");
		System.out.print("is ");
		System.out.print("on ");
		System.out.print("one ");
		System.out.print("line.");
		System.out.println(); // Add newline at the end
		
		System.out.println();
		
		// Formatted output using printf
		System.out.println("=== Testing Formatted Output (printf) ===");
		System.out.printf("Integer: %d%n", intValue);
		System.out.printf("Double (2 decimals): %.2f%n", doubleValue);
		System.out.printf("String: %s%n", stringValue);
		System.out.printf("Character: %c%n", charValue);
		System.out.printf("Boolean: %b%n", boolValue);
		System.out.printf("Multiple values: %s is %d years old and has %.2f dollars%n", "John", 25, 100.50);
		
		System.out.println();
		
		// Special characters and escape sequences
		System.out.println("=== Testing Special Characters and Escape Sequences ===");
		System.out.println("Newline test:\nThis is on a new line");
		System.out.println("Tab test:\tThis is tabbed");
		System.out.println("Quote test: \"Hello in quotes\"");
		System.out.println("Backslash test: C:\\Users\\Documents\\file.txt");
		System.out.println("Single quote: It\'s a beautiful day");
		System.out.println("Carriage return and newline: Line1\r\nLine2");
		
		System.out.println();
		
		// Multiple data types in one statement
		System.out.println("=== Testing Multiple Data Types in One Statement ===");
		System.out.println("Values: " + intValue + ", " + doubleValue + ", " + boolValue + ", " + charValue + ", " + stringValue);
		
		System.out.println();
		
		// Testing empty and null scenarios
		System.out.println("=== Testing Empty and Special Cases ===");
		System.out.println("");
		System.out.println("Empty string: \"\"");
		String nullString = null;
		System.out.println("Null string: " + nullString);
		
		System.out.println();
		
		// Mathematical expressions in print
		System.out.println("=== Testing Mathematical Expressions ===");
		System.out.println("5 + 3 = " + (5 + 3));
		System.out.println("10 - 4 = " + (10 - 4));
		System.out.println("6 * 7 = " + (6 * 7));
		System.out.println("20 / 4 = " + (20 / 4));
		System.out.println("17 % 5 = " + (17 % 5));
		
		System.out.println();
		System.out.println("=== Print Testing Complete ===");
	}

}

