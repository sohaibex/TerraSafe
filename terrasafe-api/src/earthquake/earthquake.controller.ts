import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { EarthquakeService } from './earthquake.service';

@Controller('earthquakes')
export class EarthquakeController {
  constructor(private readonly earthquakeService: EarthquakeService) {}

  // Endpoint to fetch and return all stored earthquakes
  @Get()
  async getEarthquakes() {
    return this.earthquakeService.fetchEarthquakes();
  }

  // Endpoint to fetch earthquake data from the USGS API and store it in Firestore
  @Get('fetch-and-store')
  async fetchAndStoreEarthquakes() {
    return this.earthquakeService.fetchAndStoreEarthquakes();
  }

  // Endpoint to add a help request to a specific earthquake
  @Post(':id/help-requests')
  async addHelpRequest(@Param('id') id: string, @Body() helpRequest: any) {
    return this.earthquakeService.addHelpRequest(id, helpRequest);
  }

  // Endpoint to add an image to a help request and analyze it
  @Post(':id/help-requests/:requestId/images')
  async addImageAndAnalyse(
    @Param('id') id: string,
    @Param('requestId') requestId: string,
    @Body() body: { imageUrl: string },
  ) {
    return this.earthquakeService.addImageAndAnalyse(
      id,
      requestId,
      body.imageUrl,
    );
  }
}
