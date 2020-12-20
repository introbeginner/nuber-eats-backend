import { Test } from "@nestjs/testing";
import { CONFIG_OPTIONS } from "src/common/common.constatns";
import { MailService } from "./mail.service"
import got from "got";
import * as FormData from "form-data";

jest.mock('got', () => {

})

jest.mock('form-data', () => {
    return {
        append: jest.fn(),
    }
})

describe('MailService', () => {
    let service: MailService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [MailService, {
                provide: CONFIG_OPTIONS,
                useValue: {
                    apikey: 'test-apiKey',
                    domain: 'test-domail',
                    fromEamil: 'test-fromEmail',
                }
            }]
        }).compile();
        service = module.get<MailService>(MailService);
    });
    it('should be define', () => {
        expect(service).toBeDefined();
    });

    describe('sendVerificationEmail', () => {
        it('should call sendEmail', () => {
            const sendVerificationiEmailArgs = {
                email: 'email',
                code: 'code',
            };

            jest.spyOn(service, 'sendEmail').mockImplementation(async () => {
                
            })

            service.sendVerificationEmail(
                sendVerificationiEmailArgs.email,
                sendVerificationiEmailArgs.code,
            );
            expect(service.sendEmail).toHaveBeenCalledTimes(1);
            expect(service.sendEmail).toHaveBeenCalledWith("Verify Your Email", "verify-email",
                [{ key: 'code', value: sendVerificationiEmailArgs.code },
                { key: 'username', value: sendVerificationiEmailArgs.email },])
        })
    })
    it.todo('sendEmail')


})