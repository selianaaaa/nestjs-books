import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/books.entity';
import { Repository } from 'typeorm';
import { CreateBookDto } from './dtos/create-book.dto';
import { Author } from 'src/authors/entities/author.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    @InjectRepository(Author)
    private authorRepository: Repository<Author>,
  ) {}

  findAll() {
    return this.bookRepository.find({
      relations: ['author'],
    });
  }

  async findOne(id: number) {
    const book = await this.bookRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!book) {
      throw new NotFoundException(`Book ${id} not found`);
    }

    return book;
  }

  async create(createBookDto: CreateBookDto) {
    await this.throwIfAlreadyExists(createBookDto.title);

    const author = await this.preloadAuthorByName(createBookDto.author);

    const book = this.bookRepository.create({
      ...createBookDto,
      author,
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

  private async preloadAuthorByName(name: string) {
    const existingAuthor = await this.authorRepository.findOne({
      where: { name },
    });

    if (existingAuthor) {
      return existingAuthor;
    }

    const newAuthor = this.authorRepository.create({ name });
    return this.authorRepository.save(newAuthor);
  }

  private async throwIfAlreadyExists(title: string) {
    const existingBook = await this.bookRepository.findOne({
      where: { title },
    });

    if (existingBook) {
      throw new HttpException(
        'This book is already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
