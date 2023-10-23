var usuarioModel = require("../models/usuarioModel");

function autenticar(req, res) {
    var email = req.body.emailServer;
    var token = req.body.tokenServer;

    if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (token == undefined) {
        res.status(400).send("Sua senha está indefinida!");
    } else {

        usuarioModel.autenticar(email, token)
            .then(
                function (response) {
                    if (response.length == 1) {
                    res.json(response)
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
    const agencyEmpre = req.body.agencyEmpreServer;

    // Validar os valores
    if (!firstName || !lastName || !email || !phoneDDD || !phoneNumber || !role || !agencyEmpre) {
        return res.status(400).json({ error: "Por favor, preencha todos os campos corretamente." });
    }

    // Passar os valores como parâmetros para o modelo de usuário (usuarioModel)
    usuarioModel.cadastrarFuncionario(firstName, lastName, email, phoneDDD, phoneNumber, role, agencyEmpre)
        .then(function (resultado) {
            console.log("Cadastro realizado com sucesso!");
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log("Houve um erro ao realizar o cadastro:", erro);
            res.status(500).json({ error: "Houve um erro ao realizar o cadastro." });
        });
}

function cadastrarEndAgencia(req, res) {
    // Obter os valores do corpo da solicitação
    const cep = req.body.cepServer
    const endereco = req.body.enderecoServer;
    const numero = req.body.numeroServer;
    const bairro = req.body.bairroServer;
    const cidade = req.body.cidadeServer;
    const uf = req.body.ufServer;
    const complemento = req.body.complementoServer;

    // Validar os valores
    if (!cep || !endereco || !bairro || !cidade || !uf) {
        return res.status(400).json({ error: "Por favor, preencha todos os campos corretamente." });
    } else if (complemento == "undefined") {
        complemento = null
    }

    // Passar os valores como parâmetros para o modelo de usuário (usuarioModel)
    usuarioModel.cadastrarEndAgencia(cep, endereco, bairro, cidade, uf, complemento)
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
    const agencia = req.body.agenciaServer
    const digito = req.body.digitoServer;
    const organizacao = req.body.organizacaoServer;
    const email = req.body.emailServer;
    const ddd = req.body.dddServer;
    const telefone = req.body.telefoneServer;
    const endereco = req.body.enderecoServer;

    // Validar os valores
    if (!agencia || !digito || !organizacao || !email || !ddd || !telefone) {
        return res.status(400).json({ error: "Por favor, preencha todos os campos corretamente." });
    }

    // Passar os valores como parâmetros para o modelo de usuário (usuarioModel)
    usuarioModel.cadastrarAgencia(agencia, digito, organizacao, email, ddd, telefone, endereco)
        .then(function (resultado) {
            console.log("Cadastro realizado com sucesso!");
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log("Houve um erro ao realizar o cadastro:", erro);
            res.status(500).json({ error: "Houve um erro ao realizar o cadastro." });
        });


}

function listarFuncionario(req, res) {
    usuarioModel.listarFuncionario()
        .then(function (resultado) {
            if (resultado.length > 0) {
                res.status(200).json(resultado);
            } else {
                res.status(204).send("Nenhum resultado encontrado!")
            }
        }).catch(
            function (erro) {
                console.log(erro);
                console.log("Houve um erro ao realizar a consulta! Erro: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            }
        );
}

function cadastrarMaquina(req, res) {
    // Obter os valores do corpo da solicitação
    const brand = req.body.brandServer
    const model = req.body.modelServer;
    const situation = req.body.situationServer;
    const funcionario = req.body.funcionarioServer;
    const agencia = req.body.agenciaServer;
    const banco = req.body.bancoServer;

    // Validar os valores
    if (!brand || !model || !situation || !funcionario) {
        return res.status(400).json({ error: "Por favor, preencha todos os campos corretamente." });
    }

    // Passar os valores como parâmetros para o modelo de usuário (usuariomodel)
    usuarioModel.cadastrarMaquina(brand, model, situation, funcionario, agencia, banco)
        .then(function (resultado) {
            console.log("Cadastro realizado com sucesso!");
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log("Houve um erro ao realizar o cadastro:", erro);
            res.status(500).json({ error: "Houve um erro ao realizar o cadastro." });
        });
}

function cadastrarToken(req, res) {
    // Obter os valores do corpo da solicitação
    const email = req.body.emailServer
    const token = req.body.tokenServer;
    const funcionario = req.body.funcionarioServer

    usuarioModel.cadastrarToken(email, token, funcionario)
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
    cadastrarEndAgencia,
    cadastrarAgencia,
    listarFuncionario,
    cadastrarMaquina,
    cadastrarToken
}