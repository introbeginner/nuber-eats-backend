import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import { from } from "form-data";
import { User } from "src/uesrs/entities/user.entity";
import {AllowedRoles} from './role.decorator';



@Injectable()
export class AuthGuard implements CanActivate{
    constructor(private readonly reflector: Reflector){}
    canActivate(context:ExecutionContext){
        const roles = this.reflector.get<AllowedRoles>(
            'roles',
            context.getHandler(),
        )
        if(!roles){
            return true;
        }
        const gqlContext = GqlExecutionContext.create(context).getContext();
        const user:User = gqlContext['user'];
        console.log(user.role);
        if(!user){
            return false;
        }
        
        if(roles.includes('Any')){  // is this include  in below return ?  no. user.role is inputed at createAccount, and not ANY
            return true;            
        }
        
       console.log(roles.includes(user.role));
        return roles.includes(user.role);
        
    }
}