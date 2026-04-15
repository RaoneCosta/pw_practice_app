import { test, expect } from '@playwright/test'
import { PageManager } from '../page-objects/pageManager'
import {faker} from '@faker-js/faker'

test.beforeEach(async ({ page }) => {
    await page.goto('/')
})

test('navigate to form page @smoke @regression', async ({ page }) => {
    const pm = new PageManager(page)
    await pm.navigateTo().formLayoutsPage()
    await pm.navigateTo().datepickerPage()
    await pm.navigateTo().toasterPage()
    await pm.navigateTo().smartTablePage()
    await pm.navigateTo().tooltipPage()
})

test('Parametrized Method', async ({ page }) => {
    const pm = new PageManager(page)
    const fullRandomName = faker.person.fullName()
    const randomEmail = `${fullRandomName.replace(" ", "_")}${faker.number.int(1000)}@test.com`
    await pm.navigateTo().formLayoutsPage()
    await pm.onFormLayoutPage().submitUsingTheGridFormWithCredentialsAndSelectOption(process.env.EMAIL, process.env.PASSWORD, 'Option 1')
    await page.screenshot({ path: 'screenshots/screenshot.png' })
    const buffer = await page.screenshot()
    console.log(buffer.toString('base64'))
    await pm.onFormLayoutPage().submitInlineFormWithNameEmailAndCheckbox(fullRandomName, randomEmail, false)
    await page.locator('nb-card', { hasText: 'Inline Form' }).screenshot({ path: 'screenshots/inlineForm.png' })
    //await pm.navigateTo().datepickerPage()
    //await pm.onDatePickerPage().selectCommonDatePickerDateFromToday(5)
    //await pm.onDatePickerPage().selectDatePickerWithRangeFromToday(6, 15)
})