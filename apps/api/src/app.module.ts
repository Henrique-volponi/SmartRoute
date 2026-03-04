import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from './prisma/prisma.module'
import { StudentsModule } from './students/students.module'
import { UniversitiesModule } from './universities/universities.module'
import { RoutesModule } from './routes/routes.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    StudentsModule,
    UniversitiesModule,
    RoutesModule,
  ],
})
export class AppModule {}
