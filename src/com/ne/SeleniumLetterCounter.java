package com.ne;

import java.util.HashMap;
import java.util.Map;

public class SeleniumLetterCounter {
	
	public static void main(String[] args) {
		String word = "Selenium";
		
		System.out.println("Word: " + word);
		
		int totalLetters = word.length();
		System.out.println("Total number of letters: " + totalLetters);
		
		System.out.println("\nLetter count breakdown:");
		Map<Character, Integer> letterCount = new HashMap<>();
		
		for (char c : word.toLowerCase().toCharArray()) {
			letterCount.put(c, letterCount.getOrDefault(c, 0) + 1);
		}
		
		for (Map.Entry<Character, Integer> entry : letterCount.entrySet()) {
			System.out.println(entry.getKey() + ": " + entry.getValue());
		}
	}

}

