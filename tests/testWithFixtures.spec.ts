import { test } from '../test-options'
import { PageManager } from '../page-objects/pageManager'
import {faker} from '@faker-js/faker'

// test.beforeEach(async ({ page }) => {
//     await page.goto('/')
// })

test('Parametrized Method', async ({ pageManager, formLayoutsPage }) => {
    const fullRandomName = faker.person.fullName()
    const randomEmail = `${fullRandomName.replace(" ", "_")}${faker.number.int(1000)}@test.com`

    //await pm.navigateTo().formLayoutsPage()
    await pageManager.onFormLayoutPage().submitUsingTheGridFormWithCredentialsAndSelectOption(process.env.EMAIL, process.env.PASSWORD, 'Option 1')
    await pageManager.onFormLayoutPage().submitInlineFormWithNameEmailAndCheckbox(fullRandomName, randomEmail, false)
})