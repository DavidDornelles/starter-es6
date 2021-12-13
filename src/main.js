import axios from 'axios';

class Api {
  static async getRepository(username) {
    try {
      const response = await axios.get(`https://api.github.com/users/${username}`);
      const reposUrl = await axios.get(`https://api.github.com/users/${username}/repos`);
      return { user: response.data, repos: reposUrl.data };
    } catch(error) {
      console.warn('Erro na requisição: ', error);
    }
  }
}

class Repositories {
  constructor() {
    this.repositories = [];
  }

  async addRepository(username) {
    const { user, repos } = await Api.getRepository(username);

    if (!user || !repos) {
      throw new Error('Usuário ou Repositório não encontrado.');
    }

    const { avatar_url, bio, name } = user;
    const infosRepos = repos.map(
      repo => (
        {
          name: repo.name,
          url: repo.html_url }
      )
    );

    this.repositories.push({ avatar: avatar_url, bio, name, repos: infosRepos });
    this.listRepositories();
  }

  listRepositories() {
    console.log(this.repositories);
    const repoList = document.getElementById('githubList');
    repoList.innerHTML='';
    
    this.repositories.forEach(user => {
      let repoImage = document.createElement('img');
      let repoTitle = document.createElement('h3');
      let repoDescription = document.createElement('p');

      repoImage.setAttribute('src', user.avatar);
      repoList.appendChild(repoImage);
      
      repoTitle.innerHTML = user.name;
      repoList.appendChild(repoTitle);
      
      repoDescription.innerHTML = user.bio
      repoList.appendChild(repoDescription);
      
      user.repos.map(repo => {
        const repoItem = document.createElement('li');
        const repoSubtitle = document.createElement('h5');
        const repoLink = document.createElement('a');
        repoLink.innerHTML = 'Acessar';

        repoList.appendChild(repoItem);

        repoSubtitle.innerHTML = repo.name;
        repoItem.appendChild(repoSubtitle);

        repoLink.setAttribute('href', repo.url);
        repoItem.appendChild(repoLink);
      });
    });
  }
}

const repositoriesList = new Repositories();

document.getElementById('githubForm').onsubmit = event => {
  event.preventDefault();

  const username = document.getElementById('githubInput').value;

  repositoriesList.addRepository(username);
}