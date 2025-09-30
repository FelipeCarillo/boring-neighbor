from aws_cdk import (
    Stack,
    aws_cognito
)

from constructs import Construct

from iac.env import ENV


class AuthenticationStack(Stack):

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        user_pool = aws_cognito.UserPool(
            self,
            user_pool_name=ENV.USER_POOL_NAME,
            sign_in_policy=aws_cognito.SignInPolicy(

            )
        )

        user_pool.add_group(
            id='admin',
            group_name='admin',
            description='Acesso a toda aplicação.',
            precedence=1
        )
        user_pool.add_group(
            id='supervisor-geral',
            group_name='supervisor-geral',
            description='Acesso a todas as obras e gerencia supervisores.',
            precedence=2
        )
        user_pool.add_group(
            id='supervisor',
            group_name='supervisor',
            description='Pode monitorar as obras atribuídas.',
            precedence=3
        )

        user_pool.add_client(
        )