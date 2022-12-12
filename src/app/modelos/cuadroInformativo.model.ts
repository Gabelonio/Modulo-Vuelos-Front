export class CuadroInformativo{
    constructor(
      public numero_vuelo: string,
      public aerolinea_vuelo: string,
      public nombre_aerolinea : string,
      public nombre_aeropuerto: string,
      public ciudad_aeropuerto: string,
      public descripcion_division_aeropuerto : string,
      public nombre_division_aeropuerto: string,
      public nombre_pais_aeropuerto: string,
      public fecha_vuelo : Date,
      public duracion_vuelo: string,
      public nombre_piloto: string,
    ){}
}
