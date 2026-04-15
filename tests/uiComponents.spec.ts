import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
    await page.goto('/')
})

test.describe('Form Layout Pages', () => {
    test.beforeEach(async ({ page }) => {
        await page.getByText('Forms').click()
        await page.getByText('Form Layouts').click()
    })

    test('input fields', async ({ page }) => {
        const usingTheGridEmailInput = page.locator('nb-card', { hasText: 'Using the grid' }).getByRole('textbox', { name: 'Email' })

        await usingTheGridEmailInput.fill('test@example.com')
        await usingTheGridEmailInput.clear()
        await usingTheGridEmailInput.pressSequentially('test2@example.com')

        expect(usingTheGridEmailInput).toHaveValue('test2@example.com')
    })

    test('radio buttons', async ({ page }) => {
        const usingTheGridEmailInput = page.locator('nb-card', { hasText: 'Using the grid' })

        await usingTheGridEmailInput.getByLabel('Option 1').check({ force: true })
        await usingTheGridEmailInput.getByRole('radio', { name: 'Option 2' }).check({ force: true })

        const radioStatusChecked = await usingTheGridEmailInput.getByLabel('Option 2').isChecked()
        expect(radioStatusChecked).toBeTruthy()
        await expect(usingTheGridEmailInput.getByLabel('Option 2')).toBeChecked()
    })
})

test('checkboxes', async ({ page }) => {
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Toastr').click()

    await page.getByRole('checkbox', { name: 'Hide on click' }).click({ force: true })
    await page.getByRole('checkbox', { name: 'Hide on click' }).uncheck({ force: true })
    await page.getByRole('checkbox', { name: 'Prevent arising of duplicate toast' }).check({ force: true })

    const allCheckBoxes = page.getByRole('checkbox')
    for (const box of await allCheckBoxes.all()) {
        await box.check({ force: true })
        expect(box).toBeChecked()
    }

    for (const box of await allCheckBoxes.all()) {
        await box.uncheck({ force: true })
        expect(box).not.toBeChecked()
    }
})

test('lists and dropdowns', async ({ page }) => {
    const dropDown = page.locator('ngx-header nb-select')
    await dropDown.click()

    page.getByRole('list')
    page.getByRole('listitem')

    const optionList = page.locator('nb-option-list nb-option')
    await expect(optionList).toHaveText(['Light', 'Dark', 'Cosmic', 'Corporate'])
    await optionList.filter({ hasText: 'Cosmic' }).click()

    const header = page.locator('nb-layout-header')
    await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)')

    const colors = {
        Light: 'rgb(255, 255, 255)',
        Dark: 'rgb(34, 43, 69)',
        Cosmic: 'rgb(50, 50, 89)',
        Corporate: 'rgb(255, 255, 255)'
    }

    await dropDown.click()
    for (const color in colors) {
        await optionList.filter({ hasText: color }).click()
        await expect(header).toHaveCSS('background-color', colors[color])
        if (color !== 'Corporate') {
            await dropDown.click()
        }
    }
})

test('tooltips', async ({ page }) => {
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Tooltip').click()

    const tooltipCard = page.locator('nb-card', { hasText: "Tooltip Placements" })
    await tooltipCard.getByRole('button', { name: 'Top' }).hover()

    //page.getByRole('tooltip')
    const tooltip = await page.locator('nb-tooltip').textContent()
    expect(tooltip).toEqual('This is a tooltip')
})

test('dialog boxes', async ({ page }) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    page.on('dialog', dialog => {
        expect(dialog.message()).toEqual('Are you sure you want to delete?')
        dialog.accept()
    })
    await page.getByRole('table').locator('tr', { hasText: 'mdo@gmail.com' }).locator('.nb-trash').click()
    await expect(page.locator('table tr').first()).not.toHaveText('mdo@gmail.com')
    
})

test('web tables', async ({ page }) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    //get the role by any text in the row
    const targetRow = page.getByRole('row', { name: 'twitter@outlook.com' })
    await targetRow.locator('.nb-edit').click()
    await page.locator('input-editor').getByPlaceholder('Age').clear()
    await page.locator('input-editor').getByPlaceholder('Age').fill('35')
    await targetRow.locator('.nb-checkmark').click()

    //get the role based on value in a specific column
    await page.locator('.ng2-smart-pagination-nav').getByText('2').click()
    const targetRowById = page.getByRole('row', { name: '11' }).filter({ has: page.locator('td').nth(1).getByText('11') })
    await targetRowById.locator('.nb-edit').click()
    await page.locator('input-editor').getByPlaceholder('E-mail').clear()
    await page.locator('input-editor').getByPlaceholder('E-mail').fill('test@test.com')
    await page.locator('.nb-checkmark').click()
    await expect(targetRowById.locator('td').nth(5)).toHaveText('test@test.com')

    //test filter of the table
    const ages = ['20', '30', '40', '200']
    
    for (let age of ages) {
        await page.locator('input-filter').getByPlaceholder('Age').clear()
        await page.locator('input-filter').getByPlaceholder('Age').fill(age)
        await page.waitForTimeout(500)
        const ageRows = page.locator('tbody tr')

        for (let row of await ageRows.all()) {
            const cellValue = await row.locator('td').last().textContent()
            if (age === '200') {
                await expect(row).toHaveText('No data found')
            } else {
                expect(cellValue).toEqual(age)
            }
        }
    }
})

test('datepicker', async ({ page }) => {
    await page.getByText('Forms').click()
    await page.getByText('Datepicker').click()

    const calendarInputField = page.getByPlaceholder('Form Picker')
    await calendarInputField.click()

    let date = new Date()
    date.setDate(date.getDate() + 500)
    const expectedDate = date.getDate().toString()
    const expectedMonthShort = date.toLocaleString('En-US', { month: 'short' })
    const expectedMonthLong = date.toLocaleString('En-US', { month: 'long' })
    const expectedYear = date.getFullYear().toString()
    const expectedFullDate = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`

    let calendarMonthYear = await page.locator('nb-calendar-view-mode').textContent()
    const expectedMonthYear = `${expectedMonthLong} ${expectedYear}`
    while (!calendarMonthYear.includes(expectedMonthYear)) {
        await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
        calendarMonthYear = await page.locator('nb-calendar-view-mode').textContent()
    }

    await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate, { exact: true }).click()
    await expect(calendarInputField).toHaveValue(expectedFullDate)
})

test('sliders', async ({ page }) => {
    //update attribute
    const tempGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')
    await tempGauge.evaluate( node  => {
        node.setAttribute('cy', '232.630')
        node.setAttribute('cx', '232.630')
    })
    await tempGauge.click()

    //Mouse movement
    const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger')
    await tempBox.scrollIntoViewIfNeeded()
    const boxBoundingBox = await tempBox.boundingBox()
    const x = boxBoundingBox.x + boxBoundingBox.width / 2
    const y = boxBoundingBox.y + boxBoundingBox.height / 2
    await page.mouse.move(x, y)
    await page.mouse.down()
    await page.mouse.move(x + 100, y)
    await page.mouse.move(x + 100, y+100)
    await page.mouse.up()

    await expect(tempBox).toContainText('30')
})
