/* Funções de dados separadas da interface para facilitar o estudo e a verificação. */
const COLUNAS = ['id_venda', 'data', 'produto', 'categoria', 'regiao', 'quantidade', 'preco_unitario'];
const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const numero = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 });

function criarDemonstracao() {
  const produtos = [
    ['X-Burger', 'Lanches', 22.9], ['X-Bacon', 'Lanches', 29.9],
    ['Refrigerante', 'Bebidas', 6.9], ['Suco natural', 'Bebidas', 9.5],
    ['Batata frita', 'Acompanhamentos', 14.9], ['Onion rings', 'Acompanhamentos', 17.9],
    ['Milkshake', 'Sobremesas', 16.9], ['Brownie', 'Sobremesas', 12.5]
  ];
  const regioes = ['Norte', 'Nordeste', 'Centro-Oeste', 'Sudeste', 'Sul'];
  // Geração determinística: estes mesmos 200 registros estão no CSV de exemplo.
  return Array.from({ length: 200 }, (_, i) => {
    const [produto, categoria, preco] = produtos[(i * 7 + Math.floor(i / 12)) % produtos.length];
    const mes = i % 12 + 1;
    return { id_venda: `DEMO-${String(i + 1).padStart(3, '0')}`,
      data: `2025-${String(mes).padStart(2, '0')}-${String((i * 11) % 28 + 1).padStart(2, '0')}`,
      produto, categoria, regiao: regioes[(i * 3 + Math.floor(i / 12)) % 5],
      quantidade: (i * 7 + Math.floor(i / 20)) % 5 + 1, preco_unitario: preco };
  });
}

function dataValida(valor) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) return false;
  const data = new Date(`${valor}T00:00:00Z`);
  return Number.isFinite(data.getTime()) && data.toISOString().slice(0, 10) === valor;
}

function lerNumero(valor) {
  const texto = String(valor ?? '').trim();
  // Campo vazio é ausente, não zero. Aceita decimal com ponto ou vírgula, sem milhares.
  if (!/^[+-]?\d+(?:[.,]\d+)?$/.test(texto)) return NaN;
  return Number(texto.replace(',', '.'));
}

function validarDados(linhas, campos) {
  const usaCanal = !campos.includes('regiao') && campos.includes('canal');
  const dimensao = usaCanal ? 'canal' : 'regiao';
  const obrigatorias = ['id_venda', 'data', 'produto', 'categoria', 'quantidade', 'preco_unitario'];
  const faltantes = obrigatorias.filter(c => !campos.includes(c));
  if (faltantes.length) throw new Error(`Colunas obrigatórias ausentes: ${faltantes.join(', ')}.`);
  const validas = [], motivos = {};
  for (const linha of linhas) {
    const erros = [];
    const registro = Object.fromEntries(campos.map(c => [c, String(linha[c] ?? '').trim()]));
    if (!registro.id_venda) erros.push('ID ausente');
    if (!dataValida(registro.data || '')) erros.push('data ausente ou inválida (use AAAA-MM-DD)');
    const quantidade = lerNumero(registro.quantidade), preco = lerNumero(registro.preco_unitario);
    if (!Number.isSafeInteger(quantidade) || quantidade < 0) erros.push('quantidade ausente, negativa ou não inteira');
    if (!Number.isFinite(preco) || preco < 0 || Math.abs(preco * 100 - Math.round(preco * 100)) > 0.000001) erros.push('preço ausente, negativo ou com mais de 2 casas decimais');
    const centavos = Math.round(preco * 100) * quantidade;
    if (!erros.length && !Number.isSafeInteger(centavos)) erros.push('faturamento fora do limite numérico');
    if (erros.length) { erros.forEach(e => motivos[e] = (motivos[e] || 0) + 1); continue; }
    validas.push({ ...registro, produto: registro.produto || 'Não informado', categoria: registro.categoria || 'Não informado',
      regiao: registro[dimensao] || 'Não informado', quantidade, preco_unitario: preco, centavos, faturamento: centavos / 100 });
  }
  return { validas, descartadas: linhas.length - validas.length, motivos, usaCanal,
    semDimensao: !campos.includes(dimensao), campos };
}

function filtrarDados(dados, filtros) {
  const busca = (filtros.pesquisa || '').toLocaleLowerCase('pt-BR');
  return dados.filter(r => (!filtros.inicio || r.data >= filtros.inicio) &&
    (!filtros.fim || r.data <= filtros.fim) && (!filtros.categoria || r.categoria === filtros.categoria) &&
    (!filtros.regiao || r.regiao === filtros.regiao) &&
    (!busca || Object.entries(r).filter(([k]) => !['centavos', 'faturamento'].includes(k)).some(([,v]) => String(v).toLocaleLowerCase('pt-BR').includes(busca))));
}

function calcularIndicadores(dados) {
  const centavos = dados.reduce((s, r) => s + r.centavos, 0);
  const vendas = new Set(dados.map(r => r.id_venda)).size;
  return { faturamento: centavos / 100, vendas, unidades: dados.reduce((s, r) => s + r.quantidade, 0), ticket: vendas ? centavos / 100 / vendas : 0 };
}

function agruparReceita(dados, campo) {
  const grupos = new Map();
  for (const r of dados) {
    const chave = campo === 'mes' ? r.data.slice(0, 7) : r[campo];
    grupos.set(chave, (grupos.get(chave) || 0) + r.centavos);
  }
  if (campo === 'mes' && grupos.size) {
    // Meses intermediários sem vendas aparecem com receita zero.
    const chaves = [...grupos.keys()].sort();
    let [ano, mes] = chaves[0].split('-').map(Number);
    const fim = chaves.at(-1);
    while (`${String(ano).padStart(4, '0')}-${String(mes).padStart(2, '0')}` <= fim) {
      const chave = `${String(ano).padStart(4, '0')}-${String(mes).padStart(2, '0')}`;
      if (!grupos.has(chave)) grupos.set(chave, 0);
      if (++mes === 13) { mes = 1; ano++; }
    }
  }
  return [...grupos].sort((a, b) => campo === 'mes' ? a[0].localeCompare(b[0]) : b[1] - a[1]).map(([chave, valor]) => [chave, valor / 100]);
}

function ordenarDados(dados, ordem) {
  const separador = ordem.lastIndexOf('-');
  const campo = ordem.slice(0, separador), sentido = ordem.slice(separador + 1) === 'asc' ? 1 : -1;
  return [...dados].sort((a, b) => sentido * (typeof a[campo] === 'number' ? a[campo] - b[campo] : String(a[campo]).localeCompare(String(b[campo]), 'pt-BR', { numeric: true })));
}

function agruparUnidades(dados) {
  const grupos = new Map();
  dados.forEach(r => grupos.set(r.produto, (grupos.get(r.produto) || 0) + r.quantidade));
  return [...grupos].sort((a,b) => b[1] - a[1]);
}

function participacaoLider(dados, campo) {
  // Proporção observada, não meta: mantém a receita e o conjunto de dados existentes.
  const grupos = agruparReceita(dados.map(r => ({ ...r, [campo]: r[campo] || 'Não informado' })), campo);
  const total = calcularIndicadores(dados).faturamento;
  const lider = grupos[0];
  return !lider || total <= 0 ? null : { nome: lider[0], receita: lider[1], total, percentual: lider[1] / total * 100 };
}

function iconeProduto(categoria) {
  // Classificação apenas visual: não altera o produto, a categoria ou os cálculos.
  const nome = String(categoria || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
  if (['lanche', 'lanches', 'hamburguer', 'hamburgueres', 'prato principal', 'pratos principais'].includes(nome)) return 'icone-hamburguer';
  if (['acompanhamento', 'acompanhamentos'].includes(nome)) return 'icone-batatas';
  if (['bebida', 'bebidas'].includes(nome)) return 'icone-refrigerante';
  return null;
}

function receitaSemana(dados) {
  const nomes = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
  const grupos = nomes.map(nome => ({ nome, centavos: 0, dias: new Set() }));
  for (const r of dados) {
    // Usa a data validada, sem depender da coluna textual dia_semana.
    const dia = (new Date(`${r.data}T00:00:00Z`).getUTCDay() + 6) % 7;
    grupos[dia].centavos += r.centavos;
    grupos[dia].dias.add(r.data);
  }
  return grupos.map(g => [g.nome, g.dias.size ? g.centavos / 100 / g.dias.size : null, g.dias.size]);
}

function mediaPorCanal(dados, campo, minimo, maximo = Infinity) {
  const grupos = new Map();
  let ausentes = 0, invalidos = 0;
  for (const r of dados) {
    const texto = String(r[campo] ?? '').trim();
    if (!texto) { ausentes++; continue; }
    const valor = lerNumero(texto);
    if (!Number.isFinite(valor) || valor < minimo || valor > maximo) { invalidos++; continue; }
    const canal = r.canal || 'Não informado';
    if (!grupos.has(canal)) grupos.set(canal, { soma: 0, n: 0 });
    grupos.get(canal).soma += valor; grupos.get(canal).n++;
  }
  return { grupos: [...grupos].sort((a,b) => a[0].localeCompare(b[0], 'pt-BR')).map(([canal,g]) => [canal, g.soma / g.n, g.n]), ausentes, invalidos };
}

function prepararExportacao(dados, campos, usaCanal) {
  return dados.map(r => Object.fromEntries(campos.map(c => [c, c === 'regiao' && usaCanal ? r.canal : r[c] ?? ''])));
}

function iniciarDashboard() {
  const el = id => document.getElementById(id);
  let dados = [], filtrados = [], campos = COLUNAS, usaCanal = false, pagina = 1, graficos = {};
  let versaoImportacao = 0;
  const porPagina = 20;
  const controles = ['inicio', 'fim', 'categoria', 'regiao', 'pesquisa'];

  function preencherOpcoes(id) {
    el(id).replaceChildren(new Option(id === 'categoria' ? 'Todas as categorias' : usaCanal ? 'Todos os canais' : 'Todas as regiões', ''));
    [...new Set(dados.map(r => r[id]))].sort((a,b) => a.localeCompare(b, 'pt-BR')).forEach(v => el(id).add(new Option(v, v)));
  }

  function limpar() {
    controles.forEach(id => el(id).value = '');
    el('ordem').value = 'data-desc';
    pagina = 1;
    atualizar();
  }

  function carregar(resultado, nome, demonstracao) {
    dados = resultado.validas; campos = resultado.campos; usaCanal = resultado.usaCanal;
    el('origem').textContent = demonstracao ? 'Dados demonstrativos · 200 vendas fictícias · janeiro a dezembro de 2025' : `${nome} · Base importada localmente · ${numero.format(dados.length)} registros válidos`;
    const mensagens = [`${resultado.descartadas} registros descartados.`];
    if (resultado.descartadas) mensagens.push(Object.entries(resultado.motivos).map(([m,n]) => `${n}: ${m}`).join('; ') + '. Um registro pode ter mais de um erro.');
    if (usaCanal) mensagens.push('Esta base não tem região: a comparação e o filtro usam a coluna canal.');
    if (resultado.semDimensao) mensagens.push('Não há região ou canal: os registros ficam em “Não informado”.');
    if (dados.some(r => [r.produto,r.categoria,r.regiao].includes('Não informado'))) mensagens.push('Textos ausentes foram agrupados em “Não informado”.');
    const repetidos = dados.length - new Set(dados.map(r => r.id_venda)).size;
    if (repetidos) mensagens.push(`${repetidos} linhas com IDs repetidos preservadas; vendas contam IDs únicos.`);
    if (!window.Chart) mensagens.push('Gráficos indisponíveis. Conecte-se à internet e recarregue para carregar Chart.js.');
    if (!window.Papa) mensagens.push('Importação e exportação indisponíveis. Conecte-se à internet e recarregue para carregar Papa Parse.');
    el('aviso').textContent = mensagens.join(' ');
    el('rotulo-regiao').textContent = usaCanal ? 'Canal de venda' : 'Região';
    el('titulo-regiao').textContent = usaCanal ? 'Receita por canal' : 'Receita por região';
    el('coluna-regiao').textContent = usaCanal ? 'Canal' : 'Região';
    preencherOpcoes('categoria'); preencherOpcoes('regiao'); limpar();
  }

  function desenharGrafico(id, grupos, linha, cor, opcoes = {}) {
    if (!window.Chart) return;
    const rotulos = grupos.map(([chave]) => linha ? (opcoes.diario ? chave.split('-').reverse().join('/') : `${chave.slice(5)}/${chave.slice(0,4)}`) : chave);
    const valores = grupos.map(([,valor]) => valor);
    const titulo = opcoes.titulo || 'Faturamento (R$)';
    const formatar = opcoes.unidade ? v => `${numero.format(v)} ${opcoes.unidade}` : v => moeda.format(v);
    // Formato escolhido pelo significado dos dados, sem mudar nenhuma agregação.
    // Bases com muitas categorias voltam a barras para preservar a legibilidade.
    const rosca = ['categorias', 'pagamentos'].includes(id) && grupos.length <= 8;
    const vertical = ['semana', 'turnos'].includes(id);
    const circular = rosca;
    const tipo = rosca ? 'doughnut' : linha ? 'line' : 'bar';
    const eixo = linha || vertical ? 'x' : 'y';
    const total = valores.reduce((s,v) => s + (v || 0), 0);
    const paleta = ['#ab7aef', '#c092f4', '#d0a7ff', '#c59bfa'];
    const cores = rotulos.map((rotulo,i) => paleta[i % paleta.length]);
    // O degradê acompanha o tamanho real do canvas, inclusive após redimensionar a tela.
    const preenchimento = contexto => {
      const { ctx, chartArea } = contexto.chart;
      if (!chartArea) return linha ? '#ab7aef22' : cor;
      const degrade = linha ? ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom) : ctx.createLinearGradient(chartArea.left, 0, chartArea.right, 0);
      degrade.addColorStop(0, linha ? '#ab7aef55' : '#d0a7ff');
      degrade.addColorStop(1, linha ? '#ab7aef03' : cor);
      return degrade;
    };
    const movimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const painelPlugin = {
      id: 'anotacoesPainel',
      afterDraw(grafico) {
        const { ctx, chartArea } = grafico;
        if (!chartArea) return;
        // Sem metas inventadas: o centro da rosca mostra apenas a soma filtrada.
        if (rosca) {
          const arco = grafico.getDatasetMeta(0).data[0];
          const x = arco ? arco.x : (chartArea.left + chartArea.right) / 2;
          const y = arco ? arco.y : (chartArea.top + chartArea.bottom) / 2;
          const subtotal = grafico.data.datasets[0].data.reduce((s,v) => s + (v || 0), 0);
          ctx.save(); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillStyle = '#b6a9c5'; ctx.font = '11px Segoe UI, Arial';
          ctx.fillText('Total filtrado', x, y - 12);
          const texto = moeda.format(subtotal);
          let tamanho = 18;
          const largura = arco ? Math.max(80, arco.innerRadius * 1.7) : 150;
          do { ctx.font = `700 ${tamanho--}px Segoe UI, Arial`; } while (ctx.measureText(texto).width > largura && tamanho > 10);
          ctx.fillStyle = '#fff'; ctx.fillText(texto, x, y + 12);
          if (!subtotal) { ctx.strokeStyle = '#c5a0ed16'; ctx.lineWidth = 14; ctx.beginPath(); ctx.arc(x,y,Math.min(chartArea.width,chartArea.height)*.35,0,Math.PI*2); ctx.stroke(); }
          ctx.restore();
        }
        if (id === 'espera') {
          // Marcadores na ponta das barras finas: a posição segue a média original.
          ctx.save();
          for (const barra of grafico.getDatasetMeta(0).data) {
            ctx.fillStyle = '#c092f4'; ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.arc(barra.x,barra.y,5,0,Math.PI*2); ctx.fill(); ctx.stroke();
          }
          ctx.restore();
        }
      }
    };
    const dataset = { label: titulo, data: valores, borderColor: circular ? '#271735' : cor,
      backgroundColor: circular ? cores : preenchimento, hoverBackgroundColor: linha ? '#ab7aef33' : '#c59bfa',
      fill: linha, tension: linha ? .35 : 0, cubicInterpolationMode: 'monotone',
      borderWidth: circular ? 2 : linha ? 3 : 0, borderRadius: rosca ? 6 : 12, borderSkipped: false,
      spacing: rosca ? 4 : 0, hoverOffset: rosca ? 9 : 0,
      pointBackgroundColor: '#fff', pointBorderColor: cor, pointBorderWidth: 2,
      pointRadius: opcoes.diario ? 0 : 4, pointHoverRadius: 8, pointHoverBackgroundColor: cor,
      pointHoverBorderColor: '#fff', pointHoverBorderWidth: 3, pointHitRadius: 12,
      maxBarThickness: id === 'espera' ? 5 : vertical ? 44 : 22 };
    const configuracao = {
      type: tipo,
      data: { labels: rotulos, datasets: [dataset] },
      plugins: [painelPlugin],
      options: { responsive: true, maintainAspectRatio: false, indexAxis: eixo,
        layout: { padding: { top: 12, right: 12, bottom: 4, left: 4 } },
        cutout: rosca ? '76%' : undefined,
        rotation: id === 'pagamentos' ? -90 : 0,
        circumference: id === 'pagamentos' ? 180 : 360,
        interaction: { mode: circular ? 'nearest' : 'index', intersect: circular },
        animation: { duration: movimentoReduzido ? 0 : 1000, easing: 'easeOutQuart',
          delay: contexto => window.matchMedia('(prefers-reduced-motion: reduce)').matches || contexto.type !== 'data' ? 0 : Math.min(contexto.dataIndex * (linha ? 12 : 65), 450) },
        plugins: { legend: { display: true, position: 'bottom',
          // Mantém todas as fatias visíveis para coincidir com cartões, tabela e filtros.
          ...(circular ? { onClick: () => {} } : {}),
          labels: { color: '#b6a9c5', padding: circular ? 12 : 20, font: { size: 11, family: 'Segoe UI, Arial, sans-serif' }, usePointStyle: true, boxWidth: 8,
            ...(circular ? { generateLabels: grafico => grafico.data.labels.map((rotulo,i) => ({
              text: `${rotulo} · ${formatar(grafico.data.datasets[0].data[i])}`,
              fillStyle: grafico.data.datasets[0].backgroundColor[i], strokeStyle: '#271735', fontColor: '#b6a9c5', lineWidth: 1, pointStyle: 'circle', index: i
            })) } : {}) } },
          tooltip: { backgroundColor: '#271735', borderColor: '#ba8cf4', borderWidth: 1, padding: 14, cornerRadius: 8, titleFont: { size: 13, weight: 'bold' }, bodyFont: { size: 13 }, displayColors: false,
            callbacks: { label: c => {
              const valor = circular ? c.raw : linha || vertical ? c.parsed.y : c.parsed.x;
              const linhas = [formatar(valor)];
              if (rosca) linhas.push(`${numero.format(total ? valor / total * 100 : 0)}% do faturamento filtrado`);
              if (grupos[c.dataIndex]?.[2]) linhas.push(`${numero.format(grupos[c.dataIndex][2])} ${id === 'avaliacoes' ? 'respostas válidas' : id === 'espera' ? 'registros válidos' : 'dias com registros'}`);
              return linhas;
            } } } },
        scales: rosca ? {} : { [eixo === 'x' ? 'y' : 'x']: { beginAtZero: true, max: opcoes.maximo, border: { display: false }, title: { display: true, text: titulo, color: '#b6a9c5', font: { size: 11 } }, ticks: { color: '#b6a9c5', font: { size: 11 }, callback: v => numero.format(v) }, grid: { color: '#c5a0ed16' } },
          [eixo]: { border: { display: false }, grid: { display: false }, ticks: { color: '#c2aed5', font: { size: 11 }, autoSkip: linha, maxTicksLimit: opcoes.diario ? 8 : undefined, maxRotation: opcoes.diario ? 30 : 50 } } } }
    };
    if (graficos[id] && graficos[id].config.type !== tipo) { graficos[id].destroy(); delete graficos[id]; }
    if (graficos[id]) {
      graficos[id].data = configuracao.data;
      graficos[id].options = configuracao.options;
      graficos[id].config.plugins = configuracao.plugins;
      graficos[id].update();
    } else { graficos[id] = new Chart(el(id), configuracao); }
  }

  function atualizarAneis() {
    el('radial-dimensao').textContent = usaCanal ? 'Canal líder' : 'Região líder';
    for (const campo of ['produto', 'categoria', 'regiao', 'periodo']) {
      const semCampo = campo === 'periodo' ? !campos.includes('periodo') : campo === 'regiao' ? !campos.includes(usaCanal ? 'canal' : 'regiao') : false;
      const indicador = semCampo ? null : participacaoLider(filtrados, campo);
      const anel = el(`anel-${campo}`), circulo = anel.querySelector('.ring-progress');
      const anterior = circulo.style.strokeDasharray || '0 100';
      const percentual = indicador ? `${numero.format(indicador.percentual)}%` : '—';
      const detalhe = indicador ? `${moeda.format(indicador.receita)} de ${moeda.format(indicador.total)}` : semCampo ? `Coluna ${campo === 'regiao' ? 'regiao/canal' : campo} indisponível nesta base.` : !filtrados.length ? 'Nenhum registro corresponde aos filtros.' : 'Faturamento zero: proporção não calculável.';
      const nome = indicador ? indicador.nome : 'Não disponível';
      el(`percentual-${campo}`).textContent = percentual;
      el(`lider-${campo}`).textContent = nome;
      el(`detalhe-${campo}`).textContent = detalhe;
      anel.setAttribute('aria-label', `${nome}: ${percentual}. ${detalhe}`);
      anel.title = `${nome}: ${percentual} da receita filtrada. ${detalhe}`;
      anel.closest('.radial-card').classList.toggle('is-unavailable', !indicador);
      const destino = `${indicador ? indicador.percentual : 0} 100`;
      circulo.getAnimations().forEach(a => a.cancel());
      circulo.style.strokeDasharray = destino;
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) circulo.animate([{ strokeDasharray: anterior }, { strokeDasharray: destino }], { duration: 950, easing: 'cubic-bezier(.22,1,.36,1)' });
    }
  }

  function graficosAdicionais() {
    const receitas = agruparReceita(filtrados, 'produto');
    const unidades = agruparUnidades(filtrados);
    const diario = agruparReceita(filtrados, 'data').sort((a,b) => a[0].localeCompare(b[0]));
    desenharGrafico('diario', diario, true, '#ab7aef', { diario: true });
    desenharGrafico('produtos', receitas.slice(0,10), false, '#ab7aef');
    desenharGrafico('unidades-produto', unidades.slice(0,10), false, '#c092f4', { titulo: 'Unidades vendidas', unidade: 'unidades' });
    el('diario-nota').textContent = `${diario.length} datas com registros no recorte. Datas sem registros não são preenchidas com zero.`;
    el('produtos-nota').textContent = receitas.length ? `Exibindo ${Math.min(10, receitas.length)} de ${receitas.length} produtos, ordenados por receita.` : 'Nenhum registro corresponde aos filtros.';
    el('unidades-produto-nota').textContent = unidades.length ? `Exibindo ${Math.min(10, unidades.length)} de ${unidades.length} produtos, ordenados por unidades.` : 'Nenhum registro corresponde aos filtros.';
    const semana = receitaSemana(filtrados);
    desenharGrafico('semana', semana, false, '#ab7aef', { titulo: 'Receita média (R$/dia com registro)' });
    el('semana-nota').textContent = filtrados.length ? semana.filter(([,v]) => v !== null).map(([nome,,n]) => `${nome}: ${n} dias`).join(' · ') + '. Dias sem registros no recorte não entram na média.' : 'Nenhum registro corresponde aos filtros.';

    function disponibilidade(id, necessarias) {
      const faltantes = necessarias.filter(c => !campos.includes(c));
      el(id).parentElement.hidden = !!faltantes.length || !window.Chart;
      if (faltantes.length) el(`${id}-nota`).textContent = `Não disponível nesta base: faltam ${faltantes.join(', ')}. Use a base da hamburgueria ou importe um CSV com essas colunas.`;
      return !faltantes.length;
    }
    for (const [id,campo] of [['turnos','periodo'], ['pagamentos','forma_pagamento']]) {
      if (!disponibilidade(id, [campo])) continue;
      const grupos = agruparReceita(filtrados.map(r => ({...r, [campo]: r[campo] || 'Não informado'})), campo);
      desenharGrafico(id, grupos, false, id === 'turnos' ? '#ab7aef' : '#c092f4');
      el(`${id}-nota`).textContent = filtrados.length ? 'Campos vazios são agrupados em “Não informado”.' : 'Nenhum registro corresponde aos filtros.';
    }
    for (const [id,campo,minimo,maximo,unidade,titulo] of [
      ['espera','tempo_espera_min',0,Infinity,'min','Tempo médio (min)'],
      ['avaliacoes','avaliacao',1,5,'pontos','Avaliação média (1 a 5)']
    ]) {
      if (!disponibilidade(id, ['canal',campo])) continue;
      const resumo = mediaPorCanal(filtrados, campo, minimo, maximo);
      desenharGrafico(id, resumo.grupos, false, '#c092f4', { titulo, unidade, maximo: id === 'avaliacoes' ? 5 : undefined });
      const amostras = resumo.grupos.map(([canal,,n]) => `${canal}: ${n} ${id === 'espera' ? 'registros' : 'respostas'}`).join(' · ');
      el(`${id}-nota`).textContent = `${amostras || 'Nenhum valor válido no recorte'}. ${resumo.ausentes} ausentes e ${resumo.invalidos} inválidos excluídos somente desta média. ${id === 'avaliacoes' ? 'Notas aceitas de 1 a 5; confirme a escala na origem.' : 'Zero é válido; tempos negativos são inválidos.'}`;
    }
    if (!window.Chart) for (const id of ['diario','produtos','unidades-produto','semana','turnos','pagamentos','espera','avaliacoes']) el(`${id}-nota`).textContent = 'Gráfico indisponível: conecte-se à internet e recarregue para carregar Chart.js.';
  }

  function desenharTabela() {
    const ordenados = ordenarDados(filtrados, el('ordem').value);
    const paginas = Math.max(1, Math.ceil(ordenados.length / porPagina));
    pagina = Math.min(pagina, paginas);
    el('linhas').replaceChildren();
    for (const r of ordenados.slice((pagina - 1) * porPagina, pagina * porPagina)) {
      const tr = document.createElement('tr');
      const valores = [r.id_venda, r.data.split('-').reverse().join('/'), r.produto, r.categoria, r.regiao, numero.format(r.quantidade), moeda.format(r.preco_unitario), moeda.format(r.faturamento)];
      valores.forEach((v,i) => {
        const td = document.createElement('td');
        if (i === 2) {
          const produto = document.createElement('span'); produto.className = 'product-cell';
          const simbolo = iconeProduto(r.categoria);
          if (simbolo) {
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('class', 'food-icon'); svg.setAttribute('viewBox', '0 0 40 40'); svg.setAttribute('aria-hidden', 'true'); svg.setAttribute('focusable', 'false');
            const uso = document.createElementNS('http://www.w3.org/2000/svg', 'use'); uso.setAttribute('href', `#${simbolo}`); svg.append(uso); produto.append(svg);
          } else {
            const espaco = document.createElement('span'); espaco.className = 'food-icon-space'; espaco.setAttribute('aria-hidden', 'true'); produto.append(espaco);
          }
          const nome = document.createElement('span'); nome.textContent = v; produto.append(nome); td.append(produto);
        } else { td.textContent = v; }
        if (i >= 5) td.className = 'number'; tr.append(td);
      });
      el('linhas').append(tr);
    }
    if (!ordenados.length) { const tr = document.createElement('tr'), td = document.createElement('td'); td.colSpan = 8; td.textContent = 'Nenhum registro encontrado.'; tr.append(td); el('linhas').append(tr); }
    el('pagina-info').textContent = `Página ${pagina} de ${paginas} · ${numero.format(ordenados.length)} registros`;
    el('anterior').disabled = pagina <= 1; el('proxima').disabled = pagina >= paginas;
  }

  function atualizar() {
    const filtros = Object.fromEntries(controles.map(id => [id, el(id).value]));
    const periodoInvalido = filtros.inicio && filtros.fim && filtros.inicio > filtros.fim;
    el('inicio').setCustomValidity(periodoInvalido ? 'A data inicial deve ser anterior ou igual à final.' : '');
    filtrados = filtrarDados(dados, filtros);
    const kpi = calcularIndicadores(filtrados);
    el('faturamento').textContent = moeda.format(kpi.faturamento); el('vendas').textContent = numero.format(kpi.vendas);
    el('unidades').textContent = numero.format(kpi.unidades); el('ticket').textContent = moeda.format(kpi.ticket);
    el('contagem').textContent = `${numero.format(filtrados.length)} de ${numero.format(dados.length)} registros exibidos`;
    el('vazio').hidden = filtrados.length > 0;
    el('vazio').textContent = periodoInvalido ? 'Período inválido: a data inicial deve ser anterior ou igual à final.' : 'Nenhum registro corresponde aos filtros. Ajuste o período, a categoria, a região ou a pesquisa.';
    el('exportar').disabled = !filtrados.length || !window.Papa;
    atualizarAneis();
    desenharGrafico('mensal', agruparReceita(filtrados, 'mes'), true, '#ab7aef');
    desenharGrafico('categorias', agruparReceita(filtrados, 'categoria'), false, '#ab7aef');
    desenharGrafico('regioes', agruparReceita(filtrados, 'regiao'), false, '#c092f4');
    graficosAdicionais();
    desenharTabela();
  }

  controles.forEach(id => el(id).addEventListener(id === 'pesquisa' ? 'input' : 'change', () => { pagina = 1; atualizar(); }));
  el('ordem').addEventListener('change', () => { pagina = 1; desenharTabela(); });
  el('limpar').addEventListener('click', limpar);
  el('anterior').addEventListener('click', () => { pagina--; desenharTabela(); });
  el('proxima').addEventListener('click', () => { pagina++; desenharTabela(); });
  function demonstrar() { versaoImportacao++; el('arquivo').value = ''; carregar(validarDados(criarDemonstracao(), COLUNAS), '', true); }
  el('demonstracao').addEventListener('click', demonstrar);
  el('hamburgueria').addEventListener('click', () => {
    if (!window.Papa) { el('aviso').textContent = 'Conecte-se à internet e recarregue para carregar Papa Parse e abrir a base da hamburgueria.'; return; }
    try {
      const resultado = Papa.parse(CSV_HAMBURGUERIA, { header: true, skipEmptyLines: 'greedy' });
      if (resultado.errors.length) throw new Error('Não foi possível ler a cópia da base da hamburgueria.');
      const validacao = validarDados(resultado.data, resultado.meta.fields);
      versaoImportacao++; el('arquivo').value = '';
      carregar(validacao, 'vendas_hamburgueria.csv · Cópia incorporada da base fornecida', false);
      el('aviso').textContent += ' A origem real ou fictícia desta base não foi confirmada. Faturamento não representa lucro.';
    } catch (erro) { el('aviso').textContent = `${erro.message} A base anterior foi mantida.`; }
  });
  el('arquivo').addEventListener('change', () => {
    const arquivo = el('arquivo').files[0];
    if (!arquivo) return;
    if (!window.Papa) { el('aviso').textContent = 'Para importar CSV, conecte-se à internet e recarregue a página para carregar Papa Parse.'; el('arquivo').value = ''; return; }
    const versao = ++versaoImportacao;
    el('aviso').textContent = 'Lendo e validando o CSV…';
    Papa.parse(arquivo, { header: true, skipEmptyLines: 'greedy', transformHeader: h => h.replace(/^\uFEFF/, '').trim().toLowerCase(),
      complete: resultado => {
        if (versao !== versaoImportacao) return;
        try {
          if (resultado.errors.length) throw new Error(`CSV malformado: ${resultado.errors.length} erros de leitura. Confira o separador e o número de campos. ${resultado.errors[0].message}`);
          const camposCsv = resultado.meta.fields || [];
          if (new Set(camposCsv).size !== camposCsv.length || resultado.meta.renamedHeaders && Object.keys(resultado.meta.renamedHeaders).length) throw new Error('Há nomes de colunas repetidos no CSV.');
          carregar(validarDados(resultado.data, camposCsv), arquivo.name, false);
        } catch (erro) { el('aviso').textContent = `${erro.message} A base anterior foi mantida.`; }
        el('arquivo').value = '';
      }, error: erro => { if (versao !== versaoImportacao) return; el('aviso').textContent = `Não foi possível ler o arquivo: ${erro.message}. A base anterior foi mantida.`; el('arquivo').value = ''; }
    });
  });
  el('exportar').addEventListener('click', () => {
    if (!window.Papa || !filtrados.length) return;
    // Neutraliza fórmulas de planilha em textos importados. Preserva as colunas extras.
    const csv = Papa.unparse(prepararExportacao(ordenarDados(filtrados, el('ordem').value), campos, usaCanal), { columns: campos, escapeFormulae: true, newline: '\r\n' });
    const url = URL.createObjectURL(new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a'); link.href = url; link.download = 'vendas-filtradas.csv'; document.body.append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  demonstrar();
  // Reproduz a entrada uma vez quando o gráfico aparece ao rolar a página.
  if ('IntersectionObserver' in window) {
    const observador = new IntersectionObserver(entradas => {
      for (const entrada of entradas) {
        const grafico = graficos[entrada.target.id];
        if (!entrada.isIntersecting || !grafico) continue;
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) { grafico.reset(); grafico.update(); }
        observador.unobserve(entrada.target);
      }
    }, { threshold: 0.2 });
    document.querySelectorAll('canvas').forEach(canvas => observador.observe(canvas));
  }
}

if (typeof document !== 'undefined') document.addEventListener('DOMContentLoaded', iniciarDashboard);
if (typeof module !== 'undefined') module.exports = { COLUNAS, criarDemonstracao, dataValida, lerNumero, validarDados, filtrarDados, calcularIndicadores, agruparReceita, ordenarDados, prepararExportacao, agruparUnidades, receitaSemana, mediaPorCanal, participacaoLider, iconeProduto };


