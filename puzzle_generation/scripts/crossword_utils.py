def has_duplicate_word(grid):
    """
    Returns True if the given crossword grid has any duplicate word in its rows or columns.
    Each crossword is assumed to be a square 2D list of single-character strings.
    """
    n = len(grid)
    seen = set()
    # Check rows
    for row in grid:
        word = ''.join(row)
        if word in seen:
            return True
        seen.add(word)
    # Check columns
    for col_idx in range(n):
        word = ''.join(grid[row_idx][col_idx] for row_idx in range(n))
        if word in seen:
            return True
        seen.add(word)
    return False

def serialize_crosswords(crosswords, file_path):
    """
    Save all crosswords to a text file, one per line, flattened into a string (row-wise), all caps.
    Args:
        crosswords: List of 2D lists representing crosswords.
        file_path: Output file path.
    """
    with open(file_path, 'w') as f:
        for grid in crosswords:
            flat = ''.join(''.join(cell.upper() for cell in row) for row in grid)
            f.write(str(len(grid)) + " " + str(len(grid[0])) + " " + flat + '\n')
