import torch
torch.zeros(1).cuda()
print(f"CUDA disponível: {torch.cuda.is_available()}")
print(f"Versão CUDA: {torch.version.cuda}")
if torch.cuda.is_available():
    print(f"GPU: {torch.cuda.get_device_name(0)}")