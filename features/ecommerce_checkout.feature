Feature: Ecommerce Checkout

  Scenario: User completes product purchase successfully
    Given user launches the ecommerce application
    When user adds product to cart
    And user completes checkout process
    Then order should be placed successfully
