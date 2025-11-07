import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink} from '@angular/router';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardContent, IonCardHeader, 
  IonCardSubtitle, IonCardTitle, IonButton, IonInput, IonIcon, IonInputPasswordToggle 
} from '@ionic/angular/standalone';
import { LoadingController, ToastController } from '@ionic/angular';

import { AuthService } from '../services/authservice'; // 👈 Importa aqui também!

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonButton,
    IonInput,
    IonIcon,
    IonInputPasswordToggle,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private authService: AuthService // 👈 Injetado aqui
  ) {}

  ngOnInit() {
    // Inicializa o formulário de login
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]], // Email obrigatório e válido
      password: ['', [Validators.required, Validators.minLength(8)]] // Senha obrigatória com mínimo 8
    });
  }

  async onLogin() {
    if (this.loginForm.invalid) {
      // Mostra toast se formulário inválido
      this.showToast('Por favor, preencha todos os campos corretamente.');
      return;
    }

    const { email, password } = this.loginForm.value; // Pega valores do formulário

    // Cria loading enquanto processa login
    const loading = await this.loadingController.create({ 
      message: 'Entrando...',
      spinner: 'bubbles', // Tipo de spinner
      cssClass: 'custom-loading', // Classe customizada do CSS
    });
    await loading.present(); // Mostra o loading

    try {
      await this.authService.login(email, password); // Chama serviço de login
      await loading.dismiss(); // Fecha loading
   
      this.router.navigateByUrl('/home', { replaceUrl: true }); // Navega para home
    } catch (error: any) {
      await loading.dismiss(); // Fecha loading em caso de erro
      this.showToast('Erro no login: ' + error.message); // Mostra erro
    }
  }

  // Função para mostrar toast
  private async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color: 'medium' // Cor do toast
    });
    await toast.present(); // Exibe o toast
  }
}
