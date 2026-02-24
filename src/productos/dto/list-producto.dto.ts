import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ListProductoDto {
  @ApiPropertyOptional({
    description: 'Filtrar por nombre (búsqueda parcial)',
    example: 'Laptop',
  })
  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  Nombre?: string;

  @ApiPropertyOptional({
    description: 'Filtrar solo productos activos',
    example: true,
    default: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean({ message: 'SoloActivos debe ser verdadero o falso' })
  SoloActivos?: boolean;

  @ApiPropertyOptional({
    description: 'Precio mínimo para filtrar',
    example: 10.0,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'El precio mínimo debe ser un número válido' },
  )
  @Min(0, { message: 'El precio mínimo no puede ser negativo' })
  PrecioMinimo?: number;

  @ApiPropertyOptional({
    description: 'Precio máximo para filtrar',
    example: 5000.0,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'El precio máximo debe ser un número válido' },
  )
  @Min(0, { message: 'El precio máximo no puede ser negativo' })
  PrecioMaximo?: number;

  @ApiPropertyOptional({
    description: 'Número de página',
    example: 1,
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El número de página debe ser un entero' })
  @Min(1, { message: 'El número de página debe ser al menos 1' })
  PageNumber?: number;

  @ApiPropertyOptional({
    description: 'Cantidad de registros por página',
    example: 20,
    default: 20,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El tamaño de página debe ser un entero' })
  @Min(1, { message: 'El tamaño de página debe ser al menos 1' })
  @Max(100, { message: 'El tamaño de página no puede exceder 100' })
  PageSize?: number;
}
