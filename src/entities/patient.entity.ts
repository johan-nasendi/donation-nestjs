
import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column,CreateDateColumn,UpdateDateColumn, OneToMany, BeforeUpdate, Unique } from "typeorm";
import { DonationtEntity } from "./donation.entity";

@Entity('patient')
@Unique(['nik','mobile_number'])
export class PatientEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({length:16})
    nik: string;

    @Column()
    name: string;

    // @Column()
    // slug: string;

    @Column({length:12})
    mobile_number: string;

    @Column()
    category: string;

    @Column()
    desease: string;

    @Column({ type:'mediumtext'})
    story: string;

   
    @CreateDateColumn() // entity special column
    createdAt: Date;
  
    @UpdateDateColumn() // entity update special column
    updatedAt: Date;

    @OneToMany(() => DonationtEntity, donation => donation.patient)
    donationPatient: DonationtEntity[];

    @BeforeUpdate()
    updateTimestamp() {
        this.updatedAt = new Date;
    }
}