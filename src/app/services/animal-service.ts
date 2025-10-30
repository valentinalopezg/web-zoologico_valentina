import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'

})

export class AnimalService {
  constructor(private http: HttpClient) { }
  apiUri = '/api/animals';

  httpOptions = new HttpHeaders().set('Content-Type', 'application/json');
  //PETICION GET
  getAllAnimalsData(): Observable<any> {
    return this.http.get<any>(this.apiUri)
  }
  //PETICIÓN POST
  newAnimal(data: any): Observable<any> {
    return this.http.post<any>(
      this.apiUri,
      data,
      { headers: this.httpOptions });
  }


  animalList: any = [];

}






