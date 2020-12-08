import { ArgsType, Field, InputType, PartialType } from "@nestjs/graphql";
import { CreateRestaurantDto } from "./create-restaurant.dto";


@InputType()
class UpdateRestaurantDtoInputType extends PartialType(CreateRestaurantDto) {}

@InputType()
export class UpdateRestaurantDto {
    @Field(type => Number)
    id: number;

    @Field(type => UpdateRestaurantDtoInputType)
    data: UpdateRestaurantDtoInputType;

}