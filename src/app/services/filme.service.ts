import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, forkJoin, switchMap, of } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * 🎬 Interface que representa a estrutura completa dos detalhes de um filme,
 * incluindo elenco e informações adicionais retornadas pela API do TMDB.
 */
export interface FilmeDetalhes {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string;
  poster_path: string;
  release_date: string;
  runtime: number;
  credits: {
    cast: Array<{
      name: string;
      character: string;
      profile_path: string;
    }>;
    crew: any[];
  };
  // Outras propriedades podem ser adicionadas conforme a necessidade
}

@Injectable({
  providedIn: 'root', // 🔹 Torna o serviço disponível em toda a aplicação
})
export class FilmeService {
  /** 🔑 Chave da API do TMDB (armazenada em environment.ts) */
  private readonly apiKey = environment.tmdbApiKey;

  /** 🌐 URL base da API do The Movie Database */
  private readonly baseUrl = 'https://api.themoviedb.org/3';

  /** 🖼️ Base de URLs para imagens de pôster */
  private readonly imgBase = 'https://image.tmdb.org/t/p/w500';

  /** 🏙️ Base de URLs para imagens de fundo (backdrop) */
  private readonly backdropBase = 'https://image.tmdb.org/t/p/w780';

  /** 🗂️ Mapa local que armazena os gêneros (id → nome) */
  private genreMap: Record<number, string> = {};

  constructor(private http: HttpClient) {}

  // ============================================================
  // 🔹 MÉTODOS AUXILIARES E DE BUSCA DE FILMES
  // ============================================================

  /**
   * 🔹 Carrega e armazena os gêneros de filmes (id → nome).
   * Faz cache local para evitar múltiplas requisições à API.
   */
  private carregarGeneros(): Observable<Record<number, string>> {
    // Se já estiver carregado, evita nova requisição
    if (Object.keys(this.genreMap).length > 0) {
      return of(this.genreMap);
    }

    // Busca os gêneros na API e cria um dicionário local
    return this.http
      .get<any>(`${this.baseUrl}/genre/movie/list?api_key=${this.apiKey}&language=pt-BR`)
      .pipe(
        map((res) => {
          this.genreMap = {};
          res.genres.forEach((g: any) => (this.genreMap[g.id] = g.name));
          return this.genreMap;
        })
      );
  }

  /**
   * 🔹 Retorna filmes em lançamento (endpoint: /movie/upcoming)
   * Inclui informações de título, data, pôster, fundo e gêneros.
   */
  getFilmes(): Observable<any[]> {
    return forkJoin({
      generos: this.carregarGeneros(),
      filmes: this.http.get<any>(
        `${this.baseUrl}/movie/upcoming?api_key=${this.apiKey}&language=pt-BR`
      ),
    }).pipe(
      map(({ generos, filmes }) =>
        filmes.results.map((filme: any) => ({
          id: filme.id,
          title: filme.title,
          release_date: filme.release_date,
          poster: filme.poster_path
            ? this.imgBase + filme.poster_path
            : 'assets/noimg.jpg',
          backdrop: filme.backdrop_path
            ? this.backdropBase + filme.backdrop_path
            : 'assets/noimg.jpg',
          genre_names: filme.genre_ids.map((id: number) => generos[id]).filter(Boolean),
        }))
      )
    );
  }

  /**
   * 🔹 Retorna filmes populares (endpoint: /movie/popular)
   * Similar a getFilmes(), mas com foco nos mais assistidos.
   */
  getFilmesPopulares(): Observable<any[]> {
    return forkJoin({
      generos: this.carregarGeneros(),
      filmes: this.http.get<any>(
        `${this.baseUrl}/movie/popular?api_key=${this.apiKey}&language=pt-BR`
      ),
    }).pipe(
      map(({ generos, filmes }) =>
        filmes.results.map((filme: any) => ({
          id: filme.id,
          title: filme.title,
          release_date: filme.release_date,
          poster: filme.poster_path
            ? this.imgBase + filme.poster_path
            : 'assets/noimg.jpg',
          backdrop: filme.backdrop_path
            ? this.backdropBase + filme.backdrop_path
            : 'assets/noimg.jpg',
          genre_names: filme.genre_ids.map((id: number) => generos[id]).filter(Boolean),
        }))
      )
    );
  }

  /**
   * 🔹 Busca filmes por texto (endpoint: /search/movie)
   * Retorna resultados correspondentes ao termo digitado pelo usuário.
   * Caso o texto esteja vazio, retorna os filmes em lançamento.
   */
  getFilmesPorBusca(query: string): Observable<any[]> {
    if (!query.trim()) return this.getFilmes(); // Se busca vazia → retorna lançamentos

    return forkJoin({
      generos: this.carregarGeneros(),
      filmes: this.http.get<any>(
        `${this.baseUrl}/search/movie?api_key=${this.apiKey}&language=pt-BR&query=${encodeURIComponent(query)}`
      ),
    }).pipe(
      map(({ generos, filmes }) =>
        filmes.results.map((filme: any) => ({
          id: filme.id,
          title: filme.title,
          release_date: filme.release_date,
          poster: filme.poster_path
            ? this.imgBase + filme.poster_path
            : 'assets/noimg.jpg',
          backdrop: filme.backdrop_path
            ? this.backdropBase + filme.backdrop_path
            : 'assets/noimg.jpg',
          genre_names: filme.genre_ids.map((id: number) => generos[id]).filter(Boolean),
        }))
      )
    );
  }

  /**
   * 🔹 Retorna filmes filtrados por gênero (categoria)
   * Faz correspondência pelo nome do gênero e usa o endpoint /discover/movie.
   */
  getFilmesPorCategoria(genreName: string): Observable<any[]> {
    return this.carregarGeneros().pipe(
      switchMap((generos) => {
        // Encontra o ID do gênero pelo nome
        const genreId = Object.entries(generos).find(
          ([, name]) => name.toLowerCase() === genreName.toLowerCase()
        )?.[0];

        if (!genreId) return of([]); // Se não encontrou, retorna vazio

        return this.http
          .get<any>(
            `${this.baseUrl}/discover/movie?api_key=${this.apiKey}&language=pt-BR&with_genres=${genreId}`
          )
          .pipe(
            map((res) =>
              res.results.map((filme: any) => ({
                id: filme.id,
                title: filme.title,
                release_date: filme.release_date,
                poster: filme.poster_path
                  ? this.imgBase + filme.poster_path
                  : 'assets/noimg.jpg',
                backdrop: filme.backdrop_path
                  ? this.backdropBase + filme.backdrop_path
                  : 'assets/noimg.jpg',
                genre_names: filme.genre_ids.map((id: number) => this.genreMap[id]).filter(Boolean),
              }))
            )
          );
      })
    );
  }

  /**
   * 🔹 Busca os detalhes completos de um filme específico.
   * Inclui informações adicionais como elenco e equipe técnica (credits).
   * Endpoint: /movie/{id}?append_to_response=credits
   */
  getDetalhesFilme(id: number): Observable<FilmeDetalhes> {
    const url = `${this.baseUrl}/movie/${id}?api_key=${this.apiKey}&language=pt-BR&append_to_response=credits`;
    return this.http.get<FilmeDetalhes>(url); // Tipagem aplicada ao retorno
  }
}

// 💡 Observação: a interface FilmeDetalhes foi movida para fora da classe
// para evitar o erro TS1068 que ocorria quando ela estava dentro do serviço.
