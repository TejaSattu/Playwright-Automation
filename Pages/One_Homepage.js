const { expect } = require('@playwright/test');
const { log } = require('../utils/logger');

class Homepage {

    constructor(page) {
        this.page = page;

        // URL of the ecommerce site
        this.url = "https://shop.polymer-project.org/";

        // Locators for homepage elements
        this.shopText = this.page.locator(':text-is("SHOP")').first();
        this.mensTshirts = this.page.getByText("Men's T-Shirts").first();

        log('Homepage object initialized');
    }

    // Navigate to the ecommerce site
    async navigateToHomePage() {
        log(`Navigating to URL: ${this.url}`);
        await this.page.goto(this.url);
        log('Homepage loaded successfully');
    }

    // Validate homepage
    async validateHomepage() {
        log('Validating homepage SHOP text visibility');
        const validation = await this.shopText.isVisible();
        expect(validation).toBeTruthy();
        log(`Homepage validation result: ${validation}`);
        return validation;
    }

    // Navigate to Men's T-Shirts
    async clickMensTshirts() {
        log('Waiting for Men’s T-Shirts link to be visible');
        await expect(this.mensTshirts).toBeVisible();

        log('Clicking on Men’s T-Shirts');
        await this.mensTshirts.click();

        // SAME wait as your original code
        await this.page.waitForLoadState('networkidle');
        log('Men’s T-Shirts page loaded (network idle)');
    }
}

module.exports = { Homepage };
