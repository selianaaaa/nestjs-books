import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorsModule } from './authors/authors.module';

@Module({
  imports: [
    BooksModule,
    AuthorsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'postgres',
      password: 'pass123',
      database: 'postgres',
      autoLoadEntities: true,
      synchronize: true, // should be disabled on prod, otherwise you can lose production data.
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
