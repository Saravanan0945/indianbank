package com.ne;

public class SoftSpellAI {
	
	public static void main(String[] args) {
		String name = "SoftSpellAI";
		
		System.out.println("String: " + name);
		
		boolean isValid = name.matches("[a-zA-Z]+");
		System.out.println("Validation: " + (isValid ? "Valid (contains only letters)" : "Invalid (contains non-letter characters)"));
		
		int letterCount = name.length();
		System.out.println("Letter count: " + letterCount);
	}

}

