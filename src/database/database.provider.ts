import { Sequelize } from 'sequelize-typescript';
import { Producto } from 'src/productos/entities/producto.entity';

/**
 * SEQUELIZE variable is stored in a file named
 * 'constants' so it can be easily reused anywhere
 * without being subject to human error.
 */

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'mssql',
        host: 'localhost',
        port: 1433,
        username: 'david',
        password: '1234',
        database: 'ClaseProcedimientos',
        dialectOptions: {
          options: {
            trustServerCertificate: true,
            encrypt: false,
          },
        },
        define: {
          freezeTableName: true,
          createdAt: false,
          updatedAt: false,
        },
      });

      /**
       * Add Models Here
       * ===============
       * You can add the models to
       * Sequelize later on.
       */
      sequelize.addModels([Producto]);

      // await sequelize.sync();
      return sequelize;
    },
  },
];