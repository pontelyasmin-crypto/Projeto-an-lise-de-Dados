# Panorama de vendas — leitura para a proprietária

## Escopo e identidade

Fonte: `vendas_hamburgueria.csv`, preservado. Período de 01/07/2026 a 30/09/2026. Esta análise usa o arquivo original do projeto, **não** os 200 registros demonstrativos que aparecem ao abrir o dashboard. Para reproduzir os indicadores na interface, importe o arquivo original e limpe todos os filtros, inclusive a pesquisa.

A origem e a natureza real ou fictícia desse arquivo não foram confirmadas. Os resultados abaixo descrevem essa base; decisões sobre uma operação real precisam de dados representativos da empresa.

A proprietária informou o nome **Yasmin**, agora exibido ao lado de “Panorama de vendas” no cabeçalho. O nome da empresa ainda não foi informado. Não foram inventados valores de lucro.

Na perspectiva da dona, a distinção necessária é:

- **Faturamento da empresa**: receita calculada pelos itens registrados. Não é lucro, saldo bancário ou dinheiro pessoal disponível.
- **Lucro da empresa**: resultado depois de contabilizar custos, despesas e demais ajustes aplicáveis; não calculável com esta base.
- **Lucro distribuído à proprietária [nome]**: parcela do resultado efetivamente destinada à proprietária segundo os dados de distribuição; também não calculável com esta base. Pró-labore e outras retiradas precisam ser identificados separadamente.

Após receber os nomes e os dados necessários, os rótulos sugeridos são “Faturamento de [empresa]”, “Lucro líquido de [empresa]” e “Lucro distribuído a [nome]”. Enquanto faltarem custos ou distribuição, os dois últimos devem mostrar **Não disponível**, nunca zero nem o faturamento.

## Indicadores e evolução

| Período | Faturamento | Vendas únicas | Unidades | Ticket médio | Receita por dia do período |
| --- | ---: | ---: | ---: | ---: | ---: |
| Julho/2026 | R$ 10.759,10 | 407 | 619 | R$ 26,44 | R$ 347,07 |
| Agosto/2026 | R$ 12.072,00 | 457 | 690 | R$ 26,42 | R$ 389,42 |
| Setembro/2026 | R$ 13.645,10 | 502 | 749 | R$ 27,18 | R$ 454,84 |
| Total | **R$ 36.476,20** | **1.366** | **2.058** | **R$ 26,70** | **R$ 396,48** |

**Fato observado:** agosto cresce 12,20% em receita e 12,29% em vendas frente a julho; o ticket varia -0,07%. Setembro cresce 13,03% em receita, 9,85% em vendas e 2,90% em ticket frente a agosto. Setembro supera julho em receita em 26,82%. Como setembro tem 30 dias, contra 31 em agosto, sua receita média diária sobe 16,80%.

**Interpretação:** o aumento de agosto está associado principalmente ao maior número de vendas; setembro combina mais vendas e maior receita média por venda. Isso descreve a composição aritmética do crescimento, não explica sua causa. Os preços unitários de cada produto são constantes nesta base; não há evidência de reajuste de preço no período. Mudanças no mix e nas quantidades por venda podem explicar a variação de ticket e merecem investigação.

**Ação sugerida:** acompanhar receita, vendas e ticket lado a lado, por canal, e revisar capacidade de produção e estoque. Não extrapolar três meses como previsão de crescimento nem presumir que lucro aumentou junto com faturamento.

## Produtos e concentração

| Categoria | Receita | Participação da receita |
| --- | ---: | ---: |
| Lanche | R$ 23.944,30 | 65,64% |
| Bebida | R$ 5.522,50 | 15,14% |
| Acompanhamento | R$ 3.933,60 | 10,78% |
| Sobremesa | R$ 3.075,80 | 8,43% |

Percentuais arredondados podem não somar exatamente 100%.

**Fato observado:** X-Bacon gera R$ 7.833,80, X-Burger R$ 5.885,30 e X-Tudo R$ 5.444,40. Juntos, os três representam **52,54%** do faturamento, entre oito produtos. Os quatro lanches representam 65,64%. Refrigerante lidera unidades, com 554, mas gera R$ 3.822,60; volume e receita produzem rankings diferentes.

**Interpretação:** existe concentração de receita nos lanches. Falhas de disponibilidade dos produtos líderes podem afetar parcela relevante do faturamento. Não há evidência de uma regra “80/20” nessa base, nem é possível chamar o líder de receita de produto mais lucrativo sem seus custos.

**Ação sugerida:** conferir disponibilidade e perdas dos insumos de X-Bacon, X-Burger e X-Tudo; calcular margem por produto antes de priorizar promoções. Ofertas de acompanhamentos podem ser uma hipótese para testar, mas esta base não registra cestas com vários produtos por pedido nem permite medir compra conjunta ou adesão a combos.

## Canais e qualidade operacional

| Canal | Receita | Participação | Vendas | Ticket | Espera média | Avaliação média observada |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Delivery | R$ 20.213,90 | 55,42% | 748 | R$ 27,02 | 40,68 min | 3,43 (665 respostas) |
| Balcão | R$ 16.262,30 | 44,58% | 618 | R$ 26,31 | 15,99 min | 4,51 (565 respostas) |

**Fato observado:** delivery tem espera média 24,69 minutos maior e avaliação média 1,08 ponto menor. Entre avaliações preenchidas, notas 1 ou 2 representam 51/665 = 7,67% no delivery e 1/565 = 0,18% no balcão. Os valores de avaliação observados estão entre 1 e 5; o significado formal da escala e o início/fim da medição de espera precisam ser confirmados.

Em setembro, a receita do balcão cresce **25,78%** frente a agosto, contra **3,86%** do delivery. Do aumento total de R$ 1.573,10, R$ 1.301,90 vêm do balcão e R$ 271,20 do delivery.

**Interpretação:** delivery combina participação maior na receita com indicadores operacionais que merecem atenção. A comparação não prova que demora causou notas menores: o tempo pode incluir entrega, os públicos podem diferir e as respostas são voluntárias. Não se pode concluir que delivery é mais rentável, pois faltam taxas e custos por canal.

**Ação sugerida:** revisar a definição de tempo de espera e separar preparo, despacho e entrega. Investigar atrasos e notas baixas por turno, item e dia; depois testar uma melhoria operacional e acompanhar os indicadores antes e depois. Confirmar margem líquida por canal antes de aumentar investimentos em delivery ou balcão.

## Ritmo semanal, turnos e extremos

**Fato observado:** sexta, sábado e domingo somam **55,07%** da receita. A média por ocorrência de sábado é **R$ 545,34**, contra **R$ 276,83** na segunda: diferença de 96,99%. Ambos têm 13 ocorrências no período, evitando uma comparação distorcida por quantidades diferentes de dias. A noite concentra **57,57%** da receita e 770 registros; almoço e tarde somam R$ 10.016,90 e R$ 5.459,60, respectivamente.

**Interpretação:** há um padrão semanal e por turno no trimestre, útil para planejar atendimento e estoque. Não há dados suficientes para afirmar sazonalidade anual, efeito de feriados ou produtividade por hora. Não sabemos os horários de funcionamento ou a equipe por turno.

**Ação sugerida:** conferir capacidade e reposição antes das noites e do fim de semana. Avaliar horários de menor movimento com custos de operação antes de testar ofertas. Reunir pelo menos um ciclo anual, idealmente dois, para estudar repetição de padrões sazonais.

**Extremos para investigar:** 28/08 registra a maior receita diária, **R$ 790,90**, em 23 vendas; 17/08 registra a menor, **R$ 79,20**, em 5 vendas. Não são automaticamente erros ou anomalias estatísticas. O primeiro é sexta-feira, o segundo segunda-feira; dia da semana, mix, quantidade, eventos, interrupções ou problemas de registro precisam ser conferidos antes de explicar esses resultados.

## Qualidade dos dados e limites

- 1.366 registros válidos, 1.366 IDs únicos, nenhuma duplicata exata e nenhum descarte nas regras de data, ID, quantidade e preço do dashboard. Linhas vazias foram ignoradas; nenhuma linha de venda foi removida para “limpar duplicatas”.
- Datas abrangem 92 dias consecutivos com ao menos um registro diário no conjunto da empresa. Isso não comprova que todas as vendas foram registradas. Em um dos dias, não há venda de balcão; ausência de registro não demonstra que o canal esteve fechado.
- A coluna `dia_semana` corresponde à data em todos os registros analisados.
- Há **136 avaliações ausentes (9,96%)**. As médias usam apenas as 1.230 respostas preenchidas. A ausência é 11,10% no delivery e 8,58% no balcão; não preenchemos notas ausentes com zero.
- Não existem região geográfica, custos, despesas, descontos, devoluções, impostos, taxas, clientes ou registros de distribuição à dona. Comparação geográfica, margem, lucro pessoal, recompra e rentabilidade não podem ser calculados.
- Cada ID aparece em uma única linha de um produto. O ticket segue a definição do dashboard (receita ÷ IDs únicos), mas precisa de confirmação de que `id_venda` identifica realmente uma venda completa, e não uma linha de pedido. Sem isso, não é possível afirmar que seja o valor médio do pedido do cliente.
- Não foi aplicada inferência causal nem teste de significância estatística. As relações descritas são comparações exploratórias.

## Prioridades para a dona

1. **Viabilizar a análise de lucro:** obter custos por produto e período, despesas, impostos, taxas por canal, descontos e devoluções. Conciliar com os registros financeiros e identificar distribuições, pró-labore e outras retiradas.
2. **Investigar delivery:** esclarecer métricas de espera e avaliação; revisar os registros com notas baixas e testar melhorias mensuráveis.
3. **Proteger os produtos líderes:** revisar disponibilidade, perdas e margens dos lanches, sem presumir que receita alta significa lucro alto.
4. **Planejar os períodos mais fortes:** dimensionar insumos e capacidade para noites e fim de semana, conferindo custos e registros de operação.
5. **Confirmar a continuidade do crescimento:** acompanhar mais períodos, receita diária e composição por canal; não projetar resultados futuros a partir desse trimestre.

## Informações solicitadas para completar a personalização e o lucro

- Nome da empresa, exatamente como deve aparecer nos títulos e rótulos; a proprietária já foi identificada como Yasmin.
- Confirmação de que a base representa a operação real e de que cada `id_venda` é uma venda completa.
- Receita efetiva e seus ajustes por período; custo dos produtos vendidos; taxas, impostos e despesas, com indicação de itens já descontados para evitar contagem dupla.
- Valores e datas de lucros distribuídos à proprietária, além de identificação de pró-labore e outras retiradas. Se houver sócios, participação e regra de distribuição.
- Definições de `tempo_espera_min` e da escala de `avaliacao`.

A apuração deve explicitar o escopo de cada indicador: margem de contribuição, lucro operacional e lucro líquido têm deduções diferentes. Não se deve aplicar uma porcentagem presumida ao faturamento para preencher a ausência desses dados.

## Reprodução

Os cálculos detalhados estão em `analise-vendas.json`. O script `analisar-vendas.cjs` usa as mesmas funções de validação e indicadores do dashboard e Papa Parse 5.5.3. Para executar: `node analisar-vendas.cjs caminho/para/papaparse.cjs`. Isso é apenas uma ferramenta de conferência e não muda a execução do site.
