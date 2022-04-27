declare namespace NodeJS {
  interface ProcessEnv {
    PORT?: string
    MONGODB_URI: string
    PASS_SECRET: string
    JWT_SECRET: string
    REFRESH_TOKEN_SECRET: string
    PROD?: string
  }
}

interface MongoDoc {
  _doc: any
  _id: string
}
