import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { StorageService } from '../../services/storage/storage.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  form: any = {
    username: null,
    password: null
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  isExpired = false;
  returnUrl: string;
  

  constructor(private route: ActivatedRoute,private authService: AuthService, private storageService: StorageService, private router: Router) { 
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: any) {
    this.storageService.setSessionState("notExpired");
    this.isExpired = false;
  }

  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.roles = this.storageService.getUser().roles;
      this.isExpired = false;
      this.storageService.setSessionState("notExpired");

    }
    this.isExpired = this.storageService.isExpired();
  }
  ngOnDestroy(): void {
    this.storageService.setSessionState("notExpired");
    this.isExpired = false;
    this.reloadPage();
  }

  onSubmit(): void {
    const { username, password } = this.form;

    this.authService.login(username, password).subscribe({
      next: data => {
        this.storageService.saveUser(data);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.storageService.getUser().roles;
        this.router.navigateByUrl(this.returnUrl);
        //this.router.navigate(['/home']);
        
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    });
  }

  reloadPage(): void {
    window.location.reload();
  }
}