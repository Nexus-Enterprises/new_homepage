var database = require("../database/config")

function autenticar(email, senha) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", email, senha)
    var instrucao = `
        SELECT id, nome, email, fk_empresa as empresaId FROM usuario WHERE email = '${email}' AND senha = '${senha}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

// Coloque os mesmos parâmetros aqui. Vá para a var instrucao
function cadastrarFuncionario(firstName, lastName, email, phoneDDD, phoneNumber, role, agency, agencyEmpre) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrarFuncionario():", firstName, lastName, email, phoneDDD, phoneNumber, role, agency, agencyEmpre);
    
    var instrucao = `
        INSERT INTO Funcionario (nome, sobrenome, emailCorporativo, ddd, telefone, cargo, situacao, fkAgencia, fkEmpresa) VALUES ('${firstName}', '${lastName}', '${email}', '${phoneDDD}', '${phoneNumber}', '${role}', 'Ativo', 1, (SELECT idEmpresa FROM Empresa WHERE nomeEmpresa = '${agencyEmpre}'));
    `;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function cadastrarAgencia(cep, endereco, bairro, cidade, uf, complemento) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrarFuncionario():", cep,endereco, bairro, cidade, uf, complemento);
    
    var instrucao = `
        INSERT INTO Endereco (cep, logradouro, bairro, localidade, uf, complemento)
VALUES
  ('${cep}', '${endereco}', '${bairro}', '${cidade}', '${uf}', '${complemento}');
    `;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

module.exports = {
    autenticar,
    cadastrarFuncionario,
    cadastrarAgencia
};