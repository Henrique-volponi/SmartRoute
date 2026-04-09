import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
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

  async remove(id: string) {
    const university = await this.prisma.university.findUnique({
      where: { id },
      include: { _count: { select: { students: true } } },
    })

    if (!university) throw new NotFoundException('Universidade não encontrada.')

    if (university._count.students > 0) {
      throw new BadRequestException(
        `Não é possível excluir "${university.name}" pois há ${university._count.students} aluno(s) vinculado(s). Remova ou transfira os alunos antes.`
      )
    }

    return this.prisma.university.delete({ where: { id } })
  }
}
