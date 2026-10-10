// Análise descritiva do arquivo original, sem alterar os dados.
// Uso: node analisar-vendas.cjs caminho/para/papaparse.cjs
const fs = require('node:fs');
const path = require('node:path');
const Papa = require(path.resolve(process.argv[2]));
const funcoes = require('./public/script.js');
const csv = Papa.parse(fs.readFileSync('vendas_hamburgueria.csv', 'utf8'), {header:true,skipEmptyLines:'greedy'});
if (csv.errors.length) throw Error(JSON.stringify(csv.errors));
const validacao = funcoes.validarDados(csv.data,csv.meta.fields);
const dados = validacao.validas;
function resumo(linhas) {
  const kpi = funcoes.calcularIndicadores(linhas);
  const esperas = linhas.map(r=>r.tempo_espera_min.trim() ? Number(r.tempo_espera_min) : NaN).filter(Number.isFinite);
  const notas = linhas.map(r=>r.avaliacao.trim() ? Number(r.avaliacao) : NaN).filter(n=>Number.isFinite(n)&&n>=1&&n<=5);
  return {...kpi, registros:linhas.length, dias:new Set(linhas.map(r=>r.data)).size,
    esperaMedia:esperas.reduce((s,n)=>s+n,0)/esperas.length, esperasValidas:esperas.length,
    avaliacaoMedia:notas.reduce((s,n)=>s+n,0)/notas.length, avaliacoes:notas.length,
    notasBaixas:notas.filter(n=>n<=2).length,
    receitaPorDia:kpi.faturamento/new Set(linhas.map(r=>r.data)).size};
}
function grupos(campo) {
  const mapa = new Map();
  dados.forEach(r=>{const k=campo==='mes'?r.data.slice(0,7):r[campo];if(!mapa.has(k))mapa.set(k,[]);mapa.get(k).push(r);});
  return [...mapa].map(([grupo,linhas])=>({grupo,...resumo(linhas)})).sort((a,b)=>campo==='mes'?a.grupo.localeCompare(b.grupo):b.faturamento-a.faturamento);
}
const dias = grupos('data');
const ocorrenciasSemana = {};
for (const data of new Set(dados.map(r=>r.data))) {
  const dia = new Date(data+'T00:00:00Z').getUTCDay();
  ocorrenciasSemana[dia]=(ocorrenciasSemana[dia]||0)+1;
}
const nomesSemana = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
const inconsistenciasSemana = dados.filter(r=>r.dia_semana!==nomesSemana[new Date(r.data+'T00:00:00Z').getUTCDay()]).length;
const cruzamentos = {};
for(const mes of [...new Set(dados.map(r=>r.data.slice(0,7)))].sort()) {
  cruzamentos[mes] = {};
  for(const canal of [...new Set(dados.map(r=>r.canal))]) cruzamentos[mes][canal]=resumo(dados.filter(r=>r.data.startsWith(mes)&&r.canal===canal));
}
const saida = {fonte:'vendas_hamburgueria.csv',colunas:csv.meta.fields,descartadas:validacao.descartadas,motivos:validacao.motivos,
  total:resumo(dados),meses:grupos('mes'),produtos:grupos('produto'),categorias:grupos('categoria'),canais:grupos('canal'),
  periodos:grupos('periodo'),semana:grupos('dia_semana'),pagamento:grupos('forma_pagamento'),
  maioresDias:dias.slice(0,5),menoresDias:dias.slice(-5),ocorrenciasSemana,inconsistenciasSemana,cruzamentos,
  idsUnicos:new Set(dados.map(r=>r.id_venda)).size,duplicatasExatas:csv.data.length-new Set(csv.data.map(r=>JSON.stringify(r))).size,
  precos:Object.fromEntries([...new Set(dados.map(r=>r.produto))].map(p=>[p,[...new Set(dados.filter(r=>r.produto===p).map(r=>r.preco_unitario))].sort((a,b)=>a-b)]))};
fs.writeFileSync('analise-vendas.json', JSON.stringify(saida,null,2)+'\n');
console.log(JSON.stringify(saida,null,2));
