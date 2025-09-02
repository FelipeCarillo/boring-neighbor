from logging import Logger, getLogger, StreamHandler, Formatter, INFO


def setup_logger(name: str, level: int = INFO) -> Logger:
    logger = getLogger(name)
    logger.setLevel(level)

    handler = StreamHandler()
    handler.setLevel(level)

    formatter = Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    handler.setFormatter(formatter)

    if not logger.hasHandlers():
        logger.addHandler(handler)

    return logger
