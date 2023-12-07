import { AppState } from './main'
import { collectSubtree, getTokenText } from './util'
import tippy from 'tippy.js'
import { Token } from './spacy-doc'
declare var LeaderLine: any

export function render (state: AppState, tokenClickCallback: (token: Token) => void) {
  while (state.lines.length > 0) {
    state.lines.shift().remove()
  }

  const subTree = state.focusToken > -1 ? collectSubtree(state.focusToken, state.document, true) : []

  const div = document.getElementById('output')
  div.innerHTML = ''
  for (const token of state.document.tokens) {
    const tok = document.createElement('span')
    tok.classList.add('token', `dep-${token.dep}`, `pos-${token.pos}`)
    tok.setAttribute('id', `token-${token.id}`)
    if (subTree.includes(token)) {
      tok.classList.add('highlight')
    } else if (subTree.length > 0) {
      tok.classList.add('dimmed')
    }

    tok.innerText = getTokenText(state.document, token)
    const chain = collectSubtree(token.id, state.document, false).map(t => getTokenText(state.document, t)).join(' &rarr; ')

    tok.setAttribute('data-tippy-content', `
      <strong>${getTokenText(state.document, token)}</strong><br>
      (${chain})
      <hr>
      Dep: ${token.dep}<br>
      Lemma: ${token.lemma}<br>
      Morph: ${token.morph}<br>
      pos: ${token.pos}<br>
      tag: ${token.tag}
    `)
    
    tok.addEventListener('click', () => { tokenClickCallback(token) })
    div.appendChild(tok)
    div.appendChild(document.createTextNode(' '))
  }

  tippy('.token', {
    content (ref) {
      const template = document.createElement('div')
      template.innerHTML = ref.getAttribute('data-tippy-content')
      return template.innerHTML
    },
    allowHTML: true,
    delay: 1000
  })

  // Connect nodes with lines if we are focusing on a subtree
  for (const token of subTree) {
    if (token.id === token.head) {
      continue // Root, prevent self-loop
    }
    const from = document.getElementById(`token-${token.id}`)
    const to = document.getElementById(`token-${token.head}`)
    // https://anseki.github.io/leader-line/
    const line = new LeaderLine(from, to, {
      // startSocket: 'top',
      // endSocket: 'top',
      middleLabel: LeaderLine.pathLabel({ text: token.dep, outlineColor: 'none' }),
      // color: 'rgba(30, 130, 250, 0.5)',
      // size: 2,
    })
    line.path = 'arc'
    state.lines.push(line)
  }
}
