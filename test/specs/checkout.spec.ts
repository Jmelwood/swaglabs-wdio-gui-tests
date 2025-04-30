import { map } from 'async';
import { expect } from 'expect-webdriverio';

import CartPage from '../pages/cart.page.js';
import CheckoutPage from '../pages/checkout.page.js';
import HeaderModal from '../pages/header.modal.js';
import InventoryPage from '../pages/inventory.page.js';
import LoginPage from '../pages/login.page.js';
import { nameToId } from '../util/misc.js';
import Users from '../util/users.js';

describe('Checkout', () => {
  before(async () => {
    await LoginPage.open();
    await LoginPage.login(Users.standard);
    await InventoryPage.waitForPageShown();
  });

  beforeEach(async () => {
    await InventoryPage.open();
  });

  afterEach(async () => {
    await HeaderModal.clickResetAppState();
  });

  it('Adding/removing items to/from the cart shows/removes the item from the summary page', async () => {
    const itemName = (await InventoryPage.pickItemRandomly()).name;
    const itemElementId = nameToId(itemName);
    await InventoryPage.clickAddToCart(itemElementId);
    await HeaderModal.shoppingCartIcon.click();
    await CartPage.waitForPageShown();
    await CartPage.waitForElements();
    let cartResults = await map(
      CartPage.inventoryItems,
      async (element: WebdriverIO.Element) => await element.getText()
    );
    let expectedCartResult = cartResults.find((item) => item === itemName);
    await expect(expectedCartResult).toBeDefined();
    await CartPage.clickRemoveFromCart(itemElementId);
    cartResults = await map(CartPage.inventoryItems, async (element: WebdriverIO.Element) => await element.getText());
    expectedCartResult = cartResults.find((item) => item === itemName);
    await expect(expectedCartResult).toBeUndefined();
  });

  it('User can navigate through the happy path flow without issue', async () => {
    /**
     * The following assertions are tested in this flow:
     * - Item total (across two items), and the 8% tax, are calculated correctly
     * - The cart is reset when checkout is finished
     */
    const item1 = await InventoryPage.pickItemRandomly();
    let item2: {
      name: string;
      description: string;
      price: string;
    };
    do {
      item2 = await InventoryPage.pickItemRandomly();
    } while (item1.name === item2.name);
    await InventoryPage.clickAddToCart(nameToId(item1.name));
    await InventoryPage.clickAddToCart(nameToId(item2.name));
    await HeaderModal.shoppingCartIcon.click();
    await CartPage.waitForPageShown();
    await CartPage.checkoutButton.waitForAndClick();
    await CheckoutPage.waitForPageShown();
    await CheckoutPage.waitForElements();
    await CheckoutPage.fillFields(Users.standard);
    await CheckoutPage.continueButton.click();
    const expectedSubtotal = parseFloat(item1.price.replace('$', '')) + parseFloat(item2.price.replace('$', ''));
    const expectedTax = expectedSubtotal * 0.08;
    const expectedTotal = expectedSubtotal + expectedTax;
    await expect(CheckoutPage.subtotalLabel).toHaveText(expect.stringContaining(expectedSubtotal.toFixed(2)));
    await expect(CheckoutPage.taxLabel).toHaveText(expect.stringContaining(expectedTax.toFixed(2)));
    await expect(CheckoutPage.totalLabel).toHaveText(expect.stringContaining(expectedTotal.toFixed(2)));
    await CheckoutPage.finishButton.click();
    await CheckoutPage.completeContainer.waitForDisplayed();
    await expect(CheckoutPage.completePonyImage).toBeDisplayed();
    await CheckoutPage.returnToInventoryButton.waitForAndClick();
    await InventoryPage.waitForPageShown();
    // If the bage isn't displayed, then no items are registered as added
    await expect(HeaderModal.shoppingCartBadge).not.toBeDisplayed();
  });

  it('Field information is required to checkout', async () => {
    const item = await InventoryPage.pickItemRandomly();
    await InventoryPage.clickAddToCart(nameToId(item.name));
    await HeaderModal.shoppingCartIcon.click();
    await CartPage.waitForPageShown();
    await CartPage.checkoutButton.waitForAndClick();
    await CheckoutPage.waitForPageShown();
    await CheckoutPage.continueButton.waitForAndClick();
    // Verify the error container appesrs, and that a label from the next screen doesn't appear
    await expect(CheckoutPage.fieldErrorContainer).toBeDisplayed();
    await expect(CheckoutPage.subtotalLabel).not.toBeDisplayed();
  });
});
