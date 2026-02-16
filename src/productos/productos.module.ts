import { Module } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { productosProviders } from './producto.providers';

@Module({
  controllers: [ProductosController],
  providers: [ProductosService, ...productosProviders],
})
export class ProductosModule {}
