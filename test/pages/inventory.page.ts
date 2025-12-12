import { map } from 'async';

import GeneralPage from './general.page.js';

class InventoryPage extends GeneralPage {
  constructor() {
    super('Inventory', 'div#inventory_container');
  }

  get subheaderLabel() {
    return $('span.title');
  }

  get sortDropdown() {
    return $('select[data-test="product-sort-container"]');
  }

  get inventoryItems() {
    return $$('div.inventory_item');
  }

  get inventoryItemImages() {
    return $$('div.inventory_item_img > a > img');
  }

  get inventoryItemNames() {
    return $$('div.inventory_item_name');
  }

  get inventoryItemDescriptions() {
    return $$('div.inventory_item_desc');
  }

  get inventoryItemPrices() {
    return $$('div.inventory_item_price');
  }

  inventoryItemLink(itemName: string) {
    return $(`div=${itemName}`);
  }

  async open() {
    await super.open('inventory.html');
    await this.waitForElements();
  }

  addToCartButton(itemId: string) {
    return $(`[data-test="add-to-cart-${itemId}"]`);
  }

  removeFromCartButton(itemId: string) {
    return $(`[data-test="remove-${itemId}"]`);
  }

  /**
   * Picks an item randomly, to keep test data dynamic.
   * @returns The chosen item's name, description, and price
   */
  async pickItemRandomly() {
    const itemNames = await map(this.inventoryItemNames, async (item: WebdriverIO.Element) => await item.getText());
    const itemDescriptions = await map(
      this.inventoryItemDescriptions,
      async (item: WebdriverIO.Element) => await item.getText()
    );
    const itemPrices = await map(this.inventoryItemPrices, async (item: WebdriverIO.Element) => await item.getText());
    const choice = chance.integer({ min: 0, max: itemNames.length - 1 });
    return {
      name: itemNames[choice],
      description: itemDescriptions[choice],
      price: itemPrices[choice]
    };
  }

  /**
   * Adds the specified item name to the shopping cart.
   * @param itemId The item's id
   */
  async clickAddToCart(itemId: string) {
    await this.addToCartButton(itemId).waitForAndClick();
  }

  /**
   * Removes the specified item name from the shopping cart.
   * @param itemId The item's id
   */
  async clickRemoveFromCart(itemId: string) {
    await this.removeFromCartButton(itemId).waitForAndClick();
  }

  async waitForElements(visibility = true) {
    const elements = [this.subheaderLabel, this.sortDropdown];
    await browser.waitForElements(elements, visibility);
    await browser.waitUntil(async () => (await this.inventoryItems.length) > 0);
  }
}

export default new InventoryPage();
