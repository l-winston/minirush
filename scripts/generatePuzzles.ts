import { read, readFile, readFileSync } from 'fs';

class TrieNode {
    children: Map<string, TrieNode>;
    end: boolean;
    constructor(){
        this.children = new Map<string, TrieNode>;
        this.end = false;
    }
}

class Trie {
    root: TrieNode;
    constructor(words?: string[]){
        this.root = new TrieNode();

        if (words !== undefined) {
            for (const word of words) {
                this.addWord(word);
            }
        }
    }

    addWord(word: string): void {
        var curr: TrieNode = this.root;
        for (const c of word){
            if (!curr.children.has(c)) {
                curr.children.set(c, new TrieNode());
            }
            curr = curr.children.get(c)!;
        }
        curr.end = true;
    }

    containsPrefix(word: string): boolean {
        var curr: TrieNode = this.root;
        for (const c of word){
            if (!curr.children.has(c)) {
                return false
            }
            curr = curr.children.get(c)!;
        }
        return true
    }
}

const wordFreqs = new Map<string, number>();
var rank = 0;
for (const line of readFileSync('wordFreq.csv', 'utf-8').split("\n")) {
    const split = line.split(",");
    wordFreqs.set(split[0].toUpperCase(), rank++);
}
const words: string[] = readFileSync('dictionary.txt', 'utf-8').split("\n").filter(s => (s.length <= 5 && wordFreqs.has(s) && wordFreqs.get(s)! < 20000));

const trie = new Trie(words);

function findAllWordGrids(n: number): string[] {
    function isValid(wordGrid: string[], idx: number): boolean{
        const i = Math.floor(idx / n);
        const j = idx % n;
        const rowChars: string[] = [];
        const colChars: string[] = [];
        for (let k = 0; k <= j; k++) {
            rowChars.push(wordGrid[i*n+k])
        }
        for (let k = 0; k <= i; k++) {
            colChars.push(wordGrid[k*n+j])
        }

        const row = rowChars.join("")
        const col = colChars.join("")

        return trie.containsPrefix(row) && trie.containsPrefix(col)
    }

    function containsDuplicate(wordGrid: string[]): boolean {
        const words = new Set<string>();
        for (let i = 0; i < n; i ++) {
            var row = []
            var col = []
            for (let j = 0; j < n; j++) {
                row.push(wordGrid[i*n+j])
                col.push(wordGrid[j*n+i])
            }
            const rowWord = row.join("")
            if (words.has(rowWord)){
                return true;
            }        
            words.add(rowWord);
            const colWord = col.join("")
            if (words.has(colWord)){
                return true;
            }
            words.add(colWord);
        }
        return false;
    }

    const wordGrids: string[] = [];
    function backtrack (wordGrid: string[], idx: number) {
        if (idx == n*n && !containsDuplicate(wordGrid)){
            wordGrids.push(wordGrid.join(""))
            console.log(wordGrids[wordGrids.length-1])
            return
        }
        for (let j = 0; j < 26; j++) {
            const c = String.fromCharCode(65+j);
            wordGrid[idx] = c;
            if (isValid(wordGrid, idx)){
                backtrack(wordGrid, idx+1);
            }
            wordGrid[idx] = "";
        }
    }
    backtrack(new Array(n*n).fill(""), 0)
    return wordGrids
}

const grids = findAllWordGrids(5);



console.log(words.length, trie.root.children.size)
console.log(grids.length, grids.slice(0, 5))