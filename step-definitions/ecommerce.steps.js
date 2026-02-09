const { Given, When, Then } = require('@cucumber/cucumber');
const { chromium } = require('playwright');

const HomePage = require('../Pages/One_Homepage');
const ProductPage = require('../Pages/Two_Productpage');
const CartPage = require('../Pages/Three_Cartpage');
const CheckoutPage = require('../Pages/Four_Orderdeatils_&_PaymentPage_and_checkout');
const ConfirmationPage = require('../Pages/Five_Order_ConfirmationPage');

let browser;
let page;

// Page Objects
let home;
let product;
let cart;
let checkout;
let confirmation;

Given('user launches the ecommerce application', async function () {
  browser = await chromium.launch({ headless: false });
  page = await browser.newPage();
  await page.goto("https://shop.polymer-project.org/");

  home = new HomePage(page);
  product = new ProductPage(page);
  cart = new CartPage(page);
  checkout = new CheckoutPage(page);
  confirmation = new ConfirmationPage(page);
});

When('user adds product to cart', async function () {
  await home.selectProduct();
  await product.addToCart();
});

When('user completes checkout process', async function () {
  await cart.proceedToCheckout();
  await checkout.fillOrderDetails();
  await checkout.placeOrder();
});

Then('order should be placed successfully', async function () {
  await confirmation.verifyOrderConfirmation();
  await browser.close();
});
