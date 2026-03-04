import { Body, Controller, Post } from '@nestjs/common'
import { RoutesService } from './routes.service'
import { GenerateRouteDto } from './dto/generate-route.dto'

@Controller('routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Post('generate')
  generate(@Body() dto: GenerateRouteDto) {
    return this.routesService.generate(dto)
  }
}
