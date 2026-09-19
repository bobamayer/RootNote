"""
RootNote music-theory service.

Phase 2 scope only: prove the Cloudflare Worker can reach this service and
get typed JSON back. This endpoint is a deliberate passthrough — it does not
touch music21's actual theory logic yet. Phase 3 replaces the body of
validate_progression() with real chord parsing/validation via music21,
without changing the request/response shape or how the Worker calls it.

Trust boundary note: the frontend never talks to this service directly.
The Cloudflare Worker is the only caller, authenticated with a shared
API key (see API_KEY below). That keeps "one gate" — the Worker — even
though there are now two backend services behind it.
"""

import os

from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel
from typing import List

import music21  # noqa: F401  (imported now so Phase 3 doesn't hit a missing-dependency surprise)

API_KEY = os.environ.get("API_KEY")

app = FastAPI(title="RootNote music-theory service")


class ChordModel(BaseModel):
    name: str
    root: str
    quality: str


class ValidateRequest(BaseModel):
    main: List[ChordModel]
    variation: List[ChordModel]


class ValidateResponse(BaseModel):
    main: List[ChordModel]
    variation: List[ChordModel]
    ok: bool


def check_api_key(x_api_key: str | None):
    if API_KEY and x_api_key != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid or missing API key")


@app.get("/health")
def health():
    return {"status": "ok", "music21_version": music21.__version__}


@app.post("/validate", response_model=ValidateResponse)
def validate_progression(payload: ValidateRequest, x_api_key: str | None = Header(default=None)):
    check_api_key(x_api_key)

    # Phase 2 passthrough. Phase 3 will parse each chord with
    # music21.harmony.ChordSymbol(chord.name), correct anything that isn't
    # real theory, and return the corrected list here instead.
    return ValidateResponse(main=payload.main, variation=payload.variation, ok=True)
