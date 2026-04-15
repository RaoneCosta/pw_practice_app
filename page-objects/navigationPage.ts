import { Locator, Page } from "@playwright/test"
import { HelperBase } from "./helperBase"

export class NavigationPage extends HelperBase {

    readonly fromLayoutsMenuItem: Locator
    readonly datepickerMenuItem: Locator
    readonly toasterMenuItem: Locator
    readonly smartTableMenuItem: Locator
    readonly tooltipMenuItem: Locator

    constructor(page: Page) {
        super(page)
        this.fromLayoutsMenuItem = page.getByText('Form Layouts')
        this.datepickerMenuItem = page.getByText('Datepicker')
        this.toasterMenuItem = page.getByText('Toastr')
        this.smartTableMenuItem = page.getByText('Smart Table')
        this.tooltipMenuItem = page.getByText('Tooltip')
        
    }

    async formLayoutsPage() {
        await this.selectGroupMenuItem('Forms')
        await this.waitForNumberOfSeconds(2)
        await this.fromLayoutsMenuItem.click()
    }

    async datepickerPage() {
        await this.selectGroupMenuItem('Forms')
        await this.datepickerMenuItem.click()
    }

    async toasterPage() {
        await this.selectGroupMenuItem('Modal & Overlays')
        await this.toasterMenuItem.click()
    }

    async smartTablePage() {
        await this.selectGroupMenuItem('Tables & Data')
        await this.smartTableMenuItem.click()
    }

    async tooltipPage() {
        await this.selectGroupMenuItem('Modal & Overlays')
        await this.tooltipMenuItem.click()
    }

    private async selectGroupMenuItem(group: string) {
        const groupMenuItem = this.page.getByTitle(group)
        const expandedState = await groupMenuItem.getAttribute('aria-expanded')
        if (expandedState == 'false') {
            await groupMenuItem.click()
        }
        
    }
}