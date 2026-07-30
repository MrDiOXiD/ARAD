import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GoogleAuthDto {
  @ApiProperty({
    description: 'The ID token returned by Google Identity Services on the client — NOT an access token.',
  })
  @IsNotEmpty()
  @IsString()
  idToken!: string;
}
