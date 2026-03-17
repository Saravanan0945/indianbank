package com.ne;

public class APIAutomationTestingProgram {
	
	public static void main(String[] args) {
		String original = "APIAUtomationTesting";
		
		System.out.println("Original: " + original);
		
		String reversed = new StringBuilder(original).reverse().toString();
		System.out.println("Reversed: " + reversed);
		
		int wordCount = 0;
		for (int i = 0; i < original.length(); i++) {
			if (Character.isUpperCase(original.charAt(i))) {
				wordCount++;
			}
		}
		System.out.println("Word Count: " + wordCount);
	}

}

