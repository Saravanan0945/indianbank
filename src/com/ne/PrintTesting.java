package com.ne;

public class PrintTesting {
	
	public static void main(String[] args) {
		String text = "API_AUTOMATION_TESTING";
		System.out.println(text);
		
		// Count words by splitting on underscores
		String[] words = text.split("_");
		int wordCount = words.length;
		
		System.out.println("Word count: " + wordCount);
	}

}

