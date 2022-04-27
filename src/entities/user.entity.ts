import { 
    Column, Entity,Unique, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn, OneToMany, BeforeInsert,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { FundraiserEntity } from './fundraiser.entity';


 
 @Entity({name: 'users'})
 @Unique(['email'])
 export class User {
     @PrimaryGeneratedColumn()
     id: number;
 
     @Column({ length: 20})
     name: string;
 
     @Column()
     email: string;
 
     @Column({ default: false })
     verified: boolean;
   
     @Column({ nullable: true })
     @Exclude()
     currentHashedRefreshToken?: string;
     
     @Column()
     password: string;

     @Column({type: 'mediumtext', default:'default.jpg'})
     avatar: string;
 
     @CreateDateColumn()
     Created_at: Date;

     @UpdateDateColumn()
     updated_at: Date;

     @OneToMany(type => FundraiserEntity , fundraiser => fundraiser.author)
     Fundraiser: FundraiserEntity[];

     @BeforeInsert()
        emailToLowerCase() {
        this.email = this.email.toLowerCase();
    }
 }