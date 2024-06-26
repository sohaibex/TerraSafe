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
  }

  private async logToElasticsearch(level: string, message: string, meta?: any) {
    const log = {
      level,
      message,
      meta,
      timestamp: new Date(),
    };

    await this.elasticsearchService.index({
      index: 'earthquake-service-logs',
      body: log,
    });
  }

  async fetchAndStoreEarthquakes() {
    const url =
      'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson';
    try {
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
        }
      }

      await this.logToElasticsearch('info', 'Earthquakes fetched and stored successfully');
      return { message: 'Earthquakes fetched and stored successfully' };
    } catch (error) {
      await this.logToElasticsearch('error', 'Failed to fetch and store earthquakes', error);
      throw new HttpException(
        'Failed to fetch and store earthquakes',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async fetchEarthquakes() {
    try {
      const earthquakes = await this.db.collection('Earthquakes').get();
      const result = earthquakes.docs.map((doc) => doc.data());
      await this.logToElasticsearch('info', 'Fetched earthquakes', { count: result.length });
      return result;
    } catch (error) {
      await this.logToElasticsearch('error', 'Failed to fetch earthquakes', error);
      throw new HttpException(
        'Failed to fetch earthquakes',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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
      await this.logToElasticsearch('info', 'Help request added or updated', { earthquakeId, helpRequest });
      return ref.id;
    } catch (error) {
      await this.logToElasticsearch('error', 'Failed to add help request', error);
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

      return response.data.description;
    } catch (error) {
      await this.logToElasticsearch('error', 'Error analyzing image', error);
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

    return imageUrl;
  }

  async fetchHelpRequest(earthquakeId: string) {
    try {
      const helpRequestSnapshot = await this.db
        .collection('Earthquakes')
        .doc(earthquakeId)
        .collection('HelpRequests')
        .doc('helpRequest')
        .get();

      if (!helpRequestSnapshot.exists) {
        await this.logToElasticsearch('warn', 'Help request not found', { earthquakeId });
        throw new HttpException('Help request not found', HttpStatus.NOT_FOUND);
      }

      const data = helpRequestSnapshot.data();
      await this.logToElasticsearch('info', 'Fetched help request', { earthquakeId, data });
      return data;
    } catch (error) {
      await this.logToElasticsearch('error', 'Failed to fetch help request', error);
      throw new HttpException(
        'Failed to fetch help request',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateStuffNeeded(earthquakeId: string, stuffNeeded: any) {
    const ref = this.db
      .collection('Earthquakes')
      .doc(earthquakeId)
      .collection('HelpRequests')
      .doc('helpRequest');

    try {
      await ref.update({ stuffNeeded });
      await this.logToElasticsearch('info', 'stuffNeeded updated', { earthquakeId, stuffNeeded });
      return { message: 'stuffNeeded updated successfully' };
    } catch (error) {
      await this.logToElasticsearch('error', 'Failed to update stuffNeeded', error);
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
      // Fetch the existing document
      const helpRequestSnapshot = await ref.get();
      const existingData = helpRequestSnapshot.exists
        ? helpRequestSnapshot.data()
        : {};

      if (file) {
        const analysedDescription = await this.analyseImage(file);
        const imageUrlInBucket = await this.uploadImageToBucket(file);

        // Merge existing images with new image
        const existingImages = existingData.images || [];
        updateData.images = [
          ...existingImages,
          {
            id: uuidv4(),
            url: imageUrlInBucket,
            analysedImageDescription: analysedDescription,
          },
        ];
      }

      // Ensure that other fields are merged properly
      const mergedData = {
        ...existingData,
        ...updateData,
        images: updateData.images || existingData.images || [],
      };

      await ref.set(mergedData, { merge: true });
      await this.logToElasticsearch('info', 'Help request updated', { earthquakeId, updateData });
      return ref.id;
    } catch (error) {
      await this.logToElasticsearch('error', 'Failed to update help request', error);
      throw new HttpException(
        'Failed to update help request',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async fetchAllEarthquakesWithHelpRequests() {
    try {
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

      await this.logToElasticsearch('info', 'Fetched all earthquakes with help requests', { count: earthquakes.length });
      return earthquakes;
    } catch (error) {
      await this.logToElasticsearch('error', 'Failed to fetch earthquakes with help requests', error);
      throw new HttpException(
        'Failed to fetch earthquakes with help requests',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async saveConversationHistory(userId: string, history: any[]) {
    try {
      const ref = this.db.collection('Conversations').doc(userId);
      await ref.set({ history }, { merge: true });
      await this.logToElasticsearch('info', 'Conversation history saved', { userId, history });
    } catch (error) {
      await this.logToElasticsearch('error', 'Failed to save conversation history', error);
      throw new HttpException(
        'Failed to save conversation history',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getConversationHistory(userId: string): Promise<any[]> {
    try {
      const ref = this.db.collection('Conversations').doc(userId);
      const doc = await ref.get();
      if (doc.exists) {
        const history = doc.data().history;
        await this.logToElasticsearch('info', 'Fetched conversation history', { userId, history });
        return history;
      } else {
        await this.logToElasticsearch('info', 'No conversation history found', { userId });
        return [];
      }
    } catch (error) {
      await this.logToElasticsearch('error', 'Failed to fetch conversation history', error);
      throw new HttpException(
        'Failed to fetch conversation history',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
