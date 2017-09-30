import { BurkeshPage } from './app.po';

describe('burkesh App', () => {
  let page: BurkeshPage;

  beforeEach(() => {
    page = new BurkeshPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
