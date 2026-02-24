import { Table, Column, Model, PrimaryKey, AutoIncrement, DataType, AllowNull, Default } from 'sequelize-typescript';

@Table({
    tableName: 'Productos',
    timestamps: false
})
export class Producto extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column({
        type: DataType.INTEGER,
        field: 'ProductoID'
    })
    ProductoID: number;

    @AllowNull(false)
    @Column({
        type: DataType.STRING(100),
        field: 'Nombre'
    })
    Nombre: string;

    @AllowNull(true)
    @Column({
        type: DataType.STRING(255),
        field: 'Descripcion'
    })
    Descripcion: string;

    @AllowNull(false)
    @Column({
        type: DataType.DECIMAL(10, 2),
        field: 'Precio'
    })
    Precio: number;

    @AllowNull(false)
    @Column({
        type: DataType.INTEGER,
        field: 'Stock'
    })
    Stock: number;

    @AllowNull(true)
    @Column({
        type: DataType.DATE,
        field: 'FechaCreacion'
    })
    FechaCreacion: Date;

    @AllowNull(true)
    @Column({
        type: DataType.BOOLEAN,
        field: 'Activo'
    })
    Activo: boolean;

    @AllowNull(true)
    @Column({
        type: DataType.DATE,
        field: 'FechaActualizacion'
    })
    FechaActualizacion: Date;
}
