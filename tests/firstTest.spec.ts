import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()
})

test('Locator Syntax Rules', async({page}) => {
    //by TagName
    await page.locator('input').first().click()

    //by Id
    page.locator('#inputEmail')

    //by ClassValue
    page.locator('.shape-rectangle')

    //by Attribute
    page.locator('[placeholder="Email]')

    //by Class value (full)
    page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]')

    //Combine different selectors
    page.locator('input[placeholder="Email].shape-rectangle')

    //by Xpath (NOT RECOMMENDED)
    page.locator('//*[@id="inputEmail"]')

    //by partial text
    page.locator(':text("Using")')

    // by exact text
    page.locator(':text-is("Using the grid")')
})

test('User facing locators', async({page}) =>{
    await page.getByRole('textbox', {name: "Email"}).first().click()
    await page.getByRole('button', {name: "Sign in"}).first().click()

    await page.getByLabel('Email').first().click()

    await page.getByPlaceholder('Jane Doe').first().click()

    await page.getByText('Using the grid').click()

    await page.getByTitle('IoT Dashboard').click()

    //await page.getByTestId('').click()
})

test('locating child elements', async ({page}) =>{
    await page.locator('nb-card nb-radio :text-is("Option 1")').click()

    await page.locator('nb-card').getByRole('button', {name: "Sign in"}).first().click()

    await page.locator('nb-card').nth(3).getByRole('button').click()
})

test('locating parent elements', async ({page}) =>{
    await page.locator('nb-card', {hasText: "Using the grid"}).getByRole('textbox', {name: "Email"}).first().click()
    await page.locator('nb-card', {has: page.locator('#inputEmail')}).getByRole('textbox', {name: "Email"}).click()

    await page.locator('nb-card').filter({hasText: "Basic form"}).getByRole('textbox', {name: "Email"}).click()
    await page.locator('nb-card').filter({has: page.locator('.status-danger')}).getByRole('textbox', {name: "Password"}).click()

    await page.locator('nb-card').filter({has: page.locator('nb-checkbox')}).filter({hasText: "Sign in"}).getByRole('textbox', {name: "Email"}).click()
})
    
test('reusing locators', async ({page}) =>{
    const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
    const emailField = basicForm.getByRole('textbox', {name: "Email"})

    await emailField.fill('test@test.com')
    await basicForm.getByRole('textbox', {name: "Password"}).fill('Welcome123')
    await basicForm.locator('nb-checkbox').click()
    await basicForm.getByRole('button').click()

    await expect(emailField).toHaveValue('test@test.com')
})

test('extracting value', async ({page}) =>{
    // single test value
    const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
    const buttonText = await basicForm.locator('button').textContent()
    expect (buttonText).toEqual('Submit')

    //all test values
    const allRadioButtonsValue = await page.locator('nb-radio').allTextContents()
    console.log(allRadioButtonsValue)
    expect (allRadioButtonsValue).toContain('Option 1')

    //input values
    const emailField = basicForm.getByRole('textbox', {name: "Email"})
    await emailField.fill('test@test.com')
    const emailValue = await emailField.inputValue()
    expect(emailValue).toEqual('test@test.com')

})

test('assertions', async ({page}) =>{
    //general assertions
    const value = 5
    expect(value).toEqual(5)
    const basicFormButton = page.locator('nb-card').filter({hasText: "Basic form"}).locator('button')
    const basicFormText = await basicFormButton.textContent()
    expect(basicFormText).toEqual('Submit')

    //locator assertions
    await expect(basicFormButton).toHaveText('Submit')

    //soft assertions
    await expect.soft(basicFormButton).toHaveText('Submit')
    await basicFormButton.click() // o click vai continuar mesmo que a asserção falhe pois é uma asserção soft

})

