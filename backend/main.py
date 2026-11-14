"""ScamShield Backend Application Entrypoint"""

import time
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from app.config import settings
from app.api.routes import router as api_router
from app.core.logging import logger

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=settings.DESCRIPTION,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(api_router, prefix=settings.API_PREFIX)
app.include_router(api_router, prefix="/api/v1")  # Alias for versioned API


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Custom handler for request payload validation errors."""
    errors = exc.errors()
    first_error = errors[0]["msg"] if errors else "Invalid request data"
    clean_error = first_error.replace("Value error, ", "")

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
        content={
            "error": "Validation Error",
            "detail": clean_error,
            "status_code": 422,
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        }
    )


@app.get("/", tags=["Root"])
async def root_endpoint():
    """Root metadata endpoint."""
    return {
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "operational",
        "documentation": "/docs",
        "endpoints": {
            "health": f"{settings.API_PREFIX}/health",
            "scan_url": f"{settings.API_PREFIX}/scan/url",
            "scan_message": f"{settings.API_PREFIX}/scan/message",
            "history": f"{settings.API_PREFIX}/history"
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
