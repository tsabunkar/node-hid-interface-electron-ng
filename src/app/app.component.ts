import { Component, OnInit } from '@angular/core';
// declare var require: any

// const electron =  require('electron');
// const { ipcRenderer } = electron;
import { ElectronService } from 'ngx-electron';

// import { ipcRenderer } from 'electron';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private electronService: ElectronService) { }

  ngOnInit() {

    this.electronService.ipcRenderer.on('jabraDeviceData', (event, deviceObject) => {
      console.log('device', deviceObject.jabraDevice);
      console.log('device', deviceObject.productName);
      console.log('device', deviceObject.productManufacturer);
      console.log('event', event);

      document.getElementById('deviceName').innerHTML = deviceObject.productName;
      document.getElementById('deviceManufacturer').innerHTML = deviceObject.productManufacturer;

    });
  }

}
