const { expect } = require('@playwright/test');

class synchronization {
    constructor(page) {
        this.page = page;
    }

    async waitForLoadState() {
        await this.page.waitForLoadState('networkidle');
    }

    async staticTimeout(timeout) {
        await this.page.waitForTimeout(timeout);
    }

    async waitForPageStable() {
        // DOM loaded (SPA-safe)
        await this.page.waitForLoadState('domcontentloaded');

        //  FIX 4: Reset focus to prevent auto-scroll / jump to bottom
        await this.page.evaluate(() => {
            document.body && document.body.focus();
        });

        // Small layout settle (not a hard sleep)
        await this.page.evaluate(() => {
            return new Promise(resolve =>
                requestAnimationFrame(() =>
                    requestAnimationFrame(resolve)
                )
            );
        });
    }
}

module.exports = { synchronization };
