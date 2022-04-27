import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

import { User } from 'src/entities/user.entity';
import { UserRepository } from 'src/repository/user.repository';



@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get<string>('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          return request?.cookies?.Authentication;
        },
      ]),
    });
  }

  async validate({ email }) {
    const user: User = await this.userRepository.findOne(
      { email },
      { select: ['id', 'email','name'] },
    );
    if (!user) {
      throw new UnauthorizedException('Login required.');
    }
    return user;
  }

  // async validate(payload: JwtPayload) {
  //   const user: User = await this.userRepository.validateUser(payload);
  //   if(!user) {
  //     throw new UnauthorizedException('Login required');
  //   }
  //   return user;
  // }
}
