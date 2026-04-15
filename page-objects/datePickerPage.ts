import { expect, Page } from "@playwright/test"
import { HelperBase } from "./helperBase"

export class DatePickerPage extends HelperBase {

    constructor(page: Page) {
        super(page)
    }

    async selectCommonDatePickerDateFromToday(numberOfDaysFromToday: number) {
        const calendarInputField = this.page.getByPlaceholder('Form Picker')
        await calendarInputField.click()
        const dateToAssert = await this.selectDateInTheCalendar(numberOfDaysFromToday)
        await expect(calendarInputField).toHaveValue(dateToAssert)
    }

    async selectDatePickerWithRangeFromToday(startDateFromToday: number, endDateFromToday: number) {
        const calendarInputField = this.page.getByPlaceholder('Range Picker')
        await calendarInputField.click()
        const startDateToAssert = await this.selectDateInTheCalendar(startDateFromToday)
        const endDateToAssert = await this.selectDateInTheCalendar(endDateFromToday)
        const dateToAssert = `${startDateToAssert} - ${endDateToAssert}`
        await expect(calendarInputField).toHaveValue(dateToAssert)
    }

    private async selectDateInTheCalendar(numberOfDaysFromToday: number) {
        let date = new Date()
        date.setDate(date.getDate() + numberOfDaysFromToday)
        const expectedDate = date.getDate().toString()
        const expectedMonthShort = date.toLocaleString('En-US', { month: 'short' })
        const expectedMonthLong = date.toLocaleString('En-US', { month: 'long' })
        const expectedYear = date.getFullYear().toString()
        const expectedFullDate = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`

        let calendarMonthYear = await this.page.locator('nb-calendar-view-mode').textContent()
        const expectedMonthYear = `${expectedMonthLong} ${expectedYear}`
        while (!calendarMonthYear?.includes(expectedMonthYear)) {
            await this.page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
            calendarMonthYear = await this.page.locator('nb-calendar-view-mode').textContent()
        }

        await this.page.locator('//*[contains(@class, "day-cell ng-star-inserted")]').getByText(expectedDate, { exact: true }).click()
        return expectedFullDate
    }
}