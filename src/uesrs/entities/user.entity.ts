import { Field, InputType, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Column, Entity } from "typeorm";
import { CoreEntity } from "./core.entity";

//type UserRole = 'client'|'owner'|'delivery';

enum UserRole {
    Client,
    Owner,
    Delivery
}

registerEnumType(UserRole, {name: 'UserRole'});


@InputType({isAbstract:true})
@ObjectType()
@Entity()
export class User extends CoreEntity{
    @Column()
    @Field(type=> String)
    email: string;

    @Column()
    @Field(type=> String)
    password: string;

    @Column({type:"enum", enum: UserRole})  //db
    @Field(type=> UserRole)                 //graphQL
    role:UserRole;
}