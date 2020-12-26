import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/uesrs/entities/user.entity";
import { Repository } from "typeorm";
import { CreateRestaurantInput, CreateRestaurantOutput } from "./dtos/create-restaurant.dto";
import { DeleteRestaurantInput, DeleteRestaurantOutput } from "./dtos/delete-restaurant.dto";
import { EditRestaurantInput, EditRestaurantOutput } from "./dtos/edit-restaurant.dto";
import { Category } from "./entities/category.entity";

import { Restaurant } from "./entities/restaurant.entity";
import { CategoryRepository } from "./repositories/category.repository";

@Injectable()
export class RestaurantService {

    constructor(
        @InjectRepository(Restaurant)
        private readonly restaurants: Repository<Restaurant>,
        private readonly categories: CategoryRepository,
    ) { }



    async createRestaurant(
        owner: User,
        createRestaurantInput: CreateRestaurantInput
    ): Promise<CreateRestaurantOutput> {
        try {
            const newRestaurant = this.restaurants.create(createRestaurantInput);
            newRestaurant.owner = owner;
            const category = await this.categories.getOrCreate(
                createRestaurantInput.categoryName,
            )

            await this.restaurants.save(newRestaurant);
            return {
                ok: true,
            };
        } catch (e) {
            return {
                ok: false,
                error: 'Could not create restaurant',
            }
        }
    }

    async editRestaurant(owner: User, editRestaurantInput: EditRestaurantInput,
    ): Promise<EditRestaurantOutput> {
        try {
            const restaurant = await this.restaurants.findOneOrFail(
                editRestaurantInput.restaurantId);
            if (!restaurant) {
                return {
                    ok: false,
                    error: "Restaurant not found",
                }
            }
            if (owner.id !== restaurant.ownerId) {
                return {
                    ok: false,
                    error: "You can't edit a restaurant that you don't own",
                }

            }
            let category: Category = null;
            if (editRestaurantInput.categoryName) {
                category = await this.categories.getOrCreate(
                    editRestaurantInput.categoryName,
                );
            }

            await this.restaurants.save([
                {
                    id: editRestaurantInput.restaurantId,
                    ...editRestaurantInput,
                    ...(category && { category }),    //if is there category, update catagory.
                }
            ])

            return {
                ok: true,
            }
        } catch {
            return {
                ok: false,
                error: 'Could not edit Restaurant',
            }
        }

    }

    async deleteRestaurant(
        owner: User,
        {restaurnatId}: DeleteRestaurantInput,
    ): Promise<DeleteRestaurantOutput> {
        try {
            const restaurant = await this.restaurants.findOneOrFail(
                restaurnatId);
            if (!restaurant) {
                return {
                    ok: false,
                    error: "Restaurant not found",
                }
            }
            if (owner.id !== restaurant.ownerId) {
                return {
                    ok: false,
                    error: "You can't delete a restaurant that you don't own",
                }
    
            }
            console.log('delete', restaurant)
            //await this.restaurants.delete(restaurnatId);
            return {
                ok:true,
            }

        }catch{
            return {
                ok:false,
                error:"Could not delete restaurant."
            }
        }
    }


    /*
    getAll() : Promise<Restaurant[]> {
        return this.restaurants.find();
    }
        
    async updateRestaurant({id, data}:UpdateRestaurantDto){
        return await this.restaurants.update(id, {...data});
    }
    */
}