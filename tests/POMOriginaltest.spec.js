const { test, expect } = require('@playwright/test');
const { Homepage } = require('../Pages/One_Homepage');
const { Productpage } = require('../Pages/Two_Productpage');
const { CartPage } = require('../Pages/Three_Cartpage');
const { Orderdeatils_PaymentPage } = require('../Pages/Four_Orderdeatils_&_PaymentPage_and_checkout');
const { OrderConfirmationPage } = require('../Pages/Five_Order_ConfirmationPage');
const JSONData = require('../utils/testData.json');
const { log } = require('../utils/logger');

for (const data of JSONData) {
  test(`Ecommerce site - Add to Cart and Checkout with ${data.targetProduct}`, async ({ page }) => {

    // Homepage actions
    const homepage = new Homepage(page);
    await homepage.navigateToHomePage();
    await homepage.validateHomepage();
    await homepage.clickMensTshirts();

    // Product Selection Page actions
    const productpage = new Productpage(page);
    await productpage.SelectingProduct(data.targetProduct);

    // Cart and Checkout actions
    const cartpage = new CartPage(page);
    await cartpage.selectSize(data.size);
    await cartpage.selectQuantity(data.Quantity);
    await cartpage.addToCart();
    await cartpage.viewCart(data.targetProduct);
    await cartpage.checkout();
    await cartpage.validateCheckoutPage();

    // Checkout & Payment
    const orderdeatils_PaymentPage = new Orderdeatils_PaymentPage(page);
    await orderdeatils_PaymentPage.fillCheckoutDetails();
    await orderdeatils_PaymentPage.fillPaymentDetails();
    await orderdeatils_PaymentPage.placeOrder();

    // Order Confirmation
    const orderConfirmationPage = new OrderConfirmationPage(page);
    await orderConfirmationPage.waitForSuccessURL();
    await orderConfirmationPage.successValidatation();
    await orderConfirmationPage.takeScreenshot();

  });
}
    