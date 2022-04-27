import { UserInterface } from "../../user/interface/user.interface";

export interface FundraiserInterface {
    id?: number;
    author?: UserInterface | number;
    nik?: string;
    mobile_number?: string;
    bank_name?: string;
    bank_account_number?: string;
    bank_account_name?: string;
    createdAt?: Date;
    updatedAt?: Date;
}