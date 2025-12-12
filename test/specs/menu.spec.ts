import { expect } from 'expect-webdriverio';

import CartPage from '../pages/cart.page.js';
import HeaderModal from '../pages/header.modal.js';
import InventoryPage from '../pages/inventory.page.js';
import LoginPage from '../pages/login.page.js';
import Users from '../util/users.js';

describe('Hamburger Menu', () => {
  before(async () => {
    await LoginPage.open();
    await LoginPage.login(Users.standard);
  });

  beforeEach(async () => {
    await InventoryPage.open();
    await HeaderModal.waitForPageShown();
  });

  it('Shopping cart icon redirects to the Cart page', async () => {
    await HeaderModal.shoppingCartIcon.waitForAndClick();
    await expect(browser).toHaveUrl(expect.stringContaining('cart'));
  });

  it('"All Items" correctly redirects back to the Products page', async () => {
    // Navigate to a different page
    await HeaderModal.shoppingCartIcon.waitForAndClick();
    await CartPage.waitForPageShown();
    await HeaderModal.clickAllItems();
    await expect(browser).toHaveUrl(expect.stringContaining('inventory'));
  });

  // WDIO hangs after redirecting to saucelabs.com, skipping for now
  it.skip('"About" correctly redirects to Sauce Labs homepage', async () => {
    await HeaderModal.clickAbout();
    await expect(browser).toHaveUrl(expect.stringContaining('saucelabs.com'));
  });

  it('"Logout" deletes session cookie and redirects to Login page', async () => {
    await HeaderModal.clickLogout();
    await expect(LoginPage.mainElement).toBeDisplayed();
    const authCookie = await browser.getCookies(['session-username']);
    await expect(authCookie).toHaveLength(0);
  });
});
