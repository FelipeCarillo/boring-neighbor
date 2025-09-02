from abc import abstractmethod, ABC
from functools import wraps
from typing import Optional, Callable, Any, TypeVar

from fastapi import HTTPException
from pydantic import BaseModel

from helpers.logger import setup_logger

logger = setup_logger(__name__)

T = TypeVar('T')


class UntreatedError(Exception):
    """Exception that can be handled by the client notification system."""

    def __init__(self, message: str, user_email: str):
        super().__init__(message)
        self.user_email = user_email


class ClientNotificationResponse(BaseModel):
    """Response model for client notifications."""
    success: bool
    message: Optional[str] = None


class IClientNotification(ABC):
    """Interface for client notification services."""

    @abstractmethod
    def notify(self, error: UntreatedError) -> ClientNotificationResponse:
        """Notify the client about an error."""
        pass


class ExceptionHandler:
    """Handles exceptions and processes them through client notifications."""

    def __init__(self, client_notification: IClientNotification):
        self.client_notification = client_notification

    def process_exception(self, e: Exception) -> None:
        """Process an exception and return client notification response if applicable."""
        if not isinstance(e, UntreatedError):
            logger.error(f"Unhandled exception: {e}", exc_info=True)
            return
        response = self.client_notification.notify(e)
        if not response.success:
            logger.error(f"Failed to notify exception: {response.message}")


def handle_exception(func: Callable[..., T], *, handler: Optional[ExceptionHandler] = None) -> Callable[..., T]:
    """
    Decorator to handle exceptions in FastAPI endpoints.
    
    Args:
        func: The function to be decorated
        handler: Optional ExceptionHandler to process exceptions
        
    Returns:
        Decorated function that handles exceptions automatically
    """

    def decorator() -> Callable[..., T]:
        @wraps(func)
        def wrapper(*args: Any, **kwargs: Any) -> T:
            try:
                return func(*args, **kwargs)
            except Exception as e:
                if isinstance(e, HTTPException):
                    return e
                if handler:
                    handler.process_exception(e)
                return HTTPException(status_code=500, detail="Internal Server Error, our team has been notified.")

        return wrapper

    return decorator
