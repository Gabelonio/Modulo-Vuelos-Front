import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, retry }  from "rxjs/operators";
import { Observable, Subject, throwError } from "rxjs";
import { Aerolinea } from '../modelos/aerolinea.model';
import { Vuelo } from '../modelos/vuelo.model';
import { Aeropuerto } from '../modelos/aeropuerto.model';
import { Piloto } from '../modelos/piloto.model';

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
  /* SELECT * FROM AIRLINE; */
  getAerolineas(): Observable<Aerolinea[]> {
    return this.http.get<Aerolinea[]>(this.URL+'/aerolineas/getAerolineas',{responseType : 'json'}).pipe(retry(1), catchError(this.handleError));
  }

  /* Obtener todas las aerolineas */
  /* SELECT * FROM FLIGHT; */
  getVuelos(): Observable<Vuelo[]> {
                                      /* Cambiar la ruta al obtener la API */
    return this.http.get<Vuelo[]>(this.URL+'/index',{responseType : 'json'}).pipe(retry(1), catchError(this.handleError));
  }

  /* Obtener los vuelos de una aerolinea */
  /* SELECT * FROM FLIGHT WHERE FLIGHT_AIRLINECODE_PK = {{valorseleccionado}}; */
  getVuelosFromAerolinea(aerolineaSeleccionada : string): Observable<Vuelo[]> {
    /* Cambiar la ruta al obtener la API */
    let queryParametros = new HttpParams();
    queryParametros = queryParametros.append("aerolinea", aerolineaSeleccionada);
    return this.http.get<Vuelo[]>(this.URL+'/vuelos/getVuelosFromAerolinea',{responseType : 'json', params: queryParametros}).pipe(retry(1), catchError(this.handleError));
  }

  /* Obtener todos los aeropuertos */
  /* SELECT * FROM AIRPORT; */
  getAeropuertos(): Observable<Aeropuerto[]> {
                                      /* Cambiar la ruta al obtener la API */
    return this.http.get<Aeropuerto[]>(this.URL+'/aeropuertos/getAeropuertos',{responseType : 'json'}).pipe(retry(1), catchError(this.handleError));
  }

  /* Obtener todos los aeropuertos referentes a un vuelo*/
  /* SELECT * FROM AIRPORT WHERE AIRPORTCODE LIKE {{UN SUBQUERY QUE SE REALIZA A TRAVES DEL VUELO SELECCIONADO Y LOS SEGMENTOS DE VUELO QUE COINCIDEN}}; */
  getAeropuertosFromVuelo(vueloSeleccionado : string): Observable<Aeropuerto[]> {
    /* Cambiar la ruta al obtener la API */
    let queryParametros = new HttpParams();
    queryParametros = queryParametros.append("vuelo", vueloSeleccionado);
    return this.http.get<Aeropuerto[]>(this.URL+'/aeropuertos/getAeropuertosFromVuelo',{responseType : 'json', params: queryParametros}).pipe(retry(1), catchError(this.handleError));
  }

  /* Obtener todas las aerolineas */
  /* SELECT * FROM PILOT; */
  getPilotos(): Observable<Piloto[]> {
                                      /* Cambiar la ruta al obtener la API */
    return this.http.get<Piloto[]>(this.URL+'/pilotos/getPilotos',{responseType : 'json'}).pipe(retry(1), catchError(this.handleError));
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




  /* Obtener todos los empleados */
/*   getEmpleados(): Observable<Empleado[]> {
    /* EN ESTA SECCION SE UBICARIARIA OBTENCION DE TODOS LOS EMPLEADOS A TRAVES DE UNA CONSULTA
    return this.http.get<Empleado[]>(this.URL+'/index',{responseType : 'json'}).pipe(retry(1), catchError(this.handleError));
        }), catchError( errorResponse => {
            return throwError(errorResponse);
    });
  }

  // HttpClient API get() method => Fetch employee
/*   getEmpleado(idEmpleado : number): Observable<Empleado> {
    return this.http.get<Empleado>(this.URL + '/Empleado/' + idEmpleado).pipe(retry(1), catchError(this.handleError));
  } */

  /* Registro Empleado Nuevo */
/*   registrarEmpleado(nuevoEmpleado : Empleado): Observable<Empleado> {
    console.log(JSON.stringify(nuevoEmpleado));
    return this.http.post<Empleado>(
        this.URL+'/formInsertar',
        JSON.stringify(nuevoEmpleado),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  } */

  // HttpClient API put() method => Update employee
/*   actualizarEmpleado(nuevaInformacion : Empleado): Observable<Empleado> {
    return this.http
      .put<Empleado>(
        this.URL + '/modificar/' + nuevaInformacion.idEmpleado,
        JSON.stringify(nuevaInformacion),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  } */
}
