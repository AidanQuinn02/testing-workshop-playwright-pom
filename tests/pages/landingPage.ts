import * as playwright from 'playwright';
import {expect} from "@playwright/test";
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

    async happyPath1(page: Page): Promise<void> {
        //click on the start button and check if we have navigated to the next page 
        await page.goto('https://www.gov.uk/calculate-your-holiday-entitlement');
        await page.click('a[href="/calculate-your-holiday-entitlement/y"]');
        await expect(page.locator('h1')).toHaveText('Does the employee work irregular hours or for part of the year?');

        //now fill in the form and click no and then continue
        await page.locator('label[for="response-1"] >> text=No').click();
        await page.locator('button:has-text("Continue")').click();
        await expect(page.locator('h1')).toHaveText('Is the holiday entitlement based on:');

        //we are on the next page, click hours worked and continue
        await page.locator('label[for="response-1"] >> text=hours worked per week').click();
        await page.locator('button:has-text("Continue")').click();
        await expect(page.locator('h1')).toHaveText('Do you want to work out holiday:');

        await page.locator('label[for="response-0"] >> text=for a full leave year').click();
        await page.locator('button:has-text("Continue")').click();
        await expect(page.locator('h1')).toHaveText('Number of hours worked per week?');

        await page.locator('[id="response"]').fill('40');
        await page.locator('button:has-text("Continue")').click();
        await expect(page.locator('h1')).toHaveText('Number of days worked per week?');

        await page.locator('[id="response"]').fill('3.5');
        await page.locator('button:has-text("Continue")').click();
        await expect(page.locator('h1')).toContainText('Information based on your answers');


    }

    async errorPath1(page: Page): Promise<void> {
    //from the answers page we want to change the number of hours worked per week incorrectly and verify the error message


        await page.locator('a[data-ga4-link*="Number of hours worked per week?"]').click();
        await expect(page.locator('h1')).toHaveText('Number of hours worked per week?');
        await page.locator('[id="response"]').fill('200');
        await page.locator('button:has-text("Continue")').click();
        await expect(page.locator('//*[@id="error-summary"]/div/div/ul/li')).toContainText(landingPage_content.errorMessageHours);
        await page.locator('[id="response"]').fill('');
        await page.locator('button:has-text("Continue")').click();
        await expect(page.locator('//*[@id="error-summary"]/div/div')).toContainText(landingPage_content.errorMessageEmpty);
    }

    async happyPath2(page: Page): Promise<void >{

        await page.locator('[id="response"]').fill('40');
        await page.locator('button:has-text("Continue")').click();
        await expect(page.locator('h1')).toHaveText('Number of days worked per week?');

        await page.locator('[id="response"]').fill('3.5');
        await page.locator('button:has-text("Continue")').click();
        await expect(page.locator('h1')).toContainText('Information based on your answers');
        await page.click('a[href="/holiday-entitlement-rights"]');
        await expect(page.locator('//*[@id="content"]/div[1]/div[1]/div/h1')).toContainText('Holiday entitlement');


    }

    async errorPath2(page: Page): Promise<void> {
        await page.goto('https://www.gov.uk/calculate-your-holiday-entitlement');
        await page.click('a[href="/calculate-your-holiday-entitlement/y"]');
        
        await page.locator('label[for="response-0"] >> text=Yes').click();
        await page.locator('button:has-text("Continue")').click();
        await expect(page.locator('h1')).toHaveText('When does the leave year start?');

        await page.locator('label[for="response-0"]').fill('1');
        await page.locator('label[for="response-1"]').fill('1');
        await page.locator('label[for="response-2"]').fill('eeeeee');
        await page.locator('button:has-text("Continue")').click();
        // Expected to break here due to bug
        await expect(page.url()).toBe('https://www.gov.uk/calculate-your-holiday-entitlement/y/irregular-hours-and-part-year');
        await expect(page.locator('//*[@id="error-summary"]/div/div')).toContainText('Please answer this question');

    }
}



export default LandingPage;
