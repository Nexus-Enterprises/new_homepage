var database = require("../database/config");

function listarAgenciasNOC(empresa) {

  var instrucao = `SELECT
  Agencia.numero AS "CodigoAgencia",
  Agencia.digitoAgencia AS "DigitoAgencia",
  COUNT(Maquina.idMaquina) AS "TotalMaquinas",
  ROUND(SUM(CASE WHEN Registro.fkAlerta = (SELECT idAlerta FROM Alerta WHERE causa = 'Sobrecarga de CPU' AND gravidade = 'Alta')
    THEN Registro.usoAtual ELSE 0 END), 2) AS "TotalUsoCPU",
  ROUND(SUM(CASE WHEN Registro.fkAlerta = (SELECT idAlerta FROM Alerta WHERE causa = 'Erro de disco rígido' AND gravidade = 'Alta')
    THEN Registro.usoAtual ELSE 0 END), 2) AS "TotalUsoDisco",
  ROUND(SUM(CASE WHEN Registro.fkAlerta = (SELECT idAlerta FROM Alerta WHERE causa = 'Memória insuficiente' AND gravidade = 'Alta')
    THEN Registro.usoAtual ELSE 0 END), 2) AS "TotalUsoRAM",
  ROUND(SUM(Registro.capacidadeMax), 2) AS "TotalCapacidade",
  SUM(CASE WHEN (Registro.usoAtual / Registro.capacidadeMax) * 100 > 70 THEN 1 ELSE 0 END) AS "MáquinasAcimaDe70Percent"
FROM Agencia
  JOIN Maquina ON Agencia.idAgencia = Maquina.fkAgencia
  LEFT JOIN Registro ON Maquina.idMaquina = Registro.fkMaquina
WHERE Agencia.fkEmpresa = (SELECT idEmpresa FROM Empresa WHERE nomeEmpresa = '${empresa}')
GROUP BY Agencia.idAgencia;
  `;

  return database.executar(instrucao);

}

function listarMaquinas(agencia) {
  var instrucao = `
  SELECT * FROM Maquina JOIN Agencia ON Maquina.fkAgencia = Agencia.idAgencia  WHERE Agencia.idAgencia = (SELECT idAgencia FROM Agencia WHERE Agencia.numero = '${agencia}');

  `;

  return database.executar(instrucao);
}

function altoConsumoCPU(banco) {
  var instrucao = `
  SELECT Agencia.numero AS "CodigoAgencia",
       Maquina.idMaquina AS "NumeroMaquina",
       Registro.capacidadeMax AS "TotalCapacidade",
       Registro.usoAtual AS "ConsumoAtual"
  FROM Registro
    JOIN Maquina ON Registro.fkMaquina = Maquina.idMaquina
    JOIN Agencia ON Maquina.fkAgencia = Agencia.idAgencia
  WHERE Registro.fkAlerta = (SELECT idAlerta FROM Alerta WHERE causa = 'Sobrecarga de CPU' AND gravidade = 'Alta')
    AND Agencia.fkEmpresa = (SELECT idEmpresa FROM Empresa WHERE nomeEmpresa = '${banco}')
  ORDER BY (Registro.usoAtual - Registro.capacidadeMax) DESC
  LIMIT 1;
  `;

  return database.executar(instrucao);
}

function altoConsumoRAM(banco) {
  var instrucao = `
  SELECT Agencia.numero AS "CodigoAgencia",
       Maquina.idMaquina AS "NumeroMaquina",
       Registro.capacidadeMax AS "TotalCapacidade",
       Registro.usoAtual AS "ConsumoAtual"
  FROM Registro
    JOIN Maquina ON Registro.fkMaquina = Maquina.idMaquina
    JOIN Agencia ON Maquina.fkAgencia = Agencia.idAgencia
  WHERE Registro.fkAlerta = (SELECT idAlerta FROM Alerta WHERE causa = 'Memória insuficiente' AND gravidade = 'Alta')
    AND Agencia.fkEmpresa = (SELECT idEmpresa FROM Empresa WHERE nomeEmpresa = '${banco}')
  ORDER BY (Registro.usoAtual - Registro.capacidadeMax) DESC
  LIMIT 1;
  `;

  return database.executar(instrucao);
}

function cadastrar(empresaId, descricao) {

  instrucaoSql = `insert into (descricao, fk_empresa) aquario values (${descricao}, ${empresaId})`;

  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}


module.exports = {
  listarAgenciasNOC,
  listarMaquinas,
  altoConsumoCPU,
  altoConsumoRAM,
  cadastrar
}
