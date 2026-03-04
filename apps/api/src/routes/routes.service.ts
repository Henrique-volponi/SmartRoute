import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { GenerateRouteDto, RouteType } from './dto/generate-route.dto'
import { OptimizationService } from './optimization.service'

@Injectable()
export class RoutesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly optimization: OptimizationService
  ) {}

  async generate(dto: GenerateRouteDto) {
    const students = await this.prisma.student.findMany({
      include: { university: true },
    })

    if (!students.length) {
      throw new NotFoundException('Nenhum estudante cadastrado para otimizar rota.')
    }

    const university = students[0].university
    if (!university) {
      throw new BadRequestException('Estudantes não vinculados a uma universidade.')
    }

    const hasMixedOrMissingUniversities = students.some(
      student => !student.university || student.university.id !== university.id
    )
    if (hasMixedOrMissingUniversities) {
      throw new BadRequestException(
        'Não é possível otimizar rota com estudantes de universidades diferentes.'
      )
    }

    const studentCoords = students.map(
      student => [student.longitude, student.latitude] as [number, number]
    )

    const isIda = dto.type === RouteType.IDA

    const coordinates: Array<[number, number]> = isIda
      ? [...studentCoords, [university.longitude, university.latitude]]
      : [[university.longitude, university.latitude], ...studentCoords]

    const optimized = await this.optimization.optimizeTrip(coordinates, {
      source: isIda ? 'any' : 'first',
      destination: isIda ? 'last' : 'any',
    })

    const routeRecord = await this.prisma.route.create({
      data: {
        type: dto.type,
        totalDistance: optimized.totalDistance,
        totalDuration: optimized.totalDuration,
      },
    })

    return {
      routeId: routeRecord.id,
      type: dto.type,
      totalDistance: optimized.totalDistance,
      totalDuration: optimized.totalDuration,
      optimizedOrder: optimized.optimizedOrder,
      geometry: optimized.geometry,
    }
  }
}
