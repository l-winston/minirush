import os
from openai import OpenAI
from typing import List

def get_clues_for_words(words: List[str], model: str = "gpt-3.5-turbo") -> List[str]:
    """
    Given a list of words, queries the OpenAI API to get one clue for each word in a single prompt.
    Returns a list of clues corresponding to the input words.
    Requires OPENAI_API_KEY set in environment.
    """
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OPENAI_API_KEY environment variable not set.")
    client = OpenAI(api_key=api_key)

    prompt = (
        "For each of the following words, write a single, unique crossword clue. "
        "Return your answers as a numbered list in the same order as the words. "
        "Words: " + ", ".join(words)
    )
    response = client.responses.create(
        model=model,
        instructions="You are a helpful crossword clue generator.",
        input=prompt,
    )
    content = response.output_text.strip()
    # Parse the numbered list
    clues = []
    for line in content.splitlines():
        line = line.strip()
        if not line:
            continue
        # Accept lines like '1. clue', '2) clue', etc.
        if line[0].isdigit():
            clue = line.split('.', 1)[-1].strip() if '.' in line else line.split(')', 1)[-1].strip()
            clues.append(clue)
        else:
            clues.append(line)
    # Only return as many clues as words
    return clues[:len(words)]

if __name__ == "__main__":
    words = ["apple", "bakery"]
    clues = get_clues_for_words(words)
    print(clues)