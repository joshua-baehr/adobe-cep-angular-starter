import {Injectable} from '@angular/core';
import {CSInterface} from 'csinterface-ts';


@Injectable({
  providedIn: 'root'
})
export class ExtendScriptService {

  private cs: CSInterface;

  constructor() {
    this.cs = new CSInterface();
  }


}
