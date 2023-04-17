import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { share, tap, Subscription, delay, timer, filter, debounceTime, distinctUntilChanged, Observable, switchMap } from 'rxjs';
import { LetModule } from '@ngrx/component';
import { Flight } from '@flight-demo/tickets/domain';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

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

  control = new FormControl('', { nonNullable: true });
  private http = inject(HttpClient);
  flights$ = this.initFlightStream();

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    // this.rxjsDemo();
  }

  private initFlightStream(): Observable<Flight[]> {
    return this.control.valueChanges.pipe(
      filter(city => city.length > 2),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(city => this.load(city))
    );
  }

  load(from: string): Observable<Flight[]>  {
    const url = "https://demo.angulararchitects.io/api/flight";

    const params = new HttpParams()
                        .set('from', from);

    const headers = new HttpHeaders()
                        .set('Accept', 'application/json');

    return this.http.get<Flight[]>(url, {params, headers});
  }


  rxjsDemo(): void {
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
