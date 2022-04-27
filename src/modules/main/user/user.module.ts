import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/repository/user.repository';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt'}),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn:  `${config.get<string>(
            'JWT_ACCESS_TOKEN_EXPIRATION_TIME'
            )}d`,
        },
        global: true
      }),
    }),
    TypeOrmModule.forFeature([UserRepository])
  ],
  controllers: [UserController],
  providers: [UserService, JwtAuthGuard,JwtStrategy,{
    provide: APP_GUARD,
    useClass: RolesGuard
  }],
  exports: [UserService,PassportModule,JwtStrategy, JwtModule],
  
})
export class UserModule {}
