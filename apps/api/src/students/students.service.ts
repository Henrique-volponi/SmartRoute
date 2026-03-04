import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateStudentDto } from './dto/create-student.dto'

@Injectable()
export class StudentsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateStudentDto) {
    return this.prisma.student.create({ data: dto })
  }

  findAll() {
    return this.prisma.student.findMany({
      include: { university: true },
      orderBy: { name: 'asc' },
    })
  }

  removeAll() {
    return this.prisma.student.deleteMany({})
  }
}
