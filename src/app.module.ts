import {Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {CacheModule} from "@nestjs/cache-manager";
import {createKeyv} from "@keyv/redis";
import {PrismaModule} from "./prisma/prisma.module";
import { ProductsModule } from './products/products.module';

@Module({
    imports: [
        ConfigModule.forRoot({isGlobal: true}),
        CacheModule.registerAsync({
            isGlobal: true,
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                const url = config.get<string>('REDIS_URL');
                return {
                    stores: [createKeyv(url)],
                    ttl: 30_000, // 30 segundos, em MILISSEGUNDOS
                }
            }
        }),
        PrismaModule,
        ProductsModule,
    ],
})
export class AppModule {
}
