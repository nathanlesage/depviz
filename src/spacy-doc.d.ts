
// UD POS tags: https://universaldependencies.org/u/pos/
type POSOpenClass = 'ADJ'|'ADV'|'INTJ'|'NOUN'|'PROPN'|'VERB'
type POSClosedClass = 'ADP'|'AUX'|'CCONJ'|'DET'|'NUM'|'PART'|'PRON'|'SCONJ'
type POSOther = 'PUNCT'|'SYM'|'X'

// Dependency relations and NER categories, taken from
// https://spacy.io/models/en -> "Label scheme"
type DepRel = 'ROOT'|'acl'|'acomp'|'advcl'|'advmod'|'agent'|'amod'|'appos'|'attr'|
  'aux'|'auxpass'|'case'|'cc'|'ccomp'|'compound'|'conj'|'csubj'|'csubjpass'|'dative'|
  'dep'|'det'|'dobj'|'expl'|'intj'|'mark'|'meta'|'neg'|'nmod'|'npadvmod'|'nsubj'|
  'nsubjpass'|'nummod'|'oprd'|'parataxis'|'pcomp'|'pobj'|'poss'|'preconj'|'predet'|
  'prep'|'prt'|'punct'|'quantmod'|'relcl'|'xcomp'

type NERCategory = 'CARDINAL'|'DATE'|'EVENT'|'FAC'|'GPE'|'LANGUAGE'|'LAW'|'LOC'|
  'MONEY'|'NORP'|'ORDINAL'|'ORG'|'PERCENT'|'PERSON'|'PRODUCT'|'QUANTITY'|'TIME'|'WORK_OF_ART'

export interface NamedEntity {
  start: number
  end: number
  label: NERCategory
}

export interface Token {
  id: number
  start: number
  end: number
  tag: string
  pos: POSOpenClass|POSClosedClass|POSOther
  morph: string
  lemma: string
  dep: DepRel
  head: number
}

export interface Doc {
  text: string
  ents: NamedEntity[]
  sents: Array<{ start: number, end: number }>
  tokens: Token[]
}
