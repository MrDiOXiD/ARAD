/* eslint-disable prettier/prettier */
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeOrmCOnfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'Amir1384@',   // ✅ FIXED
    database: 'API',         // ✅ FIXED
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: true,
};