package com.ne;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

/**
 * LoginPage class implements Page Object Model (POM) pattern for the login functionality.
 * This class encapsulates all the elements and actions related to the login page.
 */
public class LoginPage {
	
	private WebDriver driver;
	
	private By usernameField = By.id("username");
	private By passwordField = By.id("password");
	private By loginButton = By.id("loginButton");
	
	/**
	 * Constructor to initialize the LoginPage with WebDriver instance.
	 * @param driver WebDriver instance to interact with the browser
	 */
	public LoginPage(WebDriver driver) {
		this.driver = driver;
	}
	
	/**
	 * Enters the username into the username field.
	 * @param username The username to be entered
	 */
	public void enterUsername(String username) {
		WebElement usernameElement = driver.findElement(usernameField);
		usernameElement.clear();
		usernameElement.sendKeys(username);
	}
	
	/**
	 * Enters the password into the password field.
	 * @param password The password to be entered
	 */
	public void enterPassword(String password) {
		WebElement passwordElement = driver.findElement(passwordField);
		passwordElement.clear();
		passwordElement.sendKeys(password);
	}
	
	/**
	 * Clicks the login button to submit the login form.
	 */
	public void clickLoginButton() {
		WebElement loginButtonElement = driver.findElement(loginButton);
		loginButtonElement.click();
	}
	
	/**
	 * Performs complete login operation by entering username, password and clicking login button.
	 * @param username The username to be entered
	 * @param password The password to be entered
	 */
	public void login(String username, String password) {
		enterUsername(username);
		enterPassword(password);
		clickLoginButton();
	}

}

