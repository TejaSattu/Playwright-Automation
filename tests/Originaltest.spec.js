const {test, expect} = require('@playwright/test');

test.only("Ecommerce site - Add to Cart and Checkout", async ({page}) => {
    // Navigate to the ecommerce site
    await page.goto("https://shop.polymer-project.org/");
    
    let validatation = await page.locator(':text-is("SHOP")').first().isVisible();
    expect(validatation).toBeTruthy();
    
    const mens_tshrits = page.getByText("Men's T-Shirts").first();
    await expect(mens_tshrits).toBeVisible();
    await mens_tshrits.click();
    
    await page.waitForLoadState('networkidle');

    // Capture product name
    const titles = await page.locator('shop-list-item >> .title').allTextContents();

    const targetProduct = "Android Soccer T-Shirt";

    for (let i = 0; i < titles.length; i++) {
        
        if (titles[i].includes(targetProduct)) {
            await page.locator('shop-list-item')
            .filter({ hasText: targetProduct })
            .first()
            .click();
            break;
        }
    }
    await page.waitForTimeout(2000);
    await expect(page.url()).toContain("detail/mens_tshirts/Android+Soccer+T-Shirt");

    // size selection dropdown

    const dropdown = page.locator('#sizeSelect');
    await dropdown.selectOption('M');

    // Quantity selection dropdown
    const quantity = page.locator('#quantitySelect');
    await quantity.selectOption('2');

    // Add to cart button
    const addToCartBtn = page.getByText('Add to Cart');
    await addToCartBtn.click();
    
    const viewcart = page.locator('#viewCartAnchor');
    await viewcart.click();

    await page.waitForLoadState('networkidle');

    // Validate cart page
    await expect(page.url()).toContain('cart');

    // await expect(page.getByAltText(targetProduct)).toBeVisible();
    await expect(page.locator('body')).toContainText(targetProduct);

    const CheckoutBtn = page.getByText('Checkout').first();
    await CheckoutBtn.click();
    await page.waitForLoadState('networkidle');

    // Validate checkout page
    await expect(page.url()).toContain('checkout');

    // CheckOut locators 
    // # fields are ID locators
    const email_field = page.locator('input[name="accountEmail"]');
    const email = 'JohnDoe@yahoo.com';
    const contact_field = page.locator('input[name="accountPhone"]');
    const contact = '1234567890';
    const shipping_address_field = page.locator('[placeholder="Address"]').first();
    const shipping_address = '123 Main St, Springfield, IL 62701';
    const shipping_city_id = page.locator("#shipCity");
    const city = 'Springfield';
    const shipping_state_id = page.locator("#shipState");
    const state = 'IL';
    const shipping_zip_id = page.locator("#shipZip");
    const zip = '62701';

    // Fill in checkout details

    await email_field.fill(email);
    await contact_field.fill(contact);
    await shipping_address_field.fill(shipping_address);
    await shipping_city_id.fill(city);
    await shipping_state_id.fill(state);
    await shipping_zip_id.fill(zip);
    
// Payment locators 
const card_name_field = page.locator('#ccName');
const card_name = 'John Doe';
const card_number_field = page.locator('#ccNumber');
const card_number = '4111111111111111';
const card_expiration_month_field = page.locator('#ccExpMonth');
const card_expiration_month = '10';
const card_expiration_Year_field = page.locator('#ccExpYear');
const card_expiration_year = '2025';
const card_cvv_field = page.locator('#ccCVV');
const card_cvv = '123';

// Fill card details
await card_name_field.fill(card_name);
await card_number_field.fill(card_number);

// Select expiration month and year
await card_expiration_month_field.selectOption(card_expiration_month);
await card_expiration_Year_field.selectOption(card_expiration_year);

// Fill CVV
await card_cvv_field.fill(card_cvv);

// Wait for the Place Order button to be enabled (instead of fixed timeout)
const place_order_button = page.locator("input[type$='button']");   // replace with correct selector if needed
await place_order_button.waitFor({ state: 'visible' });
await expect(place_order_button).toBeEnabled();
await place_order_button.click();

await page.waitForLoadState('networkidle');
await expect(page.locator('body')).toContainText('Finish');
console.log("Order has been placed successfully.");

const Successurl = 'https://shop.polymer-project.org/checkout/success'
await page.waitForURL(Successurl);
// Take a screenshot of the completed order page

await page.screenshot({ path: 'ecommerce_checkout_complete.png', fullPage: true });

await page.close();

});