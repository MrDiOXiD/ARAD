import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config(); // Loads environment variables from your .env file

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'Amir1384@',
  database: process.env.DB_NAME || 'API',
  
  // Point to both TS (for development) and JS (compiled for production)
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  
  // MUST be false when using migrations to prevent data loss!
  synchronize: false, 
};

const AppDataSource = new DataSource(dataSourceOptions);
export default AppDataSource;