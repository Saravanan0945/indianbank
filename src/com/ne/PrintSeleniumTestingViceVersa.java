package com.ne;

public class PrintSeleniumTestingViceVersa {
	
	public static void main(String[] args) {
		String text = "Selenium Testing";
		String[] words = text.split("\\s+");
		
		for (int i = words.length - 1; i >= 0; i--) {
			System.out.print(words[i]);
			if (i > 0) {
				System.out.print(" ");
			}
		}
		System.out.println();
	}

}

