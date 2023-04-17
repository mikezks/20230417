import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { share, tap, Subscription, delay, timer } from 'rxjs';
import { LetModule } from '@ngrx/component';

@Component({
  selector: 'tickets-flight-typeahead',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LetModule
  ],
  templateUrl: './flight-typeahead.component.html',
  styleUrls: ['./flight-typeahead.component.css'],
})
export class FlightTypeaheadComponent implements OnInit, OnDestroy {
  timer$ = timer(0, 2_000).pipe(
    tap(num => console.log('Observable Producer', num)),
    // share()
  );
  subscription = new Subscription();

  ngOnInit(): void {
    this.subscription.add(
      this.timer$.pipe(
        // delay(3_000)
      ).subscribe(num => console.log(num))
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
