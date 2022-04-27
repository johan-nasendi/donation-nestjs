import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, ForbiddenException, Injectable,InternalServerErrorException,UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Verification } from 'src/entities/verification.entity';
import { UserRepository } from 'src/repository/user.repository';
import { EventEmitter } from 'stream';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginInputDto } from './dto/login-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@Injectable()
export class AuthService {

    private readonly emitter = new EventEmitter();
    private readonly clientAppUrl: string;

    constructor(
        @InjectRepository(UserRepository)
        private readonly userRepository: UserRepository,
        @InjectRepository(Verification)
        private readonly verification: Repository<Verification>,
        private readonly jwtService: JwtService,
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService,
      ) {
        this.clientAppUrl = this.configService.get<string>('FE_APP_URL');
    
      }

      async signUp(authCredentialDto: CreateUserDto): Promise<{ ok: boolean }> {
        const user = await this.userRepository.createUser(authCredentialDto);
        try {
          const verification = await this.verification.save(
            this.verification.create({
              user,
            }),
          );
          //sendEmail
          this.sendMail(user.email, user.name, verification.code);
          return { ok: true };
        } catch (error) {
          console.log(error);
          throw new InternalServerErrorException();
        }
      }

      async signIn({ email, password }: LoginInputDto) {
        const user = await this.userRepository.findOne({ email });
        if (!user) {
          throw new UnauthorizedException('User does not exist.');
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          throw new UnauthorizedException('password is wrong.');
        }
  
        if (!user.verified) {
          throw new UnauthorizedException('Email verification is required.');
        }
  
        const { accessToken, accessOption } =
          await this.getCookieWithJwtAccessToken(email);
        const { refreshToken, refreshOption } =
          await this.getCookieWithJwtRefreshToken(email);
        await this.updateRefreshTokenInUser(refreshToken, email);
        const returnUser = await this.userRepository
          .createQueryBuilder('user')
          .select([
            'user.id',
            'user.name',
            'user.email',
          ])
          .where('user.email = :email', { email })
          .getOne();
        return {
          accessToken,
          accessOption,
          refreshToken,
          refreshOption,
          user: returnUser,
        };
      }

          // send confirmation email w 
    async sendMail(email: string,name: string, code: string) {
        try {
          await this.mailerService.sendMail({
            to: email, // list of receivers
            from: `${this.configService.get<string>('EMAIL_ID')}@donation.com`, // sender address
            subject: 'Verify User.', // Subject line
            html: `
            <h3> Hello,${name}</h3>
            <p><a href="http://localhost:3000/email/?code=${code}">Verification Link Authenticate</a>to confirm your account</p>`, // HTML body content
          });
          //front
          return { ok: true };
        } catch (error) {
          console.log(error);
        }
      }

      async forgotPassword( forgotPasswordDto: ForgotPasswordDto): Promise<void> {
        const user = await this.userRepository.findByEmail(forgotPasswordDto.email);
          if (!user) {
              throw new BadRequestException('Invalid email');
          }
          const token = await this.signIn(user);
          const forgotLink = `${this.clientAppUrl}/forgotPassword?token=${token}`;
          await this.mailerService.sendMail({
            from: this.configService.get<string>('EMAIL_ID'),
            to: user.email,
            subject: 'Forgot Password',
            html: `
                <h3>Hello ${user.name}!</h3>
                <p>Please use this <a href="${forgotLink}">link</a> to reset your password.</p>
            `,
        });
      }

      async confirmationEmail({code,}: {code: string;}): 
      Promise<{ ok: boolean; message: string }> {
      try {
        const verification = await this.verification.findOne(
          { code },
          { relations: ['user'] },
        );
        if (verification) {
          verification.user.verified = true;
          this.userRepository.save(verification.user);
        }
        // Delete email verification code and grant verification code validity period
        return {
          ok: true,
          message: '!Please log in to get started',
        };
      } catch (error) {
        console.log(error);
        return {
          ok: false,
          message: 'Email authentication failed. please try again',
        };
      }
    }

     //accessToken 
     async getCookieWithJwtAccessToken(email: string) {
        const payload = { email };
        const token = this.jwtService.sign(payload, {
          secret: this.configService.get('JWT_SECRET'),
          expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
   
        });
        return {
          accessToken: token,
          accessOption: {
            domain: 'localhost',
            path: '/',
            httpOnly: true,
            maxAge: 240 * 60 * 8000,
          },
        };
      }
    
      //refreshToken 
      async getCookieWithJwtRefreshToken(email: string) {
        const payload = { email };
        const token = this.jwtService.sign(payload, {
          secret: this.configService.get('JWT_SECRET'),
          expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
          
        });
        return {
          refreshToken: token,
          refreshOption: {
            domain: 'localhost',
            path: '/',
            maxAge: 240 * 60 * 8000,
            httpOnly: true,   
          },
        };
      }
    
      // RefreshToken 
      async updateRefreshTokenInUser(refreshToken: string, email: string) {
        if (refreshToken) {
          refreshToken = await bcrypt.hash(refreshToken, 10);
        }
        await this.userRepository.update(
          { email },
          {
            currentHashedRefreshToken: refreshToken,
          },
        );
      }
    
      // RefreshToken
      async getUserRefreshTokenMatches(
        refreshToken: string,
        email: string,
      ): Promise<{ result: boolean }> {
        const user = await this.userRepository.findOne({ email });
        if (!user) {
          throw new UnauthorizedException('User does not exist.');
        }
        const isRefreshTokenMatch = await bcrypt.compare(
          refreshToken,
          user.currentHashedRefreshToken,
        );
        if (isRefreshTokenMatch) {
          // await this.updateRefreshTokenInUser(null, email);
          return { result: true };
        } else {
          throw new UnauthorizedException();
        }
      }
    
      async removeRefreshToken(email: string) {
        return this.userRepository.update(
          { email },
          {
            currentHashedRefreshToken: null,
          },
        );
      }
    
      async logOut(email: string) {
        await this.removeRefreshToken(email);
      }
    
      async getNewAccessAndRefreshToken(email: string) {
        const { refreshToken } = await this.getCookieWithJwtRefreshToken(email);
        await this.updateRefreshTokenInUser(refreshToken, email);
        return {
          accessToken: await this.getCookieWithJwtAccessToken(email),
          refreshToken,
        };
      }
    
      getCookiesForLogOut() {
        return {
          accessOption: {
            domain: 'localhost',
            path: '/',
            httpOnly: true,
            maxAge: 0,
          },
          refreshOption: {
            domain: 'localhost',
            path: '/',
            httpOnly: true,
            maxAge: 0,
          },
        };
      }


}
