const { expect } = require('@playwright/test');
const { log } = require('../utils/logger');

class OrderConfirmationPage {
    constructor(page) {
        this.page = page;
        this.Successurl = 'https://shop.polymer-project.org/checkout/success';

        log('Order Confirmation Page object initialized');
    }

    async successValidatation() {
        log('Validating order success message');

        await expect(this.page.locator('body')).toContainText('Finish');
        log('Order success message validated successfully');
    }

    async waitForSuccessURL() {
        log(`Waiting for success URL: ${this.Successurl}`);

        await this.page.waitForURL(this.Successurl);

        log('Success URL loaded');
    }

    async takeScreenshot() {
        log('Taking order confirmation screenshot');

        await this.page.screenshot({
            path: 'ecommerce_checkout_complete.png',
            fullPage: true
        });

        log('Order confirmation screenshot captured');
    }
}

module.exports = { OrderConfirmationPage };
