var usuarioModel = require("../models/usuarioModel");
var aquarioModel = require("../models/aquarioModel");

function autenticar(req, res) {
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está indefinida!");
    } else {

        usuarioModel.autenticar(email, senha)
            .then(
                function (resultadoAutenticar) {
                    console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);
                    console.log(`Resultados: ${JSON.stringify(resultadoAutenticar)}`); // transforma JSON em String

                    if (resultadoAutenticar.length == 1) {
                        console.log(resultadoAutenticar);

                        aquarioModel.buscarAquariosPorEmpresa(resultadoAutenticar[0].empresaId)
                            .then((resultadoAquarios) => {
                                if (resultadoAquarios.length > 0) {
                                    res.json({
                                        id: resultadoAutenticar[0].id,
                                        email: resultadoAutenticar[0].email,
                                        nome: resultadoAutenticar[0].nome,
                                        senha: resultadoAutenticar[0].senha,
                                        aquarios: resultadoAquarios
                                    });
                                } else {
                                    res.status(204).json({ aquarios: [] });
                                }
                            })
                    } else if (resultadoAutenticar.length == 0) {
                        res.status(403).send("Email e/ou senha inválido(s)");
                    } else {
                        res.status(403).send("Mais de um usuário com o mesmo login e senha!");
                    }
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }

}

function cadastrarFuncionario(req, res) {
    // Obter os valores do corpo da solicitação
    const firstName = req.body.firstNameServer;
    const lastName = req.body.lastNameServer;
    const email = req.body.emailServer;
    const phoneDDD = req.body.phoneDDDServer;
    const phoneNumber = req.body.phoneNumberServer;
    const role = req.body.roleServer;
    const agency = req.body.agencyServer;
    const agencyEmpre = req.body.agencyEmpreServer;
    
    // Validar os valores
    if (!firstName || !lastName || !email || !phoneDDD || !phoneNumber || !role || !agency || !agencyEmpre) {
        return res.status(400).json({ error: "Por favor, preencha todos os campos corretamente." });
    }
    
    // Passar os valores como parâmetros para o modelo de usuário (usuarioModel)
    usuarioModel.cadastrarFuncionario(firstName, lastName, email, phoneDDD, phoneNumber, role, agency, agencyEmpre)
        .then(function (resultado) {
            console.log("Cadastro realizado com sucesso!");
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log("Houve um erro ao realizar o cadastro:", erro);
            res.status(500).json({ error: "Houve um erro ao realizar o cadastro." });
        });
}

function cadastrarAgencia(req, res) {
    // Obter os valores do corpo da solicitação
    const cep = req.body.cepServer
    const endereco = req.body.enderecoServer;
    const numero = req.body.numeroServer;
    const bairro = req.body.bairroServer;
    const cidade = req.body.cidadeServer;
    const uf = req.body.ufServer;
    const complemento = req.body.complementoServer;
    
    // Validar os valores
    if (!cep || !endereco || !bairro || !cidade || !uf ) {
        return res.status(400).json({ error: "Por favor, preencha todos os campos corretamente." });
    } else if (complemento == "undefined"){
        complemento = null
    }
    
    // Passar os valores como parâmetros para o modelo de usuário (usuarioModel)
    usuarioModel.cadastrarAgencia(cep, endereco, bairro, cidade, uf, complemento)
        .then(function (resultado) {
            console.log("Cadastro realizado com sucesso!");
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log("Houve um erro ao realizar o cadastro:", erro);
            res.status(500).json({ error: "Houve um erro ao realizar o cadastro." });
        });
}

module.exports = {
    autenticar,
    cadastrarFuncionario,
    cadastrarAgencia
}