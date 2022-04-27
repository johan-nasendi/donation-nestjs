import { FundraiserInterface } from "../../donation/interface/fundraiser.interface";

export interface UserInterface {
    id?: number;
    name?: string;
    email?: string;
    password?: string;
    avatar?: string;
    Fundraiser?: FundraiserInterface[];
    
}

