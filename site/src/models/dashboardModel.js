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

function listarLocalizacao(empresa) {
  var instrucao = `
  SELECT
  idMaquina,
  Registro.enderecoIPV4 AS "endereco",
  Agencia.digitoAgencia
  FROM Registro
  JOIN Maquina ON Maquina.idMaquina = Registro.fkMaquina
  JOIN Agencia ON Agencia.idAgencia = Maquina.fkAgencia
WHERE Agencia.fkEmpresa = (SELECT idEmpresa FROM Empresa WHERE nomeEmpresa = '${empresa}')
GROUP BY Maquina.idMaquina, Registro.enderecoIPV4, Agencia.digitoAgencia;
  `;

  return database.executar(instrucao);

}

function statusMaquinas(agencia, banco, idMaq){
  var instrucao = `
  SELECT DISTINCT
  Componente.nome AS "NomeComponente",
  Registro.capacidadeMax AS "CapacidadeMaxima",
  Registro.usoAtual AS "UsoAtual",
  Maquina.situacao AS "Status",
  Maquina.idMaquina AS "IdMaquina",
  TIME_FORMAT(Registro.dataHora, '%H:%i:%s') AS "DataHora",
  Registro.enderecoIPV4 AS "EnderecoIP"
FROM (
  SELECT
      fkComponente,
      MAX(Registro.dataHora) AS max_dataHora
  FROM Registro
  GROUP BY fkComponente
) AS ultimos_registros
INNER JOIN Componente ON ultimos_registros.fkComponente = Componente.idComponente
INNER JOIN Registro ON ultimos_registros.fkComponente = Registro.fkComponente AND ultimos_registros.max_dataHora = Registro.dataHora
INNER JOIN Maquina ON Registro.fkMaquina = Maquina.idMaquina
INNER JOIN Agencia ON Maquina.fkAgencia = Agencia.idAgencia
INNER JOIN Alerta ON Registro.fkAlerta = Alerta.idAlerta
WHERE Maquina.idMaquina = ${idMaq}
AND Maquina.fkAgencia = ${agencia}
AND Agencia.fkEmpresa = (SELECT idEmpresa FROM Empresa WHERE nomeEmpresa = '${banco}');
  `

  return database.executar(instrucao);
}

function listarMaquinas(agencia) {
  var instrucao = `
  SELECT * FROM Maquina JOIN Agencia ON Maquina.fkAgencia = Agencia.idAgencia  WHERE Agencia.idAgencia = (SELECT idAgencia FROM Agencia WHERE Agencia.numero = '${agencia}');

  `;

  return database.executar(instrucao);
}

function listarMaquinasAg(agencia){
  var instrucao = `
  SELECT * FROM Maquina JOIN Agencia ON Maquina.fkAgencia = Agencia.idAgencia  WHERE Agencia.idAgencia = '${agencia}';
  `;

  return database.executar(instrucao)
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

module.exports = {
  listarMaquinasAg,
  listarAgenciasNOC,
  listarMaquinas,
  altoConsumoCPU,
  altoConsumoRAM,
  statusMaquinas,
  listarLocalizacao
}
