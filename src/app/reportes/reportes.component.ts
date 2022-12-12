import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Aeropuerto } from '../modelos/aeropuerto.model';
import { GestorVuelosService } from '../servicios/gestor-vuelos.service';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {

  public aeropuertosCargados : Aeropuerto[] = [];
  public formularioItinerario: FormGroup;
  public isItinerariosDisponibles : boolean = false;

  aeropuertoOrigen = new FormControl('', Validators.required);
  aeropuertoDestino = new FormControl('', Validators.required);
  fechaPartida = new FormControl('', Validators.required);



  constructor(private formBuilder: FormBuilder, private gestorVuelosService : GestorVuelosService) {
    this.formularioItinerario = this.formBuilder.group({
      'aeropuertoOrigen' :  this.aeropuertoOrigen,
      'aeropuertoDestino' :  this.aeropuertoDestino,
      'fechaPartida' :  this.fechaPartida,
    });
  }

  ngOnInit(): void {

    this.formularioItinerario.setValue({
      'aeropuertoOrigen' : '',
      'aeropuertoDestino' : '',
      'fechaPartida' : ''
    })

    this.gestorVuelosService.getAeropuertos().subscribe((aeropuertos) => {
      this.aeropuertosCargados = aeropuertos;
    });
  }

  generarItinerarios(): void {
    this.isItinerariosDisponibles = true;
    console.log("aqui se crean itinerarios");
  }

  /* Funciones Referentes a la validacion de datos */
  getErrorMensaje(controlFormulario : FormControl, mensajeControl : string){
    return (controlFormulario.hasError('required'))?'Debes ingresar un '+mensajeControl:'';
  }

}
