import { Field, InputType,  ObjectType } from "@nestjs/graphql";
import { IsString, Length } from "class-validator";
import { string } from "joi";
import { CoreEntity } from "src/common/entities/core.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Restaurant } from "./restaurant.entity";

@InputType("CategoryInputType",{isAbstract:true})
@ObjectType()
@Entity()
export class Category extends CoreEntity{
    @Field(is => String)
    @Column({unique:true})
    @IsString()
    @Length(5, 20)
    name:string;

    @Field(type => String, {nullable:true})  //graphQL
    @Column({nullable:true})               //typeORM
    @IsString()
    coverImage:string;

    @Field(type =>String)
    @Column({unique:true})
    @IsString()
    slug:string;

    @Field(type => [Restaurant], {nullable:true})
    @OneToMany(type => Restaurant, restaurant => restaurant.category)
    restaurants?: Restaurant[];
    
}