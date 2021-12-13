import axios from 'axios';

class Api {
  static async getRepository(username) {
    const response = await axios.get(`https://api.github.com/users/${username}`);
    const reposUrl = await axios.get(`https://api.github.com/users/${username}/repos`);

    return { user: response.data, repos: reposUrl.data };
  }
}

class Repositories {
  constructor() {
    this.repositories = [];
    this.formInput = document.getElementById('githubInput');
    this.repoList = document.getElementById('githubList');
    this.formInput.setAttribute('placeholder', 'Digite o usuário.');
  }

  async addRepository(username) {
    try {
      if (!username) {
        alert('Usuário não preenchido.');
        return;
      }

      const { user, repos } = await Api.getRepository(username);

      const { avatar_url, bio, name } = user;
      const infosRepos = repos.map(
        repo => (
          {
            name: repo.name,
            url: repo.html_url }
        )
      );
      this.repositories.push({
        avatar: avatar_url,
        bio,
        name,
        repos: infosRepos
      });
      
    } catch {
      alert('Usuário não encontrado.');
    }

    this.listRepositories();
  }

  listRepositories() {
    console.log(this.repositories);

    this.formInput.value = '';
    this.repoList.innerHTML= '';
    
    this.repositories.forEach(user => {
      let repoImage = document.createElement('img');
      let repoTitle = document.createElement('h3');
      let repoDescription = document.createElement('p');

      repoImage.setAttribute('src', user.avatar);
      this.repoList.appendChild(repoImage);
      
      repoTitle.innerHTML = user.name;
      this.repoList.appendChild(repoTitle);
      
      repoDescription.innerHTML = user.bio
      this.repoList.appendChild(repoDescription);
      
      user.repos.map(repo => {
        const repoItem = document.createElement('li');
        const repoSubtitle = document.createElement('h5');
        const repoLink = document.createElement('a');
        repoLink.innerHTML = 'Acessar';

        this.repoList.appendChild(repoItem);

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