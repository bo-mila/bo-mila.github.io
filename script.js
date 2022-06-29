getReposData('unibreakfast').then(links => {
  wrapper.innerHTML = `
    <nav>
      <ul>${
        links.map(
          ({ name, repo, deploy }) => `
            <li>
              <a href="${repo}" target="_blank">${name}</a>${
                deploy ? `<a href="${deploy}" target="_blank">👁️</a>` : ''
              }
            </li>
          `
        ).join('')
      }</ul>
    </nav>
  `
})

async function getReposData(username) {
  const response = await fetch(`https://api.github.com/users/${username}`)
  const { public_repos, repos_url } = await response.json()
  const pages = []

  for (let i = 0; i < public_repos / 30; i++) {
    pages.push(fetch(`${repos_url}?page=${i + 1}`).then(r => r.json()))
  }

  const repos = (await Promise.all(pages)).flat()
  return repos.map(({ homepage, html_url, name }) => ({ name, repo: html_url, deploy: homepage }))
}
