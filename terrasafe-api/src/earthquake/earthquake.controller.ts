import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { EarthquakeService } from './earthquake.service';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';

@Controller('earthquakes')
@ApiTags('earthquakes')
export class EarthquakeController {
  constructor(private readonly earthquakeService: EarthquakeService) {}

  @Get()
  @ApiOperation({ summary: 'Get all earthquakes' })
  async getEarthquakes() {
    return this.earthquakeService.fetchEarthquakes();
  }

  @Get('fetch-and-store')
  @ApiOperation({ summary: 'Fetch and store earthquake data' })
  async fetchAndStoreEarthquakes() {
    return this.earthquakeService.fetchAndStoreEarthquakes();
  }

  @Get('all-with-help-requests')
  @ApiOperation({ summary: 'Get all earthquakes with their help requests' })
  async getAllEarthquakesWithHelpRequests() {
    return this.earthquakeService.fetchAllEarthquakesWithHelpRequests();
  }

  @Post(':id/help-request')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Add or update help request for an earthquake' })
  @ApiParam({ name: 'id', description: 'Earthquake ID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        helpRequest: { type: 'string' },
        currentLocation: { type: 'string' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async addOrUpdateHelpRequest(
    @Param('id') id: string,
    @Body('helpRequest') helpRequest: string,
    @Body('currentLocation') currentLocation: string,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    console.log('Received helpRequest body:', helpRequest);
    console.log('Received currentLocation body:', currentLocation);
    const parsedHelpRequest = JSON.parse(helpRequest);
    const parsedCurrentLocation = JSON.parse(currentLocation);
    return this.earthquakeService.addOrUpdateHelpRequest(
      id,
      parsedHelpRequest,
      parsedCurrentLocation,
      file,
    );
  }

  @Get(':id/help-request')
  @ApiOperation({ summary: 'Get help request for an earthquake' })
  @ApiParam({ name: 'id', description: 'Earthquake ID' })
  async getHelpRequest(@Param('id') id: string) {
    return this.earthquakeService.fetchHelpRequest(id);
  }

  @Put(':id/help-request/stuff-needed')
  @ApiOperation({ summary: 'Update stuff needed in the help request' })
  @ApiParam({ name: 'id', description: 'Earthquake ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        stuffNeeded: { type: 'string' },
      },
    },
  })
  async updateStuffNeeded(
    @Param('id') id: string,
    @Body('stuffNeeded') stuffNeeded: any,
  ) {
    console.log('Received stuffNeeded:', stuffNeeded);
    const parsedStuffNeeded = JSON.parse(stuffNeeded);
    return this.earthquakeService.updateStuffNeeded(id, parsedStuffNeeded);
  }

  @Put(':id/help-request')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Update help request for an earthquake' })
  @ApiParam({ name: 'id', description: 'Earthquake ID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        updateData: { type: 'string' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async updateHelpRequest(
    @Param('id') id: string,
    @Body('updateData') updateData: string,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    console.log('Received updateData body:', updateData);
    const parsedUpdateData = JSON.parse(updateData);
    return this.earthquakeService.updateHelpRequest(id, parsedUpdateData, file);
  }
}
