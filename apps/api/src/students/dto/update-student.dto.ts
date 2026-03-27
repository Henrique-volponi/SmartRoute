import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator'

export class UpdateStudentDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  address?: string

  @IsNumber()
  @IsOptional()
  latitude?: number

  @IsNumber()
  @IsOptional()
  longitude?: number

  @IsUUID()
  @IsOptional()
  universityId?: string
}
