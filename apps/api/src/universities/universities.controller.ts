import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'
import { UniversitiesService } from './universities.service'
import { CreateUniversityDto } from './dto/create-university.dto'

@Controller('universities')
export class UniversitiesController {
  constructor(private readonly universitiesService: UniversitiesService) {}

  @Post()
  create(@Body() dto: CreateUniversityDto) {
    return this.universitiesService.create(dto)
  }

  @Get()
  findAll() {
    return this.universitiesService.findAll()
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.universitiesService.remove(id)
  }
}
