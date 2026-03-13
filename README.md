# Geographo

## Visão geral

Geographo é uma aplicação web desenvolvida para visualização e manipulação de dados geográficos no mapa interativo. A aplicação permite importar arquivos no formato `GeoJSON` e `JSON`, visualizar seus elementos em um mapa, além de criar, editar e remover geometrias diretamente pela interface.

O objetivo do projeto é demonstrar a manipulação de dados geoespaciais em um ambiente web, utilizando padrões abertos como `GeoJSON` e bibliotecas especializadas para mapas interativos.

---

# Tecnologias utilizadas

A aplicação foi construída utilizando tecnologias web simples e amplamente utilizadas.

```
* HTML
* CSS
* JavaScript
* Leaflet (visualização de mapas) https://leafletjs.com
* Leaflet Draw (criação e edição de geometrias)
* GeoJSON (estrutura de dados geoespaciais)
* OpenStreetMap (camada base do mapa) https://www.openstreetmap.org.br/
```

A escolha dessas tecnologias foi feita por sua simplicidade de integração e pela ampla adoção em aplicações de geoprocessamento na web.

---

# Estrutura do projeto

```
geographo/
│
├── index.html
├── style.css
├── app.js
│
├── assets/
│   └── sanesul.png
│
├── data/
│   ├── data.geojson
│   └── sanesul.geojson
│
└── README.md
```

---

# Implementação dos requisitos

## Importação de dados

A aplicação permite a importação de arquivos nos formatos `.json` ou `.geojson`.
Ao selecionar um arquivo, o sistema lê seu conteúdo e cria automaticamente uma camada de dados no mapa utilizando o padrão GeoJSON.

Os elementos importados são convertidos para objetos Leaflet e adicionados à camada editável da aplicação.

---

## Mapa interativo

O mapa é renderizado utilizando a biblioteca Leaflet e utiliza tiles do OpenStreetMap como camada base.

A interface permite:

* navegação com zoom
* movimentação do mapa
* visualização de elementos geográficos
* interação direta com os elementos

Quando os dados são carregados, o mapa ajusta automaticamente o enquadramento para exibir todos os elementos presentes.

---

## Operações CRUD

A aplicação permite realizar as principais operações sobre os elementos geográficos.

### Criação

Novos elementos podem ser criados diretamente no mapa utilizando as ferramentas do Leaflet Draw.

Os tipos suportados incluem:

* pontos
* linhas
* polígonos
* retângulos
* círculos

Durante a criação é possível atribuir propriedades como nome e endereço.

---

### Leitura

Os elementos presentes no mapa podem ser visualizados e selecionados. Ao clicar em um elemento, um popup apresenta suas propriedades associadas, incluindo nome, endereço e coordenadas geográficas.

---

### Atualização

As propriedades dos elementos podem ser alteradas através de interação direta na interface. Um duplo clique sobre o elemento permite modificar seus dados. Também é possível alterar sua geometria utilizando as ferramentas de edição.

---

### Remoção

Elementos podem ser removidos utilizando a ferramenta de exclusão disponível na interface de edição do mapa.

---

## Visualização de propriedades

Cada elemento do mapa possui um popup associado. Ao interagir com o elemento, o popup exibe suas propriedades, incluindo informações como:

* nome
* endereço
* coordenadas geográficas
* raio (para círculos)

---

# Unidades da Sanesul em Campo Grande

O projeto inclui pontos representando unidades da empresa Sanesul localizadas em Campo Grande, em `data/sanesul.geojson`. Esses pontos foram adicionados ao mapa utilizando coordenadas geográficas e possuem propriedades associadas.

Ao selecionar cada ponto no mapa, são exibidas informações como:

* nome da unidade
* endereço
* latitude
* longitude

---

# Como executar o projeto

1. Clone ou faça download do repositório.

2. Abra a pasta do projeto.

3. Execute o arquivo `index.html` em um navegador.

O projeto foi desenvolvido utilizando o Live Server através do Google Chrome.

---

# Importação de dados

1. Clique no botão **Importar Dados**.
2. Selecione um arquivo `.json` ou `.geojson`.
3. Os dados serão carregados e exibidos no mapa.

Para ter acesso as unidades Sanesul como requisitado no desafio, importar o arquivo `data/sanesul.geojson`

---

# Exportação de dados

Para exportar os dados presentes no mapa:

1. Clique no botão **Exportar Dados**.
2. Um arquivo GeoJSON será gerado contendo todos os elementos atualmente presentes no mapa.

---

# Aesthetics

O sistema ultiliza uma aparencia denominada "Liquid Glass" popular entre as UIs atuais.
os CSS utilizados foram gerados através do site https://css.glass/

---

# Considerações finais

A aplicação foi desenvolvida com foco na manipulação de dados geoespaciais em ambiente web, utilizando padrões abertos e bibliotecas amplamente utilizadas no ecossistema de geoprocessamento. A organização do código prioriza clareza e separação das responsabilidades principais da aplicação a favor da empresa Sanesul.
