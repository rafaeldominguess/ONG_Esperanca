🌎 ONG Brasil Esperança
📝 Nota Acadêmica
Este projeto foi desenvolvido como um trabalho acadêmico para a disciplina de Desenvolvimento Web do curso de Análise e Desenvolvimento de Sistemas. O objetivo principal é aplicar e demonstrar conhecimentos avançados em HTML, CSS e JS.

🚩 Visão Geral do Projeto
ONG Brasil Esperança é uma simulação de um site institucional para uma organização não governamental fictícia. O projeto vai além de um simples site estático, implementando uma arquitetura de SPA (Single Page Application) utilizando JavaScript puro (Vanilla JS). Isso significa que toda a navegação entre as "páginas" (Início, Sobre, Projetos, Contato) é gerenciada dinamicamente pelo JavaScript, que renderiza o conteúdo no DOM sem a necessidade de recarregar a página inteira.

O desafio central foi construir um sistema de "roteamento" e renderização de templates do zero, sem o uso de frameworks modernos (como React, Vue ou Angular), para focar nos fundamentos da manipulação do DOM e gerenciamento de estado da aplicação.

✨ Features Principais
Navegação SPA: Experiência de usuário fluida sem recarregamentos de página.

Renderização Dinâmica: O conteúdo de cada página é carregado e renderizado via JavaScript.

Validação de Formulários: O formulário de contato possui validação de campos em tempo real (client-side).

Feedback ao Usuário: Utilização de componentes como Toasts e Badges para notificar o usuário sobre ações (ex: envio de formulário).

Design Responsivo: O layout é adaptável para dispositivos móveis (mobile-first), incluindo um menu hambúrguer.

Simulação de Persistência: Uso do LocalStorage para simular o envio e armazenamento de dados de formulários.

🛠️ Tecnologias e Conceitos Aplicados
Este projeto foi construído puramente com a "tríade" fundamental do desenvolvimento front-end, com foco especial em JavaScript moderno (ES6+).

1. Front-End
HTML5: Utilizado para a estrutura semântica base da aplicação (index.html) e dos templates de página.

CSS3: Responsável por toda a estilização, incluindo:

Design System: Um sistema de design coeso baseado em variáveis CSS (:root) para cores (paleta em tons de marrom e mostarda), fontes e espaçamentos.

Flexbox & Grid: Usados para a criação de layouts complexos e responsivos.

Media Queries: Para garantir a adaptabilidade em diferentes tamanhos de tela.

JavaScript (ES6+): O "cérebro" da aplicação.

Manipulação do DOM: Criação, seleção, adição e remoção de elementos HTML de forma dinâmica para renderizar as diferentes seções.

Gerenciamento de Eventos: Captura de cliques (navegação, menu, formulário) e outros eventos para disparar as ações da aplicação.

Arquitetura SPA: Um "roteador" simples foi implementado para observar mudanças no hash da URL (window.location.hash) e carregar o conteúdo da página correspondente.

Módulos (ESM): O código JS é modularizado para melhor organização (ex: um módulo para o SPA, outro para validação).

Fetch API (Simulado): Embora não haja um back-end real, o conceito é aplicado para carregar os "templates" das páginas.

Validação de Formulários: Verificação de padrões (regex) e preenchimento dos campos de entrada.

2. Armazenamento
LocalStorage: Utilizado para persistir os dados do formulário de contato localmente no navegador, simulando um envio bem-sucedido para um banco de dados.

3. Ferramentas e Metodologia
Git & GitHub: Para controle de versão e hospedagem do código.

VS Code: Ambiente de desenvolvimento.

Design Responsivo (Mobile-First): A estilização foi pensada primeiro para dispositivos móveis e depois adaptada para desktops.

📂 Estrutura de Pastas
A estrutura do projeto é organizada para separar claramente as responsabilidades (Estilo, Lógica e Estrutura).

ONG_Esperanca/
├── CSS/
│   └── style.css       # Folha de estilo principal (inclui Design System)
├── img/
│   └── ...             # Imagens e ícones utilizados no projeto
├── js/
│   └── main.js         # Script principal (roteador SPA, lógica de eventos)
│   └── validation.js   # (Exemplo) Módulo de validação de formulários
├── index.html          # Ponto de entrada único da aplicação (HTML base)
├── LICENSE             # Licença MIT
└── README.md           # Esta documentação


🚀 Como Executar o Projeto
Este projeto não requer um servidor de back-end ou ferramentas de build complexas (como Node.js, Webpack, etc.). Ele pode ser executado diretamente no navegador.

Clone o repositório:

Bash

git clone https://github.com/rafaeldominguess/ONG_Esperanca.git
Navegue até a pasta do projeto:

Bash

cd ONG_Esperanca
Abra o arquivo index.html:

Você pode simplesmente dar um duplo clique no arquivo index.html para abri-lo no seu navegador padrão.

Opcional (Recomendado): Se você utiliza o VS Code, pode usar a extensão Live Server para iniciar um servidor local e visualizar o projeto (clique com o botão direito no index.html e selecione Open with Live Server).

👨‍💻 Autor
Desenvolvido por Rafael Vera Domingues, como parte da graduação em Análise e Desenvolvimento de Sistemas.

LinkedIn: https://www.linkedin.com/in/rafaelvdomingues/

🪪 Licença
Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes. Sinta-se à vontade para usar este código como base de estudo.