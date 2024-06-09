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

  @Post(':id/help-request')
  @UseInterceptors(FileInterceptor('file'))
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
  async getHelpRequest(@Param('id') id: string) {
    return this.earthquakeService.fetchHelpRequest(id);
  }

  @Put(':id/help-request/stuff-needed')
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
