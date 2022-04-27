import { 
  Controller, 
  Logger,UseGuards,
  ValidationPipe,
  HttpStatus, 
  Post,Get,Put,Delete,Body,Param,Query, } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FundraiserCreatetDTO } from '../dto/fundraiser-create.dto';
import { FundraiserService } from './fundraiser.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { FundraiserUpdatetDTO } from '../dto/fundraiser-update.dto';
import { Observable } from 'rxjs';
import { FundraiserInterface } from '../interface/fundraiser.interface';


export const FUNDRAISER_URL ='http://localhost:4000/fundraiser';

@ApiBearerAuth()
@ApiTags('fundraiser')
@Controller('fundraiser')
export class FundraiserController {

    private logger = new Logger('FundraiserController')
    constructor(
        private readonly fundraiserService : FundraiserService,
    
    ){}

    @UseGuards(AuthGuard('jwt'))
    @Post()
    create(
      @Body(ValidationPipe) fundraisrCreateDTO: FundraiserCreatetDTO,
    ): Promise<{ ok: boolean }> {
      return this.fundraiserService.create(fundraisrCreateDTO);
    }



    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    findOne(@Param('id') id: number) : Observable<FundraiserInterface>{
          return this.fundraiserService.findOne(id)
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async update(@Param('id') id: string, @Body() fundraiserData: FundraiserUpdatetDTO){
          return await this.fundraiserService.update(id, fundraiserData);
    }
  
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    deleted(@Param('id') id: string){
           this.fundraiserService.remove(id);
           return {status: HttpStatus.OK}
    }



    @UseGuards(AuthGuard('jwt'))
    @Get('')
    index(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ) {
        limit = limit > 100 ? 100 : limit;
        return this.fundraiserService.paginateAll({
            limit: Number(limit),
            page: Number(page),
            route: FUNDRAISER_URL
        })
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':fundraiser')
    indexByUser(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Param('fundraiser') userId: number,
        
    ) {
        limit = limit > 100 ? 100 : limit;

        return this.fundraiserService.paginateByUser({
            limit: Number(limit),
            page: Number(page),
            route: FUNDRAISER_URL + '/fundraiser/' + userId 
        }, Number(userId))
    }

}
