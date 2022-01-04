import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../store-app';
import { clearLog, selectTopNLogs } from '../store-hero';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent implements OnInit {

  logs: string[] = [];

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.store.select(selectTopNLogs(5)).subscribe(logs => {
      this.logs = logs;
    })
  }

  clearLog() {
    this.store.dispatch(clearLog());
  }
}
