import { Locator, Page } from "@playwright/test"
import { HelperBase } from "./helperBase"

export class FormLayoutPage extends HelperBase {

    constructor(page: Page) {
        super(page)
    }

    async submitUsingTheGridFormWithCredentialsAndSelectOption(email: string, password: string, optionText: string) {
        const usingTheGridForm = this.page.locator('nb-card', { hasText: 'Using the Grid' })
        await usingTheGridForm.getByRole('textbox', { name: 'Email' }).fill(email)
        await usingTheGridForm.getByRole('textbox', { name: 'Password' }).fill(password)
        await usingTheGridForm.getByRole('radio', { name: optionText }).check({ force: true })
        await usingTheGridForm.getByRole('button').click()
    }

    /**
     * This method submits the inline form with the provided name, email, and remember me option.
     * @param name 
     * @param email 
     * @param rememberMe 
     */
    async submitInlineFormWithNameEmailAndCheckbox(name: string, email: string, rememberMe: boolean) {
        const InlineForm = this.page.locator('nb-card', { hasText: 'Inline Form' })
        await InlineForm.getByRole('textbox', { name: 'Jane Doe' }).fill(name)
        await InlineForm.getByRole('textbox', { name: 'Email' }).fill(email)
        if (rememberMe) await InlineForm.getByRole('checkbox', { name: 'Remember me' }).check({ force: true })
        await InlineForm.getByRole('button').click()
    }
}