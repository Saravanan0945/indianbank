package com.ne;

public class PrintReverseCodeSpellAI {
	
	public static void main(String[] args) {
		String original = "CodeSpellAI";
		String reversed = new StringBuilder(original).reverse().toString();
		
		System.out.println("Original: " + original);
		System.out.println("Reversed: " + reversed);
	}

}

