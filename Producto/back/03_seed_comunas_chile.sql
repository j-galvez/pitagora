-- Script de Población de Regioens y Comunas de Chile
-- Basado en la estructura de IDs de la tabla 'regiones'

SET FOREIGN_KEY_CHECKS = 0;

-- Limpiar comunas previas para evitar duplicados si se vuelve a ejecutar
-- TRUNCATE TABLE comunas; -- Opcional, dependiendo de si se quiere limpiar antes

-- Regiones de Chile
INSERT INTO regiones (id_region, nombre_region) VALUES 
(1, 'Arica y Parinacota'), (2, 'Tarapacá'), (3, 'Antofagasta'), (4, 'Atacama'), 
(5, 'Coquimbo'), (6, 'Valparaíso'), (7, 'O’Higgins'), (8, 'Maule'), 
(9, 'Ñuble'), (10, 'Biobío'), (11, 'Araucanía'), (12, 'Los Ríos'), 
(13, 'Metropolitana de Santiago'), (14, 'Los Lagos'), (15, 'Aysén'), (16, 'Magallanes');

INSERT INTO comunas (id_comuna, nombre_comuna, id_region) VALUES
-- Región de Arica y Parinacota (ID: 1)
(15101, 'Arica', 1), (15102, 'Camarones', 1), (15201, 'Putre', 1), (15202, 'General Lagos', 1),

-- Región de Tarapacá (ID: 2)
(1101, 'Iquique', 2), (1107, 'Alto Hospicio', 2), (1401, 'Pozo Almonte', 2), (1402, 'Camiña', 2), (1403, 'Colchane', 2), (1404, 'Huara', 2), (1405, 'Pica', 2),

-- Región de Antofagasta (ID: 3)
(2101, 'Antofagasta', 3), (2102, 'Mejillones', 3), (2103, 'Sierra Gorda', 3), (2104, 'Taltal', 3), (2201, 'Calama', 3), (2202, 'Ollagüe', 3), (2203, 'San Pedro de Atacama', 3), (2301, 'Tocopilla', 3), (2302, 'María Elena', 3),

-- Región de Atacama (ID: 4)
(3101, 'Copiapó', 4), (3102, 'Caldera', 4), (3103, 'Tierra Amarilla', 4), (3201, 'Chañaral', 4), (3202, 'Diego de Almagro', 4), (3301, 'Vallenar', 4), (3302, 'Alto del Carmen', 4), (3303, 'Freirina', 4), (3304, 'Huasco', 4),

-- Región de Coquimbo (ID: 5)
(4101, 'La Serena', 5), (4102, 'Coquimbo', 5), (4103, 'Andacollo', 5), (4104, 'La Higuera', 5), (4105, 'Paiguano', 5), (4106, 'Vicuña', 5), (4201, 'Illapel', 5), (4202, 'Canela', 5), (4203, 'Los Vilos', 5), (4204, 'Salamanca', 5), (4301, 'Ovalle', 5), (4302, 'Combarbalá', 5), (4303, 'Monte Patria', 5), (4304, 'Punitaqui', 5), (4305, 'Río Hurtado', 5),

-- Región de Valparaíso (ID: 6)
(5101, 'Valparaíso', 6), (5102, 'Casablanca', 6), (5103, 'Concón', 6), (5104, 'Juan Fernández', 6), (5105, 'Puchuncaví', 6), (5107, 'Quintero', 6), (5109, 'Viña del Mar', 6), (5201, 'Isla de Pascua', 6), (5301, 'Los Andes', 6), (5302, 'Calle Larga', 6), (5303, 'Rinconada', 6), (5304, 'San Esteban', 6), (5401, 'La Ligua', 6), (5402, 'Cabildo', 6), (5403, 'Papudo', 6), (5404, 'Petorca', 6), (5405, 'Zapallar', 6), (5501, 'Quillota', 6), (5502, 'Calera', 6), (5503, 'Hijuelas', 6), (5504, 'La Cruz', 6), (5506, 'Nogales', 6), (5601, 'San Antonio', 6), (5602, 'Algarrobo', 6), (5603, 'Cartagena', 6), (5604, 'El Quisco', 6), (5605, 'El Tabo', 6), (5606, 'Santo Domingo', 6), (5701, 'San Felipe', 6), (5702, 'Catemu', 6), (5703, 'Llaillay', 6), (5704, 'Panquehue', 6), (5705, 'Putaendo', 6), (5706, 'Santa María', 6), (5801, 'Quilpué', 6), (5802, 'Limache', 6), (5803, 'Olmué', 6), (5804, 'Villa Alemana', 6),

-- Región de O'Higgins (ID: 7)
(6101, 'Rancagua', 7), (6102, 'Codegua', 7), (6103, 'Coinco', 7), (6104, 'Coltauco', 7), (6105, 'Doñihue', 7), (6106, 'Graneros', 7), (6107, 'Las Cabras', 7), (6108, 'Machalí', 7), (6109, 'Malloa', 7), (6110, 'Mostazal', 7), (6111, 'Olivar', 7), (6112, 'Peumo', 7), (6113, 'Pichidegua', 7), (6114, 'Quinta de Tilcoco', 7), (6115, 'Rengo', 7), (6116, 'Requínoa', 7), (6117, 'San Vicente', 7), (6201, 'Pichilemu', 7), (6202, 'La Estrella', 7), (6203, 'Litueche', 7), (6204, 'Marchihue', 7), (6205, 'Navidad', 7), (6206, 'Paredones', 7), (6301, 'San Fernando', 7), (6302, 'Chépica', 7), (6303, 'Chimbarongo', 7), (6304, 'Lolol', 7), (6305, 'Nancagua', 7), (6306, 'Palmilla', 7), (6307, 'Peralillo', 7), (6308, 'Placilla', 7), (6309, 'Pumanque', 7), (6310, 'Santa Cruz', 7),

-- Región del Maule (ID: 8)
(7101, 'Talca', 8), (7102, 'Constitución', 8), (7103, 'Curepto', 8), (7104, 'Empedrado', 8), (7105, 'Maule', 8), (7106, 'Pelarco', 8), (7107, 'Pencahue', 8), (7108, 'Río Claro', 8), (7109, 'San Clemente', 8), (7110, 'San Rafael', 8), (7201, 'Cauquenes', 8), (7202, 'Chanco', 8), (7203, 'Pelluhue', 8), (7301, 'Curicó', 8), (7302, 'Hualañé', 8), (7303, 'Licantén', 8), (7304, 'Molina', 8), (7305, 'Rauco', 8), (7306, 'Romeral', 8), (7307, 'Sagrada Familia', 8), (7308, 'Teno', 8), (7309, 'Vichuquén', 8), (7401, 'Linares', 8), (7402, 'Colbún', 8), (7403, 'Longaví', 8), (7404, 'Parral', 8), (7405, 'Retiro', 8), (7406, 'San Javier', 8), (7407, 'Villa Alegre', 8), (7408, 'Yerbas Buenas', 8),

-- Región de Ñuble (ID: 9)
(16101, 'Chillán', 9), (16102, 'Bulnes', 9), (16103, 'Chillán Viejo', 9), (16104, 'El Carmen', 9), (16105, 'Pemuco', 9), (16106, 'Pinto', 9), (16107, 'Quillón', 9), (16108, 'San Ignacio', 9), (16109, 'Yungay', 9), (16201, 'Quirihue', 9), (16202, 'Cobquecura', 9), (16203, 'Coelemu', 9), (16204, 'Ninhue', 9), (16205, 'Portezuelo', 9), (16206, 'Ránquil', 9), (16207, 'Trehuaco', 9), (16301, 'San Carlos', 9), (16302, 'Coihueco', 9), (16303, 'Ñiquén', 9), (16304, 'San Fabián', 9), (16305, 'San Nicolás', 9),

-- Región del Biobío (ID: 10)
(8101, 'Concepción', 10), (8102, 'Coronel', 10), (8103, 'Chiguayante', 10), (8104, 'Florida', 10), (8105, 'Hualqui', 10), (8106, 'Lota', 10), (8107, 'Penco', 10), (8108, 'San Pedro de la Paz', 10), (8109, 'Santa Juana', 10), (8110, 'Talcahuano', 10), (8111, 'Tomé', 10), (8112, 'Hualpén', 10), (8201, 'Lebu', 10), (8202, 'Arauco', 10), (8203, 'Cañete', 10), (8204, 'Contulmo', 10), (8205, 'Curanilahue', 10), (8206, 'Los Álamos', 10), (8207, 'Tirúa', 10), (8301, 'Los Ángeles', 10), (8302, 'Antuco', 10), (8303, 'Cabrero', 10), (8304, 'Laja', 10), (8305, 'Mulchén', 10), (8306, 'Nacimiento', 10), (8307, 'Negrete', 10), (8308, 'Quilaco', 10), (8309, 'Quilleco', 10), (8310, 'San Rosendo', 10), (8311, 'Santa Bárbara', 10), (8312, 'Tucapel', 10), (8313, 'Yumbel', 10), (8314, 'Alto Biobío', 10),

-- Región de la Araucanía (ID: 11)
(9101, 'Temuco', 11), (9102, 'Carahue', 11), (9103, 'Cunco', 11), (9104, 'Curarrehue', 11), (9105, 'Freire', 11), (9106, 'Galvarino', 11), (9107, 'Gorbea', 11), (9108, 'Lautaro', 11), (9109, 'Loncoche', 11), (9110, 'Melipeuco', 11), (9111, 'Nueva Imperial', 11), (9112, 'Padre Las Casas', 11), (9113, 'Perquenco', 11), (9114, 'Pitrufquén', 11), (9115, 'Pucón', 11), (9116, 'Saavedra', 11), (9117, 'Teodoro Schmidt', 11), (9118, 'Toltén', 11), (9119, 'Vilún', 11), (9120, 'Villarrica', 11), (9121, 'Cholchol', 11), (9201, 'Angol', 11), (9202, 'Collipulli', 11), (9203, 'Curacautín', 11), (9204, 'Ercilla', 11), (9205, 'Lonquimay', 11), (9206, 'Los Sauces', 11), (9207, 'Lumaco', 11), (9208, 'Purén', 11), (9209, 'Renaico', 11), (9210, 'Traiguén', 11), (9211, 'Victoria', 11),

-- Región de Los Ríos (ID: 12)
(14101, 'Valdivia', 12), (14102, 'Corral', 12), (14103, 'Lanco', 12), (14104, 'Los Lagos', 12), (14105, 'Máfil', 12), (14107, 'Mariquina', 12), (14108, 'Paillaco', 12), (14109, 'Panguipulli', 12), (14201, 'La Unión', 12), (14202, 'Futrono', 12), (14203, 'Lago Ranco', 12), (14204, 'Río Bueno', 12),

-- Región Metropolitana de Santiago (ID: 13)
(13101, 'Santiago', 13), (13102, 'Cerrillos', 13), (13103, 'Cerro Navia', 13), (13104, 'Conchalí', 13), (13105, 'El Bosque', 13), (13106, 'Estación Central', 13), (13107, 'Huechuraba', 13), (13108, 'Independencia', 13), (13109, 'La Cisterna', 13), (13110, 'La Florida', 13), (13111, 'La Granja', 13), (13112, 'La Pintana', 13), (13113, 'La Reina', 13), (13114, 'Las Condes', 13), (13115, 'Lo Barnechea', 13), (13116, 'Lo Espejo', 13), (13117, 'Lo Prado', 13), (13118, 'Macul', 13), (13119, 'Maipú', 13), (13120, 'Ñuñoa', 13), (13121, 'Pedro Aguirre Cerda', 13), (13122, 'Peñalolén', 13), (13123, 'Providencia', 13), (13124, 'Pudahuel', 13), (13125, 'Quilicura', 13), (13126, 'Quinta Normal', 13), (13127, 'Recoleta', 13), (13128, 'Renca', 13), (13129, 'San Joaquín', 13), (13130, 'San Miguel', 13), (13131, 'San Ramón', 13), (13132, 'Vitacura', 13), (13201, 'Puente Alto', 13), (13202, 'Pirque', 13), (13203, 'San José de Maipo', 13), (13301, 'Colina', 13), (13302, 'Lampa', 13), (13303, 'Tiltil', 13), (13401, 'San Bernardo', 13), (13402, 'Buin', 13), (13403, 'Calera de Tango', 13), (13404, 'Paine', 13), (13501, 'Melipilla', 13), (13502, 'Alhué', 13), (13503, 'Curacaví', 13), (13504, 'María Pinto', 13), (13505, 'San Pedro', 13), (13601, 'Talagante', 13), (13602, 'El Monte', 13), (13603, 'Isla de Maipo', 13), (13604, 'Padre Hurtado', 13), (13605, 'Peñaflor', 13),

-- Región de Los Lagos (ID: 14)
(10101, 'Puerto Montt', 14), (10102, 'Calbuco', 14), (10103, 'Cochamó', 14), (10104, 'Fresia', 14), (10105, 'Frutillar', 14), (10106, 'Los Muermos', 14), (10107, 'Llanquihue', 14), (10108, 'Maullín', 14), (10109, 'Puerto Varas', 14), (10201, 'Castro', 14), (10202, 'Ancud', 14), (10203, 'Chonchi', 14), (10204, 'Curaco de Vélez', 14), (10205, 'Dalcahue', 14), (10206, 'Puqueldón', 14), (10207, 'Queilén', 14), (10208, 'Quellón', 14), (10209, 'Quemchi', 14), (10210, 'Quinchao', 14), (10301, 'Osorno', 14), (10302, 'Puerto Octay', 14), (10303, 'Purranque', 14), (10304, 'Puyehue', 14), (10305, 'Río Negro', 14), (10306, 'San Juan de la Costa', 14), (10307, 'San Pablo', 14), (10401, 'Chaitén', 14), (10402, 'Futaleufú', 14), (10403, 'Hualaihué', 14), (10404, 'Palena', 14),

-- Región de Aysén del Gral. Carlos Ibáñez del Campo (ID: 15)
(11101, 'Coyhaique', 15), (11102, 'Lago Verde', 15), (11201, 'Aysén', 15), (11202, 'Cisnes', 15), (11203, 'Guaitecas', 15), (11301, 'Cochrane', 15), (11302, 'O\'Higgins', 15), (11303, 'Tortel', 15), (11401, 'Chile Chico', 15), (11402, 'Río Ibáñez', 15),

-- Región de Magallanes y de la Antártica Chilena (ID: 16)
(12101, 'Punta Arenas', 16), (12102, 'Laguna Blanca', 16), (12103, 'Río Verde', 16), (12104, 'San Gregorio', 16), (12201, 'Cabo de Hornos', 16), (12202, 'Antártica', 16), (12301, 'Porvenir', 16), (12302, 'Primavera', 16), (12303, 'Timaukel', 16), (12401, 'Natales', 16), (12402, 'Torres del Paine', 16);

SET FOREIGN_KEY_CHECKS = 1;
