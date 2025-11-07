import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router,RouterLink } from '@angular/router';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardContent, IonButton, 
  IonInput, IonIcon, IonInputPasswordToggle 
} from '@ionic/angular/standalone';
import { LoadingController, ToastController } from '@ionic/angular';

import { AuthService } from '../services/authservice'; // ✅ mantém como está, se seu arquivo se chama authservice.ts

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
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
    IonButton,
    IonInput,
    IonIcon,
    IonInputPasswordToggle,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CadastroPage implements OnInit {
  cadastroForm!: FormGroup; // Representa o formulário de cadastro

  constructor(
    private formBuilder: FormBuilder, // Ajuda a criar FormGroup
    private router: Router, // Permite navegar entre páginas
    private loadingController: LoadingController, // Para mostrar loading
    private toastController: ToastController, // Para mostrar mensagens rápidas
    private authService: AuthService // Serviço que faz comunicação com Firebase
  ) {}

  ngOnInit() {
    // Inicializa o formulário com validações
    this.cadastroForm = this.formBuilder.group({
      nome: ['', Validators.required], // Campo nome obrigatório
      email: ['', [Validators.required, Validators.email]], // Campo email obrigatório e válido
      password: ['', [Validators.required, Validators.minLength(8)]], // Senha obrigatória com no mínimo 8 caracteres
    });
  }

  // Função chamada quando o usuário clica em "Cadastrar"
  async onRegister() {
    console.log('Botão clicado!'); // Teste para confirmar clique

    if (this.cadastroForm.invalid) {
      // Se algum campo estiver inválido, mostra toast e sai da função
      this.showToast('Por favor, preencha todos os campos corretamente.');
      return;
    }

    const { nome, email, password } = this.cadastroForm.value; // Pega valores do formulário

    // Cria loading com bolhas enquanto processa cadastro
    const loading = await this.loadingController.create({ 
      message: 'Cadastrando...', // Mensagem exibida
      spinner: 'bubbles', // Tipo de loading
      cssClass: 'custom-loading', // Classe CSS customizada
    });
    await loading.present(); // Exibe o loading

    try {
      // Chama serviço de cadastro passando email, senha e nome
      await this.authService.register(email, password, nome);
      await loading.dismiss(); // Fecha loading
 
      this.router.navigateByUrl('/login', { replaceUrl: true }); // Navega para login
    } catch (error: any) {
      await loading.dismiss(); // Fecha loading em caso de erro
      console.error(error); // Mostra erro no console
      this.showToast('Erro no cadastro: ' + (error.message || 'Erro desconhecido')); // Mostra mensagem de erro
    }
  }

  // Função para mostrar mensagens rápidas (toast)
  private async showToast(message: string) {
    const toast = await this.toastController.create({
      message, // Mensagem do toast
      duration: 2000, // Tempo que fica na tela (2s)
      color: 'medium', // Cor do toast
    });
    await toast.present(); // Exibe toast
  }
}