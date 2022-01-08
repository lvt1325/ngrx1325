import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './store-app';
import { clearLog, selectTopNLogs } from './store-log';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Tour of Heroes V2';
  logs: string[] = [];
  
  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.select(selectTopNLogs(5)).subscribe(logs => {
      this.logs = logs;
    })
  }

  clearLog() {
    this.store.dispatch(clearLog());
  }
}
