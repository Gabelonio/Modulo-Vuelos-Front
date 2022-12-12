export class SegmentoItinerario{
    constructor(
      public vueloOrigen: string,
      public aeropuertoOrigen: string,
      public ciudadOrigen : string,
      public divisionOrigen: string,
      public paisOrigen: string,
      public fechaOrigen : Date,
      public horaOrigen : string,
      public vueloDestino : string,
      public aeropuertoDestino : string,
      public ciudadDestino : string,
      public divisionDestino : string,
      public paisDestino : string,
      public fechaDestino : Date,
      public horaDestino : string
    ){}
}
