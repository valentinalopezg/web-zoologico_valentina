import { Component } from '@angular/core';
import { AnimalService } from '../../services/animal-service';
import { take } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-animal-component',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './animal-component.html',
  styleUrl: './animal-component.css'
})
export class AnimalComponent {
  animalList: any = [];
  animalForm: FormGroup | any;
  idAnimal: any;
  editableAnimal: boolean = false;



  constructor(private animalService: AnimalService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService) {
  }


  getAllAnimals() {
    this.animalService.getAllAnimalsData().subscribe((data: {}) => {
      this.animalList = data;
    });
  }
  ngOnInit() {
    this.animalForm = this.formBuilder.group({
      nombre: '',
      edad: 0,
      tipo: '',
      fecha: new Date()
    })
    this.getAllAnimals();
  }

  newMessage(messageText: string) {
    this.toastr.success('Clic aquí para actualizar la lista', messageText)
      .onTap
      .pipe(take(1))
      .subscribe(() => window.location.reload());
  }

  newAnimalEntry() {
    this.animalService.newAnimal(this.animalForm.value).subscribe(
      () => {
        //Redirigiendo a la ruta actual /inicio y recargando la ventana
        this.router.navigate(['/inicio'])
          .then(() => {
            this.newMessage('Registro exitoso');
          })
      }
    );
  }

  updateAnimalEntry() {
    //Removiendo valores vacios del formulario de actualización
    const updateData: any = {};
    for (let key in this.animalForm.value) {
      if (this.animalForm.value[key] !== '' && this.animalForm.value[key] !== null) {
        updateData[key] = this.animalForm.value[key];
      }
    }
    this.animalService.updateAnimal(this.idAnimal, updateData).subscribe(
      () => {
        this.newMessage("Animal editado");
        this.getAllAnimals(); // Agregar esto para refrescar
      }
    );
  }

  toggleEditAnimal(id: any) {
    this.idAnimal = id;
    console.log(this.idAnimal)
    this.animalService.getOneAnimal(id).subscribe(
      data => {
        this.animalForm.patchValue({
          nombre: data.nombre,
          edad: data.edad,
          tipo: data.tipo,
        });
      }
    );
    this.editableAnimal = !this.editableAnimal;
  }

deleteAnimalEntry(id: any) {
  if (!confirm('¿Estás seguro de eliminar este animal?')) {
    return;
  }
  
  console.log(id);
  this.animalService.deleteAnimal(id).subscribe(
    () => {
      this.toastr.success('Animal eliminado exitosamente');
      this.getAllAnimals();
    },
    (error) => {
      console.error('Error al eliminar el animal:', error);
      this.toastr.error('Error al eliminar el animal', 'Error');
    }
  );
}






}
