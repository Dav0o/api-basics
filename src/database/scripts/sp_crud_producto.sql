-- =============================================
-- 1. CREATE - Insertar un nuevo producto
-- =============================================
CREATE OR ALTER PROCEDURE dbo.sp_Productos_Insertar
    @Nombre         NVARCHAR(100),
    @Descripcion    NVARCHAR(255)   = NULL,
    @Precio         DECIMAL(10,2),
    @Stock          INT,
    @Activo         BIT             = 1,
    @NuevoID        INT             = NULL OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

            INSERT INTO dbo.Productos (Nombre, Descripcion, Precio, Stock, FechaCreacion, Activo)
            VALUES (@Nombre, @Descripcion, @Precio, @Stock, GETDATE(), @Activo);

            SET @NuevoID = SCOPE_IDENTITY();

        COMMIT TRANSACTION;

        -- Retornar el producto creado
        SELECT ProductoID, Nombre, Descripcion, Precio, Stock, FechaCreacion, Activo
        FROM dbo.Productos
        WHERE ProductoID = @NuevoID;

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        THROW;  -- Re-lanza el error original
    END CATCH
END;
GO

-- =============================================
-- 2. READ - Obtener productos
-- =============================================

-- 2a. Obtener un producto por ID
CREATE OR ALTER PROCEDURE dbo.sp_Productos_ObtenerPorID
    @ProductoID INT
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM dbo.Productos WHERE ProductoID = @ProductoID)
    BEGIN
        RAISERROR('El producto con ID %d no existe.', 16, 1, @ProductoID);
        RETURN;
    END

    SELECT ProductoID, Nombre, Descripcion, Precio, Stock, 
           FechaCreacion, Activo, FechaActualizacion
    FROM dbo.Productos
    WHERE ProductoID = @ProductoID;
END;
GO

-- 2b. Listar productos con filtros opcionales y paginación
CREATE OR ALTER PROCEDURE dbo.sp_Productos_Listar
    @Nombre         NVARCHAR(100)   = NULL,
    @SoloActivos    BIT             = 1,
    @PrecioMinimo   DECIMAL(10,2)   = NULL,
    @PrecioMaximo   DECIMAL(10,2)   = NULL,
    @PageNumber     INT             = 1,
    @PageSize       INT             = 20
AS
BEGIN
    SET NOCOUNT ON;

    -- Validar parámetros de paginación
    IF @PageNumber < 1 SET @PageNumber = 1;
    IF @PageSize < 1 OR @PageSize > 100 SET @PageSize = 20;

    SELECT ProductoID, Nombre, Descripcion, Precio, Stock, 
           FechaCreacion, Activo, FechaActualizacion
    FROM dbo.Productos
    WHERE (@SoloActivos = 0 OR Activo = 1)
      AND (@Nombre IS NULL OR Nombre LIKE '%' + @Nombre + '%')
      AND (@PrecioMinimo IS NULL OR Precio >= @PrecioMinimo)
      AND (@PrecioMaximo IS NULL OR Precio <= @PrecioMaximo)
    ORDER BY ProductoID
    OFFSET (@PageNumber - 1) * @PageSize ROWS
    FETCH NEXT @PageSize ROWS ONLY;
END;
GO

-- =============================================
-- 3. UPDATE - Actualizar un producto
-- =============================================
CREATE OR ALTER PROCEDURE dbo.sp_Productos_Actualizar
    @ProductoID     INT,
    @Nombre         NVARCHAR(100)   = NULL,
    @Descripcion    NVARCHAR(255)   = NULL,
    @Precio         DECIMAL(10,2)   = NULL,
    @Stock          INT             = NULL,
    @Activo         BIT             = NULL
AS
BEGIN
    SET NOCOUNT ON;

    -- Validar que el producto existe
    IF NOT EXISTS (SELECT 1 FROM dbo.Productos WHERE ProductoID = @ProductoID)
    BEGIN
        RAISERROR('El producto con ID %d no existe.', 16, 1, @ProductoID);
        RETURN;
    END

    BEGIN TRY
        BEGIN TRANSACTION;

            -- Solo actualiza las columnas que reciben valor (no NULL)
            UPDATE dbo.Productos
            SET Nombre       = ISNULL(@Nombre, Nombre),
                Descripcion  = ISNULL(@Descripcion, Descripcion),
                Precio       = ISNULL(@Precio, Precio),
                Stock        = ISNULL(@Stock, Stock),
                Activo       = ISNULL(@Activo, Activo),
                FechaActualizacion = GETDATE()
            WHERE ProductoID = @ProductoID;

        COMMIT TRANSACTION;

        -- Retornar el producto actualizado
        SELECT ProductoID, Nombre, Descripcion, Precio, Stock, 
               FechaCreacion, Activo, FechaActualizacion
        FROM dbo.Productos
        WHERE ProductoID = @ProductoID;

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        THROW;
    END CATCH
END;
GO

-- =============================================
-- 4. DELETE - Soft Delete (recomendado)
-- =============================================
CREATE OR ALTER PROCEDURE dbo.sp_Productos_Eliminar
    @ProductoID INT
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM dbo.Productos WHERE ProductoID = @ProductoID)
    BEGIN
        RAISERROR('El producto con ID %d no existe.', 16, 1, @ProductoID);
        RETURN;
    END

    BEGIN TRY
        BEGIN TRANSACTION;

            -- Soft delete: marca como inactivo en vez de borrar
            UPDATE dbo.Productos
            SET Activo = 0,
                FechaActualizacion = GETDATE()
            WHERE ProductoID = @ProductoID;

        COMMIT TRANSACTION;

        SELECT 'Producto desactivado correctamente.' AS Mensaje;

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        THROW;
    END CATCH
END;
GO

-- =============================================
-- 5. DELETE FÍSICO (opcional, usar con precaución)
-- =============================================
CREATE OR ALTER PROCEDURE dbo.sp_Productos_EliminarFisico
    @ProductoID INT
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM dbo.Productos WHERE ProductoID = @ProductoID)
    BEGIN
        RAISERROR('El producto con ID %d no existe.', 16, 1, @ProductoID);
        RETURN;
    END

    BEGIN TRY
        BEGIN TRANSACTION;

            DELETE FROM dbo.Productos
            WHERE ProductoID = @ProductoID;

        COMMIT TRANSACTION;

        SELECT 'Producto eliminado permanentemente.' AS Mensaje;

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        THROW;
    END CATCH
END;
GO