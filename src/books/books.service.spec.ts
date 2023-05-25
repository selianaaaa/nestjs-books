import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BooksService } from './books.service';
import { Book } from './entities/books.entity';
import { Author } from '../authors/entities/author.entity';

describe('BooksService', () => {
  let service: BooksService;
  let bookRepository: Repository<Book>;
  let authorRepository: Repository<Author>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getRepositoryToken(Book),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Author),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    bookRepository = module.get(getRepositoryToken(Book));
    authorRepository = module.get(getRepositoryToken(Author));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a single book', async () => {
      const result = {
        title: 'Test Book',
        id: 1,
        author: { name: 'Test Author', id: '1', books: [] },
      };

      jest
        .spyOn(bookRepository, 'findOne')
        .mockImplementation(() => Promise.resolve(result));
      expect(await service.findOne(1)).toBe(result);
    });

    it('should throw NotFoundException when book does not exist', async () => {
      jest
        .spyOn(bookRepository, 'findOne')
        .mockImplementation(() => Promise.resolve(undefined));
      await expect(service.findOne(1)).rejects.toThrowError('Book 1 not found');
    });
  });

  describe('create', () => {
    it('should successfully insert a book', async () => {
      const bookDto = { title: 'Test Book', author: 'Test Author' };
      const result = {
        title: 'Test Book',
        id: 1,
        author: { name: 'Test Author', id: '1' },
      };
      jest
        .spyOn(bookRepository, 'create')
        .mockImplementation(() => result as any);
      jest
        .spyOn(bookRepository, 'save')
        .mockImplementation(() => Promise.resolve(result as any));
      expect(await service.create(bookDto)).toBe(result);
    });
  });

  describe('delete', () => {
    it('should delete a book', async () => {
      const result = {
        title: 'Test Book',
        id: 1,
        author: { name: 'Test Author', id: '1', books: [] },
      };

      jest
        .spyOn(bookRepository, 'findOne')
        .mockImplementation(() => Promise.resolve(result));
      jest
        .spyOn(bookRepository, 'remove')
        .mockImplementation(() => Promise.resolve(result as any));
      expect(await service.delete(1)).toBe(result);
    });

    it('should throw NotFoundException when book does not exist', async () => {
      jest
        .spyOn(bookRepository, 'findOne')
        .mockImplementation(() => Promise.resolve(undefined));
      await expect(service.delete(1)).rejects.toThrowError('Book 1 not found');
    });
  });

  // Continue to define tests for other service methods (findOne, create, delete, etc.)
});
