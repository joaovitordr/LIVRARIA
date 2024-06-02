const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Caminho para o arquivo JSON
const livrosPath = path.join(__dirname, 'data', 'livros.json');

// Função para ler o arquivo JSON
const readLivros = () => {
    const data = fs.readFileSync(livrosPath);
    return JSON.parse(data);
};

// Função para escrever no arquivo JSON
const writeLivros = (livros) => {
    fs.writeFileSync(livrosPath, JSON.stringify(livros, null, 2));
};

// Listagem dos livros
app.get('/livros', (req, res) => {
    const livros = readLivros();
    res.json(livros.books);
});

// Compra de um livro
app.post('/livros/compra', (req, res) => {
    const { titulo } = req.body;
    let livros = readLivros();
    const livroIndex = livros.books.findIndex(livro => livro.titulo === titulo);

    if (livroIndex !== -1 && livros.books[livroIndex].numeroExemplares > 0) {
        livros.books[livroIndex].numeroExemplares -= 1;
        writeLivros(livros);
        res.json({ message: 'Compra realizada com sucesso' });
    } else {
        res.status(404).json({ message: 'Livro não encontrado ou sem exemplares disponíveis' });
    }
});

// Cadastro de novos livros
app.post('/livros', (req, res) => {
    const novoLivro = req.body;
    let livros = readLivros();
    livros.books.push(novoLivro);
    writeLivros(livros);
    res.json({ message: 'Livro cadastrado com sucesso' });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});