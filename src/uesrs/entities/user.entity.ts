import { Field, InputType, ObjectType, registerEnumType } from "@nestjs/graphql";
import { BeforeInsert, BeforeUpdate, Column, Entity } from "typeorm";
import { CoreEntity } from "../../common/entities/core.entity";
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from "@nestjs/common";
import { IsEmail, IsEnum, IsOptional } from "class-validator";

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
    @IsEmail()
    @IsOptional()
    email: string;

    @Column()
    @Field(type=> String)
    @IsOptional()
    password: string;

    @Column({type:"enum", enum: UserRole})  //db
    @Field(type=> UserRole)                 //graphQL
    @IsEnum(UserRole)
    @IsOptional()
    role:UserRole;

    @Column({default:false})
    @Field(type=>Boolean)
    verified:boolean;

    @BeforeInsert() //when create or save ? save. create just create, not save. insert is save
    @BeforeUpdate()
    async hashPassword(): Promise<void> {
        try{
            this.password = await bcrypt.hash(this.password, 10);
        } catch(e){
            console.log(e);
            throw new InternalServerErrorException();
        }
        
    }

    async checkPassword(aPassword: string): Promise<boolean> {
        try{
            const ok = await bcrypt.compare(aPassword, this.password);
            return ok;
        } catch(e){
            console.log(e);
            throw new InternalServerErrorException();
        }
        
    }

}