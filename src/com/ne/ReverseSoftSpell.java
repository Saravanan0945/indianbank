package com.ne;

public class ReverseSoftSpell {
	
	public static void main(String[] args) {
		String original = "SoftSpell";
		
		String reversed = new StringBuilder(original).reverse().toString();
		System.out.println(reversed);
		
		int wordCount = original.split("\\s+").length;
		System.out.println("Total word count: " + wordCount);
	}

}

