import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { UesrsModule } from 'src/uesrs/uesrs.module';
import { AuthGuard } from './auth.guard';

@Module({
    imports: [UesrsModule],
    providers: [{
        provide: APP_GUARD,
        useClass: AuthGuard,
    }]
})
export class AuthModule {}
