import { Module } from '@nestjs/common'
import { RoutesService } from './routes.service'
import { RoutesController } from './routes.controller'
import { OptimizationService } from './optimization.service'

@Module({
  controllers: [RoutesController],
  providers: [RoutesService, OptimizationService],
})
export class RoutesModule {}
