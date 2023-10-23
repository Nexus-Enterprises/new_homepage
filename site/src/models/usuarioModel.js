var database = require("../database/config")

function autenticar(email, token) {
    var instrucao = `
        SELECT * FROM Usuario JOIN Funcionario ON Usuario.fkFuncionario = Funcionario.idFuncionario WHERE Usuario.email = '${email}' AND Usuario.token = '${token}';
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
        INSERT INTO Endereco (cep, logradouro, bairro, localidade, uf, complemento)
VALUES
  ('${cep}', '${endereco}', '${bairro}', '${cidade}', '${uf}', '${complemento}');
    `;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function cadastrarAgencia(agencia, digito, organizacao, email, ddd, telefone, endereco) {
    var instrucao = `
    INSERT INTO Agencia (numero, digitoAgencia, ddd, telefone, email, fkEmpresa, fkEndereco)
    VALUES
      ('${agencia}', '${digito}', '${ddd}', '${telefone}', '${email}', (SELECT idEmpresa FROM Empresa WHERE nomeEmpresa = '${organizacao}'), (SELECT idEndereco FROM Endereco WHERE logradouro = '${endereco}'));
    `;
    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

function listarFuncionario() {
    
    var instrucao = `
    SELECT nome FROM Funcionario;
    `;
    return database.executar(instrucao);
}

function cadastrarMaquina(brand, model, situation, funcionario, agencia, banco) {
    
    var instrucao = `
    INSERT INTO Maquina (marca, modelo, situacao, fkFuncionario, fkAgencia, fkEmpresa) VALUES ('${brand}', '${model}', '${situation}', (SELECT idFuncionario FROM Funcionario WHERE nome = '${funcionario}'), (SELECT idAgencia FROM Agencia WHERE numero = ${agencia}), (SELECT idEmpresa FROM Empresa WHERE nomeEmpresa = '${banco}'));
    `;
    return database.executar(instrucao);
}

function cadastrarToken(email, token, funcionario) {
    
    var instrucao = `
    INSERT INTO Usuario (email, token, fkFuncionario) VALUES ('${email}', '${token}', (SELECT idFuncionario FROM Funcionario WHERE nome = '${funcionario}'));
    `;
    return database.executar(instrucao);
}

module.exports = {
    autenticar,
    cadastrarFuncionario,
    cadastrarEndAgencia,
    cadastrarAgencia,
    listarFuncionario,
    cadastrarMaquina,
    cadastrarToken
};