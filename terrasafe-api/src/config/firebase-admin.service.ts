import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as admin from "firebase-admin";

@Injectable()
export class FirebaseAdminService implements OnModuleInit {
  constructor(private configService: ConfigService) {
  }

  onModuleInit() {
    this.initializeFirebase();
  }

  private initializeFirebase() {
    const serviceAccount = {
      type: "service_account",
      projectId: "mlr-test-400520",
      privateKeyId: "9b82e01fa13acbf71d6d3ea0a1443055ffced952",
      privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDX4mb14fWTXKhH\nLtAJWCChP+Vpn65A8waG+9FrE8KInaEfQJZAZMrhmFEC3pY1TfM6qTScGHVs8wFU\nOXapvsBz8DV9VfTgoIltufSI8mPA8L4f032vgMMsBs35bPqe7YonN3fTE6wCGjFh\nIOxfQusqmtRk5GIJcryhs4kBPbG+JQiog7o8qEn4XbGPjlHuDGbLZSTYmUIOJ9sV\nRdsOWboMkuu2zTpH3C0gfPOF3QD/w2qyJ9wIO9LZIEv8nkBd64/CAXcovy6KepCb\nYh/BZbYIc/ucfKeAln11vq4ha3oiFpk4D3UPPnCvZcAuHqRxU84HfojXRCYjmDYu\nqJYCM/jZAgMBAAECggEAGJZ+bAxVjDheKSdVhe7t3ne40RAhCGA1ktus9SFdw3IS\nlwzj4AcqzUlsFqPT31PWu0xow8uMWkGOGfHmiDxDzqCh8vm+h3P5WxA2H//daSzy\nNo0/sCS99e57eKhXHhFHbiKE6PtBWMbzb1DQ4yOrxaE3Rht16AYTomYgmU3Vx+ZZ\nxEswv1tmje/lNp7oyHwcWEkx4spbly0gGqS2nni8bzB0l9tDRxfU9/p3AedgWfz9\nHrrXunLKY2nMpmj1Qh0B5VNzxMsWQmWMHbVqIf+Q3/9TVIEtGdNdLjHfgVCOqyaZ\na2IoxGCqe/IL9UtmI3F0rSLdtyaBE9Sss3vzplMn9QKBgQD4y/zVTrMwaHQkBPDM\n/yUsX6HOtMFxbKKpTplF3Tm2o7ARu9hAML6ylSKucetQNS/SMggtZxbj6v2dwUTF\nbc+Szi6Qq1v5YwXCdNQIlQH66o9GCivBpwfs4qpbWMjsSMerS/nkqEBRp5dN6e34\nOVCk6GZCC6HeFMMl7bRSwQDs3QKBgQDeInoMdqsDYK/0bm19aKBTTFq3e8Ncaj5a\nc5IWi2hmZJO8dzyD9bkzhauSJ+rbVSQiy34GihQ6UPJc32Mylhr53OSetx0wWmb5\ngpka8MH7oH0hVoTwjOVpoxXpTCTbWj8f7XQShe5BTmwp3wlcv/qVE3vhLGUUXqZD\nr1d+9utOLQKBgQCnSXGtc4dkyzccaP4IuJ4kIgFIXZ2cSHFu6dyBb2i494MRyX50\nWtI+fayeIxcYDUskSGPbM2/evEjfY+572YQyr9P7jlz/aKecwrU3OAnmzwSbEYeu\nZEMd8qKdXStsRNuMwD88kiz9OnSv/NT3jII+/8ySKAQksU0uGZCf/ApFOQKBgFr9\nalsCnOhkSY7pUOYm3k1goGQ6SPro9iOc5YFgl2Ih3rY7bUlsdPFa1r2mpjgztvqd\nukC5fLGqiKxsQLju7Zvd1LQCs+0jiry3tzlm1z7YLYljZE8Yl7xetlH7A7nqTKMq\nY/pWbBLKKdo45x/b76vy8DJ7OehPIPHmuANk51v9AoGBAPhJPKmoaZevM8+hOSip\nf2coUwBywUKb9oYXOb0LglA3H8uGOCEQi4UAppSL48aORrRgotxuCK2oQWfJOKBw\nPOyaG0gvWenuEK9e+U9+BMz3LTQ4er9avQJ4CQ/l+sftwFQ6+znr9SK2PA0HCYRi\nydf57nhKSAPRI7INIc0JDAPU\n-----END PRIVATE KEY-----\n",
      clientEmail: "firebase-adminsdk-qidf2@mlr-test-400520.iam.gserviceaccount.com",
      clientId: "107517291602380993634",
      authUri: "https://accounts.google.com/o/oauth2/auth",
      tokenUri: "https://oauth2.googleapis.com/token",
      authProviderX509CertUrl: "https://www.googleapis.com/oauth2/v1/certs",
      clientX509CertUrl: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-qidf2%40mlr-test-400520.iam.gserviceaccount.com"
    };

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }
}
