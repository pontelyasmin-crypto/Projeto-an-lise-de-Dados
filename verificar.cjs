// Verificação sem instalação: node verificar.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const d = require('./public/script.js');
const linha = (id, data, categoria, regiao, quantidade, preco) => ({ id_venda: id, data, produto: 'Produto teste', categoria, regiao, quantidade, preco_unitario: preco });
const amostra = [linha('A','2025-01-01','Lanches','Sul',2,10),linha('A','2025-01-02','Bebidas','Sul',1,5),linha('B','2025-03-01','Lanches','Norte',3,7.5)];
const validas = d.validarDados(amostra,d.COLUNAS).validas;
assert.deepEqual(d.calcularIndicadores(validas),{faturamento:47.5,vendas:2,unidades:6,ticket:23.75});
assert.deepEqual(d.agruparReceita(validas,'mes'),[['2025-01',25],['2025-02',0],['2025-03',22.5]]);
const filtros = {inicio:'2025-01-01',fim:'2025-01-31',categoria:'Lanches',regiao:'Sul',pesquisa:'teste'};
assert.equal(d.filtrarDados(validas,filtros).length,1);
assert.equal(d.calcularIndicadores(d.filtrarDados(validas,filtros)).faturamento,20);
assert.deepEqual(d.calcularIndicadores(d.filtrarDados(validas,{inicio:'2027-01-01'})),{faturamento:0,vendas:0,unidades:0,ticket:0});
assert.equal(d.filtrarDados(validas,{}).length,3);
const erros = d.validarDados([linha('','2025-01-01','X','Sul',1,5),linha('C','2025-02-30','X','Sul',1,5),linha('D','2025-01-01','X','Sul','',5),linha('E','2025-01-01','X','Sul',1,'abc'),linha('F','2025-01-01','','',0,0)],d.COLUNAS);
assert.equal(erros.descartadas,4);assert.equal(erros.validas[0].centavos,0);assert.equal(erros.validas[0].categoria,'Não informado');
assert.throws(()=>d.validarDados([],['data']),/Colunas obrigatórias/);
assert.equal(d.lerNumero('7,50'),7.5);assert.ok(Number.isNaN(d.lerNumero('')));
assert.equal(d.ordenarDados(validas,'faturamento-desc')[0].id_venda,'B');
assert.deepEqual(d.agruparUnidades(validas),[['Produto teste',6]]);
const semana = d.receitaSemana(validas);
assert.deepEqual(d.participacaoLider(validas,'produto'),{nome:'Produto teste',receita:47.5,total:47.5,percentual:100});
assert.ok(Math.abs(d.participacaoLider(validas,'categoria').percentual-42.5/47.5*100)<0.000001);
assert.equal(d.participacaoLider([],'categoria'),null);
assert.equal(d.participacaoLider([{...validas[0],centavos:0}],'produto'),null);
assert.equal(semana.find(([dia])=>dia==='Quarta')[1],20);
assert.equal(semana.find(([dia])=>dia==='Quinta')[1],5);
assert.equal(semana.find(([dia])=>dia==='Sábado')[1],22.5);
assert.equal(semana.find(([dia])=>dia==='Domingo')[1],null);
const tempos = d.mediaPorCanal([{canal:'Delivery',tempo:'0'},{canal:'Delivery',tempo:'20'},{canal:'Balcão',tempo:''},{canal:'Delivery',tempo:'-1'},{canal:'Balcão',tempo:'abc'}],'tempo',0);
assert.deepEqual(tempos,{grupos:[['Delivery',10,2]],ausentes:1,invalidos:2});
assert.deepEqual(d.mediaPorCanal([{canal:'Balcão',nota:5},{canal:'Balcão',nota:1},{canal:'Balcão',nota:0},{canal:'Balcão',nota:6}],'nota',1,5),{grupos:[['Balcão',3,2]],ausentes:0,invalidos:2});
const incorporado = fs.readFileSync('public/dados-hamburgueria.js','utf8');
const copia = JSON.parse(incorporado.slice(incorporado.indexOf('=')+1).trim().replace(/;$/,''));
assert.equal(copia,fs.readFileSync('vendas_hamburgueria.csv','utf8'));
const demo = d.criarDemonstracao();
assert.equal(demo.length,200);assert.equal(new Set(demo.map(r=>r.data.slice(0,7))).size,12);
const esperado = d.COLUNAS.join(',')+'\n'+demo.map(r=>d.COLUNAS.map(c=>r[c]).join(',')).join('\n')+'\n';
assert.equal(fs.readFileSync('public/dados-exemplo.csv','utf8'),esperado);
assert.deepEqual(d.calcularIndicadores(d.validarDados(demo,d.COLUNAS).validas),{faturamento:10152.8,vendas:200,unidades:600,ticket:10152.8/200});

// Se Papa Parse estiver disponível em arquivo local, verifica o parser real e a exportação.
if (process.argv[2]) {
  const Papa = require(require('node:path').resolve(process.argv[2]));
  for (const arquivo of ['public/dados-exemplo.csv','vendas_hamburgueria.csv']) {
    const csv = Papa.parse(fs.readFileSync(arquivo,'utf8'),{header:true,skipEmptyLines:'greedy'});
    assert.equal(csv.errors.length,0);
    const resultado = d.validarDados(csv.data,csv.meta.fields);
    assert.equal(resultado.descartadas,0);
    assert.equal(resultado.validas.length,arquivo.includes('hamburgueria')?1366:200);
    assert.equal(resultado.usaCanal,arquivo.includes('hamburgueria'));
    assert.equal(d.agruparUnidades(resultado.validas).reduce((s,[,v])=>s+v,0),d.calcularIndicadores(resultado.validas).unidades);
    if(arquivo.includes('hamburgueria')) {
      const notas=d.mediaPorCanal(resultado.validas,'avaliacao',1,5);
      assert.equal(notas.ausentes,136); assert.equal(notas.invalidos,0);
      assert.equal(notas.grupos.find(([canal])=>canal==='Delivery')[2],665);
      assert.equal(d.participacaoLider(resultado.validas,'produto').nome,'X-Bacon');
      assert.ok(Math.abs(d.participacaoLider(resultado.validas,'categoria').percentual-65.643616)<0.001);
      const espera=d.mediaPorCanal(resultado.validas,'tempo_espera_min',0);
      assert.equal(espera.ausentes+espera.invalidos,0);
      assert.ok(Math.abs(espera.grupos.find(([canal])=>canal==='Delivery')[1]-40.679144385)<0.000001);
    }
    const filtrados = d.filtrarDados(resultado.validas,{categoria:resultado.validas[0].categoria});
    const exportado = Papa.unparse(d.prepararExportacao(filtrados,csv.meta.fields,resultado.usaCanal),{columns:csv.meta.fields,escapeFormulae:true});
    const reimportado = Papa.parse(exportado,{header:true,skipEmptyLines:'greedy'});
    assert.equal(reimportado.errors.length,0);
    assert.deepEqual(d.calcularIndicadores(d.validarDados(reimportado.data,reimportado.meta.fields).validas),d.calcularIndicadores(filtrados));
    console.log(arquivo, d.calcularIndicadores(resultado.validas));
  }
  assert.ok(Papa.parse('id,data\n1,a,b',{header:true}).errors.length>0);
}
console.log('OK: cálculos, validação, filtros combinados, ausência de resultados, ordenação e correspondência do CSV.');
