import axios from 'axios';

class Api {
  static async getRepository(username) {
    try {
      const response = await axios.get(`https://api.github.com/users/${username}`);
      return response.data;
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
    const repository = await Api.getRepository(username);

    if (!repository) {
      throw new Error('Repositório não encontrado.');
    }

    this.repositories.push(repository);
  }
}

const repositoriesList = new Repositories();

document.getElementById('githubForm').onsubmit = event => {
  event.preventDefault();

  const username = document.getElementById('githubInput').value;

  repositoriesList.addRepository(username);
}