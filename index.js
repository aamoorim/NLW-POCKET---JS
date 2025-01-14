const { select, input, checkbox} = require('@inquirer/prompts')
const fs = require("fs").promises

let mensagem = "Bem vindo ao App de Metas";

let metas 

 const carregarMetas = async () => {
    try {
        const dados = await fs.readFile("metas.json", "utf-8")
        metas = JSON.parse(dados)
    }
    catch(erro){ 
        metas = []
    }
 }

const salvarMetas = async () => {
    await fs.writeFile("metas.json", JSON.stringify(metas, null, 2))
}

const cadastrarMeta = async () => {
    const meta = await input({message: "Digite a meta:"})

    if(meta.length == 0){
        mensagem = 'A meta não pode ser vazia.'
        return
    }

    metas.push(
        { value: meta, checked: false}
    )

    mensagem = "Meta cadastrada com sucesso!"
}

const listarMetas = async () => {
    if(metas.length == 0){
        mensagem = "Não existem metas para listagem!"
        return
    }
    const respostas = await checkbox({
        message:"Use as setas para mudar de meta, o espaço para marcar ou desmacar e o Enter para finalizar essa etapa",
        choices: [...metas],
        instructions: false,
    })
    
    metas.forEach((m) => {
        m.checked = false
    })
    
    if(respostas.length == 0) {
        mensagem = "Nenhuma meta selecionada!"
        return
    }

    respostas.forEach((resposta) => {
        const meta = metas.find((m) => {
            return m.value == resposta 
       })

         meta.checked = true
    })

    mensagem = 'Meta(s) marcada(s) concluída(s)'
    
}

const metasRealizadas = async () => {
    if(metas.length == 0) {
        mensagem = "Não existem metas!"
        return
    }

    const realizadas = metas.filter((meta) => {
        return meta.checked
    })

    if(realizadas.length == 0){
       mensagem = 'Não existem metas realizadas! :('
        return
    }

    await select({
        message: "Metas Realizadas: " + realizadas.length,
        choices: [...realizadas]
    })
}

const metasAbertas = async () => {
    if(metas.length == 0) {
        mensagem = "Não existem metas!"
        return
    }

    const Abertas = metas.filter((meta) => {
        return meta.checked != true
    })

    if(Abertas.length == 0){
        mensagem = "Não existem metas abertas! :)"
        return
    }
    
    await select({
        message: "Metas Abertas: " + Abertas.length,
        choices: [...Abertas]
    })
}

const deletarMetas = async () => {
    if(metas.length == 0) {
        mensagem = "Não existem metas para deletar!"
        return
    }

    const metasDesmarcadas = metas.map((meta) => {
        return {value: meta.value, checked: false}
    })

    const itensAdeletar = await checkbox({
        message:"Selecione um item para deletar",
        choices: [...metasDesmarcadas],
        instructions: false,
})

   if(itensAdeletar.length == 0){
        console.log("Nenhum item para deletar!")
        return
   }

   itensAdeletar.forEach((item) => {
        metas = metas.filter((meta) => {
            return meta.value != item
        })
   })

   console.log("Meta(s) Deletada(s) com sucesso!")
}

const mostrarMensagem = () => {
    console.clear();
    
    if(mensagem != ""){
        console.log(mensagem)
        console.log("")
        mensagem = ""
        
    }
}

const start = async () => {
    await carregarMetas()
        
    while(true){
        mostrarMensagem()
        await salvarMetas()

        const opcao = await select({
            message: "Menu >",
            choices: [
                {
                    name: "Cadastrar meta",
                    value: "Cadastrar"
                },
                
                {
                    name: "Listar meta",
                    value: "Listar"
                },

                {
                    name: "Metas Realizadas",
                    value: "Realizadas"
                },
                
                {
                    name: "Metas Abertas",
                    value: "Abertas"
                },

                {
                    name: "Deletar Metas",
                    value: "Deletar"
                },

                {
                    name: "Sair",
                    value: "Sair"
                },
            ]
        })

        switch(opcao){
            case "Cadastrar": 
                await cadastrarMeta()
                break
            case "Listar":
                await listarMetas()
                break
            case "Realizadas":
                await metasRealizadas()
                break
            case "Abertas":
                await metasAbertas()
                break
            case "Deletar":
                await deletarMetas()
                break
            case "Sair":
                console.log("Até a próxima!")
                return
            }
    }
}
start()