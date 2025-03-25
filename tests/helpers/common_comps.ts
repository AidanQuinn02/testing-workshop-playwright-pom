import * as playwright from 'playwright';
import {expect, Page} from "@playwright/test";



  export async function continueAction(page: Page, message: string){

        await page.locator('button:has-text("Continue")').click(); 
        await expect(page.locator('h1')).toContainText(message);

    }


