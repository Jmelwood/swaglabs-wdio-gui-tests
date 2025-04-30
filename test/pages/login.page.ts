import type { User } from '../util/users.js';
import GeneralPage from './general.page.js';

class LoginPage extends GeneralPage {
  constructor() {
    super('Login', 'div.login_container');
  }

  get headerLabel() {
    return $('div.login_logo');
  }

  get usernameField() {
    return $('input[data-test="username"]');
  }

  get passwordField() {
    return $('input[data-test="password"]');
  }

  get submitButton() {
    return $('input[data-test="login-button"]');
  }

  get errorMsg() {
    return $('h3[data-test="error"]');
  }

  async open() {
    await super.open();
    await this.waitForElements();
  }

  async waitForElements(visibility?: boolean) {
    const elements = [this.headerLabel, this.usernameField, this.passwordField, this.submitButton];
    await browser.waitForElements(elements, visibility);
  }

  /**
   * Handles the login functionality.
   * @param user A fixture object containing the username/password credentials
   *
   */
  async login(user: User) {
    await this.usernameField.setValue(user.username);
    await this.passwordField.setValue(user.password);
    await this.submitButton.click();
  }
}

export default new LoginPage();
