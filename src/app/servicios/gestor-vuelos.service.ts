import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, retry }  from "rxjs/operators";
import { Observable, Subject, throwError } from "rxjs";
import { Aerolinea } from '../modelos/aerolinea.model';
import { Vuelo } from '../modelos/vuelo.model';
import { Aeropuerto } from '../modelos/aeropuerto.model';
import { Piloto } from '../modelos/piloto.model';
import { SegmentoVuelo } from '../modelos/segmentoVuelo.model';
import { PilotoAsignacion } from '../modelos/pilotoAsignacion.model';
import { Conexion } from '../modelos/conexion.model';
import { CuadroInformativo } from '../modelos/cuadroInformativo.model';
import { Itinerario } from '../modelos/itinerario.model';

@Injectable({
  providedIn: 'root'
})
export class GestorVuelosService {

  // UBICACION DE LA API
  URL = 'http://localhost:8089/api/v1';

  // OPCIONES HTTP
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  error = new Subject<string>();

  constructor(private http: HttpClient) {}

  /* Obtener todas las aerolineas */
  getAerolineas(): Observable<Aerolinea[]> {
    return this.http.get<Aerolinea[]>(this.URL+'/aerolineas/getAerolineas',{responseType : 'json'}).pipe(retry(1), catchError(this.handleError));
  }

  /* Obtener todos los vuelos */
  getVuelos(): Observable<Vuelo[]> {
                                      /* Cambiar la ruta al obtener la API */
    return this.http.get<Vuelo[]>(this.URL+'/index',{responseType : 'json'}).pipe(retry(1), catchError(this.handleError));
  }

  /* Registrar un nuevo vuelo */
  registrarVuelo(nuevoVuelo : Vuelo): Observable<Vuelo> {
    console.log(JSON.stringify(nuevoVuelo));
    return this.http.post<Vuelo>(
        this.URL+'/vuelos/setVuelo',
        JSON.stringify(nuevoVuelo),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  /* Registrar un nuevo segmento de vuelo */
  registrarSegmentoVuelo(nuevoSegmentVuelo : SegmentoVuelo): Observable<SegmentoVuelo> {
    console.log(JSON.stringify(nuevoSegmentVuelo));
    return this.http.post<SegmentoVuelo>(
        this.URL+'/segmentosVuelos/setSegmentoVuelo',
        JSON.stringify(nuevoSegmentVuelo),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  /* Registrar una nueva conexion */
  registrarConexion(nuevaConexion : Conexion): Observable<Conexion> {
    console.log(JSON.stringify(nuevaConexion));
    return this.http.post<Conexion>(
        this.URL+'/conexiones/setConexion',
        JSON.stringify(nuevaConexion),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  /* OBTENER EL AEROPUERTO DESTINO REFERENTE A UNA AEROLINEA, VUELO Y AEROPUERTO ORIGEN SELECCIONADO */
  getAeropuertoDestinoFromSegmentosDeVuelo
    (aerolineaConexion : string, numeroVueloConexion : string, aeropuertoOrigen : string) : Observable<string[]> {
      let queryParametros = new HttpParams();
      queryParametros = queryParametros.append("aerolinea", aerolineaConexion);
      queryParametros = queryParametros.append("numeroVuelo", numeroVueloConexion);
      queryParametros = queryParametros.append("aeropuertoOrigen", aeropuertoOrigen);
      return this.http.get<string[]>(
        this.URL+'/aeropuertos/getAeropuertoDestinoFromSegmentosDeVuelo',
        {responseType : 'json', params: queryParametros}).pipe(retry(1),
        catchError(this.handleError));
  }

  /* Obtener los vuelos de una aerolinea */
  getVuelosFromAerolinea(aerolineaSeleccionada : string): Observable<Vuelo[]> {
    let queryParametros = new HttpParams();
    queryParametros = queryParametros.append("aerolinea", aerolineaSeleccionada);
    return this.http.get<Vuelo[]>(this.URL+'/vuelos/getVuelosFromAerolinea',{responseType : 'json', params: queryParametros}).pipe(retry(1), catchError(this.handleError));
  }

  /* Obtener todos los aeropuertos */
  getAeropuertos(): Observable<Aeropuerto[]> {
    return this.http.get<Aeropuerto[]>(this.URL+'/aeropuertos/getAeropuertos',{responseType : 'json'}).pipe(retry(1), catchError(this.handleError));
  }

  /* Obtener todos los aeropuertos referentes a un vuelo (Conexion) */
  getAeropuertosFromVuelo(vueloSeleccionado : string, aeropuertosDestinoRelacionados : string[]): Observable<Aeropuerto[]> {
    let queryParametros = new HttpParams();
    queryParametros = queryParametros.append("vuelo", vueloSeleccionado);
    queryParametros = queryParametros.append("aeropuertos", aeropuertosDestinoRelacionados.join(', '));
    return this.http.get<Aeropuerto[]>(this.URL+'/aeropuertos/getAeropuertosFromVuelo',{responseType : 'json', params: queryParametros}).pipe(retry(1), catchError(this.handleError));
  }

  /* Obtener el aeropuerto destino referente a un vuelo, un aeropuerto origen y una aerolinea */
  getAeropuertoDestinoFromVuelo(vuelo : string, aeropuerto : string, aerolinea : string ) : Observable<string[]> {
    let queryParametros = new HttpParams();
    queryParametros = queryParametros.append("aerolinea", aerolinea);
    queryParametros = queryParametros.append("numeroVuelo", vuelo);
    queryParametros = queryParametros.append("aeropuertoOrigen", aeropuerto);
    return this.http.get<string[]>(this.URL+'/aeropuertos/getAeropuertoDestinoFromSegmentosDeVuelo',{responseType : 'json', params: queryParametros}).pipe(retry(1), catchError(this.handleError));
  }

  /* Obtener todos los pilotos */
  getPilotos(): Observable<Piloto[]> {
    return this.http.get<Piloto[]>(this.URL+'/pilotos/getPilotos',{responseType : 'json'}).pipe(retry(1), catchError(this.handleError));
  }

  /* Obtener todos los pilotos de una aerolinea */
  getPilotosFromAerolinea(aerolineaSelecionada : string): Observable<Piloto[]> {
    let queryParametros = new HttpParams();
    queryParametros = queryParametros.append("aerolinea", aerolineaSelecionada);
    return this.http.get<Piloto[]>(this.URL+'/pilotos/getPilotosFromAerolinea', {responseType : 'json', params: queryParametros}).pipe(retry(1), catchError(this.handleError));
  }

  /* Registrar una nueva asignacion de piloto */
  registrarAsignacionPiloto(nuevaPilotoAsignacion : PilotoAsignacion): Observable<PilotoAsignacion> {
    console.log(JSON.stringify(nuevaPilotoAsignacion));
    return this.http.post<PilotoAsignacion>(
        this.URL+'/pilotosAsignados/setAsignarPiloto',
        JSON.stringify(nuevaPilotoAsignacion),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  /* Obtener los cuadros informativos al generar un nuevo vuelo */
  getCuadrosInformativos(numeroVuelo : string, codigoAerolinea : string, codigoAeropuerto : string): Observable<CuadroInformativo[]>{
    let queryParametros = new HttpParams();
    queryParametros = queryParametros.append("numeroVuelo", numeroVuelo);
    queryParametros = queryParametros.append("codigoAerolinea", codigoAerolinea);
    queryParametros = queryParametros.append("codigoAeropuerto", codigoAeropuerto);
    return this.http.get<CuadroInformativo[]>(this.URL+'/cuadrosInformativos/getCuadrosInformativos', {responseType : 'json', params: queryParametros}).pipe(retry(1), catchError(this.handleError));
  }

  /* Obtener todos los itinerarios de vuelo */
  getItinerarios(aeropuertoOrigen: string, aeropuertoDestino : string, fechaOrigen : string): Observable<Itinerario[]>{
    let queryParametros = new HttpParams();
    queryParametros = queryParametros.append("aeropuertoOrigen", aeropuertoOrigen);
    queryParametros = queryParametros.append("aeropuertoDestino", aeropuertoDestino);
    queryParametros = queryParametros.append("fechaOrigen", fechaOrigen);
    return this.http.get<Itinerario[]>(this.URL+'/itinerario/getItinerarios', {responseType : 'json', params: queryParametros}).pipe(retry(1), catchError(this.handleError));
  }

  // Error handling
  handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }


}
