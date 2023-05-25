import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { CreateAuthorDto } from './dtos/create-author.dto';
import { Author } from './entities/author.entity';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author)
    private authorRepository: Repository<Author>,
  ) {}

  findAll() {
    return this.authorRepository.find({
      relations: ['books'],
    });
  }

  async findOne(id: string) {
    const author = await this.authorRepository.findOne({
      where: { id },
      relations: ['books'],
    });

    if (!author) {
      throw new NotFoundException(`Author ${id} not found`);
    }

    return author;
  }

  async create(createAuthorDto: CreateAuthorDto) {
    const author = this.authorRepository.create({
      ...createAuthorDto,
    });

    return this.authorRepository.save(author);
  }
}
