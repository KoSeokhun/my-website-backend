import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from "@nestjs/typeorm";

export default class TypeOrmConfig {
    static getOrmConfig(configService: ConfigService): TypeOrmModuleOptions{
        const envPort: number = parseInt(configService.get('DATABASE_PORT') || ''); // PORT number or NaN
        const port: number = Number.isInteger(envPort) ? envPort : 20; // PORT number => true, NaN => false

        return {
            type: 'postgres',
            host: configService.get('DATABASE_HOST'),
            port,
            username: configService.get('DATABASE_USERNAME'),
            password: configService.get('DATABASE_PASSWORD'),
            database: configService.get('DATABASE_NAME'),
            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            synchronize: configService.get('DATABASE_SYNC'),
            logging: false,
            migrations: ['dist/migrations/*{.ts,.js}'],
            migrationsTableName: 'custom_migration_table',
        }
    }
}

export const ormConfigAsync: TypeOrmModuleAsyncOptions = {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService):
        Promise<TypeOrmModuleOptions> => TypeOrmConfig.getOrmConfig(configService),
}