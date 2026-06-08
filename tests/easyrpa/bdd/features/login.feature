Feature: EasyRPA Login

  Scenario: Shows error for invalid credentials
    Given I am logged in as "wrongUser"
    Then I should see an error message "Invalid credentials for user"

  Scenario: Redirects to home page on valid credentials
    Given I am logged in as "adminUserDEV"
    Then I should see the home page