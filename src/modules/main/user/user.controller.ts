import { Controller,UseGuards,Query, Logger,Post,Get,Body,Put,Delete,Param,ValidationPipe,Patch, HttpStatus, UseInterceptors, UploadedFile, Request, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { map, Observable, of, tap } from 'rxjs';
import { User } from 'src/entities/user.entity';
import { GetUser } from '../auth/decorators/get-user.decorator';;
import { ChangePasswordDto } from '../auth/dto/change-password.dto';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { UpdateUserDto } from '../auth/dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserInterface } from './interface/user.interface';
import { UserService } from './user.service';
import { join } from 'path';
import { diskStorage } from 'multer';
import path = require('path');
import { v4 as uuidv4 } from 'uuid';

export const USER_URL ='http://localhost:4000/user';
export const storage = {
  storage: diskStorage({
      destination: './uploads/profileimages',
      filename: (req, file, cb) => {
          const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
          const extension: string = path.parse(file.originalname).ext;

          cb(null, `${filename}${extension}`)
      }
  })

}

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
export class UserController {

    private logger = new Logger('UserController')
    constructor(
        private readonly userService : UserService,
    ) {}


    @UseGuards(AuthGuard('jwt'))
    @Get('')
    index(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ) {
        limit = limit > 100 ? 100 : limit;
        return this.userService.paginateAll({
            limit: Number(limit),
            page: Number(page),
            route: USER_URL
        })
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
      findOne(@GetUser() user: User){
        return user;
      }

    
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':id')
    async update(@Param('id') Userid: string, @Body() userData: UpdateUserDto){
      return await this.userService.updateUsers(Userid, userData);
    }

    @Patch('/changePassword')
    async changePassword(
      @GetUser()
      @Param('id') Userid: string,
      @Body(new ValidationPipe()) changePasswordDto: ChangePasswordDto,
      ) : Promise<boolean> {
         return this.userService.changesPassword(Userid, changePasswordDto);
      }
      
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    deleted(@Param('id') id: string){
       this.userService.remove(id);
       return {status: HttpStatus.OK}
    }

    @UseGuards(JwtAuthGuard)
    @Post('upload')
    @UseInterceptors(FileInterceptor('file', storage))
    uploadFile(@UploadedFile() file,  @Request() req): Observable<Object> {
        const user: UserInterface = req.user;

        return this.userService.uploadImageProfile(user.id, {avatar: file.filename}).pipe(
            tap((user: UserInterface) => console.log(user)),
            map((user:UserInterface) => ({avatar: user.avatar}))
        )
    }

    @Get('profile-image/:imagename')
    findProfileImage(@Param('imagename') imagename, @Res() res): Observable<Object> {
        return of(res.sendFile(join(process.cwd(), 'uploads/profileimages/' + imagename)));
    }

}
