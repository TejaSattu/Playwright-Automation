const { expect } = require('@playwright/test');

class Validatation_in_UI{
    constructor(page){
        this.page = page;
    }
    async Screenshot(){
        await this.page.screenshot()
    }
}

module.exports = { Validatation_in_UI }