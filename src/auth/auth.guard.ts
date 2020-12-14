import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { AdvancedConsoleLogger } from "typeorm";



@Injectable()
export class AuthGuard implements CanActivate{
    canActivate(context:ExecutionContext){
        const gqlContext = GqlExecutionContext.create(context).getContext();
        const user = gqlContext['user'];
        if(!user){
            return false;
        }
        return true;
    }
}