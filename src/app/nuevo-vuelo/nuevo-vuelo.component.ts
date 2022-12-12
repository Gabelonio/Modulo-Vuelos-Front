import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GestorVuelosService } from '../servicios/gestor-vuelos.service';
import { Aerolinea } from '../modelos/aerolinea.model';
import { Aeropuerto } from '../modelos/aeropuerto.model';
import { Piloto } from '../modelos/piloto.model';
import { Vuelo } from '../modelos/vuelo.model';
import { SegmentoVuelo } from '../modelos/segmentoVuelo.model';
import { PilotoAsignacion } from '../modelos/pilotoAsignacion.model';
import { Conexion } from '../modelos/conexion.model';
import { CuadroInformativo } from '../modelos/cuadroInformativo.model';


@Component({
  selector: 'app-nuevo-vuelo',
  templateUrl: './nuevo-vuelo.component.html',
  styleUrls: ['./nuevo-vuelo.component.css']
})
export class NuevoVueloComponent implements OnInit, OnDestroy {

  /* Variables para gestionar el funcionamiento de los diferentes formularios */
  public isConexionHabilitada : boolean = false;
  public isSegmentosDisponibles : boolean = false;
  public isConexionDisponible : boolean = false;
  public clickeadoGenerado : boolean = false;
  public numeroFormulariosSegmentos : number = 0;
  public registroConexionRealizada : boolean = false;
  public isRegistroCuadrosNuevoVueloRealizado : boolean = false;
  public isRegistroCuadrosConexionRealizado : boolean = false;

  /* Variables que gestionan el funcionamiento de los llamados desde la base de datos hasta la vista */
  public airlinesSuscripcion : Subscription;
  public aerolineasCargadas : Aerolinea[] = [];
  public airportsSuscripcion : Subscription;
  public aeropuertosCargados : Aeropuerto[] = [];
  public pilotsSuscripcion : Subscription;
  public pilotosCargados : Piloto[] = [];
  public cuadrosInformativosNuevoVuelo : CuadroInformativo[] = [];
  public cuadrosInformativosConexion : CuadroInformativo[] = [];
  /* ================================================================================================ */
  public vuelosFromAerolinea : Vuelo[] = [];
  public vuelosSuscripcion: Subscription;
  public aeropuertosFromVuelo : Aeropuerto[] = [];

  cambiarConexionHabilitada(habilitado : boolean){
    this.isConexionHabilitada = habilitado;
  }

  generarFormulariosSegmentos(){
    this.clickeadoGenerado = true;
    this.numeroFormulariosSegmentos = this.formularioNuevoVuelo.value['numeroSegmentos'] + 1;
    for(let i = 0;i < this.formularioNuevoVuelo.value['numeroSegmentos'] + 1;i++){
      this.agregarSegmento(i === this.formularioNuevoVuelo.value['numeroSegmentos']);
    }
  }
  private agregarSegmento(isUltimoSegmento : boolean) {
    const segmentos = this.formularioSegmentos.get('segmentos') as FormArray;
    segmentos.push((isUltimoSegmento)?this.createUltimoSegmentoFormGroup():this.createSegmentoFormGroup());
  }
  private createSegmentoFormGroup(): FormGroup {
    return new FormGroup({
      'aeropuerto': new FormControl('', Validators.required),
      'horasVuelo': new FormControl( 1, Validators.required),
      'piloto' : new FormControl('', Validators.required)
    })
  }
  private createUltimoSegmentoFormGroup(): FormGroup {
    return new FormGroup({
      'aeropuerto': new FormControl('', Validators.required),
      'horasVuelo': new FormControl( 1,),
      'piloto' : new FormControl('',)
    })
  }

  public asignarNumeroVuelo(evento : Event){
    /* OBTENCION DE LOS VUELOS AL SELECCIONAR UNA AEROLINEA y SE ASIGNA SEGUN LA CANTIDAD DE VUELOS REALIZADOS*/
    this.gestorVuelosService.getVuelosFromAerolinea(
      this.formularioNuevoVuelo.value['nuevoVueloAerolinea']).subscribe((vuelos) => {
      const numeroNuevoVuelo = ((vuelos.length+1) >= 100)
                                ?(vuelos.length+1)
                                  :(vuelos.length+1 >= 10)
                                    ?'0' + (vuelos.length+1)
                                      :'00' + (vuelos.length+1);
      this.formularioNuevoVuelo.patchValue({nuevoVueloNumeroVuelo : numeroNuevoVuelo});
    });
  }
  public getPilotosFromAerolinea(evento : Event){
    this.gestorVuelosService.getPilotosFromAerolinea(
      this.formularioNuevoVuelo.value['nuevoVueloAerolinea']).subscribe((pilotos) => {
        this.pilotosCargados = pilotos;
      });
  }
  public getVuelosFromAerolinea(evento : Event){
    /* OBTENCION DE LOS VUELOS AL SELECCIONAR UNA AEROLINEA */
    this.gestorVuelosService.getVuelosFromAerolinea(
      this.formularioConexion.value['conexionAerolinea']).subscribe((vuelos) => {
      this.vuelosFromAerolinea = vuelos;
    });
  }
  public getAeropuertosFromVuelo(evento : Event){
    let aeropuertosDestinoSeleccionados : string [] = [];
    for(let i = 1 ; i < this.formularioSegmentos.value['segmentos'].length; i++ ){
      aeropuertosDestinoSeleccionados.push(this.formularioSegmentos.value['segmentos'][i]['aeropuerto']);
    }
    /* OBTENCION DE LOS AEROPUERTOS AL SELECCIONAR UN VUELO */
    this.gestorVuelosService.getAeropuertosFromVuelo(
      this.formularioConexion.value['conexionNumeroVuelo'], aeropuertosDestinoSeleccionados).subscribe((aeropuertos)=> {
        this.aeropuertosFromVuelo = aeropuertos;
      });
  }

  /* CONFIGURACION DE LOS DIFERENTES FORMULARIOS */
  public formularioNuevoVuelo: FormGroup;
  public formularioSegmentos: FormGroup;
  public formularioConexion: FormGroup;

  /* Creacion de campos del nuevo vuelo */
  numeroSegmentos = new FormControl('', Validators.required);
  nuevoVueloAerolinea = new FormControl('', Validators.required);
  nuevoVueloNumeroVuelo = new FormControl('', Validators.required);
  nuevoVueloFechaPartida = new FormControl('', Validators.required);
  /* Creacion de campos de conexion */
  conexionAerolinea = new FormControl('', Validators.required);
  conexionNumeroVuelo = new FormControl('', Validators.required);
  conexionAeropuerto = new FormControl('', Validators.required);

  constructor(private formBuilder: FormBuilder, private gestorVuelosService : GestorVuelosService){
    this.formularioNuevoVuelo = this.formBuilder.group({
      'numeroSegmentos' :  this.numeroSegmentos,
      'nuevoVueloAerolinea' :  this.nuevoVueloAerolinea,
      'nuevoVueloNumeroVuelo' :  this.nuevoVueloNumeroVuelo,
      'nuevoVueloFechaPartida' :  this.nuevoVueloFechaPartida
    })
    this.formularioConexion = this.formBuilder.group({
      'conexionAerolinea' :  this.conexionAerolinea ,
      'conexionNumeroVuelo' : this.conexionNumeroVuelo ,
      'conexionAeropuerto' : this.conexionAeropuerto ,
    })
  }

  ngOnInit(): void {

    /* OBTENCION DE LAS AEROLINEAS EN EL MENU DE NUEVO VUELO */
    this.airlinesSuscripcion = this.gestorVuelosService.getAerolineas().subscribe((aerolineas) => {
      this.aerolineasCargadas = aerolineas;
    });
    /* OBTENCION DE LOS AEROPUERTOS EN EL MENU DE SECCIONES */
    this.airportsSuscripcion = this.gestorVuelosService.getAeropuertos().subscribe((aeropuertos) => {
      this.aeropuertosCargados = aeropuertos;
    })
    /* OBTENCION DE LOS PILOTOS EN EL MENU DE SECCIONES */
    /* this.pilotsSuscripcion = this.gestorVuelosService.getPilotos().subscribe((pilotos) => {
      this.pilotosCargados = pilotos;
    }) */

    this.formularioSegmentos = this.formBuilder.group({
      segmentos: this.formBuilder.array([])
    });
    this.formularioNuevoVuelo.setValue({
      'numeroSegmentos' : 1,
      'nuevoVueloAerolinea' : '',
      'nuevoVueloNumeroVuelo' : '',
      'nuevoVueloFechaPartida' : ''
    })
    this.formularioConexion.setValue({
      'conexionAerolinea' :  '' ,
      'conexionNumeroVuelo' : '',
      'conexionAeropuerto' : '',
    })

    this.gestorVuelosService.getItinerarios('BOG', 'JFK', "2022-12-08").subscribe((itinerarios) => {
      console.log(itinerarios);
    })


  }
  get segmentosFormGroups () {
    return this.formularioSegmentos.get('segmentos') as FormArray
  }

  ngOnDestroy(){
    this.airlinesSuscripcion.unsubscribe();
    this.airportsSuscripcion.unsubscribe();
    this.pilotsSuscripcion.unsubscribe();
    this.vuelosSuscripcion.unsubscribe();
  }

  /* Funciones Referentes a la validacion de datos */
  getErrorMensaje(controlFormulario : FormControl, mensajeControl : string){
    return (controlFormulario.hasError('required'))?'Debes ingresar un '+mensajeControl:'';
  }

  public registrarVuelo(){
    /*this.formularioSegmentos.value['segmentos'][this.formularioSegmentos.value['segmentos'].length - 1]['piloto'] = "pilotoDummy";*/
    if(this.formularioNuevoVuelo.valid && this.formularioSegmentos.valid && this.clickeadoGenerado){
      this.isSegmentosDisponibles = true;
      this.gestorVuelosService.registrarVuelo(
        new Vuelo(
          this.formularioNuevoVuelo.value['nuevoVueloAerolinea'],
          this.formularioNuevoVuelo.value['nuevoVueloNumeroVuelo'],
      )).subscribe(() => {
        for(let i = 0; i < this.formularioSegmentos.value['segmentos'].length - 1; i++){
          this.gestorVuelosService.registrarSegmentoVuelo(
            new SegmentoVuelo(
              this.formularioNuevoVuelo.value['nuevoVueloAerolinea'],
              this.formularioNuevoVuelo.value['nuevoVueloNumeroVuelo'],
              this.formularioSegmentos.value['segmentos'][i+1]['aeropuerto'],
              this.formularioSegmentos.value['segmentos'][i]['aeropuerto'],
              this.formularioNuevoVuelo.value['nuevoVueloFechaPartida'],
              this.formularioSegmentos.value['segmentos'][i]['horasVuelo']
          )).subscribe(() => {
            /* for(let i = 0; i < this.formularioSegmentos.value['segmentos'].length; i++){ */
              this.gestorVuelosService.registrarAsignacionPiloto(
                new PilotoAsignacion(
                  this.formularioNuevoVuelo.value['nuevoVueloAerolinea'],
                  this.formularioNuevoVuelo.value['nuevoVueloNumeroVuelo'],
                  this.formularioSegmentos.value['segmentos'][i+1]['aeropuerto'],
                  this.formularioSegmentos.value['segmentos'][i]['piloto']
              )).subscribe(() => {
                if(this.isConexionHabilitada && this.formularioConexion.valid && !this.registroConexionRealizada){
                  this.isConexionDisponible = true;
                  this.gestorVuelosService.getAeropuertoDestinoFromSegmentosDeVuelo(
                    this.formularioConexion.value['conexionAerolinea'],
                    this.formularioConexion.value['conexionNumeroVuelo'],
                    this.formularioConexion.value['conexionAeropuerto']
                  ).subscribe((aeropuertoDestino) => {
                    this.gestorVuelosService.registrarConexion(
                      new Conexion(
                        this.formularioConexion.value['conexionAerolinea'],
                        this.formularioConexion.value['conexionNumeroVuelo'],
                        aeropuertoDestino[0],
                        this.formularioNuevoVuelo.value['nuevoVueloAerolinea'],
                        this.formularioNuevoVuelo.value['nuevoVueloNumeroVuelo'],
                        this.formularioConexion.value['conexionAeropuerto']
                      )
                    ).subscribe();
                    this.registroConexionRealizada = true;
                  })
                }
                if(!this.isRegistroCuadrosNuevoVueloRealizado){
                  for(let i=0; i < this.formularioSegmentos.value['segmentos'].length; i++){
                    this.gestorVuelosService.getCuadrosInformativos(
                      this.formularioNuevoVuelo.value['nuevoVueloNumeroVuelo'],
                      this.formularioNuevoVuelo.value['nuevoVueloAerolinea'],
                      this.formularioSegmentos.value['segmentos'][i]['aeropuerto']).subscribe((cuadroInformativo) => {
                        this.cuadrosInformativosNuevoVuelo.push(cuadroInformativo[0]);
                    });/* Nuevo Vuelo sin Conexion */
                  }
                  /*  */
                  this.isRegistroCuadrosNuevoVueloRealizado = true;
                }
                if(this.isConexionHabilitada && this.formularioConexion.valid && !this.isRegistroCuadrosConexionRealizado){/*
                  this.cuadrosInformativosConexion.push(this.cuadrosInformativosNuevoVuelo[this.cuadrosInformativosNuevoVuelo.length - 1]); */
                  this.gestorVuelosService.getAeropuertoDestinoFromSegmentosDeVuelo(
                    this.formularioConexion.value['conexionAerolinea'],
                    this.formularioConexion.value['conexionNumeroVuelo'],
                    this.formularioConexion.value['conexionAeropuerto']).subscribe((aeropuertoDestino) => {
                      const aeropuertosConexion = [
                        {
                          'numeroVuelo' : this.formularioNuevoVuelo.value['nuevoVueloNumeroVuelo'],
                          'aerolinea' : this.formularioNuevoVuelo.value['nuevoVueloAerolinea'],
                          'aeropuerto' : this.formularioSegmentos.value['segmentos'][this.formularioSegmentos.value['segmentos'].length - 1]['aeropuerto']
                        },
                        {
                          'numeroVuelo' : this.formularioConexion.value['conexionNumeroVuelo'],
                          'aerolinea' : this.formularioConexion.value['conexionAerolinea'],
                          'aeropuerto' : this.formularioSegmentos.value['segmentos'][this.formularioSegmentos.value['segmentos'].length - 1]['aeropuerto']
                        },
                        {
                          'numeroVuelo' : this.formularioConexion.value['conexionNumeroVuelo'],
                          'aerolinea' : this.formularioConexion.value['conexionAerolinea'],
                          'aeropuerto' : aeropuertoDestino[0]
                        }
                      ]
                      for(let i=0; i < aeropuertosConexion.length; i++){
                        this.gestorVuelosService.getCuadrosInformativos(
                          aeropuertosConexion[i].numeroVuelo,
                          aeropuertosConexion[i].aerolinea,
                          aeropuertosConexion[i].aeropuerto).subscribe((cuadroInformativo) => {
                            this.cuadrosInformativosConexion.push(cuadroInformativo[0]);
                      });
                    }
                  })
                  this.isRegistroCuadrosConexionRealizado = true;
                }/* Nuevo Vuelo con Conexion */
            });
          })
        }
      });
      this.registroConexionRealizada = false;
      this.isRegistroCuadrosNuevoVueloRealizado = false;
      this.isRegistroCuadrosConexionRealizado = false;
    }
    console.log(this.formularioNuevoVuelo.valid);
    console.log(this.formularioSegmentos.valid);
    console.log(this.formularioConexion.valid);
  }

}
