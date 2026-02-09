const { expect } = require('@playwright/test');
const { log } = require('../utils/logger');

class Orderdeatils_PaymentPage {
    constructor(page) {

        this.page = page;

        // checkout locators
        this.email_field = this.page.locator('input[name="accountEmail"]');
        this.contact_field = this.page.locator('input[name="accountPhone"]');
        this.shipping_address_field = this.page.locator('[placeholder="Address"]').first();
        this.shipping_city_id = this.page.locator("#shipCity");
        this.shipping_state_id = this.page.locator("#shipState");
        this.shipping_zip_id = this.page.locator("#shipZip");

        // Payment locators
        this.card_name_field = this.page.locator('#ccName');
        this.card_number_field = this.page.locator('#ccNumber');
        this.card_expiration_month_field = this.page.locator('#ccExpMonth');
        this.card_expiration_year_field = this.page.locator('#ccExpYear');
        this.cvv_field = this.page.locator('#ccCVV');
        this.place_order_btn = this.page.getByText('Place Order').first();

        // checkout data
        this.email = 'JohnDoe@yahoo.com';
        this.contact = '1234567890';
        this.shipping_address = '123 Main St, Springfield, IL 62701';
        this.city = 'Springfield';
        this.state = 'IL';
        this.zip = '62701';

        // payment data
        this.card_name = 'John Doe';
        this.card_number = '4111111111111111';
        this.card_expiration_month = '10';
        this.card_expiration_year = '2026';
        this.card_cvv = '123';

        log('Orderdetails & Payment Page object initialized');
    }

    async fillCheckoutDetails() {
        log('Filling checkout details');

        await this.email_field.fill(this.email);
        log(`Email entered: ${this.email}`);

        await this.contact_field.fill(this.contact);
        log(`Contact entered: ${this.contact}`);

        await this.shipping_address_field.fill(this.shipping_address);
        log('Shipping address entered');

        await this.shipping_city_id.fill(this.city);
        log(`City entered: ${this.city}`);

        await this.shipping_state_id.fill(this.state);
        log(`State entered: ${this.state}`);

        await this.shipping_zip_id.fill(this.zip);
        log(`ZIP entered: ${this.zip}`);

        log('Checkout details filled successfully');
    }

    async fillPaymentDetails() {
        log('Filling payment details');

        await this.card_name_field.fill(this.card_name);
        log(`Cardholder name entered: ${this.card_name}`);

        await this.card_number_field.fill(this.card_number);
        log('Card number entered');

        // Handle expiration selectors
        if (await this.page.locator('#ccExpMonth').count() > 0) {
            log('Expiration month/year selectors detected');

            await this.card_expiration_month_field.waitFor({ state: 'visible' });
            await this.card_expiration_month_field.selectOption(this.card_expiration_month);
            log(`Expiration month selected: ${this.card_expiration_month}`);

            await this.card_expiration_year_field.selectOption(this.card_expiration_year);
            log(`Expiration year selected: ${this.card_expiration_year}`);

        } else if (await this.page.locator('#ccExp').count() > 0) {
            log('Combined expiration selector detected');

            const expLocator = this.page.locator('#ccExp');
            await expLocator.waitFor({ state: 'visible' });

            const options = await expLocator.locator('option').allTextContents();
            let matchValue = null;

            for (let i = 0; i < options.length; i++) {
                const text = options[i];
                log(`Checking expiration option: ${text}`);

                if (text.includes(this.card_expiration_month) && text.includes(this.card_expiration_year)) {
                    const value = await expLocator.locator('option').nth(i).getAttribute('value');
                    matchValue = value || text;
                    break;
                } else if (text.includes(this.card_expiration_year)) {
                    const value = await expLocator.locator('option').nth(i).getAttribute('value');
                    matchValue = value || text;
                    break;
                }
            }

            if (matchValue) {
                await expLocator.selectOption(matchValue);
                log(`Expiration selected: ${matchValue}`);
            } else {
                await expLocator.selectOption({ index: 1 });
                log('Expiration fallback option selected');
            }

        } else {
            log('Expiration selector not found, retrying after short wait');
            await this.page.waitForTimeout(500);
        }

        // Robust CVV handling
        log('Attempting to locate CVV field');

        const cvvSelectors = ['#ccCVV', '#ccCvv', '#cccvv', '#ccCvv', '#ccCvvField', '#ccCvvField'];
        let cvvLocator = null;

        for (const sel of cvvSelectors) {
            if (await this.page.locator(sel).count() > 0) {
                cvvLocator = this.page.locator(sel);
                log(`CVV field found using selector: ${sel}`);
                break;
            }
        }

        if (!cvvLocator && (await this.page.getByPlaceholder(/cvv/i).count()) > 0) {
            cvvLocator = this.page.getByPlaceholder(/cvv/i).first();
            log('CVV field found using placeholder');
        }

        if (cvvLocator) {
            await cvvLocator.fill(this.card_cvv);
            log('CVV entered successfully');
        } else {
            log('ERROR: CVV input not found on the page');
            throw new Error('CVV input not found on the page');
        }

        log('Payment details filled successfully');
    }

    async placeOrder() {
        log('Attempting to place order');

        const place_order_button = this.page.locator("input[type$='button']");

        await place_order_button.waitFor({ state: 'visible' });
        log('Place Order button is visible');

        await expect(place_order_button).toBeEnabled();
        log('Place Order button is enabled');

        await place_order_button.click();
        log('Place Order button clicked');

        await this.page.waitForLoadState('networkidle');
        log('Order placed and page reached network idle');
    }

    // Optional - Validatations in CheckOut page

    async Email_Check_with_INTEGERS(WrongEmail){
        await this.email_field.fill(WrongEmail);
        await this.contact_field.click();
        
        const email_error_messgae_field = this.page.locator('[error-message="Invalid Email"]');
        await expect(email_error_messgae_field).toBeVisible();
    }}

module.exports = { Orderdeatils_PaymentPage };
