# Login usando Ionic

Hacer un login básico utilizando Ionic, Visual Studio Code y Android Studio

## Clonar
```bash
Git clone https://github.com/LascanoAldahir/Examen-Blog-Login.git
```

## Pasos

- 1 Pre requisitos

Tener instalado Node.JS y Npm
Tener un IDE para customizar nuestro proyecto en este caso Visual Studio Code
Tener una cuenta de Firebase Authenticacion y sus credenciales
Tener Android Studio configurado
Estos se pueden descargar desde la pagina web oficial de dependiendo de el OS que estes utilizando.

- 2 Empezar el proyecto

Para empezar el proyecto hay que ejecutar el siguiente comando

```bash
npx ionic Start nombreproyecto blank --type=angular
```

En este nombreproyecto es el nombre que le vamos a poner a nuestro proyecto, por lo que se puede poner el
que tu quieras para tu proyecto.

En este tambien debemos elegir que módulos vamos a ocupar, en este caso vamos a ocupar "NGModules"

Al finalizar no es necesario tener una cuenta de Ionic, asi que eso podemos indicar que no y con eso nuestro
proyecto se ha creado

- 3 Navegar al directorio e intalación dependencias
Utilizando la consola CMD podemos ir a el directorio de nuestro proyecto con 
```bash
cd nombreproyecto
```
Dentro de esta carpeta tendremos que instalar los módulos necesarios para que se ejecute nuestro proyecto:

```bash
npm install
```
Después de instalar los módulos del proyecto, es necesario instalar firebase authentication, ya que este nos dara los servicios necesarios para poder generar la logica del login y registro
Para ello necesitamos ejecutar el siguiente comando
```bash
npm install firebase @angular/fire
npx ionic g service services/auth
npx ionic g page login
npx ionic g page home
```
Estos lo que nos ayudan es a configurar nuestro Firebase que si no tenemos cuenta debemos registrarnos, generar una apikey web en authentication con correo y contraseña.
Para iniciar la configuracion de nuestro Firebase necesitamos estos comandos.
```bash
firebase login // si aun no inicias sesión
firebase init // configuración de firebase para nuestra aplicación
```
Cuando generemos nuestro apikey nos debe entregar algo como esto
```bash
firebaseConfig: {
    apiKey: "TU_API_KEY",
    authDomain: "TU_AUTH_DOMAIN",
    projectId: "TU_PROJECT_ID",
    storageBucket: "TU_STORAGE_BUCKET",
    messagingSenderId: "TU_MESSAGING_SENDER_ID",
    appId: "TU_APP_ID",
    measurementId: "TU_MEASUREMENT_ID"
  }
```
- 4 Funcionalidad
Para empezar a generar el código necesitamos realizar una importación de los modulos de autenticación
```bash
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebaseConfig)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```
Pero al poner ese código necesitamos tambien poner nuestras credenciales en nuestro archivo "environment.ts"
Ahora con los módulos importados podemos empezar a realizar la lógica del login y que este nos redireccione a una página home.

Primero se realiza la codificación de la lógica del login en el archivo login.page.ts
```bash
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
```
Con este código lo que hacemos, es que en el login la persona debe ingresar un correo y contraseña, esto para poder o logearse o registrarse.
Ahora ya con la lógica necesaria para el login podemos pasar a hacer el HTML
```bash
<ion-header>
  <ion-toolbar color="primary">
    <ion-title>Devdactic Chat</ion-title>
  </ion-toolbar>
</ion-header>
<ion-content class="ion-padding">
  <form [formGroup]="credentialForm">
    <ion-item>
      <ion-input
        placeholder="Email address"
        formControlName="email"
        autofocus="true"
        clearInput="true"
      ></ion-input>
    </ion-item>
    <div *ngIf="email && (email.dirty || email.touched) && email.errors" class="errors">
      <span *ngIf="email.errors?.required">Email is required</span>
      <span *ngIf="email.errors?.email">Email is invalid</span>
    </div>
    <ion-item>
      <ion-input
      placeholder="Password"
      type="password"
      formControlName="password"
      clearInput="true"
    ></ion-input>
    </ion-item>
    <div *ngIf="password && (password.dirty || password.touched) && password.errors" class="errors">
      <span *ngIf="password.errors?.required">Password is required</span>
      <span *ngIf="password.errors?.minlength">Password needs to be 6 characters</span>
    </div>
  </form>
    <ion-button (click)="signUp()" expand="full">Sing up</ion-button>
    <ion-button (click)="signIn()" expand="full" color="secondary">Sing in</ion-button>

</ion-content>
```
- 5 Ejecución
Para poder ejecutar nuestro proyecto simplemente necesitamos ejecutar el comando
```bash
npx ionic s
```
Este comando ejecutará nuestra aplicación de forma web, entonces podremos comprobar que la aplicación es totalmente funcional.
si se quiere ejecutar en android se necesitan 2 comandos
```bash
npx ionic build android
npx ionic capacitor open android
```
El primero comando empezará a generar los archivos necesarios para que nuestra aplicación tambien funcione en android, loque genera una carpeta android.
El segundo comando lo que hace es abrir este proyecto de Android en Android Studio, esto para poder hacer la emulación de la aplicación en android o emulación directamente en nuestro dispositivo Android a través de Wifi.
Un problema que suele ocurrir al momento de generar el build de Android es que no suele encontrar las credenciales de Firebase, para solucionar esto hay que pasar las credenciales de enviroment.ts y copiarlas tambien en enviroment.prod.ts

# Capturas
### Web
![image](https://github.com/4lanPz/AM_Login_2024A/assets/117743495/5cdf8257-dc59-4807-bed6-24c42b77b844)
![image](https://github.com/4lanPz/AM_Login_2024A/assets/117743495/f8b9a647-30ea-4e6b-99ad-d617fbca1265)
![image](https://github.com/4lanPz/AM_Login_2024A/assets/117743495/999d3b07-e546-4290-8c7a-bb210bcbf49f)

### Android
![image](https://github.com/4lanPz/AM_Login_2024A/assets/117743495/121c641e-9e4d-4f63-8d29-03552fb0bd6c)
![image](https://github.com/4lanPz/AM_Login_2024A/assets/117743495/ad6ae350-3d0f-462c-90d5-be4657246b60)
![image](https://github.com/4lanPz/AM_Login_2024A/assets/117743495/6ea8741c-9876-4976-b68c-0438a44210ee)

