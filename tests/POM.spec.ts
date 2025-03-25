import { expect } from '@playwright/test';
import {test} from "@playwright/test";
import LandingPage from "./pages/landingPage";
import landingPage_content from "./content/landingPage_content";
import irregularHours_content from "./content/irregularHours_content";
import holidayEntitlement_content from "./content/holidayEntitlement_content";
import workOutHoliday_content from "./content/workOutHoliday_content";
import hoursPerWeek_content from "./content/hoursPerWeek_content";
import daysPerWeek_content from "./content/daysPerWeek_content";
import endPage_content from "./content/endPage_content";
import holidayInfo_content from "./content/holidayInfo_content";

import { continueAction } from './helpers/common_comps';
test.describe('E2E tests', () => {

    test(`Checking landing page and links`, async ({ page }): Promise<void> => {
        const landingPage: LandingPage = new LandingPage();
        await landingPage.checkPageLoads(page);
    });

    test('happy path - no', async ({ page }) => {
        //click on the start button and check if we have navigated to the next page 
        await page.goto('https://www.gov.uk/calculate-your-holiday-entitlement');
        await page.click('a[href="/calculate-your-holiday-entitlement/y"]');
        await expect(page.locator('h1')).toHaveText(irregularHours_content.pageTitle);

        //now fill in the form and click no and then continue
        await page.locator('label[for="response-1"] >> text=No').click();
        await continueAction(page, holidayEntitlement_content.pageTitle);   

        //we are on the next page, click hours worked and continue
        await page.locator('label[for="response-1"] >> text=hours worked per week').click();
        await continueAction(page, workOutHoliday_content.pageTitle);

        await page.locator('label[for="response-0"] >> text=for a full leave year').click();
        await continueAction(page, hoursPerWeek_content.pageTitle);

        await page.locator('[id="response"]').fill('40');
        await continueAction(page, daysPerWeek_content.pageTitle);

        await page.locator('[id="response"]').fill('3.5');
        await continueAction(page, endPage_content.pageTitle);
        await page.click('a[href="/holiday-entitlement-rights"]');
        await expect(page.locator('//*[@id="content"]/div[1]/div[1]/div/h1')).toContainText(holidayInfo_content.pageTitle);
        
    })

    test('error path - checking error message', async ({ page }) => {
        await page.goto('https://www.gov.uk/calculate-your-holiday-entitlement');
        await page.click('a[href="/calculate-your-holiday-entitlement/y"]');
        await expect(page.locator('h1')).toHaveText('Does the employee work irregular hours or for part of the year?');

        //now fill in the form and click no and then continue
        await page.locator('label[for="response-1"] >> text=No').click();
        await continueAction(page,'Is the holiday entitlement based on:');

        //we are on the next page, click hours worked and continue
        await page.locator('label[for="response-1"] >> text=hours worked per week').click();
        await continueAction(page,'Do you want to work out holiday:');

        await page.locator('label[for="response-0"] >> text=for a full leave year').click();
        await continueAction(page,'Number of hours worked per week?');

        await page.locator('[id="response"]').fill('40');
        await continueAction(page,'Number of days worked per week?');

        await page.locator('[id="response"]').fill('3.5');
        await continueAction(page,'Information based on your answers');

        await page.locator('a[data-ga4-link*="Number of hours worked per week?"]').click();
        await expect(page.locator('h1')).toHaveText('Number of hours worked per week?');
        await page.locator('[id="response"]').fill('200');
        await page.locator('button:has-text("Continue")').click();
        await expect(page.locator('//*[@id="error-summary"]/div/div/ul/li')).toContainText(landingPage_content.errorMessageHours);
        await page.locator('[id="response"]').fill('');
        await page.locator('button:has-text("Continue")').click();
        await expect(page.locator('//*[@id="error-summary"]/div/div')).toContainText(landingPage_content.errorMessageEmpty);
    })

    test('error path - year error checker', async ({ page }) => {
        await page.goto('https://www.gov.uk/calculate-your-holiday-entitlement');
        await page.click('a[href="/calculate-your-holiday-entitlement/y"]');
        
        await page.locator('label[for="response-0"] >> text=Yes').click();
        await continueAction(page,'When does the leave year start?');

        await page.locator('label[for="response-0"]').fill('1');
        await page.locator('label[for="response-1"]').fill('1');
        await page.locator('label[for="response-2"]').fill('eeeeee');
        await page.locator('button:has-text("Continue")').click();
        // Expected to break here due to bug
        await expect(page.url()).toBe('https://www.gov.uk/calculate-your-holiday-entitlement/y/irregular-hours-and-part-year');
        await expect(page.locator('//*[@id="error-summary"]/div/div')).toContainText('Please answer this question');

    })

})