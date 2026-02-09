const{expect} = require('@playwright/test');

class CartPage {
    constructor(page) {
        this.page = page;
        this.size_dropdown = this.page.locator('#sizeSelect');
        this.quantity_dropdown = this.page.locator('#quantitySelect');
        this.addToCartBtn = this.page.getByText('Add to Cart');
        this.viewcart = this.page.locator('#viewCartAnchor');
        this.CheckoutBtn = this.page.getByText('Checkout').first();

        // Optional locators

        // remove button locator
        this.removeBtn = this.page.locator('.delete-button');
        // Cart Symbol locator 
        this.carticon_in_CartPage = this.page.locator('paper-icon-button[icon="shopping-cart"]');

    }

    async selectSize(size) {
        await this.size_dropdown.selectOption(size);
    }
    async selectQuantity(quantity) {
        await this.quantity_dropdown.waitFor({ state: 'visible' });
        await this.quantity_dropdown.selectOption({label: quantity.toString()});
        
    }
    async addToCart() {
        await this.addToCartBtn.click();
    }
    async viewCart(targetProduct) {
        await this.viewcart.click();
        await this.page.waitForLoadState('networkidle');
        await expect(this.page.url()).toContain('cart');
        await expect(this.page.locator('body')).toContainText(targetProduct);
    }
    async checkout() {
        await this.CheckoutBtn.click();
        await this.page.waitForLoadState('networkidle');
    }
    async validateCheckoutPage() {
        await expect(this.page.url()).toContain('checkout');
    }

    // Optional Methods
    // To remove item from cart
    async removeItemFromCart() {
        await this.removeBtn.click();
        await this.page.waitForLoadState('networkidle');
    }
    // Optional - EmptyCart Validatation 
    async validatecartIsEmpty() {
        const cartMessage = this.page.locator('text=is empty');
        await expect(cartMessage).toBeVisible();
}
    // Optional - Cart Number validatation in Cart page
    async CartNumberValidatation(Quantity){
        const arial_label_for_carticon = await this.carticon_in_CartPage.getAttribute('aria-label'); // "Shopping cart: ${Quantity} items"
        const itemCount = parseInt(arial_label_for_carticon.match(/\d+/)[0]);
        expect(itemCount).toBe(Quantity);
        console.log('Cart Number is', itemCount)

    }

    // Optional - Product Quanity 'INTEGER VALUE'
    async StoreSelectedQuantity() {
        const inputvalue_read_from_QunatityDropdown = await this.quantity_dropdown.inputValue();
        this.storedata = Number(inputvalue_read_from_QunatityDropdown);
        // return storedata;
    }
    // Optional - Storing CART Quantity 'INTGER VALUE'
    async Validate_Quanity_in_CartPage(){
        const cartpagedropdown_locator = await this.quantity_dropdown.inputValue();
        const cartpage_storedata = Number(cartpagedropdown_locator)
        if (cartpage_storedata == this.storedata){
            return true;
        }
        else{
            return false;
        }

    } 

}   

module.exports = { CartPage };