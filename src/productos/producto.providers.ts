import { Producto } from './entities/producto.entity';

export const productosProviders = [
  {
    provide: 'PRODUCTOS_REPOSITORY',
    useValue: Producto,
  },
];