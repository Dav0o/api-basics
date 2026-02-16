import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam,
  ApiBody
} from '@nestjs/swagger';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

 
  @Get()
  @ApiOperation({ 
    summary: 'Obtener todos los productos',
    description: 'Retorna la lista completa de productos registrados'
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Lista de productos obtenida exitosamente',
    type: [CreateProductoDto]
  })
  findAll() {
    return this.productosService.findAll();
  }

 
}
