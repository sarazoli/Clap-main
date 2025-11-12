import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// Importe os SERVIÇOS
import { LoadingController, ToastController } from '@ionic/angular';

// Importe os COMPONENTES
import { 
  IonContent, 
  IonCard, 
  IonCardContent, 
  IonItem, 
  IonLabel, 
  IonInput, 
  IonButton, 
  IonText, 
  IonInputPasswordToggle
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonContent,
    IonCard,
    IonCardContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonText,
    IonInputPasswordToggle
  ]
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loadingCtrl: LoadingController, // Injete
    private toastCtrl: ToastController      // Injete
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit() { }

  async onLogin() {
    // Verificação de validade (segurança extra)
    if (this.loginForm.invalid) {
      console.log('Formulário de login inválido');
      return;
    }

    // Crie e mostre o loading
    const loading = await this.loadingCtrl.create({
      message: 'Entrando...',
      cssClass: 'custom-loading', // Usando sua classe CSS!
      spinner: 'crescent',
    });
    await loading.present();

    try {
      const { email, password } = this.loginForm.value;

      console.log('Tentando login com:', email);
      
      // AQUI é onde você colocaria sua lógica de Firebase
      // ou API para autenticar o usuário.
      // Ex: await this.authService.login(email, password);
      
      // Vamos simular uma espera de 2 segundos:
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Login bem-sucedido, navegando para /home');

      // Se tudo der certo, navegue para a home
      // (Não precisa de toast de sucesso se você vai mudar de tela)
      this.router.navigateByUrl('/home');

    } catch (error) {
      console.error('Erro no login:', error);
      // Se der erro, mostre um toast de erro
      await this.showToast('Email ou senha inválidos.', 'danger');
      
    } finally {
      // Feche o loading
      await loading.dismiss();
    }
  }

  // Função auxiliar para o link de cadastro
  goToCadastro() {
    this.router.navigateByUrl('/cadastro');
  }

  // Função auxiliar para mostrar Toasts
  async showToast(message: string, color: 'success' | 'danger' = 'success') {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2500, // Um pouco mais de tempo
      color: color,
      position: 'top'
    });
    await toast.present();
  }
}