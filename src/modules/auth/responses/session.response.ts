import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities';

export class SessionResponse {
  @ApiProperty({ description: 'Usuario autenticado' })
  payload: User;

  @ApiProperty({
    description: 'Token de acceso',
    type: String,
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTIyZjgwZjdlNzQ2YjUzZDk2YjgyZTQiLCJlbWFpbCI6ImNyaXN2ZXJhMTkwOUBnbWFpbC5jb20iLCJuYW1lIjoiQ3JpcyBWZXJhIFZpbGxhbWl6YXIiLCJwaG9uZU51bWJlciI6IjMwMjQ1Njc4MzQiLCJyb2xlcyI6WyJ1c2VyIiwic3R1ZGVudCIsImFkbWluIl0sImlhdCI6MTY5Njc5NjY0OSwiZXhwIjoxNjk5Mzg4NjQ5fQ.3A6Y5203oXoQrhQpkrHlf65vmXEmo4X7ucdGF145NRE',
  })
  token: string;

}
