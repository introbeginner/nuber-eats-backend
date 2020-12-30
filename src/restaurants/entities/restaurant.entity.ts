import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { IsBoolean, IsOptional, IsString, Length } from "class-validator";
import { CoreEntity } from "src/common/entities/core.entity";
import { Order } from "src/orders/entities/order.entity";
import { User } from "src/uesrs/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { Category } from "./category.entity";
import { Dish } from "./dish.entity";

@InputType("RestaurantInputType", { isAbstract: true })
@ObjectType()
@Entity()
export class Restaurant extends CoreEntity {
    /*
    @PrimaryGeneratedColumn()
    @Field(type => Number)
    id:Number;

    @Field(type => Boolean, {defaultValue:true}) //graphQl
    @Column({default:true}) //for db
    @IsBoolean()    //for dto
    @IsOptional()   //for dto
    isVegan: boolean;

    */
    @Field(is => String)
    @Column()
    @IsString()
    @Length(5, 20)
    name: string;

    @Field(type => String)  //graphQL
    @Column()               //typeORM
    @IsString()
    coverImage: string;

    @Field(type => String)
    @Column()
    @IsString()
    address: string;

    @Field(type => Category, { nullable: true })
    @ManyToOne(type => Category, category => category.restaurants, { nullable: true, onDelete: 'SET NULL' })
    category: Category;

    @Field(type => User, { nullable: true })
    @ManyToOne(
        type => User,
        user => user.restaurants,
        { onDelete: 'CASCADE' },
    )
    owner: User;

    @Field(type => [Order])
    @OneToMany(type => Order, order => order.restaurant)
    orders: Order[];

    @RelationId((restaurant:Restaurant) => restaurant.owner)
    ownerId:number;

    @Field(type =>[Dish])
    @OneToMany(
        type => Dish,
        dish => dish.restaurant,
    )
    menu:Dish[];
}