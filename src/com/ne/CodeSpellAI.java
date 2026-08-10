package com.ne;

public class CodeSpellAI {
	
	public static void main(String[] args) {
		String text = "codeSpellAI";
		String reversed = new StringBuilder(text).reverse().toString();
		
		System.out.println(text + " Vice Versa: " + reversed);
		
		// Count words in the full phrase
		String fullPhrase = text + " Vice Versa";
		String[] words = fullPhrase.split("\\s+");
		int wordCount = words.length;
		
		System.out.println("Word Count: " + wordCount);
	}

}

