

import { StatusEnum } from "src/modules/main/enums/enums";
import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column,CreateDateColumn,UpdateDateColumn, ManyToOne, JoinColumn, BeforeUpdate } from "typeorm";
import { FundraiserEntity } from "./fundraiser.entity";
import { PatientEntity } from "./patient.entity";


@Entity('donation')
export class DonationtEntity  {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 100})
    title: string;

    // @Column()
    // slug: string;
    
    @Column({type:'date'})
    start_date: Date;

    @Column({type:'date'})
    end_date: Date;

    @Column({type: 'mediumtext', default:'default.jpg'})
    image: string;

    @Column({length:100})
    amount_estimation: string;

    @Column({ type: 'mediumtext'})
    purpose: string;

    @Column({type: 'enum', enum: StatusEnum, default: StatusEnum.ACTIVE})
    status: StatusEnum | string;

    @ManyToOne(type => FundraiserEntity, fund => fund.donationFaundraiser, {nullable:false})
    fundraiser: FundraiserEntity | number;

    @ManyToOne(() => PatientEntity, patinet => patinet.donationPatient,{nullable:false}) 
    @JoinColumn()
    patient: PatientEntity | number;
   
    @CreateDateColumn() // entity special column
    createdAt: Date;
  
    @UpdateDateColumn() // entity update special column
    updatedAt: Date;

    @BeforeUpdate()
    updateTimestamp() {
        this.updatedAt = new Date;
    }

}