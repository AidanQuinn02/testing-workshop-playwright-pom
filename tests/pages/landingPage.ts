import { Page } from 'playwright';
import {expect} from "@playwright/test";
import landingPage_content from "../content/landingPage_content";

class LandingPage {
    private readonly title: string;
    private readonly text: string;

    constructor() {
        this.title = `.govuk-heading-xl`
        // this.text =
    }

    async checkPageLoads(page: Page): Promise<void> {
        // Navigate to the landing page
        await page.goto('');

        //
        const header = await page.$('h2.gem-c-related-navigation__main-heading');
        const list = await header.evaluateHandle(h2 => h2.nextElementSibling.querySelector('ul'));
        const listItems = await list.$$('li.gem-c-related-navigation__link');
        const relatedContentActual = [];
        for (const item of listItems) {
            const text = await item.innerText();
            console.log(text); // Prints the text inside each <li>
            relatedContentActual.push(text);
          }
        //

        // Check all elements of the page
        await Promise.all([
            expect(page.locator(this.title)).toHaveText(landingPage_content.pageTitle),
            expect(relatedContentActual).toEqual(landingPage_content.relatedContent)
        ]);
    }

    async continueOn(page: Page): Promise<void> {
        // Click the continue button

    }
}

export default LandingPage;
