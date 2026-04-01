const {test, expect} = require('@playwright/test');
const { Homepage } = require('../Pages/One_Homepage');
const { Productpage } = require('../Pages/Two_Productpage');
const { CartPage } = require('../Pages/Three_Cartpage');
const { Orderdeatils_PaymentPage } = require('../Pages/Four_Orderdeatils_&_PaymentPage_and_checkout')
const { synchronization } = require('../syncornazation');

const targetProduct = 'YouTube Organic Cotton T-Shirt - Grey';
const Quantity = 2;
const size = 'L';


// Hookes
let homepage, productPage, cartPage, sync, Orderdetails_Checkout ;

test.beforeEach(async ({page}) => {
    homepage = new Homepage(page);
    productPage = new Productpage(page);
    cartPage = new CartPage(page);
    Orderdetails_Checkout = new Orderdeatils_PaymentPage(page);
    sync = new synchronization(page);
});

//--------------------------- //

// Empty Cart Validation Test
//--------------------------- //

test('Cart page Empty Validation', async ({page}) => {
    
    // Navigate to the cart page
    await page.goto('https://shop.polymer-project.org/cart');

    /// check cart is empty or not
    const cartMessage = page.locator('text=is empty');
    await expect(cartMessage).toBeVisible();

    console.log('Cart is empty validation passed');

    
});

// Ladies Outerwear – Item Count Validation
//----------------------------------------- //

test('Ladies Outerwear item count matches product list', async ({ page }) => {

  // Navigate to home page
  await page.goto('https://shop.polymer-project.org/');

  // Navigate to Ladies Outerwear section
  const ladieswear = page.locator('a[href="/list/ladies_outerwear"]').first();
  await ladieswear.click();

  // Wait for the page to load
  await page.waitForLoadState('networkidle');

    // Get the count of products displayed
    const products = page.locator('.grid li');
    const productCount = await products.count();
    console.log(`Number of products displayed: ${productCount}`);

    const itemCountText = page.locator('text=items');
    const itemCount = await itemCountText.textContent();
    
    // Extract the number from the text (e.g., "5 items" -> 5)
    const itemCountNumber = parseInt(itemCount.match(/\d+/));
    console.log(`Item count from page text: ${itemCountNumber}`);

    if (productCount === itemCountNumber) {
        console.log('Hurry :), Item count validation passed: Product count matches item count text.');
    } else {
        console.error('Item count validation failed: Product count does not match item count text.');
    }
});


// Adding product to cart and removing it validation
//------------------------------------------------ //

test('Add and Remove product from cart validation', async ({ page }) => {

    const targetProduct = 'YouTube Organic Cotton T-Shirt - Grey';

    // Navigate to homepage
    await homepage.navigateToHomePage();
    // Navigate to Men's T-Shirts
    await homepage.clickMensTshirts();

    await productPage.SelectingProduct(targetProduct);

    // Go to Cart Page
    await cartPage.selectSize('M');
    await cartPage.selectQuantity(1);
    await cartPage.addToCart();
    await cartPage.viewCart(targetProduct);

    // Remove the product from cart
    await cartPage.removeItemFromCart();

    // Validate cart is empty
    await cartPage.validatecartIsEmpty();

    console.log('Add and Remove product from cart validation passed');

    await sync.staticTimeout(2000);
});

// Cart showing one item validation after adding an item
//----------------------------------------------------- //

test('Cart shows one item after adding a product', async () => {

    const targetProduct = 'YouTube Organic Cotton T-Shirt - Grey';
    const Quantity = 2;

    await homepage.navigateToHomePage();
    await homepage.clickMensTshirts();
    await productPage.SelectingProduct(targetProduct);

    await cartPage.selectSize('M');
    await cartPage.selectQuantity(Quantity);
    await cartPage.addToCart();
    await cartPage.viewCart(targetProduct);

    await cartPage.CartNumberValidatation(Quantity);

    await cartPage.removeItemFromCart();
    await cartPage.validatecartIsEmpty();

});

// Quantity Check in the Product Page and Cart page is equal //
//--------------------------------------------------------- //

test('Quantity Check in Product Page and Cart page', async({ page }) => {

    await homepage.navigateToHomePage();
    await homepage.clickMensTshirts();
    
    await productPage.SelectingProduct(targetProduct);

    await cartPage.selectSize('M');
    await cartPage.selectQuantity(Quantity);
    await cartPage.StoreSelectedQuantity();
    await cartPage.addToCart();
    const result =  await cartPage.Validate_Quanity_in_CartPage();
    expect(result).toBe(true);
    await cartPage.viewCart(targetProduct);
});

// -------------------------->>>>>>>>>>>>>>>>>>>>>>>>>>>-------------------------- //

// CheckOut Page Validatations

test('Incorrect Email & Error message check', async({ page }) =>{
        
        // Homepage actions
        await homepage.navigateToHomePage();
        await homepage.validateHomepage();
        await homepage.clickMensTshirts();
    
        // Product Selection Page actions
        await productPage.SelectingProduct(targetProduct);
    
        // Cart and Checkout actions
        
        await cartPage.selectSize(size);
        await cartPage.selectQuantity(Quantity);
        await cartPage.addToCart();
        await cartPage.viewCart(targetProduct);
        await cartPage.checkout();
        await cartPage.validateCheckoutPage();

        // Order details and CheckOutPage 

        await Orderdetails_Checkout.Email_Check_with_INTEGERS("12323")
        await page.waitForTimeout(2000);
});