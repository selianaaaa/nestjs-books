import { IsString, MinLength } from 'class-validator';

export class CreateAuthorDto {
  @IsString()
  @MinLength(2, {
    message: 'Name is too short',
  })
  readonly name: string;
}
