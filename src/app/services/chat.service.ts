import { Injectable, NgZone } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

export interface ChatUser {
  _id: string;
  username: string;
  email: string;
  role?: string;
  fotoPerfil?: string;
  tipoCliente?: 'comprador' | 'arrendatario' | 'propietario' | null;
}

export interface ChatMessage {
  _id?: string;
  emisorEmail: string;
  receptorEmail: string;
  mensaje: string;
  fecha?: string | Date;
  archivoUrl?: string | null;
  tipoDocumento?: string | null;
  leido?: boolean;
  nombreCliente?: string;
}

export interface EnviarMensajePayload {
  emisorEmail: string;
  receptorEmail: string;
  mensaje?: string;
  archivo?: File;
  tipoDocumento?: string;
  nombreCliente?: string;
}

export interface ChatThreadItem {
  email: string;
  username?: string;
  fotoPerfil?: string;
  lastMessage: {
    _id: string;
    mensaje: string;
    fecha: string | Date;
    leido?: boolean;
    archivoUrl?: string | null;
    tipoDocumento?: string | null;
  };
}


@Injectable({ providedIn: 'root' })
export class ChatService {
  private api = environment.apiUrl;
  private socketUrl = (environment as any).socketUrl || this.api.replace(/\/api\/?$/, '');
  private socket?: Socket;
  private connected$ = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private zone: NgZone
  ) {}

  private authHeaders(skipContentType = false): HttpHeaders {
    const token = this.auth.obtenerToken();
    let h = new HttpHeaders({ Authorization: `Bearer ${token}` });
    if (!skipContentType) h = h.set('Content-Type', 'application/json');
    return h;
  }

  getUsuarios(): Observable<ChatUser[]> {
    return this.http.get<ChatUser[]>(`${this.api}/auth/users`, {
      headers: this.authHeaders(),
    });
  }

  getRelacion(clienteEmail: string) {
    return this.http.get(`${this.api}/relaciones/${clienteEmail}`, {
      headers: this.authHeaders(),
    });
  }

  getAgentes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/auth/agentes`); // o /usuarios/agentes si ya filtras en backend
  }



  actualizarTipoCliente(clienteEmail: string, tipoCliente: string) {
    return this.http.post(
      `${this.api}/relaciones/actualizar`,
      { clienteEmail, tipoCliente },
      { headers: this.authHeaders() }
    );
  }

  getThreads(): Observable<ChatThreadItem[]> {
    return this.http.get<ChatThreadItem[]>(`${this.api}/chat/threads`, {
      headers: this.authHeaders(),
    });
  }

  getMensajes(yoEmail: string, otroEmail: string): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(
      `${this.api}/chat/${encodeURIComponent(yoEmail)}/${encodeURIComponent(otroEmail)}`,
      { headers: this.authHeaders() }
    );
  }

  onNuevoLead(): Observable<any> {
    if (!this.socket) this.conectarSocket();
    return new Observable<any>((observer) => {
      const handler = (payload: any) =>
        this.zone.run(() => observer.next(payload));
      this.socket?.on("nuevoLead", handler);
      return () => this.socket?.off("nuevoLead", handler);
    });
  }


  marcarLeido(mensajeId: string, leido = true): Observable<any> {
    return this.http.patch(
      `${this.api}/chat/marcar-leido/${encodeURIComponent(mensajeId)}`,
      { leido },
      { headers: this.authHeaders() }
    );
  }

  enviarMensaje(payload: EnviarMensajePayload): Observable<any> {
    const hasFile = !!payload.archivo;
    if (hasFile) {
      const fd = new FormData();
      fd.append('emisorEmail', payload.emisorEmail);
      fd.append('receptorEmail', payload.receptorEmail);
      fd.append('mensaje', payload.mensaje || '');
      if (payload.nombreCliente) fd.append('nombreCliente', payload.nombreCliente);
      if (payload.tipoDocumento) fd.append('tipoDocumento', payload.tipoDocumento);
      if (payload.archivo) fd.append('archivo', payload.archivo);
      return this.http.post<any>(`${this.api}/chat/enviar`, fd, {
        headers: this.authHeaders(true),
      });
    }
    const body = {
      emisorEmail: payload.emisorEmail,
      receptorEmail: payload.receptorEmail,
      mensaje: payload.mensaje || '',
      ...(payload.nombreCliente ? { nombreCliente: payload.nombreCliente } : {}),
      ...(payload.tipoDocumento ? { tipoDocumento: payload.tipoDocumento } : {}),
    };
    return this.http.post<any>(`${this.api}/chat/enviar`, body, {
      headers: this.authHeaders(),
    });
  }

  conectarSocket(userEmail?: string): void {
    if (this.socket?.connected) return;
    const token = this.auth.obtenerToken() || '';
    this.socket = io(this.socketUrl, {
      transports: ['websocket'],
      withCredentials: false,
      auth: { token, email: userEmail || '' },
      query: userEmail ? { email: userEmail } : undefined,
    });
    this.socket.on('connect', () => {
      this.zone.run(() => this.connected$.next(true));
    });
    this.socket.on('disconnect', () => {
      this.zone.run(() => this.connected$.next(false));
    });
  }

  estadoConexion$(): Observable<boolean> {
    return this.connected$.asObservable();
  }


  onNuevoMensaje(): Observable<ChatMessage> {
    if (!this.socket) this.conectarSocket();
    return new Observable<ChatMessage>((observer) => {
      const handler = (msg: any) => this.zone.run(() => observer.next(msg as ChatMessage));
      (this.socket as Socket).on('nuevoMensaje', handler);
      return () => (this.socket as Socket).off('nuevoMensaje', handler);
    });
  }

  emitirNuevoMensaje(mensaje: ChatMessage) {
    if (!this.socket) this.conectarSocket();
    this.socket?.emit('nuevoMensaje', mensaje);
  }

  desconectarSocket(): void {
    this.socket?.disconnect();
    this.socket = undefined;
    this.connected$.next(false);
  }

getUsuarioActual() {
  return this.http.get(`${this.api}/auth/me`, { headers: this.authHeaders() });
}


}
