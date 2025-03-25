import { expect } from '@playwright/test';
import {test} from "@playwright/test";
import LandingPage from "./pages/landingPage";

test(`Page object model happy path for second test`, async ({ page }): Promise<void> => {
    const landingPage: LandingPage = new LandingPage();
    await landingPage.checkPageLoads(page);
    await landingPage.happyPath1(page);
    await landingPage.errorPath1(page);
    await landingPage.happyPath2(page);
    await landingPage.errorPath2(page);
});