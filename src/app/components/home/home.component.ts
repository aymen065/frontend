import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { EventBusService } from 'src/app/shared/event-bus.service';
import { EventData } from 'src/app/shared/event.class';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit ,OnDestroy{
  content?: string;

  constructor(private userService: UserService,
    private storageService: StorageService,
    private eventBusService: EventBusService,
    private router: Router) { }

  ngOnInit(): void {
    this.storageService.setSessionState("notExpired");
    this.userService.getPublicContent().subscribe({
      next: data => {
        this.content = data;
      },
      error: err => {console.log(err)
        if (err.error) {
          this.content = JSON.parse(err.error).message;
        } 
        if (err.status === 401 && this.storageService.isLoggedIn()) {
          this.eventBusService.emit(new EventData('logout', null));
          this.router.navigate(['/login']);
        }else {
          this.content = "Error with status: " + err.status;
        }
      }
    });
  }
  ngOnDestroy(): void {
    if (this.storageService.isExpired()) {
      this.eventBusService.emit(new EventData('logout', null));
      this.router.navigate(['/login']);
    }
  }
}