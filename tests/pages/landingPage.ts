import * as playwright from 'playwright';
import {expect, Page} from "@playwright/test";
import landingPage_content from "../content/landingPage_content";

class LandingPage {
    private readonly title: string;
    private readonly text: string;

    constructor() {
        this.title = `.govuk-heading-xl`
        // this.text =
    }

    // async checkLinks(page: Page, links: string[], identifiers: string[]): Promise<void> {
    //     const header = await page.$('h2.gem-c-related-navigation__main-heading');
    //     const list = await header.evaluateHandle(h2 => h2.nextElementSibling.querySelector('ul'));
    //     const listItems = await list.$$('li.gem-c-related-navigation__link');
    //     const listActual = [];
    //     for (const item of listItems) {
    //         const text = await item.innerText();
    //         console.log(text); // Prints the text inside each <li>
    //         listActual.push(text);
    //       }
    //     //

    //     // Check all elements of the page
    //     await Promise.all([
    //         expect(page.locator(this.title)).toHaveText(landingPage_content.pageTitle),
    //         expect(relatedContentActual).toEqual(landingPage_content.relatedContent)
    //     ]);


    // }



    async checkPageLoads(page: Page): Promise<void> {
        // Navigate to the landing page
        await page.goto('https://www.gov.uk/calculate-your-holiday-entitlement');

        //checking the related content links
        const header = await page.$('h2.gem-c-related-navigation__main-heading');
        const list = await header.evaluateHandle(h2 => h2.nextElementSibling.querySelector('ul'));
        const listItems = await list.$$('li.gem-c-related-navigation__link');
        const relatedContentActual = [];
        for (const item of listItems) {
            const text = await item.innerText();
            relatedContentActual.push(text);
          }
        //

        // Check all elements of the page
        await Promise.all([
            expect(page.locator(this.title)).toHaveText(landingPage_content.pageTitle),
            expect(relatedContentActual).toEqual(landingPage_content.relatedContent)
        ]);

        //checking the explore the topic links 
        

        
        // Now find all <li> elements under this header
        const listItems2 = await expect(page.locator('//*[@id="content"]/div[2]/div[1]/div/div/nav')).toContainText(landingPage_content.exploreTheTopic);

    

        }


}



export default LandingPage;
