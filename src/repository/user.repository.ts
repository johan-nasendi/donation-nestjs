import { EntityRepository, Repository } from 'typeorm';
import { ConflictException,InternalServerErrorException} from '@nestjs/common';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/modules/main/auth/dto/create-user.dto';


@EntityRepository(User)
export class UserRepository extends Repository<User> {
  private readonly saltRounds = 10;

  async createUser({
    name, email,password,avatar
  } : CreateUserDto): Promise<User> {
    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      const user = await this.save(
        this.create({
          name,
          email,
          password: hashedPassword,
          avatar,
        }),
      );
      return user;
    } catch (error){
      if (error.code === '23505') {
        throw new ConflictException('This is email Error.');
      } else {
        console.log(error);
        throw new InternalServerErrorException();
      }
    }
  } 



  async findOneById(id: number): Promise<User | null> {
      return this.findOne({ id });
    }
  async hashPassword(password: string): Promise<string> {
      const salt = await bcrypt.genSalt(this.saltRounds);
      return await bcrypt.hash(password, salt);
    }

  async findByEmail(email: string): Promise<User> {
      return await this.findOne({ email });
  }

  async findBy(criteria: any): Promise<User[]> {
    return await this.find(criteria);
  }





}