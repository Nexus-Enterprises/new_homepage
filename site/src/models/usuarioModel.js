var database = require("../database/config")

function autenticar(email, token) {
    var instrucao = `
    SELECT * FROM Funcionario 
    JOIN Empresa ON Funcionario.fkEmpresa = Empresa.idEmpresa 
    JOIN Maquina on Funcionario.idFuncionario = Maquina.fkFuncionario
    WHERE Funcionario.emailCorporativo = '${email}' AND Funcionario.token = '${token}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

// Coloque os mesmos parâmetros aqui. Vá para a var instrucao
function cadastrarFuncionario(firstName, lastName, email, phoneDDD, phoneNumber, role, agencyEmpre) {

    var instrucao = `
        INSERT INTO Funcionario (nome, sobrenome, emailCorporativo, ddd, telefone, cargo, situacao, fkAgencia, fkEmpresa) VALUES ('${firstName}', '${lastName}', '${email}', '${phoneDDD}', '${phoneNumber}', '${role}', 'Ativo', 1, (SELECT idEmpresa FROM Empresa WHERE nomeEmpresa = '${agencyEmpre}'));
    `;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function cadastrarEndAgencia(cep, endereco, bairro, cidade, uf, complemento) {
    var instrucao = `
    INSERT IGNORE INTO Endereco (cep, logradouro, bairro, localidade, uf, complemento)
    VALUES ('${cep}', '${endereco}', '${bairro}', '${cidade}', '${uf}', '${complemento}');
    `;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function cadastrarAgencia(agencia, digito, organizacao, email, ddd, telefone, endereco) {
    var instrucao = `
    INSERT IGNORE INTO Agencia (numero, digitoAgencia, ddd, telefone, email, fkEmpresa, fkEndereco)
    VALUES
      ('${agencia}', '${digito}', '${ddd}', '${telefone}', '${email}', (SELECT idEmpresa FROM Empresa WHERE nomeEmpresa = '${organizacao}'), (SELECT LAST_INSERT_ID(idEndereco) AS idEndereco FROM Endereco WHERE logradouro = '${endereco}'));
    `;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function listarFuncionario(agencia) {

    var instrucao = `
    SELECT idFuncionario, nome FROM Funcionario JOIN Agencia 
    JOIN Empresa ON Agencia.fkEmpresa = Empresa.idEmpresa
    WHERE numero = ${agencia};
    `;
    return database.executar(instrucao);
}

function listarEmpresa() {

    var instrucao = `
    SELECT nomeEmpresa FROM Empresa;
    `;
    return database.executar(instrucao);
}

function cadastrarMaquina(brand, model, situation, funcionario, agencia, banco, email) {

    var instrucao = `
    INSERT INTO Maquina (marca, modelo, situacao, fkFuncionario, fkAgencia, fkEmpresa) VALUES ('${brand}', '${model}', '${situation}', (SELECT idFuncionario FROM Funcionario WHERE emailCorporativo = '${email}'), (SELECT idAgencia FROM Agencia WHERE numero = ${agencia}), (SELECT idEmpresa FROM Empresa WHERE nomeEmpresa = '${banco}'));
    `;

    var instrucao2 = `
    UPDATE Funcionario AS Func JOIN ( SELECT idFuncionario, (SELECT idAgencia FROM Agencia WHERE numero = '${agencia}') AS atualizaAgencia FROM Funcionario WHERE emailCorporativo = '${email}') AS SubQuery ON Func.idFuncionario = SubQuery.idFuncionario SET Func.fkAgencia = SubQuery.atualizaAgencia;`;

    return (database.executar(instrucao), database.executar(instrucao2));
}

function cadastrarToken(email, token) {

    var instrucao = `
    UPDATE Funcionario
        SET token = '${token}'
        WHERE emailCorporativo = '${email}';`;

    return database.executar(instrucao);
}

module.exports = {
    autenticar,
    cadastrarFuncionario,
    cadastrarEndAgencia,
    cadastrarAgencia,
    listarFuncionario,
    cadastrarMaquina,
    cadastrarToken,
    listarEmpresa
};