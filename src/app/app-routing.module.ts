import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NuevoVueloComponent } from './nuevo-vuelo/nuevo-vuelo.component';
import { ReportesComponent } from './reportes/reportes.component';

const routes: Routes = [
  {path : '', component : NuevoVueloComponent, pathMatch: 'full'},
  {path : 'nuevo-vuelo', component : NuevoVueloComponent},
  {path : 'reportes', component : ReportesComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
