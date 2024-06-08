import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentialForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit() {
    this.credentialForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async signUp() {
    const loading = await this.loadingController.create();
    await loading.present();

    this.afAuth.createUserWithEmailAndPassword(
      this.credentialForm.value.email,
      this.credentialForm.value.password
    ).then(
      (user) => {
        loading.dismiss();
        this.router.navigateByUrl('/home', { replaceUrl: true });
      },
      async (err) => {
        loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Sign up failed',
          message: err.message,
          buttons: ['OK'],
        });

        await alert.present();
      }
    );
  }

  async signIn() {
    const loading = await this.loadingController.create();
    await loading.present();

    this.afAuth.signInWithEmailAndPassword(
      this.credentialForm.value.email,
      this.credentialForm.value.password
    ).then(
      (res) => {
        loading.dismiss();
        this.router.navigateByUrl('/home', { replaceUrl: true });
      },
      async (err) => {
        loading.dismiss();
        const alert = await this.alertController.create({
          header: ':(',
          message: err.message,
          buttons: ['OK'],
        });

        await alert.present();
      }
    );
  }

  get email() {
    return this.credentialForm.get('email');
  }

  get password() {
    return this.credentialForm.get('password');
  }
}
