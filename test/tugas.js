require('chromedriver');

const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');

describe('HOMEWORK_9 - SauceDemo Automation', function () {

    this.timeout(60000); // tambah waktu jadi 60 detik

    let driver;

    // BEFORE
    before(async function () {
        const options = new chrome.Options();

        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();

        await driver.get('https://www.saucedemo.com/');
    });

    // TEST LOGIN
    it('Sukses Login', async function () {

        await driver.findElement(By.id('user-name')).sendKeys('standard_user');
        await driver.findElement(By.id('password')).sendKeys('secret_sauce');
        await driver.findElement(By.id('login-button')).click();

        await driver.wait(until.urlContains('inventory.html'), 10000);

        const currentUrl = await driver.getCurrentUrl();

        assert.strictEqual(
            currentUrl.includes('inventory.html'),
            true
        );
    });

    // TEST SORT A-Z
    it('Urutkan Produk dari A-Z', async function () {

        const dropdown = await driver.findElement(
            By.className('product_sort_container')
        );

        await dropdown.sendKeys('Name (A to Z)');

        await driver.sleep(2000);

        const productElements = await driver.findElements(
            By.className('inventory_item_name')
        );

        let actualProducts = [];

        for (let product of productElements) {
            actualProducts.push(await product.getText());
        }

        let expectedProducts = [...actualProducts].sort();

        assert.deepStrictEqual(actualProducts, expectedProducts);
    });

    // AFTER
    after(async function () {
        if (driver) {
            await driver.quit();
        }
    });

});