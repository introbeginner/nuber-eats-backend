import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/output.dto";
import { Order } from "../entities/order.entity";


@InputType()
export class GetOrderInput extends PickType(Order, ['id']){}

@ObjectType()
export class GetOrderOutput extends CoreOutput{
    @Field(tyep => Order, {nullable: true})
    order?:Order;
}

