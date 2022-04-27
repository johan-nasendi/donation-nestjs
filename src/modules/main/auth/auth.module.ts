import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/roles.guard';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from 'src/repository/user.repository';
import { Verification } from 'src/entities/verification.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';


@Module({
  imports: [
    PassportModule.register({ 
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: `${config.get<string>(
            'JWT_ACCESS_TOKEN_EXPIRATION_TIME'
            )}`,
        },
      }),
    }),
    TypeOrmModule.forFeature([UserRepository,Verification]),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport:  {
          service:'smtp.mailtrap.io',
          host: config.get<string>('MAIL_HOST'),
          port: config.get<number>('MAIL_PORT'),
          secure: false,
          auth: {
            type: 'login',
            user: "5922f3242c45e2", // generated ethereal user
            pass: "550f523b4437eb" , // generated ethereal password
          },
        },
        defaults: {
          from: '"Testing "<pachenoghe01@gmail.com>'
        }
      }),
      
    }),

  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy,
      {
        provide: APP_GUARD,
        useClass: RolesGuard,
      }
  ],
  exports: [JwtStrategy, JwtRefreshStrategy, PassportModule,JwtModule],
})
export class AuthModule {}
