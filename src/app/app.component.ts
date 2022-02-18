import { Component } from '@angular/core';
import { HostService } from './host.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private hostService: HostService) {}

  helloWorld() {
    this.hostService.helloWorld();
  }

  showProjectName() {
    this.hostService.getProjectName().then((name) => alert(name));
  }
}
