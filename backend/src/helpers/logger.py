import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(filename)s:%(lineno)d [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S.%ms",
)


def get_logger(name: str) -> logging.Logger:
    return logging.getLogger(name)
