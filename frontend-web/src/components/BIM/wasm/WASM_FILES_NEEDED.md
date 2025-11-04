# Arquivos WASM Necessários

Os seguintes arquivos devem estar neste diretório para o visualizador IFC funcionar:

- `web-ifc.wasm`
- `web-ifc-mt.wasm`

## Como copiar os arquivos

### Windows PowerShell:
```powershell
Copy-Item node_modules\web-ifc\*.wasm public\wasm\
```

### Windows CMD:
```cmd
copy node_modules\web-ifc\*.wasm public\wasm\
```

### Linux/Mac:
```bash
cp node_modules/web-ifc/*.wasm public/wasm/
```

## Verificar se os arquivos estão aqui

### Windows:
```cmd
dir public\wasm\
```

### Linux/Mac:
```bash
ls -la public/wasm/
```

Você deve ver os arquivos `web-ifc.wasm` e `web-ifc-mt.wasm`.

