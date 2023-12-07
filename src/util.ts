import { Doc, Token } from './spacy-doc'

export function getTokenText (doc: Doc, token: Token): string {
  return doc.text.substring(token.start, token.end)
}

export function collectSubtree (tokenID: number, doc: Doc, withChildren: boolean = false): Token[] {
  const tokens: Token[] = []
  if (withChildren) {
    for (const token of doc.tokens) {
      if (token.head === tokenID) {
        tokens.push(token)
      }
    }
  }

  let token = doc.tokens[tokenID]
  do {
    tokens.push(token)
    token = doc.tokens[token.head]
  } while (token.dep !== 'ROOT')

  if (tokens.find(t => t.id === token.id) === undefined) {
    tokens.push(token)
  }

  return tokens
}
