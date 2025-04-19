class Trie:
    def __init__(self, words=None):
        self.root = {'END': True}
        if words:
            for word in words:
                self.addWord(word)

    def addWord(self, word):
        curr = self.root
        for c in word:
            if c not in curr:
                curr[c] = {}
            curr = curr[c]
        curr['END'] = True

    def containsWord(self, word):
        curr = self.root
        for c in word:
            if c not in curr:
                return False
            curr = curr[c]
        return 'END' in curr

    def containsPrefix(self, word):
        curr = self.root
        for c in word:
            if c not in curr:
                return False
            curr = curr[c]
        return True