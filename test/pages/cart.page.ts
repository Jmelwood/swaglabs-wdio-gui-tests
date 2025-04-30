import GeneralPage from './general.page.js';

class CartPage extends GeneralPage {
  constructor() {
    super('Cart', 'div.cart_contents_container');
  }

  get inventoryItems() {
    return $$('div.inventory_item_name');
  }

  inventoryItemLink(itemName: string) {
    return $(`div=${itemName}`);
  }

  get checkoutButton() {
    return $('button[data-test="checkout"]');
  }

  get cancelButton() {
    return $('button[data-test="continue-shopping"]');
  }

  removeFromCartButton(itemId: string) {
    return $(`button[data-test="remove-${itemId}"]`);
  }

  /**
   * Removes the specified item name from the shopping cart.
   * @param itemName - The name of the item to be removed.
   */
  async clickRemoveFromCart(itemName: string) {
    const itemId = itemName.replace(/\s/g, '-').toLowerCase();
    await this.removeFromCartButton(itemId).waitForAndClick();
  }

  async open() {
    await super.open('cart.html');
    await this.waitForElements();
  }

  async waitForElements(visibility = true) {
    const elements = [this.checkoutButton, this.cancelButton];
    await browser.waitForElements(elements, visibility);
  }
}

export default new CartPage();
