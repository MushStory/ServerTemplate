import {IsString} from 'class-validator';

export class JoinDto {
  @IsString()
  readonly id: string;

  @IsString()
  readonly password: string;
}
