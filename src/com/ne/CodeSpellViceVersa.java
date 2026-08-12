package com.ne;

public class CodeSpellViceVersa {
	
	public static void main(String[] args) {
		String original = "CodeSpell";
		String reversed = new StringBuilder(original).reverse().toString();
		
		System.out.println("Original: " + original);
		System.out.println("Reversed: " + reversed);
	}

}

