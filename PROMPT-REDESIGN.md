# Prompt para redesenhar o dashboard

Copie o texto abaixo para uma IA de código com acesso ao projeto.

---

Atue como designer de interfaces e desenvolvedor especialista em dashboards corporativos de BI e produtos SaaS. Examine o código existente e aplique diretamente um redesenho visual profissional, usando Stripe, Linear, Datadog e Power BI bem configurado como referências de qualidade, sem copiar marcas ou interfaces.

Contexto: dashboard de vendas para uma atividade de Fundamentos de IA e Análise de Dados. O projeto usa HTML, CSS e JavaScript puro, Chart.js e Papa Parse por CDN com versões fixadas. Os arquivos de interface são public/index.html, public/styles.css e public/script.js. Deve continuar funcionando ao abrir public/index.html diretamente e como Static Site no Render, sem backend, compilação ou novas dependências obrigatórias. Leia AGENTS.md antes de editar.

Direção visual:
- Fundo claro neutro, superfícies brancas, bordas discretas e sombras suaves.
- Paleta sóbria com azul como acento principal e verde como acento secundário. Evite arco-íris, gradientes chamativos e decoração sem função.
- Hierarquia clara entre título, filtros, indicadores, gráficos e tabela. Dê maior destaque ao faturamento, mantendo os quatro cartões alinhados.
- Tipografia limpa, números tabulares, escala de tamanhos consistente e espaçamento baseado em múltiplos de 4 ou 8 px. Use fontes do sistema ou alternativas que não exijam uma nova dependência de rede.
- Componentes com alturas, bordas, raios e estados de foco consistentes. Diferencie ações primárias, secundárias e desabilitadas.
- Gráficos com a mesma linguagem visual: grades discretas, textos legíveis, unidades, legendas e tooltips consistentes. Use uma cor por série quando as barras representam a mesma medida. Preserve os tipos de gráfico, ordenação, agregações e valores.
- Tabela legível, valores numéricos alinhados à direita, destaque discreto na linha sob o cursor e rolagem horizontal restrita à tabela em telas pequenas.
- Ícones SVG simples apenas onde ajudam a entender ações; mantenha os rótulos textuais e esconda ícones decorativos de leitores de tela.
- Trate visualmente os estados existentes de carregamento, erro, ausência de resultados e indisponibilidade de bibliotecas. Preserve as condições e mensagens atuais; não simule atrasos ou invente estados.
- Layout responsivo, navegação por teclado, foco visível, contraste adequado e respeito à preferência por movimento reduzido.

Restrições obrigatórias:
1. Modifique apenas a camada visual: estilos, composição, cores, tipografia, espaçamento, ícones e opções de apresentação do Chart.js.
2. Preserve integralmente os dados, fórmulas, validação, filtros combinados, pesquisa, ordenação, paginação, importação, exportação e adaptação de região para canal.
3. Não renomeie rotas, arquivos existentes, componentes, funções, IDs de elementos, nomes de campos ou atributos usados pelo JavaScript. Não remova controles ou eventos. Não crie navegação decorativa sem destino.
4. Preserve os arquivos originais e o CSV de demonstração. Não invente indicadores, tendências, comparações, resultados ou relações de causa e efeito.
5. Se houver dúvida sobre o comportamento, preserve a implementação atual e explique a escolha no resumo. Resolva escolhas visuais comuns de forma coerente e prossiga.
6. Mantenha textos em português do Brasil, moeda em reais e caminhos relativos.

Verificação e entrega:
- Aplique as alterações diretamente nos arquivos, sem se limitar a sugestões ou mockups.
- Execute os testes disponíveis apropriados e confira que os indicadores continuam iguais antes e depois do redesenho.
- Se houver navegador disponível, examine o layout em desktop e celular, teste filtros, limpeza, importação, exportação e ausência de resultados, e verifique erros de JavaScript.
- Entregue um breve resumo dos arquivos alterados, decisões visuais, verificações realizadas e limitações que permaneceram. Não afirme ter verificado algo que não executou.
