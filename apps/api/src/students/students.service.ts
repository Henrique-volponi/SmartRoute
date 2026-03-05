import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
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

  async removeOne(id: string) {
    try {
      return await this.prisma.student.delete({ where: { id } })
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Student with id ${id} not found`)
      }
      throw error
    }
  }

  removeAll() {
    return this.prisma.student.deleteMany({})
  }
}
