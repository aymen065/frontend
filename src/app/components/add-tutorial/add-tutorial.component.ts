import { Component, OnInit } from '@angular/core';
import { Tutorial } from 'src/app/models/tutorial.model';
import { TutorialService } from '../../services/tutorialService/tutorial.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { EventBusService } from 'src/app/shared/event-bus.service';
import { Router } from '@angular/router';
import { EventData } from 'src/app/shared/event.class';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-tutorial',
  templateUrl: './add-tutorial.component.html',
  styleUrls: ['./add-tutorial.component.css']
})
export class AddTutorialComponent implements OnInit {

  tutorial: Tutorial = {
    title: '',
    description: '',
    published: false
  };
  submitted = false;
  eventBusSub?: Subscription;

  constructor(private tutorialService: TutorialService,
    private storageService: StorageService,
    private authService: AuthService,
    private eventBusService: EventBusService,
    private router: Router) { }

  ngOnInit(): void {
  }

  saveTutorial(): void {
    const data = {
      title: this.tutorial.title,
      description: this.tutorial.description
    };

    this.tutorialService.create(data)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.submitted = true;
        },
        error: (e) => {
          console.error(e.status)
            this.eventBusService.emit(new EventData('logout', null));
            this.router.navigate(['/login']);
          
          
        }
      });
  }

  newTutorial(): void {
    this.submitted = false;
    this.tutorial = {
      title: '',
      description: '',
      published: false
    };
  }
  expire(): void {
    this.authService.logout().subscribe({
      next: res => {
        console.log(res);
        this.storageService.clean();

        window.location.reload();
        this.storageService.setSessionState("expired");
      },
      error: err => {
        console.log(err);
      }
    });
  }

}