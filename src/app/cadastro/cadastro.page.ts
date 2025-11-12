import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// [CORREÇÃO]: LoadingController e ToastController são SERVIÇOS
// e são importados de '@ionic/angular'
import { LoadingController, ToastController } from '@ionic/angular';

// [CORREÇÃO]: Apenas os COMPONENTES Visuais são importados de '@ionic/angular/standalone'
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
  // Removido LoadingController e ToastController daqui
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
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
export class CadastroPage implements OnInit {
  cadastroForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loadingCtrl: LoadingController, // 3. Injete
    private toastCtrl: ToastController     // 4. Injete
  ) {
    this.cadastroForm = this.fb.group({
      nome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit() { }

  async onRegister() {
    // Não faça nada se o formulário for inválido
    // (A Solução 1 [disabled] já cuida disso, mas é uma boa dupla verificação)
    if (this.cadastroForm.invalid) {
      console.log('Formulário inválido');
      return;
    }

    // 5. Crie e mostre o loading
    // Você já tem o CSS .custom-loading no seu SCSS
    const loading = await this.loadingCtrl.create({
      message: 'Cadastrando...',
      cssClass: 'custom-loading', // Usando sua classe CSS!
      spinner: 'crescent',
    });
    await loading.present();

    try {
      // Extrai os valores do formulário
      const { nome, email, password } = this.cadastroForm.value;

      console.log('Tentando registrar:', email);
      
      // AQUI é onde você colocaria sua lógica de Firebase
      // ou API para salvar o usuário.
      // Ex: await this.authService.register(email, password);
      
      // Vamos simular uma espera de 2 segundos:
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Registro bem-sucedido, navegando para /login');

      // 6. Se tudo der certo, mostre um toast de sucesso
      await this.showToast('Cadastro realizado com sucesso!', 'success');

      // 7. Navegue para o login
      this.router.navigateByUrl('/login');

    } catch (error) {
      console.error('Erro no registro:', error);
      // 8. Se der erro, mostre um toast de erro
      await this.showToast('Erro ao cadastrar. Tente novamente.', 'danger');
      
    } finally {
      // 9. INDEPENDENTE de sucesso ou erro, feche o loading
      await loading.dismiss();
    }
  }

  // Função auxiliar para mostrar Toasts (mensagens flutuantes)
  async showToast(message: string, color: 'success' | 'danger' = 'success') {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'top'
    });
    await toast.present();
  }
}