export class Aeropuerto{
  constructor(
    public airport_AirportCode_PK : string,
    public airporttype_AirportType_FK : string,
    public airport_AirportName : string,
    public place_IdPlace_FK ?: string
  ){}
}
