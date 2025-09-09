from repositories.repositories.user_repo.user_repo_interface import IUserRepo


class AuthService:
    def __init__(self, user_repo: IUserRepo):
        self.user_repo = user_repo

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
