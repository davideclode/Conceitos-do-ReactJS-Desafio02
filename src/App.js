import React, { useState, useEffect } from "react";

// Importando api
import api from './services/api';

import './styles.css';
// import { useEffect } from "react";

function App() {

    // Criando dois projetos
  /* 'useState' retorna duas posições: 
  1. Variável com o seu valor inicial 
  2. Função para atualizarmos esse valor
  Logo, vamos utilizar o conceito e DESESTRUTUÇÃO
  Obs.: como "repositories" vai sempre ser uma array, é necessário também que useState([]) o seja e vazio
  Obs.: Se "repositories" fosse um objeto, então teriamos também useState({}).
  */
  const [ repositories, setRepositories ] = useState([]);

  // Aqui, vou colocar o useAffect que recebe dois parâmetros:
  // 1º parâmetro: qual função eu quero disparar?
  // 2º parâmetro: quando é que eu quero disparar essa função?
  // Se eu quissesse que essa função fosse disparada toda vez que a variável "repositoies" tivesse valor alterado, então fariamos "[repositories]". Mas eu quere que a função seja disparada a penas 1 vez. Logo de o array vazio '[]'. chama-se array de dependências. Se tivermos alguma variável dentro de "{}", então toda vez que ocorrer alteração em '[]', a variável dentro de "{}" será executada. Neste caso temos.
  useEffect( () => {
    // Quando api.get('projects') retornar uma resposta "então" teremos resposta disponível dentro de "response"
    api.get('repositories').then(response => {
      // Vou usar o 'data' para preencher o repositório. Temos que inicializar também nosso repositório com array vazio, ou seja "useState([])". Vale dizer que dentro do "response.data", temos "id", "title" e "owner"
      setRepositories(response.data);
      /* Poderia ser também:
      const repository = response.data;
      setRepositories(repository);
      */
    });
  }, [] );

  // Função para lidar com a adição de novos projetos sem duplicá-las
  async function handleAddRepository() {
    /*Tota vez que a gente quer alterar o valor de "repositories" precisamos chamar a função     "setRespositories". Então é essa função que devemos chamar. E para isso também vamos utilizar o conceito de IMUTABILIDADE. 
    '[]' significa que estamos criando um novo array
    '...projects' copiando tudo que já está dentro de projects
    `Novo projeto ${Date.now()}` e criando um novo projeto
    */

    // Lembrando que no "insomnia" enviamos uma requisição do tipo "POST" para rota "projects", enviando "title" e "owner". Portanto, aqui vamos utilizar a nossa "api" para enviar uma requisição do tipo "POST" para rota "repositories", enviando "title" e "owner"
    // Criando novo Repositório
    const response = await api.post('repositories', {
      title: `Novo Repositório ${Date.now()}`,
      url: 'https://skylab.rocketseat.com.br/node/front-end-com-react-js',
      techs: ['Node.js', 'ReactJS']
    } );
    // Assim como no "response.data" do "api.get()" também temos dentro do "response.data" do "api.post()" o "id", "title" e "owner". Portanto fazemos:
    const repository = response.data;

    // Agora vou adicionar o repositório(repository) recem criado no final de array de repositórios(repositories). Lembrar de adicionar o plugin "   " e acrescentar no arquivo babel.config.js o seguinte: 
    setRepositories([...repositories, repository]); 
    // ou "setRepositories([...repositories, response.data])"

  }

  async function handleRemoveRepository(id) {
    //Não vamos utilizar, aqui, o "cost response = " como no "handleAddRepository" porque a rota "delete" não está me retornando nada.
    // Também vou utilizar uma crase porque daí consigo passar a "id" como uma variável
    await api.delete(`repositories/${id}`);

    // Agora eu preciso deletar esse repositório da minha lista aqui no front-end.
    // Vou usar "setRepositories" e vou pegar todos os meus repositórios(repositories) e vou realizar um filter.
    setRepositories(repositories.filter(
      // O filtro faz o seguinte: Para cada um dos repositórios(repository) eu vou verificar se a "id" dele(do repository) é diferente da "id" que estou recebendo acima(em "handleRemoveRepository(id)"). Quer dizer de que eu estou mantendo no meu "repositories" a penas os repositórios em que a "id" é diferente da id que eu removi.
      repository => repository.id !== id
    ))

    /*Outra opção do deste último trecho do código é:*/
    //const newRepositories = repositories.filter(
    //  repository => repository.id !== id
    //)
    //setRepositories(newRepositories);
  }


  return (
    <div>
      <ul data-testid="repository-list">        
        
          {repositories.map(repository => (
            <li key={repository.id}>
              {repository.title}

              <button type="button" onClick={() => handleRemoveRepository(repository.id)}>
                Remover
              </button>
            </li>

          ))}
      </ul>

      <button type="button" onClick={handleAddRepository}> Adicionar </button>
    </div>
  );
}

export default App;
