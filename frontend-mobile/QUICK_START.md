# 🚀 Guia Rápido de Início

## Passos para Executar o App Mobile

### 1️⃣ Configure o IP automaticamente

```bash
cd frontend-mobile
npm run setup
```

Isso criará o arquivo `.env` com o IP da sua máquina.

### 2️⃣ Configure CORS no Backend

Edite `backend/src/configs/env.py` e mude a linha:

**DE:**
```python
cors_origins: list[str] = ["http://localhost:3000", "http://localhost:5173"]
```

**PARA:**
```python
cors_origins: list[str] = ["*"]  # Para desenvolvimento
```

### 3️⃣ Inicie o Backend com Host 0.0.0.0

```bash
cd backend
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

⚠️ O `--host 0.0.0.0` é **ESSENCIAL** para o mobile funcionar!

### 4️⃣ Limpe o Cache e Inicie o Mobile

```bash
cd frontend-mobile
npx expo start --clear
```

### 5️⃣ Execute no Dispositivo

- **Dispositivo Físico**: Escaneie o QR code com o Expo Go
- **Emulador Android**: Pressione `a`
- **Simulador iOS**: Pressione `i`

---

## ✅ Checklist de Problemas Comuns

### Texto não aparece ou não consigo digitar?
- [ ] Limpei o cache: `npx expo start --clear`
- [ ] Reiniciei o Metro bundler
- [ ] Limpei o cache do Expo Go no dispositivo

### Erro de "Network" ou OPTIONS request?
- [ ] Backend rodando com `--host 0.0.0.0`
- [ ] CORS configurado para `["*"]`
- [ ] `.env` tem o IP correto (não `localhost`)
- [ ] Testei `http://MEU_IP:8000/docs` no navegador

### Cannot connect to API?
- [ ] Estou na mesma rede Wi-Fi
- [ ] Backend, MinIO e PostgreSQL estão rodando
- [ ] Firewall não está bloqueando a porta 8000
- [ ] IP no `.env` está correto

---

## 📱 Credenciais de Teste

Depois de criar um admin com o script:

```bash
cd backend
python scripts/create_admin.py
```

Use:
- **Registro**: 1234567 (ou o que você configurou)
- **Senha**: admin123 (ou a que você configurou)

---

## 🎯 Funcionalidade Principal

1. Faça login
2. Vá para "Obras"
3. Toque em uma obra
4. Toque no botão FAB (câmera) no canto inferior direito
5. Tire uma foto
6. Adicione observações (opcional)
7. Envie!

---

## 🆘 Precisa de Ajuda?

Veja documentação completa:
- `README.md` - Documentação completa
- `backend/MOBILE_SETUP.md` - Configuração detalhada do backend
- Troubleshooting completo no `README.md`

---

## 🎉 Tudo Funcionando?

O app deve estar rodando perfeitamente! Principais recursos:
- ✅ Login e autenticação
- ✅ Dashboard com estatísticas
- ✅ Lista de obras
- ✅ Detalhes da obra
- ✅ **Captura de foto com câmera**
- ✅ Upload de progresso
- ✅ Comparação com BIM
- ✅ Perfil do usuário

**Boa codificação! 🚀**

