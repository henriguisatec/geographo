# Geographo 🗺️

O **Geographo** é uma aplicação web interativa para **visualização, criação e edição de dados geográficos** diretamente em um mapa.

A aplicação permite **desenhar elementos geográficos**, **editar informações**, **importar arquivos GeoJSON** e **exportar os dados criados**, utilizando a biblioteca **Leaflet**.

---

# 📌 Funcionalidades

* 🗺️ Visualização de mapa interativo
* ✏️ Desenho de elementos no mapa:

  * Marcadores
  * Linhas
  * Polígonos
  * Retângulos
  * Círculos
* ✏️ Edição de elementos desenhados
* 📝 Adição de informações (nome e endereço)
* 📂 Importação de arquivos **GeoJSON**
* 💾 Exportação de dados para **GeoJSON**
* 🔁 Salvamento automático no **LocalStorage**
* 📍 Exibição de **coordenadas e raio** nos popups
* ✏️ Edição rápida com **duplo clique**

---

# 🛠️ Tecnologias Utilizadas

* **HTML5**
* **CSS3**
* **JavaScript**
* **Leaflet**
* **Leaflet Draw**
* **GeoJSON**

---

# 📂 Estrutura do Projeto

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

# 🚀 Como executar o projeto

1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/geographo.git
```

2. Abra a pasta do projeto.

3. Execute o arquivo:

```
index.html
```

Você pode abrir diretamente no navegador ou usar uma extensão como **Live Server** no VS Code.

---

# 📥 Importar dados

1. Clique no botão **Importar Dados**
2. Selecione um arquivo:

```
.geojson
.json
```

Os dados serão carregados automaticamente no mapa.

---

# 📤 Exportar dados

Clique no botão **Exportar Dados** para baixar todos os elementos desenhados no mapa como um arquivo:

```
map-data.geojson
```

---

# ✏️ Como editar elementos

### Criar elementos

Use as ferramentas de desenho no canto superior esquerdo do mapa.

### Editar informações

Dê **duplo clique no elemento** para editar:

* Nome
* Endereço (apenas marcadores)

### Editar geometria

Use a ferramenta **Edit** do Leaflet Draw.

---

# 💾 Salvamento automático

Todos os elementos criados são automaticamente salvos no:

```
localStorage do navegador
```

Ao recarregar a página, os dados são restaurados automaticamente.

---

# 📄 Formato dos dados

Os dados são armazenados no padrão **GeoJSON**, contendo:

* Point (Marcadores)
* LineString (Linhas)
* Polygon (Polígonos)
* Circle (implementado via propriedades personalizadas)

Exemplo:

```json
{
  "type": "Feature",
  "properties": {
    "nome": "Local Exemplo",
    "endereco": "Rua Exemplo"
  },
  "geometry": {
    "type": "Point",
    "coordinates": [-54.6201, -20.4697]
  }
}
```

---

# 🧭 Base do mapa

O mapa utiliza tiles do:

**OpenStreetMap**

---

# 📜 Licença

Este projeto é de uso livre para fins **educacionais e experimentais**.
