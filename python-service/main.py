"""
RootNote music-theory service.

Phase 3: validate_progression() now does real work with music21 instead of
echoing chords back. For every chord the Worker sends, it:

  1. Normalizes our notation to what music21's chord-symbol parser expects
     (our prompt rules use "s" for a sharp inside a suffix, e.g. "C7s9",
     to keep chord names simple strings — music21 wants "#" there).
  2. Asks music21 to actually build the chord from that figure string.
  3. If music21 can't parse it, or parses it but the resulting chord
     doesn't have a root matching what was claimed, treats that as
     Claude having invented a chord that isn't real theory, and replaces
     it with the nearest safe fallback (a plain triad on the stated root)
     rather than trusting the label.

This is deliberately conservative: it corrects what's actually wrong
rather than reformatting everything into music21's own chord-symbol
spelling conventions, since the Worker's contract (and the frontend's
useAudio playback) depends on the app's own root/quality notation, not
music21's.
"""

import os
import re

from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel
from typing import List

from music21 import harmony

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
    corrections: List[str] = []


def check_api_key(x_api_key: str | None):
    if API_KEY and x_api_key != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid or missing API key")


def to_music21_figure(name: str) -> str:
    """Our chord-notation rules use 's' for a sharp inside a suffix
    (e.g. "C7s9", "Cmaj7s11") to avoid stacking '#' characters in a
    string. music21's figure parser expects the standard '#'."""
    return re.sub(r"s(\d)", r"#\1", name)


def format_root(pitch) -> str:
    """music21 spells flats as e.g. 'B-'; our contract spells them 'Bb'."""
    return pitch.name.replace("-", "b")


def fallback_chord(chord: ChordModel) -> ChordModel:
    """Couldn't make sense of the chord as real theory — fall back to a
    plain major triad on the stated root, so the app never has to play or
    display something that isn't an actual chord."""
    return ChordModel(name=chord.root, root=chord.root, quality="")


def validate_chord(chord: ChordModel) -> tuple[ChordModel, str | None]:
    """Returns (possibly-corrected chord, correction note or None)."""
    figure = to_music21_figure(chord.name)

    try:
        symbol = harmony.ChordSymbol(figure)
        pitches = symbol.pitches
    except Exception:
        return fallback_chord(chord), f'"{chord.name}" is not a valid chord — replaced with "{chord.root}"'

    if len(pitches) < 2:
        # music21 accepted the string but couldn't build a real chord out
        # of it (this happens on figures it doesn't recognize a kind for).
        return fallback_chord(chord), f'"{chord.name}" did not resolve to a real chord — replaced with "{chord.root}"'

    parsed_root = format_root(symbol.root())
    if parsed_root != chord.root:
        # It parsed, but not on the root it claimed. Trust the pitches
        # music21 actually built over the label Claude attached to them.
        corrected = ChordModel(name=chord.name, root=parsed_root, quality=chord.quality)
        return corrected, f'"{chord.name}" actually roots on {parsed_root}, not {chord.root} as labeled — corrected'

    return chord, None


def validate_section(chords: List[ChordModel], label: str) -> tuple[List[ChordModel], List[str]]:
    validated: List[ChordModel] = []
    notes: List[str] = []

    for bar, chord in enumerate(chords, start=1):
        fixed, note = validate_chord(chord)
        validated.append(fixed)
        if note:
            notes.append(f"{label} bar {bar}: {note}")

    return validated, notes


@app.get("/health")
def health():
    return {"status": "ok", "music21_version": __import__("music21").__version__}


@app.post("/validate", response_model=ValidateResponse)
def validate_progression(payload: ValidateRequest, x_api_key: str | None = Header(default=None)):
    check_api_key(x_api_key)

    main_chords, main_notes = validate_section(payload.main, "Main")
    variation_chords, variation_notes = validate_section(payload.variation, "Variation")
    corrections = main_notes + variation_notes

    return ValidateResponse(
        main=main_chords,
        variation=variation_chords,
        ok=len(corrections) == 0,
        corrections=corrections,
    )
