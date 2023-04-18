import { provideEffects } from '@ngrx/effects';
import { ticketsFeature } from './../../../domain/src/lib/+state/reducer';
import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { FlightBookingComponent } from './flight-booking.component';
import { FlightEditComponent } from './flight-edit/flight-edit.component';
import { FlightSearchComponent } from './flight-search/flight-search.component';
import { PassengerSearchComponent } from './passenger-search/passenger-search.component';
import { FlightTypeaheadComponent } from './flight-typeahead/flight-typeahead.component';

export const FLIGHT_BOOKING_ROUTES: Routes = [
  {
    path: '',
    component: FlightBookingComponent,
    children: [
      {
        path: 'flight-search',
        component: FlightSearchComponent,
      },
      {
        path: 'flight-edit/:id',
        component: FlightEditComponent,
      },
      {
        path: 'flight-typeahead',
        component: FlightTypeaheadComponent,
      },
      {
        path: 'passenger-search',
        component: PassengerSearchComponent,
      },
    ],
    providers: [
      provideState(ticketsFeature),
      provideEffects()
    ]
  },
];

export default FLIGHT_BOOKING_ROUTES;
