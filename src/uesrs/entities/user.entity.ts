import { Field, InputType, ObjectType, registerEnumType } from "@nestjs/graphql";
import { BeforeInsert, Column, Entity } from "typeorm";
import { CoreEntity } from "./core.entity";
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from "@nestjs/common";

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

    @BeforeInsert() //when create or save ? save. create just create, not save. insert is save
    async hashPassword(): Promise<void> {
        try{
            this.password = await bcrypt.hash(this.password, 10);
        } catch(e){
            console.log(e);
            throw new InternalServerErrorException();
        }
        
    }
}