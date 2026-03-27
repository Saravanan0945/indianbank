package com.ne;

public class ReverseCodeSpell {
	
	public static void main(String[] args) {
		String word = "CodeSpell";
		String reversed = new StringBuilder(word).reverse().toString();
		System.out.println(reversed);
	}

}

