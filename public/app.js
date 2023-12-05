// Main JS file for DepViz
let focusToken = -1
const lines = []

// Helper functions
function collectSubtree (tokenID, withChildren) {
  if (withChildren === undefined) {
    withChildren = false
  }

  const tokens = []
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

function getTokenText (token) {
  return doc.text.substring(token.start, token.end)
}

// Action methods
function highlightSubtree (token) {
  if (focusToken === token.id) {
    focusToken = -1
  } else {
    focusToken = token.id
  }
  render()
}

// RENDER FUNCTION
function render () {
  while (lines.length > 0) {
    lines.shift().remove()
  }

  const subTree = focusToken > -1 ? collectSubtree(focusToken, true) : []

  const div = document.getElementById('output')
  div.innerHTML = ''
  for (const token of doc.tokens) {
    const tok = document.createElement('span')
    tok.classList.add('token', `dep-${token.dep}`, `pos-${token.pos}`)
    tok.setAttribute('id', `token-${token.id}`)
    if (subTree.includes(token)) {
      tok.classList.add('highlight')
    } else if (subTree.length > 0) {
      tok.classList.add('dimmed')
    }

    tok.innerText = getTokenText(token)
    const chain = collectSubtree(token.id, false).map(t => getTokenText(t)).join(' &rarr; ')

    tok.setAttribute('data-tippy-content', `
      <strong>${getTokenText(token)}</strong><br>
      (${chain})
      <hr>
      Dep: ${token.dep}<br>
      Lemma: ${token.lemma}<br>
      Morph: ${token.morph}<br>
      pos: ${token.pos}<br>
      tag: ${token.tag}
    `)
    
    tok.addEventListener('click', () => { highlightSubtree(token) })
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
    const line = new LeaderLine(from, to, {
      // middleLabel: LeaderLine.pathLabel({ text: token.dep, outlineColor: 'none' }),
      // color: 'rgba(30, 130, 250, 0.5)',
      // size: 2,
    })
    line.path = 'arc'
    lines.push(line)
  }
}

document.addEventListener('DOMContentLoaded', function (event) {
  console.log('Starting JavaScript ...')
  render()
})
