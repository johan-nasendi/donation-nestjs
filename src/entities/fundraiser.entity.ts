
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne,CreateDateColumn,UpdateDateColumn, OneToMany, BeforeUpdate, Unique, JoinColumn } from "typeorm";
import { DonationtEntity } from "./donation.entity";
import { User } from "./user.entity";



@Entity('fundraiser')
@Unique(['nik','mobile_number','bank_account_number'])
export class FundraiserEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => User, user => user.Fundraiser, {nullable:false})
    @JoinColumn()
    author: User | number ;
    
    @Column({length:16})
    nik: string;

    @Column({length:12})
    mobile_number: string;

    @Column()
    bank_name: string;

    @Column({length:20})
    bank_account_number : string

    @Column()
    bank_account_name : string

    // @Column()
    // slug: string;

    @CreateDateColumn() // entity special column
    createdAt: Date;
  
    @UpdateDateColumn() // entity update special column
    updatedAt: Date;

    @OneToMany(() => DonationtEntity, donation => donation.fundraiser)
    donationFaundraiser: DonationtEntity[];

    @BeforeUpdate()
    updateTimestamp() {
        this.updatedAt = new Date;
    }
}