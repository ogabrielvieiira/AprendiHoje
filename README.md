# Projeto Final de Desenvolvimento mobile - AprendiHoje

## Proposta do Sistema
O sistema tem o intuito de guardar anotações e resumos importantes sobre conteúdos vistos em aula. O sistema resolve o problema de esquecimento pós-aula, incentivando os alunos a gravarem resumos verbais curtos em formato de áudio. Isso facilita a revisão rápida e a consolidação da matéria.

## Aplicação do Microfone
O recurso de hardware central da aplicação é o Microfone, integrado nativamente através da biblioteca `expo-audio`. 
A sua aplicação é essencial para o fluxo do sistema: 
- O aplicativo faz a gestão de permissões em tempo de execução, solicitando ao utilizador o acesso ao microfone na primeira vez que a tela de gravação é aberta. 
- Com a permissão concedida, o hardware é ativado para captar a voz do aluno, permitindo iniciar, parar e pré-visualizar a gravação do resumo antes de avançar para a etapa de categorização.

## Descrição das Telas
O aplicativo é composto por 4 telas principais interligadas:

1. **Home (index.tsx)**: 
   - É a tela inicial que exibe a listagem de todos os resumos gravados.
   - Consome os dados de uma API externa.
   - Permite filtrar as anotações por matérias e excluir registros.

2. **Gravador (gravador.tsx)**: 
   - A tela de interação direta com o hardware. 
   - Contém os controlos de gravação e um reprodutor de áudio para ouvir a prévia. Após a gravação, permite avançar para o formulário passando o `URI` do áudio como parâmetro de rota.

3. **Formulário de Submissão (formulario.tsx)**: 
   - Tela responsável por classificar o áudio gravado.
   - **O Formulário Principal** contém 4 campos de captura de dados validados através do *React Hook Form*:
     - **Tópico / Título** (Entrada de Texto obrigatória).
     - **Descrição / Resumo** (Área de Texto multilinhas obrigatória).
     - **Matéria / Categoria** (Seletores visuais tipo *Chips*).
     - **Marcar como Importante** (*Switch* booleano).
   - Ao submeter, os dados são enviados e guardados na Nuvem através de uma API (via Axios - POST) com feedback de carregamento (*ActivityIndicator*).

4. **Detalhes (detalhes.tsx)**: 
   - Tela acedida ao clicar num cartão na Home. 
   - Recebe parâmetros da rota para exibir o título, categoria, status de favorito e a descrição completa do resumo.
   - Disponibiliza um player de áudio completo para o aluno ouvir a sua revisão.