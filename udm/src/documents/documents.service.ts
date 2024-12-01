import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './document.entity';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private documentsRepository: Repository<Document>,
  ) {}

  create(documentData: any) {
    const document = this.documentsRepository.create(documentData);
    return this.documentsRepository.save(document);
  }

  findAll() {
    return this.documentsRepository.find();
  }

  findOne(id: number) {
    return this.documentsRepository.findOne({
      where: { id },  // Correct usage with `where` clause
    });
  }

  remove(id: number) {
    return this.documentsRepository.delete(id);
  }
}
