package com.ne;

public class ReverseString {
	
	public static void main(String[] args) {
		String original = "Testing";
		String reversed = new StringBuilder(original).reverse().toString();
		System.out.println(reversed);
	}

}

