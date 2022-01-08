import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../store-app';
import { clearLog, selectTopNLogs } from '../store-log';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
// V2 Component as Presentation Component
export class LogComponent implements OnInit {

  @Input() logs: string[] = [];
  @Output() onClickButtonClearLog = new EventEmitter();

  constructor() {}

  ngOnInit() {
  }

  clearLog() {
    this.onClickButtonClearLog.emit();
  }
}
