import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { IsBoolean, IsOptional, IsString, Length } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@InputType({isAbstract:true})
@ObjectType()
@Entity()
export class Restaurant {

    @PrimaryGeneratedColumn()
    @Field(type => Number)
    id:Number;

    @Field(is => String)
    @Column()
    @IsString()
    @Length(5, 20)
    name:string;

    @Field(type => Boolean, {defaultValue:true}) //graphQl
    @Column({default:true}) //for db
    @IsBoolean()    //for dto
    @IsOptional()   //for dto
    isVegan: boolean;
    
    @Field(type => String)
    @Column()
    @IsString()
    address: string;

    @Field(type => String)
    @Column()
    @IsString()
    ownersName:string;


}