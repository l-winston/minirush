from flask import Flask, request, jsonify, abort
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load and parse crosswords.txt at startup
def load_crosswords(file_path):
    puzzles = []
    with open(file_path, 'r') as f:
        for line in f:
            parts = line.strip().split()
            if len(parts) < 3:
                continue
            try:
                n = int(parts[0])
                m = int(parts[1])
                s = ''.join(parts[2:])
                puzzles.append({'n': n, 'm': m, 'string': s})
            except ValueError:
                continue
    return puzzles

PUZZLES = load_crosswords("../../resources/crosswords.txt")

@app.route('/puzzle', methods=['GET'])
def get_puzzle():
    puzzle_id = request.args.get('puzzleId', type=int)
    if puzzle_id is None or puzzle_id < 0 or puzzle_id >= len(PUZZLES):
        abort(404, description="Puzzle not found")
    puzzle = PUZZLES[puzzle_id]
    return jsonify({'n': puzzle['n'], 'm': puzzle['m'], 'string': puzzle['string']})

if __name__ == '__main__':
    app.run(debug=True, port=5001)
