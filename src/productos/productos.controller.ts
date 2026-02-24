import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { ListProductoDto } from './dto/list-producto.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Productos')
@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  // ==========================================
  // POST /productos - Crear un producto
  // ==========================================
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear un nuevo producto',
    description:
      'Crea un nuevo producto ejecutando el procedimiento almacenado sp_Productos_Insertar',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Producto creado exitosamente',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de entrada inválidos',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Error interno del servidor',
  })
  create(@Body() createProductoDto: CreateProductoDto) {
    return this.productosService.create(createProductoDto);
  }

  // ==========================================
  // GET /productos - Listar productos con filtros
  // ==========================================
  @Get()
  @ApiOperation({
    summary: 'Listar productos con filtros y paginación',
    description:
      'Retorna una lista de productos con filtros opcionales ejecutando el procedimiento almacenado sp_Productos_Listar',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de productos obtenida exitosamente',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Parámetros de filtrado inválidos',
  })
  findAll(@Query() listProductoDto: ListProductoDto) {
    return this.productosService.findAll(listProductoDto);
  }

  // ==========================================
  // GET /productos/:id - Obtener producto por ID
  // ==========================================
  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un producto por ID',
    description:
      'Retorna un producto específico ejecutando el procedimiento almacenado sp_Productos_ObtenerPorID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del producto',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Producto obtenido exitosamente',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Producto no encontrado',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'ID inválido',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.findOne(id);
  }

  // ==========================================
  // PATCH /productos/:id - Actualizar producto
  // ==========================================
  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un producto',
    description:
      'Actualiza un producto existente ejecutando el procedimiento almacenado sp_Productos_Actualizar. Solo se actualizan los campos proporcionados.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del producto a actualizar',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Producto actualizado exitosamente',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Producto no encontrado',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de entrada inválidos',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductoDto: UpdateProductoDto,
  ) {
    return this.productosService.update(id, updateProductoDto);
  }

  // ==========================================
  // DELETE /productos/:id - Soft delete
  // ==========================================
  @Delete(':id')
  @ApiOperation({
    summary: 'Desactivar un producto (soft delete)',
    description:
      'Marca un producto como inactivo ejecutando el procedimiento almacenado sp_Productos_Eliminar',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del producto a desactivar',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Producto desactivado exitosamente',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Producto no encontrado',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.remove(id);
  }

  // ==========================================
  // DELETE /productos/:id/hard - Eliminación física
  // ==========================================
  @Delete(':id/hard')
  @ApiOperation({
    summary: 'Eliminar permanentemente un producto (hard delete)',
    description:
      'Elimina físicamente un producto de la base de datos ejecutando el procedimiento almacenado sp_Productos_EliminarFisico. ¡Esta acción es irreversible!',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del producto a eliminar permanentemente',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Producto eliminado permanentemente',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Producto no encontrado',
  })
  removeHard(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.removeHard(id);
  }
}
