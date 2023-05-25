import { IsString, MinLength } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @MinLength(2, {
    message: 'Title is too short',
  })
  readonly title: string;

  @IsString()
  @MinLength(2, {
    message: 'Author is too short',
  })
  readonly author: string;
}
