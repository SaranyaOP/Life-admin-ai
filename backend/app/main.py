from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import tasks, ai

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tasks.router)
app.include_router(ai.router)


@app.get("/")
def root():
    return {"message": "Life Admin AI Backend Running"}


@app.get("/health")
def health_check():
    """Health check endpoint for Cloud Run"""
    return {"status": "healthy"}