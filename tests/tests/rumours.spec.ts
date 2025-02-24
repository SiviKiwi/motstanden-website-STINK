import { expect, Page, test } from '@playwright/test';
import { UserGroup } from 'common/enums';
import { NewRumour } from 'common/interfaces';
import { randomUUID } from "crypto";
import { EditListPage } from '../pages/EditListPage.js';
import { disposeStorageLogIn, storageLogIn } from '../utils/auth.js';

test.describe.serial("Users can update and delete rumours created by themselves @smoke",  async () => {
	await testCrud({
		creator: UserGroup.Contributor,
		moderator: UserGroup.Contributor,
		testId: 1
	})
})

test.describe.serial("Admin can update and delete rumours created by others",  async () => {
	await testCrud({
		creator: UserGroup.Contributor,
		moderator: UserGroup.Administrator,
		testId: 2
	})
})

test.describe.serial("Super admin can update and delete rumours created by others", async () => {
	await testCrud({
		creator: UserGroup.Contributor,
		moderator: UserGroup.SuperAdministrator,
		testId: 3
	})
})

// crud -> create read update delete
async function testCrud(opts: {creator: UserGroup, moderator: UserGroup, testId: number}) {
	
	const rumour1: NewRumour = createRandomRumour()
	const rumour2: NewRumour = createRandomRumour()

	let page: Page

	test(`New (${opts.testId})`, async ({browser}) => {
		page = await storageLogIn(browser, opts.creator)
    	
		await testCreateNew(page, rumour1)

		if(opts.creator !== opts.moderator) {
			await disposeStorageLogIn(page)
		}
	})

	test(`Update (${opts.testId})`, async ({browser}) => {
		page = opts.creator === opts.moderator 
			 ? page 
			 : await storageLogIn(browser, opts.moderator) 

    	await testUpdate(page, rumour1, rumour2)
	})

	test(`Delete (${opts.testId})`, async () => {
    	await testDelete(page, rumour2)
		await disposeStorageLogIn(page)
	})
}

async function testCreateNew(page: Page, rumour: NewRumour) {
	await page.goto('/rykter/ny');
	
	const rumourPage = new RumourPage(page)
	await rumourPage.newItem(rumour)
	
	await expect(page).toHaveURL('/rykter');
	await expect(page.getByText(rumour.rumour)).toBeVisible();
}

async function testUpdate(page: Page, oldRumour: NewRumour, newRumour: NewRumour) {
	if(!page.url().endsWith("/rykter")) {
		await page.goto('/rykter');
	}
	
	const rumourPage = new RumourPage(page)
	await rumourPage.editItem(oldRumour, newRumour)

	await expect(page.getByText(newRumour.rumour)).toBeVisible();
	await expect(page.getByText(oldRumour.rumour)).not.toBeVisible();
}

async function testDelete(page: Page, rumour: NewRumour) {
	if(!page.url().endsWith("/rykter")) {
		await page.goto('/rykter');
	}
	
	const rumourPage = new RumourPage(page)
	await rumourPage.deleteItem(rumour)

	await expect(page.getByText(rumour.rumour)).not.toBeVisible();
}

function createRandomRumour(): NewRumour {
	return {
		rumour: `__test rumour id: ${randomUUID()}`
	}
}

class RumourPage extends EditListPage<NewRumour> {
	
	protected override async fillForm(value: NewRumour): Promise<void> {
		await this.page.getByLabel('Har du hørt at...? *').fill(value.rumour);
	}

	protected override async openMenu(value: NewRumour) {
		await this.page.locator(`li:has-text("${value.rumour}")`).getByRole('button').click();
	}
}