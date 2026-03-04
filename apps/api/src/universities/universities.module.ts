import { Module } from '@nestjs/common'
import { UniversitiesService } from './universities.service'
import { UniversitiesController } from './universities.controller'

@Module({
  controllers: [UniversitiesController],
  providers: [UniversitiesService],
})
export class UniversitiesModule {}
