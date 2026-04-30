# Plataforma de Área de Membros (estilo Cakto Members)

Réplica visual da página enviada — área de aulas com player de vídeo, lista lateral de módulos e navegação anterior/próxima — com login funcional e tema preto + verde menta. Sem logo (espaço reservado para você adicionar depois).

## O que será construído

### Visual e identidade
- Tema escuro (preto/cinza muito escuro) com verde menta (#00E5A8 aprox.) como cor de destaque, igual ao original.
- Cabeçalho fixo no topo com:
  - Espaço reservado à esquerda para a logo (placeholder discreto que você substitui depois).
  - Avatar/menu do usuário à direita (sair, conta).
- Tipografia limpa, cantos arredondados, cards com leve borda verde nos itens ativos.

### Páginas (rotas)
- `/login` — Entrar (email + senha, Google opcional).
- `/signup` — Criar conta.
- `/` (após login) — Dashboard com a lista de cursos disponíveis.
- `/curso/$cursoId` — Página do curso com a primeira aula carregada.
- `/curso/$cursoId/aula/$aulaId` — Página da aula (layout principal replicando a screenshot):
  - Botão "Voltar" + breadcrumb com o título do módulo/aula.
  - Botões "Anterior" / "Próxima" no topo direito.
  - Player de vídeo grande ocupando o centro.
  - Título da aula abaixo do player.
  - Aba "Materiais (X)" com lista de downloads (ou estado vazio "Não há materiais disponíveis para esta aula").
  - Painel lateral direito "Conteúdo do Curso" listando módulos numerados (0, 1, 2…) que expandem mostrando as aulas; aula atual destacada em verde com miniatura.
- `/conta` — dados básicos do usuário e logout.

### Conteúdo do curso (fixo no código)
Vou criar um curso de exemplo "Mentoria Vivendo do Digital" com 3 módulos e algumas aulas cada (títulos no estilo do original: "Aula 1: PRIMEIROS R$ 3.000…", "Aula 2: LIGANDO O ROBÔ…", "Aula 3: ATIVANDO SEU ROBÔ…"). Você pode editar os títulos, descrições, URLs de vídeo (YouTube/Vimeo/MP4) e materiais diretamente em um arquivo de dados. Marcação de aula concluída fica salva por usuário.

### Login funcional (Lovable Cloud)
- Cadastro e login por email/senha.
- Sessão persistente; rotas do curso protegidas (redirecionam para /login se deslogado).
- Tabela `profiles` para nome de exibição.
- Tabela `lesson_progress` para marcar aulas concluídas por aluno (bolinha verde de progresso).

### Comportamento
- Player aceita link do YouTube/Vimeo (embed) ou MP4 direto.
- Navegação Anterior/Próxima percorre as aulas em ordem entre módulos.
- Layout responsivo: no mobile a lista de aulas vira uma gaveta acessível por botão.
- Estado "última aula assistida" para retomar de onde parou.

## Detalhes técnicos
- TanStack Start + Tailwind, tokens de cor semânticos no `styles.css` (verde menta como `--primary`).
- Rotas protegidas via layout `_authenticated`.
- Lovable Cloud: Auth (email/senha), tabelas `profiles` e `lesson_progress` com RLS (cada usuário lê/escreve só o próprio progresso).
- Dados do curso em `src/data/course.ts` (fácil de editar).
- Player: componente que detecta YouTube/Vimeo/MP4 e renderiza o iframe ou `<video>` apropriado.

## Fora do escopo (posso adicionar depois se quiser)
- Painel admin para criar cursos pela interface.
- Pagamentos / liberação de acesso por compra.
- Comentários, certificados, fórum.
- Upload de vídeos próprios (por enquanto você cola a URL).
