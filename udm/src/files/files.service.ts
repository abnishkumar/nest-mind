import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose'
import { GridFSBucketReadStream } from 'mongodb'
import { FileInfoVm } from './file-info-vm.model'
import { Connection, Model } from 'mongoose';
import { QueryFile, QueryResult } from 'src/files/interface/fileInterface'
import { updateFileDto } from './dto/update-file-dto'
import { MongoGridFS } from 'mongo-gridfs';

@Injectable()
export class FilesService {
  private fileModel: MongoGridFS;

  constructor(@InjectConnection() private readonly connection: Connection,
    @InjectModel('fs.files') private filesModel: Model<any>) {
    // Initialize MongoGridFS with the database connection
    this.fileModel = new MongoGridFS(this.connection.db, 'fs');
  }

  async readStream(id: string): Promise<GridFSBucketReadStream> {
    return await this.fileModel.readFileStream(id);
  }

  async findInfo(id: string): Promise<FileInfoVm> {
    console.log(id);
    const result = await this.fileModel.findById(id)
      .then(result => result)
      .catch(err => { throw new HttpException('File not found', HttpStatus.NOT_FOUND) })
    console.log(result);
    return {
      filename: result.filename,
      length: result.length,
      chunkSize: result.chunkSize,
      md5: result.md5,
      contentType: result.contentType
    }
  }

  async deleteFile(id: string): Promise<boolean> {
    return await this.fileModel.delete(id)
  }

  /**
   * {filename: 'test.png'}
   * contentType: file type
   * filename：filename
   * @param searchParam 
   */
  async findAllFile(searchParam = {}): Promise<any> {
    let param = {}
    if (Object.getOwnPropertyNames(searchParam).length) {
      for (const key in searchParam) {
        if (searchParam.hasOwnProperty(key)) {
          param[key] = searchParam[key];
        }
      }
    }
    const result = await this.fileModel.find(param)
    return result;
  }

  /**
   * Paginate the list of files
   * @param query 
   * @param pageIndex 
   * @param pageSize 
   */
  async queryFileInfo(query: QueryFile = {}, pageIndex: number, pageSize: number): Promise<QueryResult> {
    console.log(query, pageIndex, pageSize);
    const total = await this.filesModel.countDocuments();
    const data = await this.filesModel.find(query)
      .skip(Number(pageSize) * Number(pageIndex))
      .limit(Number(pageSize))
    return {
      total,
      data
    }
  }

  async updateFile(
    _id: string,
    updateFile: updateFileDto
  ): Promise<any> {
    const existingUser = await this.filesModel.findByIdAndUpdate(
      { _id: _id },
      updateFile,
    );
    if (!existingUser) {
      throw new NotFoundException(`file #${_id} not found`);
    }

    return existingUser;
  }
}


