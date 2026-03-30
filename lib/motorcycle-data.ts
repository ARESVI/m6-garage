// Popüler motosiklet markaları ve modelleri
export const motorcycleBrands = {
  Honda: [
    'CBR150R', 'CBR250R', 'CBR500R', 'CBR600RR', 'CBR1000RR',
    'CB125F', 'CB150R', 'CB300R', 'CB500F', 'CB650R', 'CB1000R',
    'CRF250L', 'CRF450L', 'Africa Twin', 'Gold Wing', 'PCX125', 'PCX150',
    'SH125i', 'SH150i', 'SH300i', 'Forza 300', 'Forza 750'
  ],
  Yamaha: [
    'YZF-R125', 'YZF-R15', 'YZF-R25', 'YZF-R3', 'YZF-R6', 'YZF-R1',
    'MT-03', 'MT-07', 'MT-09', 'MT-10', 'MT-125', 'MT-15',
    'FZ25', 'FZ-S', 'XSR700', 'XSR900', 'Tracer 700', 'Tracer 900',
    'Tenere 700', 'NMAX 125', 'NMAX 155', 'XMAX 300', 'TMAX 560'
  ],
  Kawasaki: [
    'Ninja 250', 'Ninja 300', 'Ninja 400', 'Ninja 650', 'Ninja ZX-6R', 'Ninja ZX-10R',
    'Z125', 'Z250', 'Z400', 'Z650', 'Z900', 'Z1000',
    'Versys 650', 'Versys 1000', 'Vulcan S', 'W800'
  ],
  Suzuki: [
    'GSX-R125', 'GSX-R150', 'GSX-R600', 'GSX-R750', 'GSX-R1000',
    'GSX-S125', 'GSX-S150', 'GSX-S750', 'GSX-S1000',
    'V-Strom 650', 'V-Strom 1050', 'Hayabusa', 'Burgman 125', 'Burgman 400'
  ],
  BMW: [
    'G 310 R', 'G 310 GS', 'F 750 GS', 'F 850 GS', 'F 900 R', 'F 900 XR',
    'R 1250 GS', 'R 1250 RT', 'S 1000 RR', 'S 1000 XR',
    'C 400 X', 'C 400 GT', 'CE 04'
  ],
  KTM: [
    '125 Duke', '200 Duke', '250 Duke', '390 Duke', '790 Duke', '890 Duke', '1290 Super Duke',
    'RC 125', 'RC 200', 'RC 390',
    '390 Adventure', '790 Adventure', '890 Adventure', '1290 Super Adventure'
  ],
  Ducati: [
    'Monster 797', 'Monster 821', 'Monster 1200',
    'Panigale V2', 'Panigale V4', 'SuperSport 950',
    'Multistrada 950', 'Multistrada V4', 'Scrambler Icon', 'Scrambler Desert Sled',
    'Diavel 1260', 'XDiavel'
  ],
  Triumph: [
    'Street Triple 765', 'Speed Triple 1200', 'Trident 660',
    'Bonneville T100', 'Bonneville T120', 'Scrambler 900', 'Scrambler 1200',
    'Tiger 900', 'Tiger 1200', 'Rocket 3'
  ],
  Aprilia: [
    'RS 125', 'RS 660', 'RSV4', 'Tuono 660', 'Tuono V4',
    'SR GT 125', 'SR GT 200', 'SXR 160'
  ],
  'Harley-Davidson': [
    'Street 750', 'Street Rod 750', 'Iron 883', 'Forty-Eight',
    'Sportster S', 'Fat Boy', 'Softail Standard', 'Low Rider S',
    'Road King', 'Street Glide', 'Road Glide', 'Pan America 1250'
  ],
  'Royal Enfield': [
    'Classic 350', 'Classic 500', 'Bullet 350', 'Bullet 500',
    'Meteor 350', 'Interceptor 650', 'Continental GT 650',
    'Himalayan', 'Scram 411'
  ],
  Benelli: [
    'TNT 125', 'TNT 150', 'TNT 249', 'TNT 300', 'TNT 600',
    'TRK 251', 'TRK 502', 'Leoncino 250', 'Leoncino 500'
  ],
  CFMoto: [
    '150NK', '250NK', '300NK', '400NK', '450NK', '650NK', '700NK', '800NK',
    '250SR', '300SR', '400SR', '450SR', '450SR-S',
    '250CL-X', '300CL-X', '450CL-C', '450CL-X', '700CL-X', '700CL-X Heritage', '700CL-X Sport',
    '300SS', '450SS',
    '450MT', '650MT', '800MT', '800MT Touring', '800MT Sport',
    '400GT', '650GT',
    'ST Papio', 'Ibex 450', 'Ibex 800'
  ],
  Kymco: [
    'Agility 125', 'Like 125', 'Like 150', 'People S 125', 'People S 150',
    'Downtown 300i', 'AK 550', 'Xciting S 400'
  ],
  Vespa: [
    'Primavera 50', 'Primavera 125', 'Primavera 150',
    'Sprint 50', 'Sprint 125', 'Sprint 150',
    'GTS 125', 'GTS 300', 'GTS Super 300'
  ],
  Piaggio: [
    'Liberty 50', 'Liberty 125', 'Liberty 150',
    'Medley 125', 'Medley 150', 'Beverly 300', 'Beverly 400',
    'MP3 300', 'MP3 500'
  ]
};

export const getBrands = () => Object.keys(motorcycleBrands).sort();

export const getModels = (brand: string) => {
  return motorcycleBrands[brand as keyof typeof motorcycleBrands] || [];
};
