import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CityPipe } from '@flight-demo/shared/ui-common';
import { computed, effect, fromObservable, signal } from '@flight-demo/shared/util-signals';
import { Flight, injectTicketsFeature } from '@flight-demo/tickets/domain';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import { filter, of } from 'rxjs';

@Component({
  selector: 'app-flight-search',
  standalone: true,
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css'],
  imports: [CommonModule, FormsModule, CityPipe, FlightCardComponent],
})
export class FlightSearchComponent {
  from = signal('London');
  to = signal('Paris');
  // flights: Array<Flight> = [];
  selectedFlight = signal<Flight | undefined>(undefined);

  basket = signal<Record<number, boolean>>({
    3: true,
    5: true,
  });

  ticketsFeature = injectTicketsFeature();
  cdRef = inject(ChangeDetectorRef);
  flights = fromObservable(this.ticketsFeature.flights$);

  user = signal({
    firstname: 'Peter',
    lastname: 'Smith',
    username: 'peter.smith'
  });

  constructor() {
    effect(() => console.log(this.from(), this.basket(), this.user()));

    const rxNumber = fromObservable(of(1,2,3,4).pipe(
      filter(v => !!(v % 2))
    ));

    effect(() => console.log(rxNumber()));

    effect(() => {
      this.from();
      this.to();
      this.basket();
      this.flights();

      this.cdRef.detectChanges();
    })
  }

  search(): void {
    if (!this.from() || !this.to()) {
      return;
    }

    // this.from.set('New York');
    this.user.update(user => ({
      ...user,
      username: 'my.user'
    }));
    this.user.mutate(user => {
      user.firstname = 'Alex';
    });

    const userStr = computed(() => this.from() + ', ' + this.user().lastname);



    // Reset properties
    this.selectedFlight.set(undefined);

    this.ticketsFeature.search(this.from(), this.to());
  }

  select(f: Flight): void {
    this.selectedFlight.set({ ...f });
  }

  updateBasket(id: number, selected: boolean): void {
    this.basket.mutate(basket => basket[id] = selected);
  }
}
