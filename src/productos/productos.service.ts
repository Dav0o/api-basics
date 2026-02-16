import { Injectable, Inject } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Producto } from './entities/producto.entity';

@Injectable()
export class ProductosService {
  constructor(
    @Inject('PRODUCTOS_REPOSITORY')
    private productosProviders: typeof Producto
  ) {}

  async findAll(): Promise<Producto[]> {
    return this.productosProviders.findAll<Producto>();
  }

 
}
