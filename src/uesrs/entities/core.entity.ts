import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


export class CoreEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    creadtAt: Date;

    @UpdateDateColumn()
    updateAt: Date;
}