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

  /* Variables que gestionan el funcionamiento de los llamados desde la base de datos hasta la vista */
  public airlinesSuscripcion : Subscription;
  public aerolineasCargadas : Aerolinea[] = [];
  public airportsSuscripcion : Subscription;
  public aeropuertosCargados : Aeropuerto[] = [];
  public pilotsSuscripcion : Subscription;
  public pilotosCargados : Piloto[] = [];
  /* ================================================================================================ */
  public vuelosFromAerolinea : Vuelo[] = [];
  public vuelosSuscripcion: Subscription;
  public aeropuertosFromVuelo : Aeropuerto[] = [];

  cambiarConexionHabilitada(habilitado : boolean){
    this.isConexionHabilitada = habilitado;
  }

  generarFormulariosSegmentos(){
    /* PARA VOLVER A GENERAR, ELIMINAR LOS REGISTROS DE SEGMENTOS ANTERIORES Y VOLVER A AGREGAR */
    this.clickeadoGenerado = true;
    this.numeroFormulariosSegmentos = this.formularioNuevoVuelo.value['numeroSegmentos'] + 1;
    for(let i = 0;i < this.formularioNuevoVuelo.value['numeroSegmentos'] + 1;i++){
      this.agregarSegmento();
    }
  }
  private agregarSegmento() {
    const emails = this.formularioSegmentos.get('segmentos') as FormArray;
    emails.push(this.createSegmentoFormGroup());
  }
  private createSegmentoFormGroup(): FormGroup {
    return new FormGroup({
      'aeropuerto': new FormControl('', Validators.required),
      'horasVuelo': new FormControl( 1, Validators.required),
      'piloto' : new FormControl('', Validators.required)
    })
  }

  public asignarNumeroVuelo(evento : Event){
    /* OBTENCION DE LOS VUELOS AL SELECCIONAR UNA AEROLINEA y SE ASIGNA SEGUN LA CANTIDAD DE VUELOS REALIZADOS*/
    this.gestorVuelosService.getVuelosFromAerolinea(
      this.formularioNuevoVuelo.value['nuevoVueloAerolinea']).subscribe((vuelos) => {
      console.log(vuelos.length);
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
    /* OBTENCION DE LOS AEROPUERTOS AL SELECCIONAR UN VUELO */
    this.gestorVuelosService.getAeropuertosFromVuelo(
      this.formularioConexion.value['conexionNumeroVuelo']).subscribe((aeropuertos)=> {
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
    console.log("Se presiona registrar vuelo");
    if(this.formularioNuevoVuelo.valid && this.formularioSegmentos.valid && this.clickeadoGenerado){
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
              this.formularioSegmentos.value['segmentos'][i]['aeropuerto'],
              this.formularioSegmentos.value['segmentos'][i+1]['aeropuerto'],
              this.formularioNuevoVuelo.value['nuevoVueloFechaPartida'],
              this.formularioSegmentos.value['segmentos'][i]['horasVuelo']
          )).subscribe(() => {
            /* for(let i = 0; i < this.formularioSegmentos.value['segmentos'].length; i++){ */
              this.gestorVuelosService.registrarAsignacionPiloto(
                new PilotoAsignacion(
                  this.formularioNuevoVuelo.value['nuevoVueloAerolinea'],
                  this.formularioNuevoVuelo.value['nuevoVueloNumeroVuelo'],
                  this.formularioSegmentos.value['segmentos'][i]['aeropuerto'],
                  this.formularioSegmentos.value['segmentos'][i]['piloto']
              )).subscribe();
/*             } */
          })
        }
      });

      console.log(this.formularioNuevoVuelo.value);
      console.log(this.formularioSegmentos.value);
      this.isSegmentosDisponibles = true;
      if(this.isConexionHabilitada && this.formularioConexion.valid){
        console.log(this.formularioConexion.value);
        this.isConexionDisponible = true;
      }/* Nuevo Vuelo con Conexion */
    }/* Nuevo Vuelo sin Conexion */

    console.log(this.formularioNuevoVuelo.valid);
    console.log(this.formularioSegmentos.valid);
    console.log(this.formularioConexion.valid);
  }

}
