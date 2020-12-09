import { Column, Entity } from "typeorm";
import { CoreEntity } from "./core.entity";

type UserRole = 'client'|'owner'|'delivery';

@Entity()
export class User extends CoreEntity{
    @Column()
    email: string;

    @Column()
    passward: string;

    @Column()
    role:UserRole;
}