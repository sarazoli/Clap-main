import { Injectable } from '@angular/core';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Conecta o app ao Firebase usando as configurações do projeto
  private app = initializeApp(environment.firebaseConfig);

  // Conecta à parte de autenticação (login e cadastro)
  private auth = getAuth(this.app);

  // Conecta ao banco de dados Firestore (onde ficam guardadas as informações dos usuários)
  private db = getFirestore(this.app);

  // Cadastra um novo usuário no Firebase e salva os dados no banco
  async register(email: string, password: string, nome: string) {
    try {
      // Cria o usuário na parte de autenticação
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;

      // Salva os dados do usuário no banco Firestore
      await setDoc(doc(this.db, 'usuarios', user.uid), {
        nome: nome,
        email: email,
        criadoEm: new Date() // Registra o momento do cadastro
      });

      return user; // Retorna os dados do usuário criado
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      throw error; // Envia o erro para ser tratado na tela
    }
  }

  // Faz o login do usuário com e-mail e senha
  async login(email: string, password: string) {
    return await signInWithEmailAndPassword(this.auth, email, password);
  }

  // Faz o logout (sair da conta)
  async logout() {
    return await signOut(this.auth);
  }
}
