import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import dataSource from './config/orm.config';
import { HealthController } from './health/health.controller';
import { UserRlsInterceptor } from './common/interceptors/user-rls.interceptor';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TeachersModule } from './teachers/teachers.module';
import { ParentsModule } from './parents/parents.module';
import { ChildrenModule } from './children/children.module';
import { GroupsModule } from './groups/groups.module';
import { HomeworkModule } from './homework/homework.module';
import { SubmissionsModule } from './submissions/submissions.module';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ENV ? `.env.${ENV}` : '.env',
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 3600, // Default TTL is 1 hour
    }),
    TypeOrmModule.forRoot({ ...dataSource.options, autoLoadEntities: true }),
    ThrottlerModule.forRoot([
      {
        ttl: 60, // 1 minute
        limit: 10, // 10 requests
      },
    ]),
    UsersModule,
    AuthModule,
    TeachersModule,
    ParentsModule,
    ChildrenModule,
    GroupsModule,
    HomeworkModule,
    SubmissionsModule,
  ],
  controllers: [HealthController],
  providers: [UserRlsInterceptor],
})
export class AppModule {}
