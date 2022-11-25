import { expect, Page, test } from '@playwright/test';
import { UserGroup } from 'common/enums';
import { NewQuote } from "common/interfaces";
import { randomUUID } from "crypto";
import { EditListPage } from "../pages/EditListPage";
import { disposeStorageLogIn, getStoragePath, storageLogIn } from '../utils/auth';

test.describe.serial("Users can update and delete quotes created by themselves",  async () => {
    await testCrud({
        creator: UserGroup.Contributor, 
        moderator: UserGroup.Contributor, 
        testId: 1
    })
})

test.describe.serial("Admin can update and delete quotes created by others @smoke", async () => {
    await testCrud({
        creator: UserGroup.Contributor, 
        moderator: UserGroup.Administrator, 
        testId: 2
    }) 
})

test.describe.serial("Super admin can update and delete quotes created by others", async () => {
    await testCrud({
        creator: UserGroup.Contributor, 
        moderator: UserGroup.SuperAdministrator, 
        testId: 3
    })
})

// crud -> create read update delete
async function testCrud(opts: {creator: UserGroup, moderator: UserGroup, testId: number}) { 

    test.use({ storageState: getStoragePath(opts.moderator)})

    // Mockup data for the tests
    const quote1: NewQuote = createRandomQuote()
    const quote2: NewQuote = createRandomQuote()

    test(`New (${opts.testId})`, async ({browser}) => {
        const page = await storageLogIn(browser, opts.creator)
        await testCreateNew(page, quote1)
        disposeStorageLogIn(page)
    })

    test(`Update (${opts.testId})`, async ({page}) => {
        await testUpdate(page, quote1, quote2)
    })

    test(`Delete (${opts.testId})`, async ({page}) => {
        await testDelete(page, quote2)
    })
}

async function testCreateNew(page: Page, quote: NewQuote) {
    await page.goto('/sitater/ny');
    
    const quotePage = new QuotePage(page)
    await quotePage.newItem(quote)

    await expect(page.getByText(quote.quote)).toBeVisible();
    await expect(page.getByText(quote.utterer)).toBeVisible();
}

async function testUpdate(page: Page, oldQuote: NewQuote, newQuote: NewQuote) {
    await page.goto('/sitater');
    
    const quotePage = new QuotePage(page)
    await quotePage.editItem(oldQuote, newQuote)

    await expect(page.getByText(newQuote.quote)).toBeVisible();
    await expect(page.getByText(newQuote.utterer)).toBeVisible();
    await expect(page.getByText(oldQuote.quote)).not.toBeVisible();
    await expect(page.getByText(oldQuote.utterer)).not.toBeVisible();
}

async function testDelete(page: Page, quote: NewQuote) {
    await page.goto('/sitater')

    const quotePage = new QuotePage(page)
    await quotePage.deleteItem(quote)

    await expect(page.getByText(quote.quote)).not.toBeVisible();
    await expect(page.getByText(quote.utterer)).not.toBeVisible();
}

function createRandomQuote(): NewQuote {
    return {
        utterer: `__test utterer id: ${randomUUID()}`, 
        quote: `__test quote id: ${randomUUID()}`     
    }
}

class QuotePage extends EditListPage<NewQuote> {
	protected override async fillForm(value: NewQuote): Promise<void> {
		await this.page.getByLabel('Sitat *').fill(value.quote);
        await this.page.getByLabel('Sitatytrer *').fill(value.utterer);
	}

	protected override async openMenu(value: NewQuote) {
        await this.page.locator(`li:has-text("${value.quote}")`).getByRole('button').click();
	}
}