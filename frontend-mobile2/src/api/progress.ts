import { Progress } from '../types';
import { API_BASE_URL, STORAGE_KEYS } from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import client from './client';

export const progressAPI = {
  register: async (formData: FormData): Promise<Progress> => {
    // No React Native, XMLHttpRequest é mais confiável para uploads de FormData
    const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
    // Adicionar barra no final para evitar redirect 307
    const url = `${API_BASE_URL}/progress/`;

    console.log('[ProgressAPI] Iniciando upload com XMLHttpRequest:', {
      url,
      hasToken: !!token,
      tokenLength: token?.length || 0,
    });

    return new Promise((resolve, reject) => {
      try {
        console.log('[ProgressAPI] Criando XMLHttpRequest...');
        const xhr = new XMLHttpRequest();

        console.log('[ProgressAPI] Abrindo conexão:', url);
        xhr.open('POST', url, true);

        // Configurar headers
        if (token) {
          console.log('[ProgressAPI] Adicionando token de autorização');
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }
        // Não definir Content-Type - o XMLHttpRequest define automaticamente com boundary

        xhr.onload = () => {
        console.log('[ProgressAPI] Resposta recebida:', {
          status: xhr.status,
          statusText: xhr.statusText,
          responseText: xhr.responseText.substring(0, 200),
        });

        // Se for redirect (301, 302, 307, 308), seguir manualmente
        if (xhr.status >= 300 && xhr.status < 400) {
          const redirectUrl = xhr.getResponseHeader('Location') || url;
          console.log('[ProgressAPI] Redirect detectado, seguindo para:', redirectUrl);
          
          // Criar nova requisição para o URL de redirect
          const redirectXhr = new XMLHttpRequest();
          redirectXhr.open('POST', redirectUrl, true);
          
          if (token) {
            redirectXhr.setRequestHeader('Authorization', `Bearer ${token}`);
          }
          
          redirectXhr.onload = () => {
            if (redirectXhr.status >= 200 && redirectXhr.status < 300) {
              try {
                const data = JSON.parse(redirectXhr.responseText);
                console.log('[ProgressAPI] Upload bem-sucedido após redirect:', data);
                resolve(data);
              } catch (parseError) {
                console.error('[ProgressAPI] Erro ao parsear resposta:', parseError);
                reject(new Error('Erro ao processar resposta do servidor'));
              }
            } else {
              let errorData;
              try {
                errorData = JSON.parse(redirectXhr.responseText);
              } catch {
                errorData = { detail: `HTTP error! status: ${redirectXhr.status}` };
              }
              console.error('[ProgressAPI] Erro na resposta após redirect:', errorData);
              const error: any = new Error(errorData.detail || `HTTP error! status: ${redirectXhr.status}`);
              error.response = {
                status: redirectXhr.status,
                data: errorData,
              };
              reject(error);
            }
          };
          
          redirectXhr.onerror = () => {
            console.error('[ProgressAPI] Erro após seguir redirect');
            reject(new Error('Erro de rede ao seguir redirect'));
          };
          
          redirectXhr.timeout = 60000;
          redirectXhr.send(formData as any);
          return;
        }

        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            console.log('[ProgressAPI] Upload bem-sucedido:', data);
            resolve(data);
          } catch (parseError) {
            console.error('[ProgressAPI] Erro ao parsear resposta:', parseError);
            reject(new Error('Erro ao processar resposta do servidor'));
          }
        } else {
          let errorData;
          try {
            errorData = JSON.parse(xhr.responseText);
          } catch {
            errorData = { detail: `HTTP error! status: ${xhr.status}` };
          }
          console.error('[ProgressAPI] Erro na resposta:', errorData);
          const error: any = new Error(errorData.detail || `HTTP error! status: ${xhr.status}`);
          error.response = {
            status: xhr.status,
            data: errorData,
          };
          reject(error);
        }
      };

      xhr.onerror = (event) => {
        console.error('[ProgressAPI] Erro de rede no XMLHttpRequest:', {
          readyState: xhr.readyState,
          status: xhr.status,
          statusText: xhr.statusText,
          responseText: xhr.responseText?.substring(0, 200),
          event,
        });
        const error: any = new Error(
          `Erro de rede ao fazer upload. Verifique:\n` +
          `- Se o servidor está rodando em ${API_BASE_URL}\n` +
          `- Se sua conexão está ativa\n` +
          `- Se o arquivo existe e está acessível\n` +
          `- Status: ${xhr.status || 'N/A'}, ReadyState: ${xhr.readyState}`
        );
        error.code = 'NETWORK_ERROR';
        error.status = xhr.status;
        error.readyState = xhr.readyState;
        reject(error);
      };

      xhr.ontimeout = () => {
        console.error('[ProgressAPI] Timeout no XMLHttpRequest');
        const error: any = new Error('Tempo de requisição esgotado. Tente novamente.');
        error.code = 'TIMEOUT';
        reject(error);
      };

      // Configurar timeout de 60 segundos
      xhr.timeout = 60000;

      // Enviar FormData
      try {
        console.log('[ProgressAPI] Enviando FormData...');
        console.log('[ProgressAPI] FormData keys:', (formData as any)._parts?.map((p: any) => p[0]) || 'N/A');
        xhr.send(formData as any);
        console.log('[ProgressAPI] FormData enviado, aguardando resposta...');
      } catch (sendError: any) {
        console.error('[ProgressAPI] Erro ao enviar requisição:', sendError);
        reject(new Error(`Erro ao enviar requisição: ${sendError.message}`));
      }
      } catch (initError: any) {
        console.error('[ProgressAPI] Erro ao inicializar XMLHttpRequest:', initError);
        reject(new Error(`Erro ao inicializar requisição: ${initError.message}`));
      }
    });
  },

  listByConstruction: async (constructionId: string | number): Promise<Progress[]> => {
    const response = await client.get(`/progress/construction/${constructionId}`);
    return response.data;
  },
};
