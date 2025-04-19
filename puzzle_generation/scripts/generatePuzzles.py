from trie import Trie
from crossword_utils import has_duplicate_word, serialize_crosswords
import copy

EMPTY = "0"
BLOCKED = "1"

MIN_WORD_LEN = 4

def generateDenseCrossword(trie, n):
    solutions = []
    grid = [[EMPTY for _ in range(n)] for __ in range(n)]
    
    def isValidGrid(grid, i):
        x, y = i//n, i % n
        row = "".join(grid[x][j] for j in range(y+1))
        col = "".join(grid[j][y] for j in range(x+1))
        
        def isValidRow(row):
            if len(row) == n:
                if not trie.containsWord(row):
                    return False
            else:
                if not trie.containsPrefix(row):
                    return False
            return True
        
        return isValidRow(row) and isValidRow(col)
    
    def backtrack(i):
        if i == n*n:
            if has_duplicate_word(grid):
                return
            solutions.append(copy.deepcopy(grid))
            return
        x, y = i//n, i%n
        for j in range(ord('A'), ord('Z')+1):
            c = chr(j)
            grid[x][y] = c
            if isValidGrid(grid, i):
                backtrack(i+1)
        grid[x][y] = EMPTY

    backtrack(0)
    return solutions

def generateCrossword(trie, n):
    grid = [[EMPTY for _ in range(n)] for __ in range(n)]
    def printGrid(grid):
        for line in grid:
            for c in line:
                if c == BLOCKED:
                    print("■", end="")
                elif c == EMPTY:
                    print("0", end="")
                else:
                    print(c, end="")
            print("")
        print("")
    
    def isValidGrid(grid, i):
        x, y = i//n, i % n
        row = "".join(grid[x][j] for j in range(y+1))
        col = "".join(grid[j][y] for j in range(x+1))
        
        # if i == 5:
        #     print(i, row, col)

        # AND■HELLO■00
        
        def isValidRow(row):
            s = row.split(BLOCKED)
            for j in range(len(s)-1):
                if not trie.containsWord(s[j]):
                    return False
            if len(row) == n:
                if not trie.containsWord(s[-1]):
                    return False
            else:
                if not trie.containsPrefix(s[-1]):
                    return False
            return True
        
        # if i == 5:
        #     print(isValidRow(row))
        #     print(isValidRow(col))

        return isValidRow(row) and isValidRow(col)
    
    closest = 0

    def backtrack(i):
        nonlocal closest
        if i > closest:
            closest = i
            print("new closest of ", closest)
            printGrid(grid)
        if i == n*n:
            printGrid(grid)
            return
        # if i > 9:
        #     return

        x, y = i//n, i%n

        for j in range(ord('A'), ord('Z')+1):
            c = chr(j)
            grid[x][y] = c
            if isValidGrid(grid, i):
                backtrack(i+1)

        grid[x][y] = BLOCKED
        if isValidGrid(grid, i):
            backtrack(i+1)
        grid[x][y] = EMPTY

    backtrack(0)

def main():
    freqs = {}
    rank = 0
    with open('resources/wordFreq.csv', 'r') as f:
        for line in f:
            line = line.strip()
            word = line.split(",")[0].upper()
            freqs[word] = rank
            rank += 1
    words = []
    with open('resources/dictionary.txt', 'r') as f:
        for line in f:
            word = line.strip()
            if 4 <= len(word) <= 4 and word in freqs and freqs[word] < 10000:
                words.append(word)
    print(len(words), "words")
    trie = Trie(words)

    crosswords = generateDenseCrossword(trie, 4)
    print(len(crosswords), "crosswords")
    serialize_crosswords(crosswords, "resources/crosswords.txt")
    print(crosswords[0])

if __name__ == "__main__":
    main()