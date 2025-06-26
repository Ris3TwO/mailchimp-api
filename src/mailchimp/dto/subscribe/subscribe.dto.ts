import { IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubscribeDto {
  @ApiProperty({
    description: 'Email del suscriptor',
    example: 'user@example.com',
    required: true,
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: `Subscriber's name`,
    example: 'John',
    required: false,
  })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({
    description: `Subscriber's last name`,
    example: 'Doe',
    required: false,
  })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({
    description: 'Subscriber labels',
    example: ['newsletter', 'client'],
    required: false,
    type: [String],
  })
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({
    description: 'Preferred language',
    example: 'es',
    required: false,
  })
  @IsString()
  @IsOptional()
  language?: string;
}
