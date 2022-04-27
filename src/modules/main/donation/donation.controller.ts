import { Controller,UseGuards,HttpStatus, Logger,Post,Put,Get,Delete,Param,Body,ValidationPipe,Query, UseInterceptors, UploadedFile, Request, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { DonationService } from './donation.service';
import { DonationCreatetDTO } from './dto/donation-create.dto';
import { DonationUpdatetDTO } from './dto/donation-update.dto';
import path = require('path');
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { FileInterceptor } from '@nestjs/platform-express';
import { map, Observable, of, tap } from 'rxjs';
import { ImageInterface } from './interface/image.interface';
import { DonationInterface } from './interface/donation.interface';

export const DONATION_URL ='http://localhost:4000/donation';
export const storage = {
    storage: diskStorage({
        destination: './uploads/donation-images',
        filename: (req, file, cb) => {
            const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
            const extension: string = path.parse(file.originalname).ext;

            cb(null, `${filename}${extension}`)
        }
    })

}

@ApiBearerAuth()
@ApiTags('Donation')
@Controller('donation')
export class DonationController {

    private logger = new Logger('DonationController')
    constructor(
        private readonly donationService : DonationService,
    ){}


    @UseGuards(AuthGuard('jwt'))
    @Post()
    create(
        @Body(ValidationPipe) donationCreateDtop : DonationCreatetDTO,
    ) : Promise<{ok: boolean}> {
        return this.donationService.create(donationCreateDtop)
        {
            ok: true;
        }
    }

    
    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    findOne(@Param('id') id: number) : Observable<DonationInterface>{
          return this.donationService.findOne(id)
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async update(@Param('id') id: string, @Body() donationUpdateDTO: DonationUpdatetDTO){
      return await this.donationService.update(id, donationUpdateDTO);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    deleted(@Param('id') id: string){
       this.donationService.remove(id);
       return {status: HttpStatus.OK}
    }

    
    @UseGuards(JwtAuthGuard)
    @Post('upload')
    @UseInterceptors(FileInterceptor('file', storage))
    uploadFile(@UploadedFile() file, @Request() req): Observable<ImageInterface> {
        return of(file);
    }

    @Get('image/:imagename')
    findImage(@Param('imagename') imagename, @Res() res): Observable<Object> {
        return of(res.sendFile(join(process.cwd(), 'uploads/donation-images/' + imagename)));
    }


    @UseGuards(AuthGuard('jwt'))
    @Get('')
    index(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ) {
        limit = limit > 100 ? 100 : limit;
        return this.donationService.paginateAll({
            limit: Number(limit),
            page: Number(page),
            route: DONATION_URL
        })
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':donations')
    indexByUser(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Param('fundraiser') userId: number,
        
    ) {
        limit = limit > 100 ? 100 : limit;
        return this.donationService.paginateByUser({
            limit: Number(limit),
            page: Number(page),
            route: DONATION_URL + '/donation/' + userId 
        }, Number(userId))
    }

}
