import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface Activity {
  icon: string;
  title: string;
  description: string;
  time: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  userName: string = 'John Doe';
  userEmail: string = 'john.doe@example.com';
  recentActivities: Activity[] = [];

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // In a real app, you would get the user data from AuthService
    // and activities from a service connected to Firebase

    this.recentActivities = [
      {
        icon: 'edit',
        title: 'Updated Profile',
        description: 'You updated your profile information',
        time: '2 hours ago'
      },
      {
        icon: 'login',
        title: 'Logged In',
        description: 'You logged in from a new device',
        time: '1 day ago'
      },
      {
        icon: 'file_upload',
        title: 'Uploaded Document',
        description: 'You uploaded a new document',
        time: '3 days ago'
      },
      {
        icon: 'settings',
        title: 'Changed Settings',
        description: 'You updated your notification settings',
        time: '1 week ago'
      }
    ];

    // Check if user is logged in, if not redirect to login
    // In a real app, you would use AuthService.isAuthenticated$
    // this.authService.isAuthenticated$.subscribe(isAuth => {
    //   if (!isAuth) {
    //     this.router.navigate(['/login']);
    //   }
    // });
  }

  logout(): void {
    // In a real app, this would be connected to AuthService
    console.log('Logging out...');
    this.router.navigate(['/login']);

    // this.authService.logout().subscribe({
    //   next: () => this.router.navigate(['/login']),
    //   error: (error) => console.error('Logout error', error)
    // });
  }
}
