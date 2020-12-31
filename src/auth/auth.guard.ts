import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import { JwtService } from "src/jwt/jwt.service";
import { User } from "src/uesrs/entities/user.entity";
import { UsersService } from "src/uesrs/user.service";
import { AllowedRoles } from './role.decorator';



@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly reflector: Reflector,
        private readonly jwtService: JwtService,
        private readonly userService: UsersService) { }
    async canActivate(context: ExecutionContext) {
        const roles = this.reflector.get<AllowedRoles>(
            'roles',
            context.getHandler(),
        )
        if (!roles) {
            return true;
        }
        const gqlContext = GqlExecutionContext.create(context).getContext();
        const token = gqlContext.token;

        if (token) {
            const decoded = this.jwtService.verify(token.toString());
            if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
                const { user, ok } = await this.userService.findById(decoded["id"]);
                if (!user) {
                    return false;
                }
                gqlContext['user'] = user;
                if (roles.includes('Any')) {  // is this include  in below return ?  no. user.role is inputed at createAccount, and not ANY
                    return true;
                }
                return roles.includes(user.role);
            }
        } else {
            return false;
        }
    }
}