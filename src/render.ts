import { AppState } from './main'
import { collectSubtree, getTokenText } from './util'
import tippy from 'tippy.js'
import { Token } from './spacy-doc'
import { depMap, POSmap, tagMap } from './data-maps'
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
      Dep: ${token.dep} [${depMap[token.dep]}]<br>
      Lemma: ${token.lemma}<br>
      Morph: ${token.morph}<br>
      pos: ${token.pos} [${POSmap[token.pos]}]<br>
      tag: ${token.tag} [${tagMap[token.tag]}]
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
  renderDetails(state)
}

function renderDetails (state: AppState) {
  const descriptive = state.details.descriptiveTags
  const wrapper = document.getElementById('debug-info')

  const resultsTable = document.createElement('table')
  const header = document.createElement('tr')
  for (const th of [ '#', 'Token', 'Head', 'POS', 'DepRel', 'NER' ]) {
    const cell = document.createElement('th')
    cell.textContent = th
    header.appendChild(cell)
  }
  resultsTable.appendChild(header)

  const body = document.createElement('tbody')
  resultsTable.appendChild(body)
  for (const token of state.document.tokens) {
    const row = document.createElement('tr')
    const id = document.createElement('td')
    id.textContent = String(token.id)
    id.classList.add('number')
    const text = document.createElement('td')
    text.textContent = getTokenText(state.document, token)
    const head = document.createElement('td')
    head.textContent = String(token.head)
    head.classList.add('number')
    const pos = document.createElement('td')
    pos.textContent = descriptive ? POSmap[token.pos] : token.pos
    const dep = document.createElement('td')
    dep.textContent = descriptive ? depMap[token.dep] : token.dep
    const ner = document.createElement('td')
    const entity = state.document.ents.find(e => e.start <= token.start && e.end >= token.end)
    if (entity !== undefined) {
      ner.textContent = entity.label
    }
    row.appendChild(id)
    row.appendChild(text)
    row.appendChild(head)
    row.appendChild(pos)
    row.appendChild(dep)
    row.appendChild(ner)
    body.appendChild(row)
  }

  wrapper.innerHTML = ''
  wrapper.appendChild(resultsTable)
}
