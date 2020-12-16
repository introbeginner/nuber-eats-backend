import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from '../common/common.constatns';
import got from "got";
import * as FormData from "form-data";
import { EmailVar, MailModuleOptions } from './mail.interface';

@Injectable()
export class MailService {
    constructor(@Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions) {
        //this.sendEmail('testing', 'test');
    }

    private async sendEmail(subject: string, template: string, emailvars: EmailVar[]) {
        const form = new FormData();
        form.append('from', `Nico from Nuber Eats <mailgun@${this.options.domain}>`);
        form.append('to', `intronovice@gmail.com`);
        form.append('subject', subject);
        form.append('template', template);
        emailvars.forEach(eVar => form.append(`v:${eVar.key}`, eVar.value));
        try {
            await got(`https://api.mailgun.net/v3/${this.options.domain}/messages`, {
                method: 'POST',
                headers: {
                    Authorization: `Basic ${Buffer.from(`api:${this.options.apiKey}`).toString('base64')}`
                },

                body: form,
            },
            );
        } catch (error) {
            console.log(error);
        }
    }

    sendVerificationEamil(email: string, code: string) {
        this.sendEmail("Verify Your Email", "verify-email", [{ key: 'code', value: code }, {key:'username', value:email},])
    }
}