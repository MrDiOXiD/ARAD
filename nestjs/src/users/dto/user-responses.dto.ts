// src/users/dto/user-responses.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Roles } from '../../utils/common/Roles.enum';

export class SafeUser {
  @ApiProperty({ example: 1, description: 'The unique numeric identifier' })
  id!: number;

  @ApiProperty({ example: 'john.doe@example.com' })
  email!: string;

  @ApiProperty({ example: 'johndoe99' })
  username!: string;

  @ApiProperty({ 
    example: [Roles.USER], 
    enum: Roles, 
    isArray: true, 
    description: 'Array of roles assigned to the user'
  })
  roles!: Roles[];

  @ApiProperty({ description: 'When the user account was created', example: '2026-03-01T00:00:00.000Z' })
  createdAt!: Date;
}

export class AuthResponse {
  @ApiProperty({ 
    description: 'JWT Access Token', 
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' 
  })
  accessToken!: string;

  @ApiProperty({ type: SafeUser, description: 'The authenticated user data' })
  user!: SafeUser;
}