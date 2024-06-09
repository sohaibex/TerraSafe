import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { FirebaseService } from '../firebase.service';
import * as admin from 'firebase-admin';
import { HttpService } from '@nestjs/axios';
import axios from 'axios';
import * as FormData from 'form-data';
import { v4 as uuidv4 } from 'uuid';
import { Storage } from '@google-cloud/storage';

@Injectable()
export class EarthquakeService {
  private db;
  private storage: Storage;

  constructor(
    private firebaseService: FirebaseService,
    private httpService: HttpService,
  ) {
    this.db = this.firebaseService.getFirestore();
    this.storage = new Storage();
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
      }
    }

    return { message: 'Earthquakes fetched and stored successfully' };
  }

  async fetchEarthquakes() {
    const earthquakes = await this.db.collection('Earthquakes').get();
    return earthquakes.docs.map((doc) => doc.data());
  }

  async addHelpRequest(earthquakeId: string, helpRequest: any) {
    const ref = this.db
      .collection('Earthquakes')
      .doc(earthquakeId)
      .collection('HelpRequests')
      .doc();
    await ref.set(helpRequest);
    return ref.id;
  }

  async addImageAndAnalyse(
    earthquakeId: string,
    requestId: string,
    imageUrl: string,
  ) {
    const requestRef = this.db
      .collection('Earthquakes')
      .doc(earthquakeId)
      .collection('HelpRequests')
      .doc(requestId);
    const requestDoc = await requestRef.get();

    if (!requestDoc.exists) {
      throw new Error('Help request not found');
    }

    const requestData = requestDoc.data();
    requestData.images = requestData.images || [];

    // Analyze the image using the GCP function
    const analysedDescription = await this.analyseImage(imageUrl);

    // Upload the image to GCP bucket
    const imageUrlInBucket = await this.uploadImageToBucket(imageUrl);

    // Add the image URL and analysis description to the help request
    requestData.images.push(imageUrlInBucket);
    requestData.analysedImageDescription = analysedDescription;
    await requestRef.update(requestData);

    return requestData;
  }

  private async analyseImage(imageUrl: string): Promise<string> {
    const form = new FormData();
    form.append(
      'file',
      axios
        .get(imageUrl, { responseType: 'stream' })
        .then((response) => response.data),
      {
        filename: 'image.jpg',
        contentType: 'image/jpeg',
      },
    );

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
      console.error('Error analyzing image:', error);
      throw new Error('Error analyzing image');
    }
  }

  private async uploadImageToBucket(imageUrl: string): Promise<string> {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'binary');
    const bucketName = 'earthquick-images';
    const fileName = `${uuidv4()}.jpg`;
    const file = this.storage.bucket(bucketName).file(fileName);

    await file.save(buffer, {
      contentType: 'image/jpeg',
    });

    return `https://storage.googleapis.com/${bucketName}/${fileName}`;
  }
}
