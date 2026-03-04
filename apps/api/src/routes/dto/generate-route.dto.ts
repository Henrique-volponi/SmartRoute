import { IsEnum } from 'class-validator'

export enum RouteType {
  IDA = 'IDA',
  VOLTA = 'VOLTA',
}

export class GenerateRouteDto {
  @IsEnum(RouteType)
  type: RouteType
}
