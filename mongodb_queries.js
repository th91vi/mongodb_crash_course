// insere 1 document na collection 'posts', da db 'acme'
db.posts.insert({
    title: 'Post one',
    body: 'Body of post one',
    category: 'News',
    likes: 4,
    tags: ['news', 'events'],
    user: {
        name: 'John Doe',
        status: 'author'
    },
    date: Date()
})

// insere varios documents na collection 'posts', da db 'acme'
db.posts.insertMany([
    {
        title: 'Post two',
        body: 'Body of post two',
        category: 'Technology',
        date: Date()
    },
    {
        title: 'Post three',
        body: 'Body of post three',
        category: 'News',
        date: Date()
    },
    {
        title: 'Post four',
        body: 'Body of post four',
        category: 'Entertainment',
        date: Date()
    },
])

// comando retorna titulos dos posts, usando laco forEach
db.posts.find().forEach((doc) => { print('Blog post title: ' + doc.title) })

// Retorna um documento que satisfaz os critérios de consulta especificados na coleção ou exibição
// Se vários documentos satisfizerem a consulta, esse método retornará o primeiro documento de acordo com a ordem natural que reflete a ordem dos documentos no disco.
db.posts.findOne({ category: 'News' })

// atualiza document na collection , reescrevendo-o inteiramente, apagando campos nao declarados na atualiazacao; falta campo 'category'
// db.collection.update(filter, update, options)
db.posts.update(
    {// filter
        title: 'Post two'
    }, 
    {//update
        title: 'Post Two',
        body: 'New post 2 body',
        date: Date()
    },
    {//options
        upsert: true // cria documento se nao existir na collection
    }
) 

// requisita document atualizado na querie anterior
db.posts.find({title:'Post Two'})

// atualiza document apenas nos campos declarados, deixando os ja existentes inalterados
db.posts.update(
    {// filter
        title: 'Post Two'
    },
    {// update
        // O operador $ set substitui o valor de um campo pelo valor especificado.
        // Se o campo não existir, $ set adicionará um novo campo com o valor especificado, desde que o novo campo não viole uma restrição de tipo. Se você especificar um caminho pontilhado para um campo inexistente, $ set criará os documentos incorporados conforme necessário para preencher o caminho pontilhado do campo.
        // Se você especificar vários pares de valor de campo, $ set atualizará ou criará cada campo.
        $set: {
            body: 'Body of post 2',
            category: 'Technology'
        }
    }
) 

// incrementa valor do campo especificado
db.posts.update(
    {// filter
        title: 'Post One'
    },
    {// update
        // O operador $ inc incrementa um campo por um valor especificado e tem o seguinte formato:
        //{ $inc: { <field1>: <amount1>, <field2>: <amount2>, ... } }
        //O operador $ inc aceita valores positivos e negativos. Se o campo não existir, $ inc cria o campo e define o campo para o valor especificado.
        //O uso do operador $ inc em um campo com um valor nulo gerará um erro.
        //$ inc é uma operação atômica dentro de um único documento.
        $inc: {
                likes:2
        }
    }
)

// renomeia nome do campo especificado
db.posts.update(
    {// filter
        title: 'Post One'
    },
    {// update
        // O operador $ rename atualiza o nome de um campo e tem o seguinte formato:
        // {$rename: { <field1>: <newName1>, <field2>: <newName2>, ... } }
        // O novo nome do campo deve ser diferente do nome do campo existente. Para especificar um <field> em um documento incorporado, use a notação de ponto.
        // O operador $ rename executa logicamente um $ unset do nome antigo e do novo nome e, em seguida, executa uma operação $ set com o novo nome. Como tal, a operação pode não preservar a ordem dos campos no documento; ou seja, o campo renomeado pode se mover dentro do documento.
        // Se o documento já tiver um campo com o <newName>, o operador $ rename remove esse campo e renomeia o <field> especificado para <newName>.
        // Se o campo a renomear não existir em um documento, $ rename não fará nada (ou seja, nenhuma operação).
        // Para campos em documentos incorporados, o operador $ rename pode renomear esses campos, bem como mover os campos para dentro e para fora dos documentos incorporados. $ rename não funcionará se esses campos estiverem em elementos de matriz.
        $rename: {
                likes: 'views'
        }
    }    
)

// remove document especificado, da collection especifica
db.posts.remove(
    {// query
        title: 'Post four'
    },
    {
        justOne: true // opcional
    }
)

// aninha comentarios como array de objetos no document/post especificado
db.posts.update(
    { // filtro
        title: 'Post One'
    },
    { //update
        $set: {
            comments: [
                {
                    user: 'May Williams',
                    body: 'Comment one',
                    date: Date()
                },
                {
                    user: 'Otto Brown',
                    body: 'Comment two',
                    date: Date()
                },
                {
                    user: 'John Doe',
                    body: 'Comment three',
                    date: Date()
                }
            ]
        }
    }
)

// faz busca usando como filtro o operador $elemMatch
db.posts.find(
    {
        comments: { // retorna TODO o document, nao apenas o comentario
            // O operador $ elemMatch corresponde a documentos que contêm um campo de matriz com pelo menos um elemento que corresponde a todos os critérios de consulta especificados.
            // { <field>: { $elemMatch: { <query1>, <query2>, ... } } }
            $elemMatch: {
                user: 'May Williams'
            }
        }
    }
)

// cria indice na collection, para buscar documents pelo campo title
// db.collection.createIndex(keys, options)
db.posts.createIndex(
    {
        title: 'text'
    }
)

// faz busca usando indice $text
db.posts.find({
    $text: { // filtro
        $search: "\"Post O\""
        // acima, string passada como parametro de busca (eh uma letra "o", nao um zero); retorna Post One
    }
})

// faz busca usando indice $text
db.posts.find({
    $text: { // filtro
        $search: "\"Post T\""
        // acima, string passada como parametro de busca; retorna Post Two, Post Three; sem ordem definida
    }
}).pretty()

// atualiza document e adiciona numero de views
db.posts.update(
    {
        title: 'Post Two'
    },
    {
    $set: {
        views: 10
    }
})

// retorna document com views maior que 6
db.posts.find(
    {
        views: {
            $gt:6 // retorna Post Two
        }
    }
)

// retorna document com views maior ou igual a 6
db.posts.find(
    {
        views: {
            $gte:6 // retorna Post Two, Post One
        }
    }
)