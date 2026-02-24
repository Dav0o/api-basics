import {
  Injectable,
  Inject,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { Sequelize, QueryTypes } from 'sequelize';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { ListProductoDto } from './dto/list-producto.dto';

// Interfaz para tipar los resultados de los stored procedures
export interface ProductoResult {
  ProductoID: number;
  Nombre: string;
  Descripcion: string | null;
  Precio: number;
  Stock: number;
  FechaCreacion: Date;
  Activo: boolean;
  FechaActualizacion?: Date | null;
}

export interface MensajeResult {
  Mensaje: string;
}

@Injectable()
export class ProductosService {
  constructor(
    @Inject('SEQUELIZE')
    private readonly sequelize: Sequelize,
  ) {}

  /**
   * Crear un nuevo producto usando el SP sp_Productos_Insertar
   */
  async create(createProductoDto: CreateProductoDto): Promise<{
    message: string;
    data: ProductoResult;
  }> {
    try {
      const { Nombre, Descripcion, Precio, Stock, Activo } = createProductoDto;

      const result = await this.sequelize.query<ProductoResult>(
        `EXEC dbo.sp_Productos_Insertar 
          @Nombre = :Nombre, 
          @Descripcion = :Descripcion, 
          @Precio = :Precio, 
          @Stock = :Stock, 
          @Activo = :Activo`,
        {
          replacements: {
            Nombre,
            Descripcion: Descripcion ?? null,
            Precio,
            Stock,
            Activo: Activo !== undefined ? (Activo ? 1 : 0) : 1,
          },
          type: QueryTypes.SELECT,
        },
      );

      if (!result || result.length === 0) {
        throw new InternalServerErrorException(
          'No se pudo crear el producto. El procedimiento no retornó datos.',
        );
      }

      return {
        message: 'Producto creado exitosamente',
        data: result[0],
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Error al crear el producto: ${error.message}`,
      );
    }
  }

  /**
   * Obtener un producto por ID usando el SP sp_Productos_ObtenerPorID
   */
  async findOne(id: number): Promise<{
    message: string;
    data: ProductoResult;
  }> {
    try {
      if (!id || id <= 0) {
        throw new BadRequestException(
          'El ID del producto debe ser un número positivo',
        );
      }

      const result = await this.sequelize.query<ProductoResult>(
        `EXEC dbo.sp_Productos_ObtenerPorID @ProductoID = :ProductoID`,
        {
          replacements: { ProductoID: id },
          type: QueryTypes.SELECT,
        },
      );

      if (!result || result.length === 0) {
        throw new NotFoundException(
          `El producto con ID ${id} no fue encontrado`,
        );
      }

      return {
        message: 'Producto obtenido exitosamente',
        data: result[0],
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      // Capturar errores del SP (RAISERROR)
      if (error.message?.includes('no existe')) {
        throw new NotFoundException(
          `El producto con ID ${id} no fue encontrado`,
        );
      }
      throw new InternalServerErrorException(
        `Error al obtener el producto: ${error.message}`,
      );
    }
  }

  /**
   * Listar productos con filtros y paginación usando el SP sp_Productos_Listar
   */
  async findAll(listProductoDto?: ListProductoDto): Promise<{
    message: string;
    data: ProductoResult[];
    pagination: {
      page: number;
      pageSize: number;
    };
  }> {
    try {
      const {
        Nombre = null,
        SoloActivos = true,
        PrecioMinimo = null,
        PrecioMaximo = null,
        PageNumber = 1,
        PageSize = 20,
      } = listProductoDto || {};

      // Validar que PrecioMinimo no sea mayor que PrecioMaximo
      if (
        PrecioMinimo !== null &&
        PrecioMaximo !== null &&
        PrecioMinimo > PrecioMaximo
      ) {
        throw new BadRequestException(
          'El precio mínimo no puede ser mayor que el precio máximo',
        );
      }

      const result = await this.sequelize.query<ProductoResult>(
        `EXEC dbo.sp_Productos_Listar 
          @Nombre = :Nombre, 
          @SoloActivos = :SoloActivos, 
          @PrecioMinimo = :PrecioMinimo, 
          @PrecioMaximo = :PrecioMaximo, 
          @PageNumber = :PageNumber, 
          @PageSize = :PageSize`,
        {
          replacements: {
            Nombre: Nombre ?? null,
            SoloActivos: SoloActivos ? 1 : 0,
            PrecioMinimo: PrecioMinimo ?? null,
            PrecioMaximo: PrecioMaximo ?? null,
            PageNumber,
            PageSize,
          },
          type: QueryTypes.SELECT,
        },
      );

      return {
        message: 'Lista de productos obtenida exitosamente',
        data: result || [],
        pagination: {
          page: PageNumber,
          pageSize: PageSize,
        },
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Error al listar los productos: ${error.message}`,
      );
    }
  }

  /**
   * Actualizar un producto usando el SP sp_Productos_Actualizar
   */
  async update(
    id: number,
    updateProductoDto: UpdateProductoDto,
  ): Promise<{
    message: string;
    data: ProductoResult;
  }> {
    try {
      if (!id || id <= 0) {
        throw new BadRequestException(
          'El ID del producto debe ser un número positivo',
        );
      }

      // Verificar que al menos un campo viene para actualizar
      const { Nombre, Descripcion, Precio, Stock, Activo } = updateProductoDto;
      const hasFields =
        Nombre !== undefined ||
        Descripcion !== undefined ||
        Precio !== undefined ||
        Stock !== undefined ||
        Activo !== undefined;

      if (!hasFields) {
        throw new BadRequestException(
          'Debe proporcionar al menos un campo para actualizar',
        );
      }

      const result = await this.sequelize.query<ProductoResult>(
        `EXEC dbo.sp_Productos_Actualizar 
          @ProductoID = :ProductoID, 
          @Nombre = :Nombre, 
          @Descripcion = :Descripcion, 
          @Precio = :Precio, 
          @Stock = :Stock, 
          @Activo = :Activo`,
        {
          replacements: {
            ProductoID: id,
            Nombre: Nombre ?? null,
            Descripcion: Descripcion ?? null,
            Precio: Precio ?? null,
            Stock: Stock ?? null,
            Activo: Activo !== undefined ? (Activo ? 1 : 0) : null,
          },
          type: QueryTypes.SELECT,
        },
      );

      if (!result || result.length === 0) {
        throw new NotFoundException(
          `El producto con ID ${id} no fue encontrado`,
        );
      }

      return {
        message: 'Producto actualizado exitosamente',
        data: result[0],
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      if (error.message?.includes('no existe')) {
        throw new NotFoundException(
          `El producto con ID ${id} no fue encontrado`,
        );
      }
      throw new InternalServerErrorException(
        `Error al actualizar el producto: ${error.message}`,
      );
    }
  }

  /**
   * Soft delete de un producto usando el SP sp_Productos_Eliminar
   */
  async remove(id: number): Promise<{
    message: string;
  }> {
    try {
      if (!id || id <= 0) {
        throw new BadRequestException(
          'El ID del producto debe ser un número positivo',
        );
      }

      const result = await this.sequelize.query<MensajeResult>(
        `EXEC dbo.sp_Productos_Eliminar @ProductoID = :ProductoID`,
        {
          replacements: { ProductoID: id },
          type: QueryTypes.SELECT,
        },
      );

      if (!result || result.length === 0) {
        throw new NotFoundException(
          `El producto con ID ${id} no fue encontrado`,
        );
      }

      return {
        message: result[0].Mensaje || 'Producto desactivado correctamente',
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      if (error.message?.includes('no existe')) {
        throw new NotFoundException(
          `El producto con ID ${id} no fue encontrado`,
        );
      }
      throw new InternalServerErrorException(
        `Error al eliminar el producto: ${error.message}`,
      );
    }
  }

  /**
   * Eliminación física de un producto usando el SP sp_Productos_EliminarFisico
   */
  async removeHard(id: number): Promise<{
    message: string;
  }> {
    try {
      if (!id || id <= 0) {
        throw new BadRequestException(
          'El ID del producto debe ser un número positivo',
        );
      }

      const result = await this.sequelize.query<MensajeResult>(
        `EXEC dbo.sp_Productos_EliminarFisico @ProductoID = :ProductoID`,
        {
          replacements: { ProductoID: id },
          type: QueryTypes.SELECT,
        },
      );

      if (!result || result.length === 0) {
        throw new NotFoundException(
          `El producto con ID ${id} no fue encontrado`,
        );
      }

      return {
        message:
          result[0].Mensaje || 'Producto eliminado permanentemente',
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      if (error.message?.includes('no existe')) {
        throw new NotFoundException(
          `El producto con ID ${id} no fue encontrado`,
        );
      }
      throw new InternalServerErrorException(
        `Error al eliminar físicamente el producto: ${error.message}`,
      );
    }
  }
}
