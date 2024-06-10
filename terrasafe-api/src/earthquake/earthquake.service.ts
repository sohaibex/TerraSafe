import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { FirebaseService } from '../firebase.service';
import * as admin from 'firebase-admin';
import { HttpService } from '@nestjs/axios';
import axios from 'axios';
import * as FormData from 'form-data';
import { v4 as uuidv4 } from 'uuid';
import { Storage } from '@google-cloud/storage';
import { ElasticsearchService } from '@nestjs/elasticsearch';
@Injectable()
export class EarthquakeService {
  private db;
  private storage: Storage;

  constructor(
    private firebaseService: FirebaseService,
    private httpService: HttpService,
    private readonly elasticsearchService: ElasticsearchService,
  ) {
    this.db = this.firebaseService.getFirestore();
    this.storage = new Storage();
    this.ensureIndexMapping();
  }

  async logData(log: any) {
    await this.elasticsearchService.index({
      index: 'logs',
      body: log,
    });
  }

  async fetchAndStoreEarthquakes() {
    const url =
      'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson';
    const response = await this.httpService.get(url).toPromise();
    const data = response.data;

    for (const feature of data.features) {
      const earthquakeId = feature.id;
      const earthquakeRef = this.db.collection('Earthquakes').doc(earthquakeId);
      const earthquakeDoc = await earthquakeRef.get();

      if (!earthquakeDoc.exists) {
        const earthquake = {
          magnitude: feature.properties.mag,
          location: feature.properties.place,
          coordinates: new admin.firestore.GeoPoint(
            feature.geometry.coordinates[1],
            feature.geometry.coordinates[0],
          ),
          timestamp: new Date(feature.properties.time),
          url: feature.properties.url,
          details: feature.properties.detail,
          status: feature.properties.status,
          tsunami: feature.properties.tsunami,
          sig: feature.properties.sig,
          net: feature.properties.net,
          code: feature.properties.code,
          ids: feature.id,
          sources: feature.properties.sources,
          types: feature.properties.types,
          nst: feature.properties.nst,
          dmin: feature.properties.dmin,
          rms: feature.properties.rms,
          gap: feature.properties.gap,
          magType: feature.properties.magType,
          title: feature.properties.title,
        };

        await earthquakeRef.set(earthquake);
        await this.logData({
          message: 'New earthquake stored',
          earthquake,
        });
      }
    }

    await this.logData({
      message: 'Earthquakes fetched and stored successfully',
    });
    return { message: 'Earthquakes fetched and stored successfully' };
  }

  private async ensureIndexMapping() {
    const indexExists = await this.elasticsearchService.indices.exists({
      index: 'logs',
    });
    if (!indexExists) {
      await this.elasticsearchService.indices.create({
        index: 'logs',
        body: {
          mappings: {
            properties: {
              'data.magnitude': { type: 'float' },
            },
          },
        },
      });
    } else {
      // Update the mapping if it exists
      await this.elasticsearchService.indices.putMapping({
        index: 'logs',
        body: {
          properties: {
            'data.magnitude': { type: 'float' },
          },
        },
      });
    }
  }

  async fetchEarthquakes() {
    const earthquakes = await this.db.collection('Earthquakes').get();
    const result = earthquakes.docs.map((doc) => doc.data());
    await this.logData({ message: 'Earthquakes fetched', data: result });
    return result;
  }

  async addOrUpdateHelpRequest(
    earthquakeId: string,
    helpRequest: any,
    currentLocation: { latitude: number; longitude: number },
    file?: Express.Multer.File,
  ) {
    const ref = this.db
      .collection('Earthquakes')
      .doc(earthquakeId)
      .collection('HelpRequests')
      .doc('helpRequest');

    try {
      if (file) {
        const analysedDescription = await this.analyseImage(file);
        const imageUrlInBucket = await this.uploadImageToBucket(file);
        helpRequest.images = helpRequest.images || [];
        helpRequest.images.push({
          id: uuidv4(),
          url: imageUrlInBucket,
          analysedImageDescription: analysedDescription,
        });
      }

      helpRequest.currentLocation = new admin.firestore.GeoPoint(
        currentLocation.latitude,
        currentLocation.longitude,
      );

      await ref.set(helpRequest, { merge: true });
      await this.logData({
        message: 'Help request added or updated',
        earthquakeId,
        helpRequest,
      });
      return ref.id;
    } catch (error) {
      await this.logData({
        message: 'Failed to add or update help request',
        earthquakeId,
        error: error.message,
      });
      throw new HttpException(
        'Failed to add help request',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async analyseImage(file: Express.Multer.File): Promise<string> {
    const form = new FormData();
    form.append('file', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });

    try {
      const response = await axios.post(
        'https://us-central1-terrasafe-423412.cloudfunctions.net/analyzeEarthquakeImage',
        form,
        {
          headers: {
            ...form.getHeaders(),
          },
        },
      );
      await this.logData({
        message: 'Image analyzed',
        file: file.originalname,
        description: response.data.description,
      });
      return response.data.description;
    } catch (error) {
      await this.logData({
        message: 'Error analyzing image',
        file: file.originalname,
        error: error.message,
      });
      throw new Error('Error analyzing image');
    }
  }

  private async uploadImageToBucket(
    file: Express.Multer.File,
  ): Promise<string> {
    const bucketName = 'earthquick-images';
    const fileName = `${uuidv4()}-${file.originalname}`;
    const fileUpload = this.storage.bucket(bucketName).file(fileName);

    await fileUpload.save(file.buffer, {
      contentType: file.mimetype,
    });

    const imageUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
    await this.logData({
      message: 'Image uploaded to bucket',
      fileName: file.originalname,
      imageUrl,
    });
    return imageUrl;
  }

  async fetchHelpRequest(earthquakeId: string) {
    const helpRequestSnapshot = await this.db
      .collection('Earthquakes')
      .doc(earthquakeId)
      .collection('HelpRequests')
      .doc('helpRequest')
      .get();

    if (!helpRequestSnapshot.exists) {
      await this.logData({
        message: 'Help request not found',
        earthquakeId,
      });
      throw new HttpException('Help request not found', HttpStatus.NOT_FOUND);
    }

    const data = helpRequestSnapshot.data();
    await this.logData({
      message: 'Help request fetched',
      earthquakeId,
      data,
    });
    return data;
  }

  async updateStuffNeeded(earthquakeId: string, stuffNeeded: any) {
    const ref = this.db
      .collection('Earthquakes')
      .doc(earthquakeId)
      .collection('HelpRequests')
      .doc('helpRequest');

    try {
      await ref.update({ stuffNeeded });
      await this.logData({
        message: 'stuffNeeded updated successfully',
        earthquakeId,
        stuffNeeded,
      });
      return { message: 'stuffNeeded updated successfully' };
    } catch (error) {
      await this.logData({
        message: 'Failed to update stuffNeeded',
        earthquakeId,
        error: error.message,
      });
      throw new HttpException(
        'Failed to update stuffNeeded',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateHelpRequest(
    earthquakeId: string,
    updateData: any,
    file?: Express.Multer.File,
  ) {
    const ref = this.db
      .collection('Earthquakes')
      .doc(earthquakeId)
      .collection('HelpRequests')
      .doc('helpRequest');

    try {
      if (file) {
        const analysedDescription = await this.analyseImage(file);
        const imageUrlInBucket = await this.uploadImageToBucket(file);
        updateData.images = updateData.images || [];
        updateData.images.push({
          id: uuidv4(),
          url: imageUrlInBucket,
          analysedImageDescription: analysedDescription,
        });
      }

      await ref.set(updateData, { merge: true });
      await this.logData({
        message: 'Help request updated successfully',
        earthquakeId,
        updateData,
      });
      return ref.id;
    } catch (error) {
      await this.logData({
        message: 'Failed to update help request',
        earthquakeId,
        error: error.message,
      });
      throw new HttpException(
        'Failed to update help request',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async fetchAllEarthquakesWithHelpRequests() {
    const earthquakesSnapshot = await this.db.collection('Earthquakes').get();
    const earthquakes = [];

    for (const earthquakeDoc of earthquakesSnapshot.docs) {
      const earthquakeData = earthquakeDoc.data();
      const helpRequestsSnapshot = await this.db
        .collection('Earthquakes')
        .doc(earthquakeDoc.id)
        .collection('HelpRequests')
        .get();

      const helpRequests = helpRequestsSnapshot.docs.map((doc) => doc.data());
      earthquakes.push({
        ...earthquakeData,
        helpRequests,
      });
    }

    await this.logData({
      message: 'All earthquakes with help requests fetched',
      earthquakes,
    });
    return earthquakes;
  }

  async saveConversationHistory(userId: string, history: any[]) {
    const ref = this.db.collection('Conversations').doc(userId);
    await ref.set({ history }, { merge: true });
    await this.logData({
      message: 'Conversation history saved',
      userId,
      history,
    });
  }
  async getConversationHistory(userId: string): Promise<any[]> {
    const ref = this.db.collection('Conversations').doc(userId);
    const doc = await ref.get();
    if (doc.exists) {
      return doc.data().history;
    } else {
      return [];
    }
  }
}
