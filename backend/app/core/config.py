from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Box Cricket Booking"
    DATABASE_URL: str = "sqlite+aiosqlite:///./box_cricket.db"
    SECRET_KEY: str = "supersecretkey" # Change this in production
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    class Config:
        env_file = ".env"

settings = Settings()
