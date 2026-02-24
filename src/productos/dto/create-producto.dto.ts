import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  MaxLength,
  Min,
  IsNotEmpty,
  IsInt,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductoDto {
  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Laptop HP',
    maxLength: 100,
  })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
  Nombre: string;

  @ApiPropertyOptional({
    description: 'Descripción del producto',
    example: 'Laptop HP con 16GB RAM y 512GB SSD',
    maxLength: 255,
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @MaxLength(255, { message: 'La descripción no puede exceder 255 caracteres' })
  Descripcion?: string;

  @ApiProperty({
    description: 'Precio del producto',
    example: 999.99,
    minimum: 0,
  })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'El precio debe ser un número con máximo 2 decimales' },
  )
  @Min(0, { message: 'El precio no puede ser negativo' })
  Precio: number;

  @ApiProperty({
    description: 'Cantidad en stock',
    example: 50,
    minimum: 0,
  })
  @IsInt({ message: 'El stock debe ser un número entero' })
  @Min(0, { message: 'El stock no puede ser negativo' })
  Stock: number;

  @ApiPropertyOptional({
    description: 'Estado del producto (activo/inactivo)',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'El campo Activo debe ser verdadero o falso' })
  Activo?: boolean;
}
