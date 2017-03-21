import { Component } from '@angular/core';
import { AfterViewInit } from '@angular/core';

declare var $:any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  ngAfterViewInit():void {
    var script = document.createElement( "script" );
    script.type = "text/javascript";
    script.src = "js/main.js";
    $("body").append(script);
  }

}
