
import { FundraiserInterface } from "./fundraiser.interface";
import { PatientInterface } from "./patient.interface";

export interface DonationInterface {
    id?: number;
    title?: string;
    start_date?: Date;
    end_date?: Date;
    status?: string;
    purpose?: string;
    amount_estimation?: string;
    fundraiser?: FundraiserInterface | number ;
    patient?:PatientInterface | number;
    image?: string;
    createdAt?: Date;
    updatedAt?: Date;
}