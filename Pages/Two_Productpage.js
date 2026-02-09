const { expect } = require('@playwright/test');
const { log } = require('../utils/logger');

class Productpage {
    constructor(page) {
        this.page = page;
        this.tiles_locator = this.page.locator('shop-list-item >> .title');

        log('Productpage object initialized');
    }

    async SelectingProduct(targetProduct) {
        log(`Fetching product titles from product listing page`);

        const titles = await this.tiles_locator.allTextContents();
        log(`Number of products found: ${titles.length}`);

        for (let i = 0; i < titles.length; i++) {
            log(`Checking product: ${titles[i]}`);

            if (titles[i].includes(targetProduct)) {
                log(`Target product matched: ${targetProduct}`);

                await this.page.locator('shop-list-item')
                    .filter({ hasText: targetProduct })
                    .first()
                    .click();

                log(`Clicked on product: ${targetProduct}`);
                break;
            }
        }

        log('Waiting for product detail page to load');
        await this.page.waitForTimeout(2000);

        log('Validating product detail page URL');
        await expect(this.page).toHaveURL(/detail\/mens_tshirts\//);


        log('Product detail page validation successful');
    }
}

module.exports = { Productpage };
