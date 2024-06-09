import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { EarthquakeService } from './earthquake.service';

@Controller('earthquakes')
export class EarthquakeController {
  constructor(private readonly earthquakeService: EarthquakeService) {}

  @Get()
  async getEarthquakes() {
    return this.earthquakeService.fetchEarthquakes();
  }

  @Get('fetch-and-store')
  async fetchAndStoreEarthquakes() {
    return this.earthquakeService.fetchAndStoreEarthquakes();
  }
  @Post(':id/help-requests')
  @UseInterceptors(FileInterceptor('file'))
  async addHelpRequest(
    @Param('id') id: string,
    @Body('helpRequest') helpRequest: string,
    @Body('currentLocation') currentLocation: string,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    console.log('Received helpRequest body:', helpRequest);
    console.log('Received currentLocation body:', currentLocation);
    const parsedHelpRequest = JSON.parse(helpRequest);
    const parsedCurrentLocation = JSON.parse(currentLocation);
    return this.earthquakeService.addHelpRequest(
      id,
      parsedHelpRequest,
      parsedCurrentLocation,
      file,
    );
  }
}
