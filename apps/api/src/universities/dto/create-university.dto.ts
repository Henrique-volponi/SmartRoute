import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateUniversityDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsNumber()
  latitude: number

  @IsNumber()
  longitude: number
}
