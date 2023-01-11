# Modulo Vuelos Front

Repositorio creado para el proyecto de modulo en la gestión de vuelos - Bases de datos 1

# Tecnologías utilizadas

  - Angular (Angular Material)

# Introducción

El siguiente proyecto consiste en el registro principalmente de diferentes entidades en una base de datos establecida en la gestión de vuelos.
Entre las entidades a intervenir se encuentran:
  - Conexion
  - Vuelo
  - Segmentos de vuelo
  - Asignación de Piloto

Como interfaz grafica de usuario se muestra lo siguiente:

<img src="https://user-images.githubusercontent.com/43209755/211919197-9bc71700-268d-42ce-b492-ca40c74789dd.png" width="750">

La interfaz usa como recurso principal los menus desplegables, en donde se han cargado previamente los datos a través de Requests Http con el uso de objetos en formato JSON. 

Así como la programación de generación programática del número de vuelo y los pilotos correspondientes a la aerolínea seleccionada.

Al generar los vuelos se crea una ficha informativa en donde se visualiza la información registrada previamente:

<img src="https://user-images.githubusercontent.com/43209755/211920519-d609aca8-ef81-4d90-a5bc-68c29ae8094a.png" width="750">

Al generar conexiones se genera igualmente una ficha informativa respectiva al vuelo en donde se hace referencia:

<img src="https://user-images.githubusercontent.com/43209755/211922855-c36cf03f-38b4-4467-b6aa-89ea5d3df069.png" width="750">

<img src="https://user-images.githubusercontent.com/43209755/211923418-18fea5a9-1529-43a5-8220-0d0dab6f9cc1.png" width="750">

Las acciones anteriores (registro) realizan de igual manera Resquests Http.

<hr>

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.2.8.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
