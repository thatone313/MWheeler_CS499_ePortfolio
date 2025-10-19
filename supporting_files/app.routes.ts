import { Routes, CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';
import { AuthGuard } from './auth/auth.guard';
import { AddTripComponent } from './add-trip/add-trip.component';
import { TripListingComponent } from './trip-listing/trip-listing.component';
import { EditTripComponent } from './edit-trip/edit-trip.component';
import { DeleteTripComponent } from './delete-trip/delete-trip.component';
import { LoginComponent } from './login/login.component';
import { NewsComponent } from './news/news.component';
import { TravelComponent } from './travel/travel.component';
import { AdminComponent } from './admin/admin.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ReservationsComponent } from './reservations/reservations.component';
import { SignupComponent } from './signup/signup.component';
import { RecommendedTripsComponent } from './recommended-trips/recommended-trips.component';

@Injectable({
  providedIn: 'root'
})
class AdminOnlyGuard implements CanActivate { // Guard to restrict access to admin-only routes
  constructor(private auth: AuthenticationService, private router: Router) {}
  canActivate(): boolean {
    if (this.auth.isLoggedIn() && this.auth.isAdmin()) return true;
    this.router.navigate(['/index']);  // redirect non-admins
    return false;
  }
}

export const routes: Routes = [
    // Public Routes
    { path: 'news', component: NewsComponent },
    { path: 'login', component: LoginComponent },
    { path: 'travel', component: TravelComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'index', component: TripListingComponent, pathMatch: 'full' },
    { path: 'recommended-trips', component: RecommendedTripsComponent},

    //Requires login
    { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard] },
    { path: 'reservations', component: ReservationsComponent, canActivate: [AuthGuard] },

    // Admin-only routes
    { path: 'admin', component: AdminComponent, canActivate: [AdminOnlyGuard] },
    { path: 'add-trip', component: AddTripComponent , canActivate: [AdminOnlyGuard]},
    { path: 'edit-trip', component: EditTripComponent, canActivate: [AdminOnlyGuard] },
    { path: 'delete-trip', component: DeleteTripComponent, canActivate: [AdminOnlyGuard] },
    
    //Fallback route
    { path: '**', redirectTo: '/index' },
    
];
