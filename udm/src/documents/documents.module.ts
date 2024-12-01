import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';  // Ensure TypeOrmModule is imported
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { Document } from './document.entity';  // Ensure Document entity is imported

@Module({
  imports: [
    TypeOrmModule.forFeature([Document]),  // Register the Document entity with TypeOrmModule
  ],
  providers: [DocumentsService],  // The DocumentsService will now have access to the DocumentRepository
  controllers: [DocumentsController],
})
export class DocumentsModule {}
