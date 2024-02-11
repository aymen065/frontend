import { Component, OnInit } from '@angular/core';
import { Tutorial } from 'src/app/models/tutorial.model';
import { TutorialService } from '../../services/tutorialService/tutorial.service';
import { StorageService } from '../../services/storage/storage.service';
import { EventBusService } from '../../shared/event-bus.service';
import { EventData } from 'src/app/shared/event.class';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tutorial-list',
  templateUrl: './tutorial-list.component.html',
  styleUrls: ['./tutorial-list.component.css']
})
export class TutorialListComponent implements OnInit {

  tutorials: Tutorial[] = [];
  currentTutorial: Tutorial = {};
  currentIndex = -1;
  title = '';

  page = 1;
  count = 0;
  pageSize = 3;
  pageSizes = [1,2,3,4,5,6,7,8,9];
  

  constructor(private tutorialService: TutorialService, private storageService: StorageService,
    private eventBusService: EventBusService, private router: Router) { }

  ngOnInit(): void {
    this.retrieveTutorials();
  }

  getRequestParams(searchTitle: string, page: number, pageSize: number): any {
    let params: any = {};

    if (searchTitle) {
      params[`title`] = searchTitle;
    }

    if (page) {
      params[`page`] = page - 1;
    }

    if (pageSize) {
      params[`size`] = pageSize;
    }

    return params;
  }

  retrieveTutorials(): void {
    const params = this.getRequestParams(this.title, this.page, this.pageSize);

    this.tutorialService.getAll(params)
    .subscribe(
      response => {
        const { tutorials, totalItems } = response;
        this.tutorials = tutorials;
        this.count = totalItems;
        console.log(response);
      },
      error => {
        console.log(error.status);
        if (this.storageService.isLoggedIn()) {
          this.eventBusService.emit(new EventData('logout', null));
          this.router.navigate(['/login']);
        }
      });
  }

  refreshList(): void {
    this.retrieveTutorials();
    this.currentTutorial = {};
    this.currentIndex = -1;
  }

  setActiveTutorial(tutorial: Tutorial, index: number): void {
    this.currentTutorial = tutorial;
    this.currentIndex = index;
  }

  removeAllTutorials(): void {
    this.tutorialService.deleteAll()
      .subscribe({
        next: (res) => {
          console.log(res);
          this.refreshList();
        },
        error: (e) => {
          console.error(e)
          if (this.storageService.isLoggedIn()) {
            this.eventBusService.emit(new EventData('logout', null));
            this.router.navigate(['/login']);
          }
        }
      });
  }
  handlePageChange(event: number): void {
    this.page = event;
    this.retrieveTutorials();
  }

  handlePageSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.page = 1;
    this.retrieveTutorials();
  }

  searchTitle(): void {
    this.currentTutorial = {};
    this.currentIndex = -1;

    this.tutorialService.findByTitle(this.title)
      .subscribe({
        next: (data) => {
          this.tutorials = data;
          console.log(data);
        },
        error: (e) => {
          console.error(e)
          if (this.storageService.isLoggedIn()) {
            this.eventBusService.emit(new EventData('logout', null));
            this.router.navigate(['/login']);
          }
        }
      });
  }

}