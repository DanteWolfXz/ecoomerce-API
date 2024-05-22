    // Datos de ejemplo de productos
    const productos = [
        { 
            id: 1,
            imagen: 'Productos Cienfuegos/Cotillon/Nashville-1.jpg',
            nombre: 'Nashville x12',
            Clase: 'Nieve Artificial',
            estrellas: 5,
            Precio: 9600
        },
        { 
            imagen: 'Productos Cienfuegos/Cotillon/Nashville-2.jpg',
            nombre: 'Glitter',
            Clase: 'Brillo en Aerosol',
            estrellas: 3,
            Precio: 1500
        },
        { 
            id: 2,
            imagen: 'Productos Cienfuegos/Cotillon/Nashville-3.jpg',
            nombre: 'Pinta Pelo',
            Clase: 'Pinta Pelo Nashville',
            estrellas: 4,
            Precio: 1600
        },
        { 
            id: 3,
            imagen: 'Productos Cienfuegos/Cotillon/Nashville-4.jpg',
            nombre: 'Serpentina',
            Clase: 'Serpentina Nashville',
            estrellas: 3,
            Precio: 1500
        },
        { 
            id: 4,
            imagen: 'Productos Cienfuegos/Cotillon/Nashville-6.jpg',
            nombre: 'Bengalas de Humo',
            Clase: 'Humo',
            estrellas: 5,
            Precio: 2500
        },
        { 
            id: 5,
            imagen: 'Productos Cienfuegos/Cotillon/Nashville-5.jpg',
            nombre: 'Lanzapapeles Dorado/Pleateado',
            Clase: 'Lanzapapeles',
            estrellas: 4 ,
            Precio: 3050
        },
        { 
            id: 6,
            imagen: 'Productos Cienfuegos/Morteros/3pulgadas.jpg',
            nombre: 'Mortero 3 Pulgadas Azul',
            Clase: 'Morteros',
            estrellas: 5,
            Precio: 15000
        },
        { 
            id: 7,
            imagen: 'Productos Cienfuegos/Morteros/100luces.jpg',
            nombre: 'Mortero 100 Luces',
            Clase: 'Morteros Friendly Fire',
            estrellas: 4,
            Precio: 7600
        },
        { 
            id: 8,
            imagen: 'Productos Cienfuegos/Morteros/morterogalaxia.jpg',
            nombre: 'Galaxia 2"',
            Clase: 'Morteros',
            estrellas: 4,
            Precio: 1600
        },
        { 
            id: 9,
            imagen: 'Productos Cienfuegos/Cotillon/potehumoceleste.jpg',
            nombre: 'Pote de Humo Celeste',
            Clase: 'Humo',
            estrellas: 5,
            Precio: 9500
        },
        { 
            id: 10,
            imagen: 'Productos Cienfuegos/Cotillon/potehumoazul.jpg',
            nombre: 'Pote de Humo Azul',
            Clase: 'Humo',
            estrellas: 5,
            Precio: 9500
        },
        { 
            id: 11,
            imagen: 'Productos Cienfuegos/Cotillon/potehumorosa.jpg',
            nombre: 'Pote de Humo Rosa',
            Clase: 'Humo',
            estrellas: 5,
            Precio: 9500
        },
        { 
            id: 12,
            imagen: 'Productos Cienfuegos/Cotillon/potehumonaranja.jpg',
            nombre: 'Pote de Humo Naranja',
            Clase: 'Humo',
            estrellas: 5,
            Precio: 9500
        },
        { 
            id: 13,
            imagen: 'Productos Cienfuegos/Cotillon/potehumoblanco.jpg',
            nombre: 'Pote de Humo Blanco',
            Clase: 'Humo',
            estrellas: 5,
            Precio: 9500
        },
        { 
            id: 14,
            imagen: 'Productos Cienfuegos/Cotillon/Nashville-6.jpg',
            nombre: 'Bengalas de Humo',
            Clase: 'Humo',
            estrellas: 5,
            Precio: 2500
        },
        { 
            id: 15,
            imagen: 'Productos Cienfuegos/Chaskis/Chaski 24x30.jpg',
            nombre: 'Display Chaski Boom 24x30',
            Clase: 'Estallos',
            estrellas: 4 ,
            Precio: 14400
        },
        { 
            id: 16,
            imagen: 'Productos Cienfuegos/Chaskis/Chaski1x30.jpg',
            nombre: 'Chaski Boom 30u',
            Clase: 'Estallo',
            estrellas: 4 ,
            Precio: 750
        },
        { 
            id: 17,
            imagen: 'Productos Cienfuegos/Chaskis/Chaski1x30.jpg',
            nombre: 'Chaski Boom 30u',
            Clase: 'Estallo',
            estrellas: 5 ,
            Precio: 750
        },
        { 
            id: 18,
            imagen: 'Productos Cienfuegos/Chaskis/Chaski 100x10.jpg',
            nombre: 'Display Chaski Boom 100x10',
            Clase: 'Estallo',
            estrellas: 5,
            Precio: 25000
        },
        { 
            id: 19,
            imagen: 'Productos Cienfuegos/Chaskis/TrikiTriki100x10.jpg',
            nombre: 'Display Triki Triki 100x10',
            Clase: 'Estallo',
            estrellas: 5 ,
            Precio: 20000
        },
        { 
            id: 20,
            imagen: 'Productos Cienfuegos/Chaskis/TrikiTriki1x10.jpg',
            nombre: 'Triki Triki 1x10',
            Clase: 'Estallo',
            estrellas: 5 ,
            Precio: 300
        },
        { 
            id: 21,
            imagen: 'Productos Cienfuegos/Petardos/displaymatasuegra.jpg',
            nombre: 'Mata Suegra 1x5',
            Clase: 'Petardos',
            estrellas: 5 ,
            Precio: 3000
        },
        { 
            id: 22,
            imagen: 'Productos Cienfuegos/Petardos/matasuegra1x5.jpg',
            nombre: 'Display Mata Suegra 10x5',
            Clase: 'Petardos',
            estrellas: 5 ,
            Precio: 30000
        },
        { 
            id: 23,
            imagen: 'Productos Cienfuegos/Petardos/petardoguachin.jpg',
            nombre: 'Petardo Guachin 1x10',
            Clase: 'Petardos',
            estrellas: 4 ,
            Precio: 2500
        },
        { 
            id: 24,
            imagen: 'Productos Cienfuegos/Petardos/displayguachin.jpg',
            nombre: 'Display Petardo Guachin 12x10',
            Clase: 'Petardos',
            estrellas: 4 ,
            Precio: 30000
        },
        { 
            id: 25,
            imagen: 'Productos Cienfuegos/Morteros/fogueta 12+1.jpg',
            nombre: 'Fogueta 12+1',
            Clase: 'Morteros',
            estrellas: 5 ,
            Precio: 2500
        },
        { 
            id: 26,
            imagen: 'Productos Cienfuegos/fosforitos/bateria100.jpg',
            nombre: 'Bateria 100 tiros',
            Clase: 'Metralla',
            estrellas: 5 ,
            Precio: 1800
        },
        { 
            id: 27,
            imagen: 'Productos Cienfuegos/fosforitos/bateria200.jpg',
            nombre: 'Bateria 200 tiros',
            Clase: 'Metralla',
            estrellas: 5 ,
            Precio: 2800
        },
        { 
            id: 28,
            imagen: 'Productos Cienfuegos/morteros/mortero70luces.jpg',
            nombre: 'Mortero 70 Luces',
            Clase: 'Morteros Friendly Fire',
            estrellas: 4 ,
            Precio: 4700
        },
        { 
            id: 29,
            imagen: 'Productos Cienfuegos/morteros/fogueta15+1.jpg',
            nombre: 'Fogueta 15+1',
            Clase: 'Morteros',
            estrellas: 4 ,
            Precio: 4800
        },
        { 
            id: 30,
            imagen: 'Productos Cienfuegos/morteros/morteroverde.jpg',
            nombre: 'Mortero 3 Pulgadas Verde',
            Clase: 'Morteros',
            estrellas: 5 ,
            Precio: 16000
        },
        { 
            id: 31,
            imagen: 'Productos Cienfuegos/morteros/morteroblanco.jpg',
            nombre: 'Mortero 3 Pulgadas Blanco',
            Clase: 'Morteros',
            estrellas: 5 ,
            Precio: 16000
        },
        { 
            id: 32,
            imagen: 'Productos Cienfuegos/morteros/morteroblanco.jpg',
            nombre: 'Mortero 3 Pulgadas Blanco',
            Clase: 'Morteros',
            estrellas: 5 ,
            Precio: 16000
        },
        { 
            id: 33,
            imagen: 'Productos Cienfuegos/morteros/akilpulgadamedia.jpg',
            nombre: 'Mortero Akil 1" 1/2',
            Clase: 'Morteros',
            estrellas: 5 ,
            Precio: 2500
        },
        { 
            id: 34,
            imagen: 'Productos Cienfuegos/morteros/akil2pulgadas.jpg',
            nombre: 'Mortero Akil 2"',
            Clase: 'Morteros',
            estrellas: 5 ,
            Precio: 3200
        },
        { 
            id: 35,
            imagen: 'Productos Cienfuegos/petardos/bombonunidad.jpg',
            nombre: 'Bombon Asesino unidad',
            Clase: 'Petardos',
            estrellas: 5 ,
            Precio: 900
        },
        { 
            id: 36,
            imagen: 'Productos Cienfuegos/petardos/bombonasesino.jpg',
            nombre: 'Display Bombon Asesino x10',
            Clase: 'Petardos',
            estrellas: 5 ,
            Precio: 9500
        },
        { 
            id: 37,
            imagen: 'Productos Cienfuegos/petardos/florerito.jpg',
            nombre: 'Florerito x10',
            Clase: 'Petardos',
            estrellas: 5 ,
            Precio: 2000
        },
        { 
            id: 38,
            imagen: 'Productos Cienfuegos/petardos/dalegym.jpg',
            nombre: 'Dale Gimnasia x5',
            Clase: 'Petardos',
            estrellas: 3 ,
            Precio: 1500
        },
        { 
            id: 39,
            imagen: 'Productos Cienfuegos/petardos/superpetardon.jpg',
            nombre: 'Display Super Petardon x10',
            Clase: 'Petardos',
            estrellas: 5 ,
            Precio: 9500
        },
        { 
            id: 40,
            imagen: 'Productos Cienfuegos/petardos/kingofkingsuni.jpg',
            nombre: 'King Of Kings x10',
            Clase: 'Petardos',
            estrellas: 4 ,
            Precio: 2500
        },
        { 
            id: 41,
            imagen: 'Productos Cienfuegos/petardos/kingofkings.jpg',
            nombre: 'King Of Kings 10x10',
            Clase: 'Petardos',
            estrellas: 5 ,
            Precio: 25000
        },
        { 
            id: 42,
            imagen: 'Productos Cienfuegos/petardos/displaygimnasia.jpg',
            nombre: 'Dale Gimnasia 10x10',
            Clase: 'Petardos',
            estrellas: 3 ,
            Precio: 15000
        },
        { 
            id: 43,
            imagen: 'Productos Cienfuegos/petardos/tumbarancho.jpg',
            nombre: 'Tumba Rancho x5',
            Clase: 'Petardos',
            estrellas: 4 ,
            Precio: 2500
        },
        { 
            id: 44,
            imagen: 'Productos Cienfuegos/petardos/displayrancho.jpg',
            nombre: 'Tumba Rancho 10x5',
            Clase: 'Petardos',
            estrellas: 4 ,
            Precio: 2000
        },
        { 
            id: 45,
            imagen: 'Productos Cienfuegos/petardos/petardon.jpg',
            nombre: 'Super Petardon',
            Clase: 'Petardos',
            estrellas: 5 ,
            Precio: 950
        },
        { 
            id: 46,
            imagen: 'Productos Cienfuegos/petardos/volcanito.jpg',
            nombre: 'Volcan Coloured Flowers x5',
            Clase: 'Petardos',
            estrellas: 4 ,
            Precio: 1500
        },
        { 
            id: 47,
            imagen: 'Productos Cienfuegos/petardos/kingkonguni.jpg',
            nombre: 'King Kong x10',
            Clase: 'Petardos',
            estrellas: 4 ,
            Precio: 1500
        },
        { 
            id: 48,
            imagen: 'Productos Cienfuegos/petardos/kingkong.jpg',
            nombre: 'King Kong 10x10',
            Clase: 'Petardos',
            estrellas: 4 ,
            Precio: 15000
        },
        { 
            id: 49,
            imagen: 'Productos Cienfuegos/cracker/huevitocrack.jpg',
            nombre: 'Huevitos Cracker x6',
            Clase: 'Cracker',
            estrellas: 4 ,
            Precio: 2
        },
        { id: 50,
            imagen: 'Productos Cienfuegos/cracker/displayhuevitocrack.jpg',
            nombre: 'Display Huevitos Cracker x6',
            Clase: 'Cracker',
            estrellas: 4 ,
            Precio: 22
        },
        { 
            id: 51,
            imagen: 'Productos Cienfuegos/Vuelan/cana-silbadora.jpg',
            nombre: 'Display Caña Silbadora 12x12(JP)',
            Clase: 'Cañas Voladoras',
            estrellas: 3,
            Precio: 19600
        },
        { 
            id: 52,
            imagen: 'Productos Cienfuegos/Vuelan/caña-cf.jpg',
            nombre: 'Display Caña Silbadora 12x12(CF)',
            Clase: 'Cañas Voladoras',
            estrellas: 4,
            Precio: 21600
        },
        { 
            id: 53,
            imagen: 'Productos Cienfuegos/Vuelan/cañitaJP.jpg',
            nombre: 'Caña Silbadora x12(JP)',
            Clase: 'Cañas Voladoras',
            estrellas: 3,
            Precio: 1800
        },
        { 
            id: 54,
            imagen: 'Productos Cienfuegos/Vuelan/cañitaCF.jpg',
            nombre: 'Caña Silbadora x12(CF)',
            Clase: 'Cañas Voladoras',
            estrellas: 4,
            Precio: 1800
        },
        { 
            id: 55,
            imagen: 'Productos Cienfuegos/Vuelan/displaytrestiros.jpg',
            nombre: 'Display 3 Tiros Brazilero 4x3',
            Clase: 'Tres Tiros',
            estrellas: 5,
            Precio: 20000
        },
        { 
            id: 56,
            imagen: 'Productos Cienfuegos/Vuelan/displayabejitas.jpg',
            nombre: 'Display Abejtias 24x12',
            Clase: 'Abejitas',
            estrellas: 4,
            Precio: 2000
        },
        { 
            id: 57,
            imagen: 'Productos Cienfuegos/Vuelan/abejitas.jpg',
            nombre: 'Abejtias x12',
            Clase: 'Abejitas',
            estrellas: 4,
            Precio: 48000
        },
        { 
            id: 58,
            imagen: 'Productos Cienfuegos/Vuelan/carnaval.jpg',
            nombre: 'Mini Torta Carnaval',
            Clase: 'Tortitas',
            estrellas: 3,
            Precio: 2500
        },
        { 
            id: 59,
            imagen: 'Productos Cienfuegos/Vuelan/pirata.jpg',
            nombre: 'Mini Torta Pirata',
            Clase: 'Tortitas',
            estrellas: 4,
            Precio: 4900
        },
        { 
            id: 60,
            imagen: 'Productos Cienfuegos/Vuelan/avion.jpg',
            nombre: 'Avion Nocturno',
            Clase: 'Tortitas',
            estrellas: 4,
            Precio: 2500
        },
        { 
            id: 61,
            imagen: 'Productos Cienfuegos/Vuelan/base25.jpg',
            nombre: 'Base Misil 25 T.',
            Clase: 'Base Misil',
            estrellas: 4,
            Precio: 2500
        },
        { 
            id: 62,
            imagen: 'Productos Cienfuegos/Vuelan/base49.jpg',
            nombre: 'Base Misil 49 T.',
            Clase: 'Base Misil',
            estrellas: 4,
            Precio: 5000
        },
        { 
            id: 63,
            imagen: 'Productos Cienfuegos/Vuelan/base100.jpg',
            nombre: 'Base Misil 100 T.',
            Clase: 'Base Misil',
            estrellas: 4,
            Precio: 7500
        },
        { 
            id: 64,
            imagen: 'Productos Cienfuegos/Vuelan/ninja4.jpg',
            nombre: 'Ninja 4 fosforitos/Tattoo',
            Clase: 'Fosforito',
            estrellas: 4,
            Precio: 400
        },
        { 
            id: 65,
            imagen: 'Productos Cienfuegos/petardos/diamante.jpg',
            nombre: 'Diamante Mortal x6',
            Clase: 'Petardos',
            estrellas: 4,
            Precio: 6500
        },
        { 
            id: 66,
            imagen: 'Productos Cienfuegos/petardos/bola.jpg',
            nombre: 'Bola',
            Clase: 'Petardos',
            estrellas: 4,
            Precio: 1500
        },
        { 
            id: 67,
            imagen: 'Productos Cienfuegos/petardos/displaybola.jpg',
            nombre: 'Display Bola x12',
            Clase: 'Petardos',
            estrellas: 4,
            Precio: 18000
        },
        { 
            id: 68,
            imagen: 'Productos Cienfuegos/Morteros Recargables/shell.jpg',
            nombre: 'Mortero Artillery Shell 6 bombas',
            Clase: 'Morteros Recargables',
            estrellas: 4,
            Precio: 18900
        },
        { 
            id: 68,
            imagen: 'Productos Cienfuegos/Morteros Recargables/africa.jpg',
            nombre: 'BOMBA AFRICANA 6 bombas',
            Clase: 'Morteros Recargables',
            estrellas: 4,
            Precio: 18900
        },
    ];

