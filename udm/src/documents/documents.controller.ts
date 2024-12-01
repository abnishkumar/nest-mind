import { Controller, Get, Post, Body, Param, Delete, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { Roles } from 'src/common/guards/roles/roles.decorator';

@Controller('documents')
@UseGuards(RolesGuard) // Apply the guard globally for this controller
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) { }



  @Get()
  findAll() {
    return this.documentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentsService.findOne(Number(id));
  }

  @Delete(':id')
  @Roles('admin') // Only allow admin to delete documents
  @Post('upload')
  @Roles('admin', 'editor')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const filename = `${Date.now()}-${file.originalname}`;
        callback(null, filename);
      },
    }),
  }))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Body() body: any) {
    const document = {
      filename: file.filename,
      filepath: `uploads/${file.filename}`,
      size: file.size,
      uploadedBy: body.username, // Assuming username is passed in the body
    };

    // Save document metadata to the database
    const savedDocument = await this.documentsService.create(document);

    return {
      message: 'File uploaded successfully',
      document: savedDocument,
    };
  }
  remove(@Param('id') id: string) {
    return this.documentsService.remove(Number(id));
  }
}
