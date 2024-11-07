
-- Tabla CLIENTE
CREATE TABLE CLIENTE (
    idCliente INT PRIMARY KEY AUTO_INCREMENT,
    Documento NVARCHAR(20) NOT NULL,
    NombreCompleto NVARCHAR(100) NOT NULL,
    Correo NVARCHAR(100),
    Telefono NVARCHAR(20),
    Estado BIT DEFAULT 1,
    FechaRegistro DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla USUARIO
CREATE TABLE USUARIO (
    idUsuario INT PRIMARY KEY AUTO_INCREMENT,
    Documento NVARCHAR(20) NOT NULL UNIQUE,
    NombreCompleto NVARCHAR(100) NOT NULL,
    Correo NVARCHAR(100),
    Telefono NVARCHAR(20),
    Clave NVARCHAR(255) NOT NULL,
    Estado BIT DEFAULT 1,
    FechaRegistro DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla ROL
CREATE TABLE ROL (
    idRol INT PRIMARY KEY AUTO_INCREMENT,
    Descripcion NVARCHAR(50) NOT NULL,
    FechaRegistro DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla PERMISO
CREATE TABLE PERMISO (
    idPermiso INT PRIMARY KEY AUTO_INCREMENT,
    idRol INT,
    NombreMenu NVARCHAR(50) NOT NULL,
    FechaRegistro DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idRol) REFERENCES ROL(idRol)
);

-- Tabla SUCURSAL
CREATE TABLE SUCURSAL (
    idSucursal INT PRIMARY KEY AUTO_INCREMENT,
    Nombre NVARCHAR(100) NOT NULL,
    Direccion NVARCHAR(200),
    Telefono NVARCHAR(20),
    FechaRegistro DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla CATEGORIA
CREATE TABLE CATEGORIA (
    idCategoria INT PRIMARY KEY AUTO_INCREMENT,
    Descripcion NVARCHAR(100) NOT NULL,
    Estado BIT DEFAULT 1,
    FechaRegistro DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla PRODUCTO
CREATE TABLE PRODUCTO (
    idProducto INT PRIMARY KEY AUTO_INCREMENT,
    Codigo NVARCHAR(50) NOT NULL UNIQUE,
    Nombre NVARCHAR(100) NOT NULL,
    Descripcion NVARCHAR(200),
    idCategoria INT,
    PrecioCompra DECIMAL(18, 2) NOT NULL,
    PrecioVenta DECIMAL(18, 2) NOT NULL,
    Stock INT NOT NULL,
    Estado BIT DEFAULT 1,
    FechaRegistro DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idCategoria) REFERENCES CATEGORIA(idCategoria)
);

-- Tabla STOCK
CREATE TABLE STOCK (
    idStock INT PRIMARY KEY AUTO_INCREMENT,
    idProducto INT,
    idSucursal INT,
    Cantidad INT NOT NULL,
    FechaRegistro DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idProducto) REFERENCES PRODUCTO(idProducto),
    FOREIGN KEY (idSucursal) REFERENCES SUCURSAL(idSucursal)
);

-- Tabla VENTA
CREATE TABLE VENTA (
    idVenta INT PRIMARY KEY AUTO_INCREMENT,
    idUsuario INT,
    idCliente INT,
    TipoDocumento NVARCHAR(20),
    NumeroDocumento NVARCHAR(20),
    MontoCambio DECIMAL(18, 2),
    MontoPago DECIMAL(18, 2),
    MontoTotal DECIMAL(18, 2),
    FechaRegistro DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idUsuario) REFERENCES USUARIO(idUsuario),
    FOREIGN KEY (idCliente) REFERENCES CLIENTE(idCliente)
);

-- Tabla DETALLE VENTA
CREATE TABLE DETALLE_VENTA (
    idDetalleVenta INT PRIMARY KEY AUTO_INCREMENT,
    idVenta INT,
    idProducto INT,
    PrecioVenta DECIMAL(18, 2) NOT NULL,
    Cantidad INT NOT NULL,
    SubTotal DECIMAL(18, 2) AS (PrecioVenta * Cantidad) STORED,
    FechaRegistro DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idVenta) REFERENCES VENTA(idVenta),
    FOREIGN KEY (idProducto) REFERENCES PRODUCTO(idProducto)
);

-- Tabla REPORTE
CREATE TABLE REPORTE (
    idReporte INT PRIMARY KEY AUTO_INCREMENT,
    idUsuario INT,
    idSucursal INT,
    TipoReporte NVARCHAR(50) NOT NULL,
    Descripcion NVARCHAR(200),
    FechaRegistro DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idUsuario) REFERENCES USUARIO(idUsuario),
    FOREIGN KEY (idSucursal) REFERENCES SUCURSAL(idSucursal)
);
-- Añadir la columna idRol a la tabla USUARIO
ALTER TABLE USUARIO
ADD idRol INT,
ADD FOREIGN KEY (idRol) REFERENCES ROL(idRol);

-- Insertar roles
INSERT INTO ROL (Descripcion) VALUES ('admin'), ('empleado');

-- Crear un usuario admin y un usuario empleado
INSERT INTO USUARIO (Documento, NombreCompleto, Correo, Telefono, Clave, idRol)
VALUES 
('44742694', 'Matias Luecena', 'matute@example.com', '1234567890', '1234', 1),
('45516905', 'Sebastian Juncos', 'gonzalito@example.com', '0987654321', '12345', 2);

SELECT * FROM USUARIO
DELETE FROM USUARIO
WHERE Documento IN ('adminDoc', 'empleadoDoc');


