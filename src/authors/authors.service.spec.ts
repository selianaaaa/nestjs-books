import { Test, TestingModule } from '@nestjs/testing';
import { AuthorsService } from './authors.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Author } from './entities/author.entity';
import { CreateAuthorDto } from './dtos/create-author.dto';

describe('AuthorsService', () => {
  let service: AuthorsService;
  let authorRepository: Repository<Author>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorsService,
        {
          provide: getRepositoryToken(Author),
          useValue: {
            find: jest.fn().mockResolvedValue([]),
            findOne: jest.fn().mockResolvedValue(null),
            create: jest.fn().mockReturnValue({}),
            save: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    service = module.get<AuthorsService>(AuthorsService);
    authorRepository = module.get<Repository<Author>>(
      getRepositoryToken(Author),
    );
  });

  describe('findAll', () => {
    it('should return an array of authors', async () => {
      const result = [{ name: 'Test Author', id: '1', books: [] }];
      jest.spyOn(authorRepository, 'find').mockResolvedValue(result);
      expect(await service.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single author', async () => {
      const result = { name: 'Test Author', id: '1', books: [] };
      jest.spyOn(authorRepository, 'findOne').mockResolvedValue(result);
      expect(await service.findOne('1')).toBe(result);
    });

    it('should throw NotFoundException when author does not exist', async () => {
      jest.spyOn(authorRepository, 'findOne').mockResolvedValue(undefined);
      await expect(service.findOne('1')).rejects.toThrowError(
        'Author 1 not found',
      );
    });
  });

  describe('create', () => {
    it('should create a author', async () => {
      const createAuthorDto: CreateAuthorDto = { name: 'Test Author' };
      const result = { name: 'Test Author', id: '1', books: [] };
      jest.spyOn(authorRepository, 'create').mockReturnValue(result as any);
      jest.spyOn(authorRepository, 'save').mockResolvedValue(result as any);
      expect(await service.create(createAuthorDto)).toBe(result);
    });
  });
});
