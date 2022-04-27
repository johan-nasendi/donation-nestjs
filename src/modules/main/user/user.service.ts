import { Injectable,InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UserRepository } from 'src/repository/user.repository';
import { ChangePasswordDto } from '../auth/dto/change-password.dto';
import { UpdateUserDto } from '../auth/dto/update-user.dto';
import {
    paginate,
    Pagination,
    IPaginationOptions,
  } from 'nestjs-typeorm-paginate';
import { from, Observable, switchMap } from 'rxjs';
import { UserInterface } from './interface/user.interface';

@Injectable()
export class UserService {

    constructor(@InjectRepository(UserRepository)
        private readonly userRepository : UserRepository,
    ){}


    async updateUsers(id: string, userUpdateDTO: UpdateUserDto): Promise<User> {
        let toUpdate = await this.userRepository.findOne(id)
        let updated = Object.assign(toUpdate, userUpdateDTO);
        return await this.userRepository.save(updated);
    }
      
    async remove(id: string) {
        await this.userRepository.delete(id);
        return {deleted: true}
    }

    async changesPassword(id: string, changesPasswordDTOP : ChangePasswordDto): Promise<boolean> {
      const password = await this.userRepository.hashPassword(changesPasswordDTOP.password);
      await this.userRepository.update(id, {password});
      return true;
    }   


    findAll(): Promise<User[]> {
        return this.userRepository.find();
    }
  

    findOne(id: number): Observable<UserInterface> {
        return from(this.userRepository.findOne({id}));
    }

    paginateAll(options: IPaginationOptions): Observable<Pagination<UserInterface>> {
        return from(paginate<User>(this.userRepository, options))
    }

    uploadImageProfile(id: number, user: UserInterface): Observable<any> {
        delete user.email;
        delete user.password;
        return from(this.userRepository.update(id, user)).pipe(
            switchMap(() => this.userRepository.findOneById(id))
        );
    }
  
}
