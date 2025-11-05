import { Progress } from '../types';
import { API_BASE_URL, STORAGE_KEYS } from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import client from './client';

export const progressAPI = {
  register: async (formData: FormData): Promise<Progress> => {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
    const url = `${API_BASE_URL}/progress/`;

    return new Promise((resolve, reject) => {
      try {
        const xhr = new XMLHttpRequest();

        xhr.open('POST', url, true);

        if (token) {
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }

        xhr.onload = () => {
        if (xhr.status >= 300 && xhr.status < 400) {
          const redirectUrl = xhr.getResponseHeader('Location') || url;
          
          const redirectXhr = new XMLHttpRequest();
          redirectXhr.open('POST', redirectUrl, true);
          
          if (token) {
            redirectXhr.setRequestHeader('Authorization', `Bearer ${token}`);
          }
          
          redirectXhr.onload = () => {
            if (redirectXhr.status >= 200 && redirectXhr.status < 300) {
              try {
                const data = JSON.parse(redirectXhr.responseText);
                resolve(data);
              } catch (parseError) {
                reject(new Error('Erro ao processar resposta do servidor'));
              }
            } else {
              let errorData;
              try {
                errorData = JSON.parse(redirectXhr.responseText);
              } catch {
                errorData = { detail: `HTTP error! status: ${redirectXhr.status}` };
              }
              const error: any = new Error(errorData.detail || `HTTP error! status: ${redirectXhr.status}`);
              error.response = {
                status: redirectXhr.status,
                data: errorData,
              };
              reject(error);
            }
          };
          
          redirectXhr.onerror = () => {
            reject(new Error('Erro de rede ao seguir redirect'));
          };
          
          redirectXhr.timeout = 60000;
          redirectXhr.send(formData as any);
          return;
        }

        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            resolve(data);
          } catch (parseError) {
            reject(new Error('Erro ao processar resposta do servidor'));
          }
        } else {
          let errorData;
          try {
            errorData = JSON.parse(xhr.responseText);
          } catch {
            errorData = { detail: `HTTP error! status: ${xhr.status}` };
          }
          const error: any = new Error(errorData.detail || `HTTP error! status: ${xhr.status}`);
          error.response = {
            status: xhr.status,
            data: errorData,
          };
          reject(error);
        }
      };

      xhr.onerror = (event) => {
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
        const error: any = new Error('Tempo de requisição esgotado. Tente novamente.');
        error.code = 'TIMEOUT';
        reject(error);
      };

      xhr.timeout = 60000;

      try {
        xhr.send(formData as any);
      } catch (sendError: any) {
        reject(new Error(`Erro ao enviar requisição: ${sendError.message}`));
      }
      } catch (initError: any) {
        reject(new Error(`Erro ao inicializar requisição: ${initError.message}`));
      }
    });
  },

  listByConstruction: async (constructionId: string | number): Promise<Progress[]> => {
    const response = await client.get(`/progress/construction/${constructionId}`);
    return response.data;
  },
};
