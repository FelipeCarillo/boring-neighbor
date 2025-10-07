import logging

from configs import ENV
from helpers.enums import STAGE

logging.basicConfig(
    level=logging.INFO if ENV.STAGE not in [STAGE.LOCAL, STAGE.DEV] else logging.DEBUG,
    format="%(asctime)s %(filename)s:%(lineno)d [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S.%ms",
)


def get_logger(name: str) -> logging.Logger:
    return logging.getLogger(name)
