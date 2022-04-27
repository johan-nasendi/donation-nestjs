import { Controller,ValidationPipe,Res,Logger,HttpStatus,Post,Get,Body,Query, UseGuards, Redirect } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { User } from 'src/entities/user.entity';
import { AuthService } from './auth.service';
import { GetUser } from './decorators/get-user.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginInputDto } from './dto/login-user.dto';
import { JwtRefreshTokenGuard } from './guards/jwt-refresh.guard';

@Controller()
export class AuthController {

    private logger = new Logger('AuthController');
    constructor(
        private authService: AuthService,
        private jwtService : JwtService,
        ) {}

        @Post('/register')
        signUp(
          @Body(ValidationPipe) authCredentialDto: CreateUserDto,
        ): Promise<{ ok: boolean }> {
          return this.authService.signUp(authCredentialDto);
        }

        @Post('/login')
        async login(
          @Res({ passthrough: true }) res: Response,
          @Body(ValidationPipe) loginInputDto: LoginInputDto,
        ) {
          const { accessToken, accessOption, refreshToken, refreshOption, user } =
            await this.authService.signIn(loginInputDto);
          res.cookie('Authentication', accessToken, accessOption);
          res.cookie('Refresh', refreshToken, refreshOption);
          return { user };
        }

        @UseGuards(JwtRefreshTokenGuard)
        @Post('/refresh')
        async refresh(
          @Res({ passthrough: true }) res: Response,
          @GetUser() user: User,
        ) {
          this.logger.verbose(`User: ${user.email} trying to refreshToken`);
          if (user) {
            const { accessToken, accessOption } =
              await this.authService.getCookieWithJwtAccessToken(user.email);
            res.cookie('Authentication', accessToken, accessOption);
            return { user };
          }
        }

        @Post('/forgotPassword')
        async forgotPassword(@Body('email',new ValidationPipe()) forgotPasswordDto: ForgotPasswordDto): Promise<void> {
            return this.authService.forgotPassword(forgotPasswordDto);
        }

        @ApiBearerAuth()
        @ApiTags('User')
        @Get('/user')
        @UseGuards(AuthGuard('jwt'))
        getUser(@GetUser() user: User) {
          return user;
        }

        @UseGuards(JwtRefreshTokenGuard)
        @Get('/logout')
        async logOut(
          @Res({ passthrough: true }) res: Response,
          @GetUser() user: User,
        ) {
          const { accessOption, refreshOption } =
            this.authService.getCookiesForLogOut();
          await this.authService.removeRefreshToken(user.email);
          res.cookie('Authentication', '', accessOption);
          res.cookie('Refresh', '', refreshOption);
      
          return {status: HttpStatus.OK}
        }

        @Get('/email')
        @Redirect('http://localhost:4000/login', 302)
          async emailAuth(@Query()  emailAuthDto: { code: string, status: string },) {
            return await this.authService.confirmationEmail(emailAuthDto);
        }
}
