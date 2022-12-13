const formatTag = html => html
  .replace(/</g, '&lt;')
  .replace(/\>/g, '&gt;')

// front matter for simple YAML (support 1 level only)
const formatYAML = yaml => (_, matter) => {
  matter
    .replace(/^\s*([^:]+):(.*)$/gm, (_, key, val) => { yaml[key.trim()] = val.trim() })
  return ''
}

const formatCode = (_, title, block) => {
  // convert tag <> to &lt; &gt; tab to 3 space, support mark code using ^^^
  block = block
    .replace(/</g, '&lt;')
    .replace(/\>/g, '&gt;')
    .replace(/\t/g, '   ')
    .replace(/\^\^\^(.+?)\^\^\^/g, '<mark>$1</mark>')

  // highlight comment and keyword based on title := none | sql | code
  if (title.toLowerCase(title) === 'sql') {
    block = block.replace(/^\-\-(.*)/gm, '<rem>--$1</rem>').replace(/\s\-\-(.*)/gm, ' <rem>--$1</rem>')
    block = block.replace(/(\s)(function|procedure|return|if|then|else|end|loop|while|or|and|case|when)(\s)/gim, '$1<b>$2</b>$3')
    block = block.replace(/(\s)(select|update|delete|insert|create|from|where|group by|having|set)(\s)/gim, '$1<b>$2</b>$3')
  }
  else if ((title || 'none') !== 'none') {
    block = block.replace(/^\/\/(.*)/gm, '<rem>//$1</rem>').replace(/\s\/\/(.*)/gm, ' <rem>//$1</rem>')
    block = block.replace(/(\s)(function|procedure|return|if|then|else|end|loop|while|or|and|case|when)(\s)/gim, '$1<b>$2</b>$3')
    block = block.replace(/(\s)(var|let|const|for|next|do|while|loop|continue|break|switch|try|catch|finally)(\s)/gim, '$1<b>$2</b>$3')
  }
  return `<pre title="${title}"><code>${block}</code></pre>`
}

export const parser = (mdstr, yaml) => {
  const formatPreCode = (m, p) => `<pre><code>${formatTag(p)}</code></pre>`
  // apply yaml variables
  for (const name in yaml) {
    mdstr = mdstr
      .replace(new RegExp(`\{\{\\s*${name}\\s*\}\}`, 'gm'), yaml[name])
  }
  return mdstr
    // table syntax
    .replace(/\n(.+?)\n.*?\-\-\|\-\-.*?\n([\s\S]*?)\n\s*?\n/g, (_, p1, p2) => {
      const thead = p1
        .replace(/^\|(.+)/gm, '$1')
        .replace(/(.+)\|$/gm, '$1')
        .replace(/\|/g, '<th>')
      let tbody = p2
        .replace(/^\|(.+)/gm, '$1')
        .replace(/(.+)\|$/gm, '$1')
      tbody = tbody
        .replace(/(.+)/gm, '<tr><td>$1</td></tr>')
        .replace(/\|/g, '<td>')
      return `\n<table>\n<thead>\n<th>${thead}\n</thead>\n<tbody>${tbody}\n</tbody></table>\n\n`
    })

    // horizontal rule => <hr>
    .replace(/^-{3,}|^\_{3,}|^\*{3,}$/gm, '<hr>').replace(/\n\n<hr\>/g, '\n<br><hr>')

    // header => <h1>..<h5>
    .replace(/^##### (.*?)\s*#*$/gm, '<h5>$1</h5>')
    .replace(/^#### (.*?)\s*#*$/gm, '<h4>$1</h4>')
    .replace(/^### (.*?)\s*#*$/gm, '<h3>$1</h3>')
    .replace(/^## (.*?)\s*#*$/gm, '<h2>$1</h2>')
    .replace(/^# (.*?)\s*#*$/gm, '<h1>$1</h1>')
    .replace(/^<h(\d)\>(.*?)\s*{(.*)}\s*<\/h\d\>$/gm, '<h$1 id="$3">$2</h$1>')

    // inline code-block: `code-block` => <code>code-block</code>
    .replace(/``(.*?)``/gm, (m, p) => { return `<code>${formatTag(p).replace(/`/g, '&#96;')}</code>` })
    .replace(/`(.*?)`/gm, '<code>$1</code>')

    // blockquote, max 2 levels => <blockquote>{text}</blockquote>
    .replace(/^\>\> (.*$)/gm, '<blockquote><blockquote>$1</blockquote></blockquote>')
    .replace(/^\> (.*$)/gm, '<blockquote>$1</blockquote>')
    .replace(/<\/blockquote\>\n<blockquote\>/g, '\n<br>')
    .replace(/<\/blockquote\>\n<br\><blockquote\>/g, '\n<br>')

    // image syntax: ![title](url) => <img alt="title" src="url" />
    .replace(/!\[(.*?)\]\((.*?) "(.*?)"\)/gm, '<img alt="$1" src="$2" $3 />')
    .replace(/!\[(.*?)\]\((.*?)\)/gm, '<img alt="$1" src="$2" width="90%" />')

    // links syntax: [title "title"](url) => <a href="url" title="title">text</a>
    .replace(/\[(.*?)\]\((.*?) "new"\)/gm, '<a href="$2" target=_new>$1</a>')
    .replace(/\[(.*?)\]\((.*?) "(.*?)"\)/gm, '<a href="$2" title="$3">$1</a>')
    .replace(/([<\s])(https?\:\/\/.*?)([\s\>])/gm, '$1<a href="$2">$2</a>$3')
    .replace(/\[(.*?)\]\(\)/gm, '<a href="$1">$1</a>')
    .replace(/\[(.*?)\]\((.*?)\)/gm, '<a href="$2">$1</a>')

    // unordered/ordered list, max 2 levels  => <ul><li>..</li></ul>, <ol><li>..</li></ol>
    .replace(/^[\*+-][ .](.*)/gm, '<ul><li>$1</li></ul>')
    .replace(/^\d[ .](.*)/gm, '<ol><li>$1</li></ol>')
    .replace(/^\s{2,6}[\*+-][ .](.*)/gm, '<ul><ul><li>$1</li></ul></ul>')
    .replace(/^\s{2,6}\d[ .](.*)/gm, '<ul><ol><li>$1</li></ol></ul>')
    .replace(/<\/[ou]l\>\n<[ou]l\>/g, '\n')
    .replace(/<\/[ou]l\>\n<[ou]l\>/g, '\n')

    // text decoration: bold, italic, underline, strikethrough, highlight
    .replace(/\*\*\*(\w.*?[^\\])\*\*\*/gm, '<b><em>$1</em></b>')
    .replace(/\*\*(\w.*?[^\\])\*\*/gm, '<b>$1</b>')
    .replace(/\*(\w.*?[^\\])\*/gm, '<em>$1</em>')
    .replace(/___(\w.*?[^\\])___/gm, '<b><em>$1</em></b>')
    .replace(/__(\w.*?[^\\])__/gm, '<u>$1</u>')
    .replace(/\^\^\^(.+?)\^\^\^/gm, '<mark>$1</mark>')
    .replace(/\^\^(\w.*?)\^\^/gm, '<ins>$1</ins>')
    .replace(/~~(\w.*?)~~/gm, '<del>$1</del>')

    // line break and paragraph => <br/> <p>
    .replace(/ {2}\n/g, '\n<br/>')
    .replace(/\n\s*\n/g, '\n<p>\n')

    // indent as code-block
    .replace(/^ {4,10}(.*)/gm, formatPreCode)
    .replace(/^\t(.*)/gm, formatPreCode)
    .replace(/<\/code\><\/pre\>\n<pre\><code\>/g, '\n')

    // Escaping Characters
    .replace(/\\([`_~\*\+\-\.\^\\\<\>\(\)\[\]])/gm, '$1')
}

export const toHtml = function (mdText) {
  const yaml = {}
  mdText = mdText
    // replace \r\n to \n, and handle front matter for simple YAML
    .replace(/\r\n/g, '\n').replace(/^---+\s*\n([\s\S]*?)\n---+\s*\n/, formatYAML(yaml))
    // handle code-block.
    .replace(/\n~~~/g, '\n```').replace(/\n``` *(.*?)\n([\s\S]*?)\n``` *\n/g, formatCode)

  // split by "<code>", skip for code-block and process normal text
  let pos1 = mdText.indexOf('<code>')
  let pos2 = 0
  let mdHTML = ''
  while (pos1 >= 0) {
    pos2 = mdText.indexOf('</code>', pos1)
    mdHTML += parser(mdText.substr(0, pos1), yaml)
    mdHTML += mdText.substr(pos1, (pos2 > 0 ? pos2 - pos1 + 7 : mdText.length))
    mdText = mdText.substr(pos2 + 7)
    pos1 = mdText.indexOf('<code>')
  }

  return `<div class="markdown">${mdHTML + parser(mdText, yaml)}</div>`
}
