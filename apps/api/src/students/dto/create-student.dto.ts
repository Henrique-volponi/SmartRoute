import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator'

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsNotEmpty()
  address: string

  @IsNumber()
  latitude: number

  @IsNumber()
  longitude: number

  @IsUUID()
  universityId: string
}
