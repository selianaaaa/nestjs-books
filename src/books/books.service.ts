import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/books.entity';
import { Repository } from 'typeorm';
import { CreateBookDto } from './dtos/create-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) {}

  findAll() {
    return this.bookRepository.find();
  }

  async findOne(id: number) {
    const book = await this.bookRepository.findOne({
      where: { id },
    });

    if (!book) {
      throw new NotFoundException(`Book ${id} not found`);
    }

    return book;
  }

  async create(createBookDto: CreateBookDto) {
    const book = this.bookRepository.create({
      ...createBookDto,
    });

    return this.bookRepository.save(book);
  }

  async delete(id: number) {
    const book = await this.bookRepository.findOne({
      where: { id },
    });

    if (!book) {
      throw new NotFoundException(`Book ${id} not found`);
    }

    return this.bookRepository.remove(book);
  }
}
