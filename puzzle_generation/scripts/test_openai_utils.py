import os
import pytest
from openai_utils import get_clues_for_words

def test_get_clues_for_words():
    # This test requires a valid OPENAI_API_KEY in your environment
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        pytest.skip("OPENAI_API_KEY not set, skipping OpenAI integration test.")
    words = ["apple"]
    clues = get_clues_for_words(words)
    assert isinstance(clues, list)
    assert len(clues) == len(words)
    for clue in clues:
        assert isinstance(clue, str)
        assert len(clue) > 0
