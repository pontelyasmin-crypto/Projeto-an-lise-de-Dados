# Panorama de vendas

Dashboard para a disciplina de Fundamentos de IA e Análise de Dados, feito em HTML, CSS e JavaScript puro. Não exige instalação, backend ou compilação.

O cabeçalho identifica **Yasmin** ao lado de “Panorama de vendas”. A identidade visual combina tipografia moderna em negrito, fundo preto com grade sutil, superfícies escuras, brilho discreto, textos brancos e destaques em diferentes tons de roxo.

O rodapé inclui créditos no estilo HUD Cyberpunk: **Yasmin | Análise de Dados**, com ícone e link para [github.com/pontelyasmin-crypto](https://github.com/pontelyasmin-crypto), aberto em nova aba.

Ao lado da identificação de Yasmin no cabeçalho, links profissionais com ícones levam ao GitHub, LinkedIn e Instagram informados. Os botões usam fundo `#1e1233`, borda `#a855f7` e brilho neon ao passar o mouse ou receber foco por teclado. Todos abrem em nova aba e se reorganizam em telas pequenas.

## Abrir e explorar

1. Abra `public/index.html` no navegador.
2. A página apresenta imediatamente **200 registros fictícios**, de janeiro a dezembro de 2025. A demonstração incorporada em `script.js` corresponde exatamente a `public/dados-exemplo.csv`; não depende de `fetch` nem de um servidor local.
3. Selecione datas, categoria e região. A pesquisa também filtra os cartões e gráficos. Use **Limpar filtros** para restaurar a visão completa, incluindo pesquisa e ordenação.
4. A tabela tem 20 registros por página. A contagem e a exportação incluem **todos** os registros filtrados, independentemente da página atual.
5. Use **Importar CSV** para escolher sua base. O processamento acontece localmente no navegador. **Usar demonstração** restaura os dados fictícios.
6. **Exportar CSV** baixa os registros filtrados na ordem selecionada, com as colunas originais, incluindo campos extras. O arquivo tem UTF-8 com BOM; fórmulas em textos são neutralizadas para abertura em planilhas.

Chart.js **4.4.8** e Papa Parse **5.5.3** são carregados por CDN com versões fixadas. **É necessário acesso à internet para os gráficos, a importação e a exportação.** Sem as bibliotecas, a amostra incorporada, os cartões, filtros e tabela continuam disponíveis, com aviso na interface.

## Arquivos

- `AGENTS.md`: orientações do projeto, preservadas.
- `public/index.html`: estrutura acessível, controles e gráficos.
- `public/styles.css`: visual e adaptação a computador e celular.
- `public/script.js`: demonstração, validação, filtros, cálculos, gráficos e exportação.
- `public/dados-exemplo.csv`: 200 vendas fictícias, uma venda única de um produto por linha.
- `vendas_hamburgueria.csv`: arquivo original fornecido, preservado na raiz.

## Colunas e regras

### Gráficos adicionais da hamburgueria

O botão **Usar base da hamburgueria** carrega a cópia incorporada do arquivo fornecido, sem `fetch` e sem precisar selecionar um arquivo. A demonstração fictícia continua sendo a base inicial. A cópia está em `public/dados-hamburgueria.js`; o CSV original permanece preservado na raiz. **Essa cópia integra o site publicado**: os registros fornecidos ficam acessíveis a quem visitar o site. A natureza real ou fictícia da base não foi confirmada e é sinalizada na interface.

Além dos três gráficos originais, há oito novos gráficos, todos atualizados pelos mesmos filtros e pesquisa:

- Faturamento diário: soma da receita em cada data com registros, em ordem cronológica. Datas sem registros não são convertidas em zero.
- Receita por produto e unidades por produto: rankings separados, limitados aos dez produtos com maior valor no indicador correspondente. O rodapé informa quantos produtos são exibidos.
- Receita média por dia da semana: receita do dia da semana ÷ número de datas distintas desse dia com registros no recorte. Dias sem registros ficam sem valor, não com zero. A classificação semanal é derivada da data validada, em vez de confiar em `dia_semana`.
- Receita por turno: agrupamento da coluna `periodo`.
- Receita por forma de pagamento: agrupamento de `forma_pagamento`, sem descontar taxas ausentes da base.
- Espera média por canal: soma dos tempos válidos ÷ número de registros válidos por `canal`. `tempo_espera_min` precisa ser numérico e não negativo; zero é válido.
- Avaliação média por canal: soma das notas válidas ÷ número de respostas válidas por `canal`. `avaliacao` é aceita entre 1 e 5, faixa observada na base; o significado da escala precisa ser confirmado na fonte.

Os gráficos de médias informam o tamanho das amostras por canal e o total de campos ausentes e inválidos excluídos **somente daquela média**. Essas linhas continuam nos indicadores de vendas, tabela e demais gráficos. Produto, categoria, canal e outros grupos textuais vazios são identificados como “Não informado”. Se uma coluna opcional não existir na base selecionada, o cartão explica quais campos faltam. As novas funções de agregação e os estados de troca de base foram verificados com amostras conhecidas e no Chrome em desktop e celular.

O dashboard permanece com 11 gráficos e não calcula lucro, pois a base não informa custos e despesas.

O visual usa diferentes tons de roxo sobre fundo preto e títulos brancos em negrito. Indicadores destacam valores em branco e lilás; a tabela segue a paleta dos gráficos, com cabeçalho roxo, linhas alternadas em preto e roxo escuro e faturamento em destaque. Os gráficos têm degradês, crescimento animado de barras, transições ao filtrar, pontos destacados ao passar o mouse e entrada ao rolar a página. As animações são breves e não ficam repetindo continuamente; a preferência de movimento reduzido do navegador desativa os efeitos. O fluxo de filtros e os valores calculados permanecem os mesmos.

### Formatos e indicadores circulares

As cores anteriores foram preservadas. O layout usa cartões com proporções variadas, cantos arredondados, tabela com cabeçalho fixo durante a rolagem e tooltips com valores e amostras. As evoluções mensal e diária usam áreas com interpolação suave monotônica; pontos são as observações reais, enquanto as curvas apenas conectam os registros. Rankings e médias usam barras arredondadas; semana e turno usam colunas. Categoria usa rosca completa e pagamento usa meia rosca, com total filtrado centralizado e participação nos tooltips. Com mais de oito grupos, as roscas voltam a barras para manter a legibilidade. Não há metas presumidas ou mudanças nos valores agregados. As legendas circulares são informativas; filtros continuam sendo o mecanismo para selecionar o recorte.

Quatro cartões radiais adicionais mostram a participação do **produto, categoria, região/canal e turno líderes** na receita filtrada. Em cada dimensão: percentual = receita do grupo líder ÷ faturamento total filtrado × 100. Cada anel apresenta nome, porcentagem centralizada e receita do grupo em relação ao total. São dimensões independentes; as quatro porcentagens não devem ser somadas e não representam progresso em direção a metas. Filtros e pesquisa atualizam os anéis junto com todos os outros resultados.

Os anéis usam SVG local, sem bibliotecas adicionais, e preservam as cores existentes. Animam o preenchimento por aproximadamente um segundo e respeitam movimento reduzido. Sem registros, sem coluna opcional ou com faturamento total zero, mostram “Não disponível”, sem uma porcentagem inventada. Os indicadores originais, o CSV, a importação, a exportação e as fórmulas de receita, unidades, vendas e ticket permanecem preservados.

A tabela tem ícones SVG locais em estilo neon roxo e branco: hambúrguer para lanches/pratos principais, batatas para acompanhamentos e copo para bebidas. Uma legenda aparece acima da tabela e os ícones acompanham os nomes dos produtos. São decorativos e não alteram os dados nem o CSV exportado. Categorias desconhecidas e sobremesas mantêm o texto sem ícone inadequado. Nenhum serviço de imagens ou dependência adicional é necessário.

Três cartões decorativos logo abaixo do cabeçalho exibem as mesmas ilustrações ampliadas em estilo holograma: fundo preto translúcido com desfoque, borda roxa, brilho suave, órbita e base de projeção. Os títulos identificam hambúrguer, batata frita e refrigerante. O efeito funciona com SVG e CSS locais, inclusive ao abrir o HTML diretamente, sem gerar novas cores, valores de vendas ou informações sobre o cardápio real.

| Coluna | Significado e formato |
| --- | --- |
| `id_venda` | Identificador obrigatório; texto ou número, tratado como texto |
| `data` | Data válida no formato AAAA-MM-DD |
| `produto` | Nome do produto |
| `categoria` | Grupo do produto |
| `regiao` | Região da venda; opcional se não existir na base |
| `quantidade` | Inteiro maior ou igual a zero |
| `preco_unitario` | Valor numérico em reais, não negativo, com até duas casas decimais, sem R$ |

O CSV precisa ter cabeçalho. Use vírgula como separador e ponto decimal, como no exemplo. Papa Parse também detecta separadores como ponto e vírgula. Decimais com vírgula são aceitos se o separador for ponto e vírgula ou o campo estiver entre aspas. Não use separador de milhares. Nomes de colunas são normalizados para minúsculas e espaços externos são removidos.

O arquivo original encontrado tem **1.366 registros (linhas vazias ignoradas)**, de julho a setembro de 2026, e as colunas `id_venda`, `data`, `dia_semana`, `periodo`, `produto`, `categoria`, `quantidade`, `preco_unitario`, `forma_pagamento`, `canal`, `tempo_espera_min` e `avaliacao`. Ao importá-lo, a ausência de `regiao` faz o dashboard usar **canal de venda** no filtro e no gráfico correspondentes. Canal não representa uma região geográfica; a interface identifica essa adaptação. Não é possível comparar regiões geográficas nessa base. Campos extras ficam disponíveis na pesquisa e na exportação, sem gerar novos indicadores.

Se não houver região nem canal, o agrupamento será “Não informado”. Produto, categoria e região vazios também recebem esse rótulo. ID, data, quantidade ou preço ausentes ou inválidos causam descarte da linha, com contagem e motivos na interface. Zero é um valor válido e difere de ausência. CSV malformado ou sem colunas obrigatórias é rejeitado, mantendo a base anterior. O preço não pode exceder duas casas decimais e o faturamento da linha precisa caber em um inteiro seguro em centavos.

Linhas e IDs repetidos **não são eliminados**: um mesmo ID pode representar vários itens de uma venda. Todos os itens contribuem para receita e unidades, enquanto o número de vendas conta IDs distintos. O usuário deve verificar se repetições são itens legítimos ou erros da fonte.

## Fórmulas

Todos os indicadores usam o mesmo conjunto de registros filtrados, inclusive a pesquisa:

- Faturamento da linha = `quantidade × preco_unitario`.
- Faturamento total = soma dos faturamentos das linhas.
- Quantidade de vendas = número de `id_venda` únicos.
- Unidades vendidas = soma de `quantidade`.
- Ticket médio = faturamento total ÷ quantidade de vendas; zero quando não há vendas.

As receitas são somadas em **centavos inteiros**, evitando erros usuais de soma com casas decimais. Ticket médio é arredondado apenas na apresentação. O faturamento mensal agrupa pelo ano e mês; meses intermediários sem vendas têm valor zero. Categorias e regiões/canais são ordenados por receita decrescente. Valores e datas são exibidos no padrão brasileiro. O ticket representa as vendas e itens presentes no recorte; filtrar categorias pode mostrar apenas parte de uma venda. Os gráficos descrevem os dados e não demonstram causalidade.

A base demonstrativa completa tem faturamento **R$ 10.152,80**, **200 vendas**, **600 unidades** e ticket médio **R$ 50,76**.

## Publicar pelo GitHub no Render

1. Envie este projeto a um repositório do GitHub, incluindo a pasta `public`.
2. No Render, crie um serviço **Static Site** e conecte o repositório.
3. Configure:

| Campo | Valor |
| --- | --- |
| Tipo de serviço | Static Site |
| Branch | A branch que contém o projeto |
| Root Directory | Vazio |
| Build Command | `echo "Site pronto"` |
| Publish Directory | `public` |

4. Publique e abra a URL disponibilizada pelo Render. Alterações enviadas à branch conectada poderão gerar novos deploys conforme a configuração do serviço.

Não há dependências para instalar durante o build. Os caminhos dos arquivos da página são relativos. O CSV original na raiz não integra a pasta publicada; a importação permite selecioná-lo localmente.

## Conferência manual para a atividade

Para conferir as fórmulas, use três linhas: venda A com 2 unidades a R$ 10,00; outra linha da venda A com 1 unidade a R$ 5,00; venda B com 3 unidades a R$ 7,50. O resultado esperado é **R$ 47,50**, **2 vendas**, **6 unidades** e **R$ 23,75** de ticket médio.

Experimente combinar período, categoria, região e pesquisa; limpar os filtros; selecionar um período sem vendas; importar o exemplo e o arquivo original; exportar e importar novamente o CSV filtrado. Compare os totais e observe o aviso de adaptação de canal no arquivo original.

## Verificações realizadas na entrega

- Amostra conhecida de R$ 47,50, IDs repetidos, zero versus ausência, datas inválidas, ordenação, filtros combinados e ausência de resultados.
- Correspondência exata entre os 200 registros incorporados e o CSV de exemplo.
- Leitura dos dois CSVs com Papa Parse 5.5.3 e exportação seguida de reimportação com os mesmos indicadores. O original contém 1.366 registros válidos, sem descartes: R$ 36.476,20, 1.366 vendas e 2.058 unidades.
- Chrome em modo headless, abrindo `public/index.html` diretamente: carregamento das bibliotecas CDN e dos gráficos, filtros, pesquisa, limpeza, ordenação, paginação, download real de CSV e importação real do arquivo original.
- Capturas examinadas em larguras de 1440 px e 390 px; sem transbordamento horizontal da página. A tabela permite rolagem horizontal no celular. Nenhuma exceção JavaScript detectada no fluxo verificado.

Os testes de dados podem ser repetidos com `node verificar.cjs` (Node.js é opcional e usado apenas na verificação, não para executar o dashboard). Para verificar também o parser real, passe o caminho de um arquivo local da distribuição Papa Parse 5.5.3 como argumento. `node verificar-navegador.cjs` repete o fluxo no Chrome instalado no caminho padrão do Windows, usando a porta 9224 e uma pasta temporária para capturas e downloads; exige internet para as bibliotecas CDN.

A publicação no Render não foi executada nesta entrega; o projeto está preparado com os arquivos na pasta `public` e a configuração descrita acima. Não houve verificação em dispositivos físicos ou outros navegadores.

