import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateUniversityDto } from './dto/create-university.dto'

@Injectable()
export class UniversitiesService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateUniversityDto) {
    return this.prisma.university.create({ data: dto })
  }

  findAll() {
    return this.prisma.university.findMany({
      include: { students: true },
      orderBy: { name: 'asc' },
    })
  }
}
