import { Test } from "@nestjs/testing";
import { CONFIG_OPTIONS } from "src/common/common.constatns";
import { MailService } from "./mail.service"
import got from "got";
import * as FormData from "form-data";

jest.mock('got')

jest.mock('form-data')

const TEST_DOMAIN = 'test-domain';

describe('MailService', () => {
    let service: MailService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [MailService, {
                provide: CONFIG_OPTIONS,
                useValue: {
                    apikey: 'test-apiKey',
                    domain: TEST_DOMAIN,
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

            jest.spyOn(service, 'sendEmail').mockImplementation(async () => true)

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

    describe('sendEmail', ()=> {
        it('', async() => {
            const ok = await service.sendEmail('','',[]);
            const formSpy = jest.spyOn(FormData.prototype,'append');
            expect(formSpy).toHaveBeenCalled();
            expect(got.post).toHaveBeenCalledTimes(1);
            expect(got.post).toHaveBeenCalledWith(`https://api.mailgun.net/v3/${TEST_DOMAIN}/messages`, expect.any(Object));
            expect(ok).toEqual(true);
        });
        it('fails on error', async() => {
            jest.spyOn(got,"post").mockImplementation(()=>{
                throw new Error();
            })
            const ok = await service.sendEmail('','',[]);
            expect(ok).toEqual(false);
        })
    } )


})