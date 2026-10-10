# Imagens ilustrativas para Panorama de vendas — Yasmin

Status: o pedido foi atualizado para ícones/ilustrações em estilo neon e cartões holográficos. Foram implementados três ícones SVG locais em `public/index.html`, com aparência em `public/styles.css` e associação às categorias em `public/script.js`. Eles aparecem nas linhas da tabela, em sua legenda e ampliados em três cartões glassmorphism abaixo do cabeçalho. Não foi utilizada API de geração de imagens. Os prompts raster abaixo ficam como referência opcional para uma mudança futura, não como tarefa pendente.

## Composição prevista

Três imagens compactas em uma faixa de apresentação logo após o cabeçalho e antes da identificação da base, com a legenda “Imagens ilustrativas”. A faixa terá três colunas no computador e cartões compactos no celular. As imagens não representam produtos fotografados da empresa nem dados de vendas. Não sobrepor imagens aos gráficos, filtros ou tabela. Manter proporção consistente e caminhos relativos dentro de `public/images`.

Os arquivos só devem ser referenciados no HTML depois de gerados, inspecionados e salvos no projeto. Não apresentar espaços vazios nem imagens quebradas enquanto a geração estiver pendente.

## Prompts de geração

Modo previsto: ferramenta nativa image_gen, se disponível; alternativa CLI da habilidade imagegen somente após confirmação. Um pedido separado por imagem. Estilo consistente de renderização 3D de produto, monocromático para manter a paleta roxo, preto e branco. Não introduzir amarelo, laranja, vermelho ou verde como cores dominantes dos alimentos.

### Hambúrguer — public/images/hamburguer.png

Use case: product-mockup
Asset type: imagem ilustrativa para cartão compacto em dashboard de vendas
Primary request: um hambúrguer artesanal estilizado, facilmente reconhecível, com pão, hambúrguer e camadas visíveis
Scene/backdrop: fundo preto uniforme #09090d, sem cenário ou objetos adicionais
Style/medium: renderização 3D elegante de produto, material fosco com pequenos reflexos e detalhes nítidos
Composition/framing: formato quadrado, objeto centralizado em vista de três quartos, com margem em todos os lados e sem cortes
Lighting/mood: luz suave de estúdio e iluminação lateral violeta discreta, aspecto tecnológico profissional
Color palette: exclusivamente preto, branco e tons roxos da interface: #ab7aef, #c092f4 e #d0a7ff; interpretação monocromática dos ingredientes
Constraints: somente um hambúrguer, sem marcas, logotipos, texto, preço ou números; não representar dados reais ou produto fotografado da empresa
Avoid: efeitos neon exagerados, amarelo, laranja, vermelho, verde, fundos complexos e marca-d'água

### Batata frita — public/images/batata-frita.png

Use case: product-mockup
Asset type: imagem ilustrativa para cartão compacto em dashboard de vendas
Primary request: uma porção de batata frita em embalagem simples sem marca, facilmente reconhecível
Scene/backdrop: fundo preto uniforme #09090d, sem cenário ou objetos adicionais
Style/medium: mesma renderização 3D elegante de produto, material fosco com pequenos reflexos e detalhes nítidos
Composition/framing: formato quadrado, objeto centralizado em vista de três quartos, com margem em todos os lados e sem cortes
Lighting/mood: luz suave de estúdio e iluminação lateral violeta discreta, aspecto tecnológico profissional
Color palette: exclusivamente preto, branco e tons roxos da interface: #ab7aef, #c092f4 e #d0a7ff; batatas estilizadas em branco/lilás e embalagem roxa
Constraints: somente uma porção de batatas na embalagem, sem marcas, logotipos, texto, preço ou números
Avoid: efeitos neon exagerados, amarelo, laranja, vermelho, verde, fundos complexos e marca-d'água

### Refrigerante — public/images/refrigerante.png

Use case: product-mockup
Asset type: imagem ilustrativa para cartão compacto em dashboard de vendas
Primary request: um copo de refrigerante com tampa e canudo, facilmente reconhecível, sem marca
Scene/backdrop: fundo preto uniforme #09090d, sem cenário ou objetos adicionais
Style/medium: mesma renderização 3D elegante de produto, material fosco com pequenos reflexos e detalhes nítidos
Composition/framing: formato quadrado, objeto centralizado em vista de três quartos, com margem em todos os lados e sem cortes
Lighting/mood: luz suave de estúdio e iluminação lateral violeta discreta, aspecto tecnológico profissional
Color palette: exclusivamente preto, branco e tons roxos da interface: #ab7aef, #c092f4 e #d0a7ff; copo roxo com tampa e canudo brancos
Constraints: somente um copo de refrigerante, sem marcas, logotipos, texto, preço ou números
Avoid: efeitos neon exagerados, amarelo, laranja, vermelho, verde, fundos complexos e marca-d'água
