import json
import logging
import socket
from datetime import datetime, UTC
from functools import wraps

from configs import ENV


class JsonFormatter(logging.Formatter):
    def format(self, record):
        log_data = {
            "timestamp": datetime.now(UTC).isoformat(),
            "level": record.levelname,
            "application": ENV.PROJECT_NAME,
            "flow": record.name,
            "message": record.getMessage(),
            "host": socket.gethostname(),
            "function": record.funcName,
            "line": record.lineno,
        }
        return json.dumps(log_data, ensure_ascii=False)


def get_logger(flow_name: str):
    logger = logging.getLogger(flow_name)
    logger.setLevel(logging.DEBUG)
    if not logger.handlers:
        handler = logging.StreamHandler()
        handler.setFormatter(JsonFormatter())
        logger.addHandler(handler)
    return logger


def trace(flow_name):
    logger = get_logger(flow_name)

    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            logger.info(f"Entrando em {func.__name__}", extra={"flow": flow_name})
            try:
                result = func(*args, **kwargs)
                logger.info(f"Saindo de {func.__name__} com sucesso", extra={"flow": flow_name})
                return result
            except Exception as e:
                logger.error(f"Erro em {func.__name__}: {e}", extra={"flow": flow_name})
                raise

        return wrapper

    return decorator
