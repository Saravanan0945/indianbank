package com.ne;

public class PrintTestingViceVersa {
	
	public static void main(String[] args) {
		String text = "Testing 123";
		
		System.out.println(text);
		
		String reversed = new StringBuilder(text).reverse().toString();
		System.out.println(reversed);
	}

}

