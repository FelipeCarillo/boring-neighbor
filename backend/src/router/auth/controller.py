from .service import AuthService


class AuthController:
    def __init__(self, service: AuthService):
        self.service = service

    def login(self):
        pass

    def token(self):
        pass

    def token_refresh(self):
        pass

    def callback(self):
        pass

    def me(self):
        pass

    def logout(self):
        pass
