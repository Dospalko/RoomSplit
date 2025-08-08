from db import Base, engine  # type: ignore
import models  # noqa: F401

def init():
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    init()
