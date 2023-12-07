import { render } from './render'
import { Doc, Token } from './spacy-doc'

// // Main JS file for DepViz
export interface AppState {
  document: Doc|undefined
  focusToken: number
  lines: any[]
}

const state: AppState = {
  document: undefined,
  focusToken: -1,
  lines: []
}


// Action methods
function highlightSubtree (token: Token): void {
  if (state.focusToken === token.id) {
    state.focusToken = -1
  } else {
    state.focusToken = token.id
  }
  render(state, highlightSubtree)
}

async function fetchDoc (sentence: string): Promise<Doc> {
  const response = await fetch(`fetch.php?sentence=${encodeURIComponent(sentence)}`)
  if (response.ok) {
    return await response.json()
  }
}

document.addEventListener('DOMContentLoaded', function (event) {
  console.log('Starting DepViz ...')
  const sentenceInput = document.getElementById('sentence-input') as HTMLTextAreaElement
  const formSubmit = document.getElementById('viz-button') as HTMLButtonElement
  const demoSentence = document.getElementById('demo-sentence')

  demoSentence.addEventListener('click', (event) => {
    const sentence = 'This is a sentence which, while being comparably long and complex, aims to demonstrate the flexibility, speed, and visual compellingness of DepViz.'
    sentenceInput.value = sentence
    formSubmit.click()
  })

  formSubmit.addEventListener('click', (event) => {
    formSubmit.disabled = true
    formSubmit.textContent = 'Visualizing …'
    fetchDoc(sentenceInput.value)
      .then(doc => {
        formSubmit.disabled = false
        formSubmit.textContent = 'Visualize'
        state.document = doc
        state.focusToken = -1
        state.lines = []
        render(state, highlightSubtree)
      })
      .catch(err => console.error(err))
  })
})
