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

function listarProcessos(idMaq) {
  var instrucao = `
    SELECT
      Processo.idProcesso,
      Processo.fkMaquina,
      Processo.nome AS NomeProcesso,
      TIME_FORMAT(Processo.dataHora, '%H:%i:%s') AS DataHora,
      Processo.usoAtualRAM AS UsoRam,
      Processo.usoAtualDisco AS UsoDisco,
      Processo.usoAtualCPU AS UsoCPU
    FROM Processo
    WHERE Processo.fkMaquina = '${idMaq}'
    ORDER BY Processo.usoAtualCPU DESC
    LIMIT 5;
    ;`
  return database.executar(instrucao);
}

function statusMaquinas(agencia, banco, idMaq) {
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

function listarMaquinasAg(agencia) {
  var instrucao = `
  SELECT * FROM Maquina JOIN Agencia ON Maquina.fkAgencia = Agencia.idAgencia  WHERE Agencia.idAgencia = '${agencia}';
  `;

  return database.executar(instrucao)
}

function listarMaquinasAg(agencia) {
  var instrucao = `
  SELECT * FROM Maquina JOIN Agencia ON Maquina.fkAgencia = Agencia.idAgencia  WHERE Agencia.idAgencia = '${agencia}';
  `;

  return database.executar(instrucao)
}

function altoConsumoCPU(banco) {
  var instrucao = `
  SELECT 
    CodigoAgencia,
    NumeroMaquina,
    TotalCapacidade,
    ConsumoAtual,
    Porcentagem,
    (SELECT AVG(Porcentagem) FROM (
        -- Sua consulta principal aqui
        SELECT 
            Agencia.numero AS "CodigoAgencia",
            Maquina.idMaquina AS "NumeroMaquina",
            Registro.capacidadeMax AS "TotalCapacidade",
            Registro.usoAtual AS "ConsumoAtual",
            (Registro.usoAtual / Registro.capacidadeMax) * 100 AS "Porcentagem"
        FROM 
            Registro
        JOIN 
            Maquina ON Registro.fkMaquina = Maquina.idMaquina
        JOIN 
            Agencia ON Maquina.fkAgencia = Agencia.idAgencia
        WHERE 
            Registro.fkAlerta = (SELECT idAlerta FROM Alerta WHERE causa = 'Sobrecarga de CPU' AND gravidade = 'Alta')
            AND Agencia.fkEmpresa = (SELECT idEmpresa FROM Empresa WHERE nomeEmpresa = '${banco}')
        ORDER BY 
            (Registro.usoAtual - Registro.capacidadeMax) DESC
    ) AS subquery) AS "MediaPorcentagem"
    FROM ( SELECT 
        Agencia.numero AS "CodigoAgencia",
        Maquina.idMaquina AS "NumeroMaquina",
        Registro.capacidadeMax AS "TotalCapacidade",
        Registro.usoAtual AS "ConsumoAtual",
        (Registro.usoAtual / Registro.capacidadeMax) * 100 AS "Porcentagem"
    FROM 
        Registro
    JOIN 
        Maquina ON Registro.fkMaquina = Maquina.idMaquina
    JOIN 
        Agencia ON Maquina.fkAgencia = Agencia.idAgencia
    WHERE 
        Registro.fkAlerta = (SELECT idAlerta FROM Alerta WHERE causa = 'Sobrecarga de CPU' AND gravidade = 'Alta')
        AND Agencia.fkEmpresa = (SELECT idEmpresa FROM Empresa WHERE nomeEmpresa = '${banco}')
    ORDER BY 
        (Registro.usoAtual - Registro.capacidadeMax) DESC
) AS principal LIMIT 1;
  `;

  return database.executar(instrucao);
}

function altoConsumoRAM(banco) {
  var instrucao = `
  SELECT 
  CodigoAgencia,
  NumeroMaquina,
  TotalCapacidade,
  ConsumoAtual,
  Porcentagem,
  (SELECT AVG(Porcentagem) FROM (
      -- Sua consulta principal aqui
      SELECT 
          Agencia.numero AS "CodigoAgencia",
          Maquina.idMaquina AS "NumeroMaquina",
          Registro.capacidadeMax AS "TotalCapacidade",
          Registro.usoAtual AS "ConsumoAtual",
          (Registro.usoAtual / Registro.capacidadeMax) * 100 AS "Porcentagem"
      FROM 
          Registro
      JOIN 
          Maquina ON Registro.fkMaquina = Maquina.idMaquina
      JOIN 
          Agencia ON Maquina.fkAgencia = Agencia.idAgencia
      WHERE 
          Registro.fkAlerta = (SELECT idAlerta FROM Alerta WHERE causa = 'Memória insuficiente' AND gravidade = 'Alta')
          AND Agencia.fkEmpresa = (SELECT idEmpresa FROM Empresa WHERE nomeEmpresa = '${banco}')
      ORDER BY 
          (Registro.usoAtual - Registro.capacidadeMax) DESC
  ) AS subquery) AS "MediaPorcentagem"
  FROM ( SELECT 
      Agencia.numero AS "CodigoAgencia",
      Maquina.idMaquina AS "NumeroMaquina",
      Registro.capacidadeMax AS "TotalCapacidade",
      Registro.usoAtual AS "ConsumoAtual",
      (Registro.usoAtual / Registro.capacidadeMax) * 100 AS "Porcentagem"
  FROM 
      Registro
  JOIN 
      Maquina ON Registro.fkMaquina = Maquina.idMaquina
  JOIN 
      Agencia ON Maquina.fkAgencia = Agencia.idAgencia
  WHERE 
      Registro.fkAlerta = (SELECT idAlerta FROM Alerta WHERE causa = 'Memória insuficiente' AND gravidade = 'Alta')
      AND Agencia.fkEmpresa = (SELECT idEmpresa FROM Empresa WHERE nomeEmpresa = '${banco}')
  ORDER BY 
      (Registro.usoAtual - Registro.capacidadeMax) DESC
) AS principal LIMIT 1;
  `;

  return database.executar(instrucao);
}

function altoConsumoDisco(banco) {
  var instrucao = `
  SELECT 
  CodigoAgencia,
  NumeroMaquina,
  TotalCapacidade,
  ConsumoAtual,
  Porcentagem,
  (SELECT AVG(Porcentagem) FROM (
      -- Sua consulta principal aqui
      SELECT 
          Agencia.numero AS "CodigoAgencia",
          Maquina.idMaquina AS "NumeroMaquina",
          Registro.capacidadeMax AS "TotalCapacidade",
          Registro.usoAtual AS "ConsumoAtual",
          (Registro.usoAtual / Registro.capacidadeMax) * 100 AS "Porcentagem"
      FROM 
          Registro
      JOIN 
          Maquina ON Registro.fkMaquina = Maquina.idMaquina
      JOIN 
          Agencia ON Maquina.fkAgencia = Agencia.idAgencia
      WHERE 
          Registro.fkAlerta = (SELECT idAlerta FROM Alerta WHERE causa = 'Erro de disco rígido' AND gravidade = 'Alta')
          AND Agencia.fkEmpresa = (SELECT idEmpresa FROM Empresa WHERE nomeEmpresa = '${banco}')
      ORDER BY 
          (Registro.usoAtual - Registro.capacidadeMax) DESC
  ) AS subquery) AS "MediaPorcentagem"
  FROM ( SELECT 
      Agencia.numero AS "CodigoAgencia",
      Maquina.idMaquina AS "NumeroMaquina",
      Registro.capacidadeMax AS "TotalCapacidade",
      Registro.usoAtual AS "ConsumoAtual",
      (Registro.usoAtual / Registro.capacidadeMax) * 100 AS "Porcentagem"
  FROM 
      Registro
  JOIN 
      Maquina ON Registro.fkMaquina = Maquina.idMaquina
  JOIN 
      Agencia ON Maquina.fkAgencia = Agencia.idAgencia
  WHERE 
      Registro.fkAlerta = (SELECT idAlerta FROM Alerta WHERE causa = 'Erro de disco rígido' AND gravidade = 'Alta')
      AND Agencia.fkEmpresa = (SELECT idEmpresa FROM Empresa WHERE nomeEmpresa = '${banco}')
  ORDER BY 
      (Registro.usoAtual - Registro.capacidadeMax) DESC
) AS principal LIMIT 1;
  `;

  return database.executar(instrucao);
}

function altoConsumoCPUFunc(banco, agencia, funcionario) {
  var instrucao = `
  SELECT 
        Registro.capacidadeMax AS "TotalCapacidade",
        Registro.usoAtual AS "ConsumoAtual",
        TIME_FORMAT(Registro.dataHora, '%H:%i:%s') AS "DataHora"
    FROM Registro
        JOIN Maquina ON Registro.fkMaquina = Maquina.idMaquina
        JOIN Agencia ON Maquina.fkAgencia = '${agencia}'
    WHERE Registro.fkAlerta = (SELECT idAlerta FROM Alerta WHERE causa = 'Sobrecarga de CPU' AND gravidade = 'Alta')
        AND Agencia.fkEmpresa = (SELECT idEmpresa FROM Empresa WHERE nomeEmpresa = '${banco}')
        AND Maquina.fkFuncionario = (SELECT idFuncionario from Funcionario where idFuncionario = '${funcionario}') 
    ORDER BY (Registro.usoAtual - Registro.capacidadeMax) DESC
    LIMIT 1;
  `;

  return database.executar(instrucao);
}

function altoConsumoRAMFunc(banco, agencia, funcionario) {
  console.log("entrei no ram teste model");
  var instrucao = `
  SELECT 
       Registro.capacidadeMax AS "TotalCapacidade",
       Registro.usoAtual AS "ConsumoAtual",
       TIME_FORMAT(Registro.dataHora, '%H:%i:%s') AS "DataHora"
  FROM Registro
    JOIN Maquina ON Registro.fkMaquina = Maquina.idMaquina
    JOIN Agencia ON Maquina.fkAgencia = '${agencia}'
  WHERE Registro.fkAlerta = (SELECT idAlerta FROM Alerta WHERE causa = 'Memória insuficiente' AND gravidade = 'Alta')
    AND Agencia.fkEmpresa = (SELECT idEmpresa FROM Empresa WHERE nomeEmpresa = '${banco}')
    AND Maquina.fkFuncionario = (SELECT idFuncionario from Funcionario where idFuncionario = '${funcionario}') 
  ORDER BY (Registro.usoAtual - Registro.capacidadeMax) DESC
  LIMIT 1;
  `;

  return database.executar(instrucao);
}

function altoConsumoDiscoFunc(banco, agencia, funcionario) {
  var instrucao = `
  SELECT 
        Registro.capacidadeMax AS "TotalCapacidade",
        Registro.usoAtual AS "ConsumoAtual",
        TIME_FORMAT(Registro.dataHora, '%H:%i:%s') AS "DataHora"
    FROM Registro
        JOIN Maquina ON Registro.fkMaquina = Maquina.idMaquina
        JOIN Agencia ON Maquina.fkAgencia = '${agencia}'
    WHERE Registro.fkAlerta = (SELECT idAlerta FROM Alerta WHERE causa = 'Erro de disco rígido' AND gravidade = 'Alta')
        AND Agencia.fkEmpresa = (SELECT idEmpresa FROM Empresa WHERE nomeEmpresa = '${banco}')
        AND Maquina.fkFuncionario = (SELECT idFuncionario from Funcionario where idFuncionario = '${funcionario}') 
    ORDER BY (Registro.usoAtual - Registro.capacidadeMax) DESC
    LIMIT 1;
  `;

  return database.executar(instrucao);
}

function listarConsumoMaquina(funcionario) {

  var instrucao = `
  SELECT * FROM Maquina JOIN Funcionario ON Maquina.fkFuncionario = Funcionario.idFuncionario  
  WHERE Funcionario.idFuncionario = '${funcionario}';
  `

  return database.executar(instrucao);
}

function ultimosRegistros(banco, agencia, funcionario) {
  var instrucao = `
  SELECT 
  Componente.idComponente AS "IdComponente",
  Componente.nome AS "NomeComponente",
  Registro.capacidadeMax AS "CapacidadeMaxima",
  Registro.usoAtual AS "UsoAtual",
   TIME_FORMAT(Registro.dataHora, '%H:%i:%s') AS "DataHora"
FROM Registro
INNER JOIN Componente ON Registro.fkComponente = Componente.idComponente
INNER JOIN Maquina ON Registro.fkMaquina = Maquina.idMaquina
INNER JOIN Agencia ON Maquina.fkAgencia = ${agencia}
WHERE Maquina.idMaquina = 5
AND Maquina.fkFuncionario = (SELECT idFuncionario from Funcionario where idFuncionario = '${funcionario}')
AND Agencia.fkEmpresa = (SELECT idEmpresa FROM Empresa WHERE nomeEmpresa = '${banco}');
  `;

  return database.executar(instrucao);
}

function ultimasTarefas(banco, agencia, funcionario) {
  var instrucao = `
  SELECT DISTINCT
  Componente.nome AS "NomeComponente",
  Registro.capacidadeMax AS "CapacidadeMaxima",
  Processo.nome AS "NomeProcesso",
  Processo.usoAtualRAM AS "UsoAtualRAM",
  Processo.usoAtualDisco AS "UsoAtualDisco",
  Processo.usoAtualCPU AS "UsoAtualCPU",
  TIME_FORMAT(Processo.dataHora, '%H:%i:%s') AS "DataHora"
FROM Processo
INNER JOIN Maquina ON Processo.fkMaquina = Maquina.idMaquina
INNER JOIN Registro ON Maquina.idMaquina = Registro.fkMaquina
INNER JOIN Componente ON Registro.fkComponente = Componente.idComponente
INNER JOIN Agencia ON Maquina.fkAgencia = ${agencia}
WHERE Maquina.idMaquina = 5
AND Maquina.fkFuncionario = (SELECT idFuncionario FROM Funcionario WHERE idFuncionario = ${funcionario})
AND Agencia.fkEmpresa = (SELECT idEmpresa FROM Empresa WHERE nomeEmpresa = '${banco}')
ORDER BY Processo.usoAtualRAM, Processo.usoAtualDisco, Processo.usoAtualCPU DESC;
  `;

  return database.executar(instrucao);
}

function verificarAgilidade(banco, agencia, funcionario) {
  var instrucao = `
  SELECT DISTINCT
  Componente.idComponente AS "IdComponente",
  Componente.nome AS "NomeComponente",
  AVG(Registro.capacidadeMax) AS "CapacidadeMaxima",
  AVG(Registro.usoAtual) AS "UsoAtual"
FROM Registro
INNER JOIN Componente ON Registro.fkComponente = Componente.idComponente
INNER JOIN Maquina ON Registro.fkMaquina = Maquina.idMaquina
INNER JOIN Agencia ON Maquina.fkAgencia = ${agencia}
WHERE Maquina.idMaquina = 5 AND Componente.idComponente = 1 OR Componente.idComponente = 2
AND Maquina.fkFuncionario = (SELECT idFuncionario from Funcionario where idFuncionario = ${funcionario})
AND Agencia.fkEmpresa = (SELECT idEmpresa FROM Empresa WHERE nomeEmpresa = '${banco}')
GROUP BY Componente.idComponente, Componente.nome, Registro.capacidadeMax
ORDER BY Componente.idComponente;
`
  return database.executar(instrucao);
}

module.exports = {
  listarProcessos,
  listarMaquinasAg,
  listarAgenciasNOC,
  listarMaquinas,
  altoConsumoCPU,
  altoConsumoRAM,
  altoConsumoDisco,
  statusMaquinas,
  listarLocalizacao,
  altoConsumoCPUFunc,
  altoConsumoRAMFunc,
  altoConsumoDiscoFunc,
  listarConsumoMaquina,
  ultimosRegistros,
  ultimasTarefas,
  verificarAgilidade,
}