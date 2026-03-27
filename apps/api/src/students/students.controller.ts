import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  ForbiddenException,
} from '@nestjs/common'
import { StudentsService } from './students.service'
import { CreateStudentDto } from './dto/create-student.dto'
import { Patch } from '@nestjs/common'
import { UpdateStudentDto } from './dto/update-student.dto'

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  create(@Body() dto: CreateStudentDto) {
    return this.studentsService.create(dto)
  }

  @Get()
  findAll() {
    return this.studentsService.findAll()
  }

  @Patch(':id')
  update(@Param('id', new ParseUUIDPipe()) id: string, @Body() dto: UpdateStudentDto) {
    return this.studentsService.update(id, dto)
  }

  @Delete(':id')
  removeOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.studentsService.removeOne(id)
  }

  @Delete()
  removeAll() {
    if (process.env.NODE_ENV === 'production') {
      throw new ForbiddenException(
        'Remoção em massa de estudantes desabilitada em produção.'
      )
    }
    return this.studentsService.removeAll()
  }
}
