import boto3
import re

# === Configurações ===
environments = ["dev", "uat", "prod"]

# Nomes amigáveis (como aparecem no Console do Cognito)
user_pool_names = {
    "dev": "boring-neighbor-dev",
    "uat": "boring-neighbor-uat",
    "prod": "boring-neighbor-prod",
}

# Grupos que queremos no final (sem stage no nome)
target_groups = [
    {"name": "admin", "description": "Acesso a tudo", "precedence": 1},
    {"name": "supervisor", "description": "Pode monitorar as obras atribuídas", "precedence": 2},
    {"name": "supervisor-geral", "description": "Acesso a todas as obras e gerencia supervisores", "precedence": 3},
]

# Padrão dos grupos antigos (com stage) para remoção
# Exemplos removidos: boring-neighbor-dev-admin, boring-neighbor-uat-supervisor, boring-neighbor-prod-supervisor-geral
OLD_GROUP_REGEX = re.compile(r"^boring-neighbor-(dev|uat|prod)-(admin|supervisor|supervisor-geral)$")

# Se necessário, especifique a região do Cognito:
client = boto3.client("cognito-idp", region_name="us-east-1")


# === Helpers ===
def get_user_pool_id_by_name(name: str) -> str:
    """Procura o ID do User Pool cujo Name == name, percorrendo as páginas."""
    print(f"🔍 Procurando User Pool com Name='{name}'...")
    next_token = None
    while True:
        kwargs = {"MaxResults": 60}
        if next_token:
            kwargs["NextToken"] = next_token
        resp = client.list_user_pools(**kwargs)
        for pool in resp.get("UserPools", []):
            print(f"   ➡️ Pool listado: Name={pool['Name']} | Id={pool['Id']}")
            if pool.get("Name") == name:
                print(f"✅ Encontrado: Name='{name}' -> Id={pool['Id']}")
                return pool["Id"]
        next_token = resp.get("NextToken")
        if not next_token:
            break
    raise ValueError(f"❌ User Pool com Name='{name}' não encontrado. Verifique região/permissões.")


def list_all_groups(user_pool_id: str) -> list[str]:
    """Lista todos os GroupName do pool, com paginação."""
    print(f"\n📋 Listando grupos do PoolId={user_pool_id}...")
    groups = []
    next_token = None
    while True:
        kwargs = {"UserPoolId": user_pool_id, "Limit": 60}
        if next_token:
            kwargs["NextToken"] = next_token
        resp = client.list_groups(**kwargs)
        for g in resp.get("Groups", []):
            groups.append(g["GroupName"])
        next_token = resp.get("NextToken")
        if not next_token:
            break
    print(f"   ➕ Total de grupos encontrados: {len(groups)}")
    for g in groups:
        print(f"   • {g}")
    return groups


def delete_groups_by_pattern(user_pool_id: str, names: list[str], pattern: re.Pattern):
    """Exclui grupos cujos nomes casem com o regex informado."""
    to_delete = [g for g in names if pattern.match(g)]
    if not to_delete:
        print("ℹ️ Nenhum grupo antigo (com stage) encontrado para remover.")
        return

    print(f"🗑️ Removendo {len(to_delete)} grupo(s) com stage no nome:")
    for g in to_delete:
        print(f"   ➡️ Deletando '{g}'...")
        try:
            client.delete_group(UserPoolId=user_pool_id, GroupName=g)
            print(f"   ✅ Deletado: {g}")
        except client.exceptions.ResourceNotFoundException:
            print(f"   ⚠️ Não encontrado (ignorado): {g}")
        except Exception as e:
            print(f"   ❌ Erro ao deletar '{g}': {e}")


def ensure_target_groups(user_pool_id: str, groups: list[dict]):
    """Garante a criação dos grupos desejados (sem stage)."""
    print(f"\n🛠️ Criando grupos alvo (sem stage) no PoolId={user_pool_id}...")
    for group in groups:
        name = group["name"]
        print(f"   ➡️ Criando '{name}'...")
        try:
            client.create_group(
                UserPoolId=user_pool_id,
                GroupName=name,
                Description=group["description"],
                Precedence=group["precedence"]
            )
            print(f"   ✅ Criado: {name}")
        except client.exceptions.GroupExistsException:
            print(f"   ⚠️ Já existe: {name}")
        except Exception as e:
            print(f"   ❌ Erro ao criar '{name}': {e}")


# === Fluxo principal ===
def main():
    # 1) Resolver IDs reais
    resolved = {}
    for env in environments:
        pool_name = user_pool_names[env]
        pool_id = get_user_pool_id_by_name(pool_name)
        resolved[env] = pool_id
        print(f"📌 Ambiente {env}: PoolName='{pool_name}' -> PoolId={pool_id}")

    # 2) Para cada ambiente: listar grupos, remover os antigos (com stage), criar sem stage
    for env in environments:
        print("\n" + "=" * 70)
        print(f"🌐 Ambiente: {env}")
        pool_id = resolved[env]

        existing = list_all_groups(pool_id)
        delete_groups_by_pattern(pool_id, existing, OLD_GROUP_REGEX)
        ensure_target_groups(pool_id, target_groups)

    print("\n✅ Finalizado com sucesso.")

if __name__ == "__main__":
    main()
