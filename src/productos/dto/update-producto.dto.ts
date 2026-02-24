import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  MaxLength,
  Min,
  IsInt,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProductoDto {
  @ApiPropertyOptional({
    description: 'Nombre del producto',
    example: 'Laptop HP Actualizada',
    maxLength: 100,
  })
  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
  Nombre?: string;

  @ApiPropertyOptional({
    description: 'Descripción del producto',
    example: 'Laptop HP con 32GB RAM y 1TB SSD',
    maxLength: 255,
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @MaxLength(255, { message: 'La descripción no puede exceder 255 caracteres' })
  Descripcion?: string;

  @ApiPropertyOptional({
    description: 'Precio del producto',
    example: 1299.99,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'El precio debe ser un número con máximo 2 decimales' },
  )
  @Min(0, { message: 'El precio no puede ser negativo' })
  Precio?: number;

  @ApiPropertyOptional({
    description: 'Cantidad en stock',
    example: 100,
    minimum: 0,
  })
  @IsOptional()
  @IsInt({ message: 'El stock debe ser un número entero' })
  @Min(0, { message: 'El stock no puede ser negativo' })
  Stock?: number;

  @ApiPropertyOptional({
    description: 'Estado del producto (activo/inactivo)',
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'El campo Activo debe ser verdadero o falso' })
  Activo?: boolean;
}
