import { Controller, Logger,UseGuards,ValidationPipe,HttpStatus, Post,Get,Put,Delete,Body,Param,Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { PatienUpdatetDTO } from '../dto/patient-update.dto';
import { PatientDTO } from '../dto/patient.dto';
import { PatientInterface } from '../interface/patient.interface';
import { PatientService } from './patient.service';

export const PATIENT_URL ='http://localhost:4000/patient';

@ApiBearerAuth()
@ApiTags('patient')
@Controller('patient')
export class PatientController {

    private logger = new Logger('PatientController');
    constructor(
        private readonly patientService : PatientService,
    ) {}

    @UseGuards(AuthGuard('jwt'))
    @Post()
    create(
      @Body(ValidationPipe) patientDTO: PatientDTO,
    ): Promise<{ ok: boolean }> {
      return this.patientService.create(patientDTO);
    }
    

    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    findOne(@Param('id') id: number) : Observable<PatientInterface>{
          return this.patientService.findOne(id)
    }

      @UseGuards(JwtAuthGuard, RolesGuard)
      @Put(':id')
      async update(@Param('id') id: string, @Body() patientData: PatienUpdatetDTO){
        return await this.patientService.update(id, patientData);
      }

      @UseGuards(JwtAuthGuard, RolesGuard)
      @Delete(':id')
      deleted(@Param('id') id: string){
         this.patientService.remove(id);
         return {status: HttpStatus.OK}
      }

      @UseGuards(AuthGuard('jwt'))
      @Get('')
      index(
          @Query('page') page: number = 1,
          @Query('limit') limit: number = 10
      ) {
          limit = limit > 100 ? 100 : limit;
          return this.patientService.paginateAll({
              limit: Number(limit),
              page: Number(page),
              route: PATIENT_URL
          })
      }

}
