// 📦 Importações principais do Angular e módulos básicos
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

// 🎬 Importação do serviço responsável por buscar dados dos filmes
import { FilmeService } from '../services/filme.service';
import { FilmeDetalhes } from '../services/filme.service';

// 🧩 Importação dos componentes standalone do Ionic usados no template
import { 
  IonContent, 
  IonHeader, 
  IonToolbar, 
  IonButtons, 
  IonBackButton, 
  IonIcon 
} from '@ionic/angular/standalone';

// 🧠 Importação e registro de ícones do Ionicons
import { addIcons } from 'ionicons';
import { person } from 'ionicons/icons';

// 🧱 Decorator que define o componente como uma página standalone do Ionic
@Component({
  selector: 'app-detalhes',                     // seletor usado no HTML
  templateUrl: './detalhes.page.html',          // template associado
  styleUrls: ['./detalhes.page.scss'],          // estilos específicos da página
  standalone: true,                             // marca como componente standalone (sem precisar de módulo)
  imports: [                                    // módulos e componentes que a página utiliza
    CommonModule, 
    FormsModule, 
    IonContent, 
    IonHeader, 
    IonToolbar, 
    IonButtons, 
    IonBackButton, 
    IonIcon,
  ]
})
export class DetalhesPage implements OnInit {

  // 🆔 ID do filme recebido pela rota (ex: /detalhes/123)
  filmeId: number = 0; // inicializado como 0 por segurança

  // 🎞️ Objeto que armazenará os detalhes do filme vindos da API
  detalhesFilme: FilmeDetalhes = {} as FilmeDetalhes;

  // ⚙️ Construtor: injeta dependências (rota e serviço de filmes)
  constructor(
    private route: ActivatedRoute,     // permite capturar parâmetros da rota
    private filmeService: FilmeService // fornece acesso aos métodos de busca da API
  ) {
    // 🔧 Registra o ícone 'person' usado no template para atores sem foto
    addIcons({ person });
  }

  // 🚀 Método do ciclo de vida chamado quando o componente é inicializado
  ngOnInit() {
    // Obtém o parâmetro "id" da URL (por exemplo: /detalhes/1280450)
    const idString = this.route.snapshot.paramMap.get('id');
    
    // Converte o ID obtido em número; se não existir, define como 0
    this.filmeId = idString ? +idString : 0; 
    
    // Se o ID for válido (> 0), busca os detalhes do filme
    if (this.filmeId > 0) {
      this.carregarDetalhesFilme(this.filmeId);
    }
  }

  // 🎬 Método responsável por buscar os detalhes do filme na API
  carregarDetalhesFilme(id: number) {
    this.filmeService.getDetalhesFilme(id).subscribe({
      // ✅ Quando a resposta é bem-sucedida, salva no objeto 'detalhesFilme'
      next: (res) => {
        this.detalhesFilme = res; 
        console.log('Detalhes Carregados:', this.detalhesFilme);
      },
      // ❌ Caso ocorra erro na requisição, exibe no console
      error: (err) => {
        console.error('Erro ao carregar detalhes do filme:', err);
      }
    });
  }
}
