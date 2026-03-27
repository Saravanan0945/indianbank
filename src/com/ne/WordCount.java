package com.ne;

public class WordCount {
	
	public static void main(String[] args) {
		String text = "Selenium Testing";
		String[] words = text.split("\\s+");
		int wordCount = words.length;
		
		System.out.println("String: " + text);
		System.out.println("Word Count: " + wordCount);
	}

}

