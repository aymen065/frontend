import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { EventBusService } from 'src/app/shared/event-bus.service';
import { Router } from '@angular/router';
import { EventData } from 'src/app/shared/event.class';

@Component({
  selector: 'app-board-admin',
  templateUrl: './board-admin.component.html',
  styleUrls: ['./board-admin.component.css']
})
export class BoardAdminComponent implements OnInit {
  content?: string;

  constructor(private userService: UserService,
    private storageService: StorageService,
    private eventBusService: EventBusService,
    private router: Router) { }

  ngOnInit(): void {
    this.userService.getAdminBoard().subscribe({
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
        } 
        else {
          this.content = "Error with status: " + err.status;
        }
      }
    });
  }
}