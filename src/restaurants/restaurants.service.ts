import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/uesrs/entities/user.entity";
import { Like, Raw, Repository } from "typeorm";
import { AllCategoriesOutput } from "./dtos/all-categories.dto";
import { CategoryInput, CategoryOutput } from "./dtos/category.dto";
import { CreateDishInput, CreateDishOutput } from "./dtos/create-dish.dto";
import { CreateRestaurantInput, CreateRestaurantOutput } from "./dtos/create-restaurant.dto";
import { DeleteDishInput, DeleteDishOutput } from "./dtos/delete-dish.dto";
import { DeleteRestaurantInput, DeleteRestaurantOutput } from "./dtos/delete-restaurant.dto";
import { EditDishInput, EditDishOutput } from "./dtos/edit-dish.dto";
import { EditRestaurantInput, EditRestaurantOutput } from "./dtos/edit-restaurant.dto";
import { RestaurantInput, RestaurantOutput } from "./dtos/restaurant.dto";
import { RestaurantsInput, RestaurantsOutput } from "./dtos/restaurants.dto";
import { SearchRestaurantInput, SearchRestaurantOutput } from "./dtos/search-restaurant.dto";
import { Category } from "./entities/category.entity";
import { Dish } from "./entities/dish.entity";

import { Restaurant } from "./entities/restaurant.entity";
import { CategoryRepository } from "./repositories/category.repository";

@Injectable()
export class RestaurantService {

    constructor(
        @InjectRepository(Restaurant)
        private readonly restaurants: Repository<Restaurant>,
        @InjectRepository(Dish)
        private readonly dishes: Repository<Dish>,
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

            newRestaurant.category = category;
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
        { restaurnatId }: DeleteRestaurantInput,
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
                ok: true,
            }

        } catch {
            return {
                ok: false,
                error: "Could not delete restaurant."
            }
        }
    }


    async allCategories(): Promise<AllCategoriesOutput> {
        try {
            const categories = await this.categories.find();
            return {
                ok: true,
                categories,
            };
        } catch {
            return {
                ok: false,
                error: 'Could not load categories',
            }
        }
    }

    countRestaurant(category: Category) {
        return this.restaurants.count({ category });
    }

    async findCategoryBySlug({ slug, page }: CategoryInput): Promise<CategoryOutput> {
        try {
            const category = await this.categories.findOne({ slug });
            if (!category) {
                return {
                    ok: false,
                    error: 'Category not found',
                }
            }
            const restaurants = await this.restaurants.find({
                where: {
                    category,
                },
                take: 3,
                skip: (page - 1) * 3,
            })
            category.restaurants = restaurants;
            const totalResults = await this.countRestaurant(category)
            return {
                ok: true,
                category,
                restaurants,
                totalPages: Math.ceil(totalResults / 3)
            }
        } catch {
            return {
                ok: false,
                error: 'Could not load category',
            }
        }
    }

    async allRestaurants({ page }: RestaurantsInput): Promise<RestaurantsOutput> {
        try {
            const [restaurants, totalResults] = await this.restaurants.findAndCount({
                skip: (page - 1) * 3,
                take: 3,
            });
            return {
                ok: true,
                results: restaurants,
                totalPages: Math.ceil(totalResults / 3),
                totalResults,
            }
        } catch {
            return {
                ok: false,
                error: 'Could not load restaurants',
            }
        }
    }

    async findRestaurantById(
        { restaurantId }: RestaurantInput,
    ): Promise<RestaurantOutput> {
        try {
            const restaurant = await this.restaurants.findOne(restaurantId, { relations: ['menu'] });
            if (!restaurant) {
                return {
                    ok: false,
                    error: 'Restaurnat not found',
                }
            }
            return {
                ok: true,
                restaurant,
            }
        } catch {
            return {
                ok: false,
                error: 'Could not find restaurant'
            }
        }
    }

    async searchRestaurantByName({ query, page }: SearchRestaurantInput,
    ): Promise<SearchRestaurantOutput> {
        try {
            const [restaurants, totalResults] = await this.restaurants.findAndCount({
                where: {
                    name: Raw(name => `${name} ILIKE '%${query}%'`),
                },
                skip: (page - 1) * 3,
                take: 3
            });
            return {
                ok: true,
                restaurants,
                totalResults,
                totalPages: Math.ceil(totalResults / 3),
            }
        } catch {
            return {
                ok: false,
                error: "Could not search for restaurants"
            }
        }
    }


    async createDish(
        owner: User,
        createDishInput: CreateDishInput,
    ): Promise<CreateDishOutput> {
        try {
            const restaurant = await this.restaurants.findOne(createDishInput.restaurantId);
            if (!restaurant) {   //defensive programming
                return {
                    ok: false,
                    error: 'Restaurant not found'
                }
            }
            if (owner.id !== restaurant.ownerId) {
                return {
                    ok: false,
                    error: "you can't do that.",
                }
            }
            await this.dishes.save(this.dishes.create({...createDishInput,restaurant}))
            return {
                ok: true,
            }
        }catch{
            return {
                ok:false,
                error:'Could not create dish'
            }
        }
    }

    async editDish(owner:User, editDishInput: EditDishInput):Promise<EditDishOutput>{
        try{
            const dish = await this.dishes.findOne(editDishInput, {relations:['restaurant']})
        if(!dish){
            return {
                ok:false,
                error: 'Dish not found',
            };
        }
        if(dish.restaurant.ownerId !== owner.id){
            return{
                ok:false,
                error:"You cant't do that.",
            };
        }
        await this.dishes.save([{
            id:editDishInput.dishId,
            ...editDishInput
        }]);
        return {
            ok:true,
        }
        }catch {
            return {
                ok :false,
                error : 'Could not edit dish'
            }
        }
    }

    async deleteDish(owner:User, {dishId}: DeleteDishInput):Promise<DeleteDishOutput>{
        try{
            const dish = await this.dishes.findOne(dishId, {relations:['restaurant']})
        if(!dish){
            return {
                ok:false,
                error: 'Dish not found',
            };
        }
        if(dish.restaurant.ownerId !== owner.id){
            return{
                ok:false,
                error:"You cant't do that.",
            };
        }
        await this.dishes.delete(dishId);
        return {
            ok:true,
        }
        }catch {
            return {
                ok :false,
                error : 'Could not delete dish'
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