import { io } from 'socket.io-client';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';

export const socket = io(SERVER_URL, { autoConnect: false });

// Token por aba (sessionStorage): identifica o jogador para reconexão e
// permite testar com duas abas no mesmo navegador.
export function getToken() {
    let token = sessionStorage.getItem('wooper-token');
    if (!token) {
        token = typeof crypto !== 'undefined' && crypto.randomUUID
            ? crypto.randomUUID()
            : `t-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        sessionStorage.setItem('wooper-token', token);
    }
    return token;
}
