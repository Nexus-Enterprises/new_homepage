var dashboardModel = require("../models/dashboardModel");

function listarAgenciasNOC(req, res) {
  const empresa = req.body.empresaServer;

  dashboardModel.listarAgenciasNOC(empresa)
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

function atualizarFuncionario(req, res) {
  var nome = req.body.nomeServer;
  var sobrenome = req.body.sobrenomeServer;
  var email = req.body.emailServer;
  var telefone = req.body.telefoneServer;
  var cargo = req.body.cargoServer;
  var idFuncionario = req.body.idFuncionarioServer;

  dashboardModel.atualizarFuncionario(nome,sobrenome,email,telefone,cargo, idFuncionario)
  .then(function (resultado) {
    console.log(resultado);
    console.log("O update foi realizado com sucesso!");
    res.status(200).json({ mensagem: "Update realizado com sucesso!" });
  })
  .catch(function (erro) {
    console.log(erro);
    console.log("Houve um erro ao realizar ao atualizar! Erro: ", erro.sqlMessage);
    res.status(500).json({ erro: erro.sqlMessage });
  });
}

function deletarFuncionario(req, res){
  var idFuncionario = req.body.idFuncionarioServer

  dashboardModel.deletarFuncionario(idFuncionario)
    .then(function (resultado) {
      console.log("O update foi realizado com sucesso!")
    }).catch(
      function (erro) {
        console.log(erro);
        console.log("Houve um erro ao realizar ao atualizar! Erro: ", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
      }
    );
}

function listarLocalizacao(req, res) {
  const empresa = req.body.empresaServer;

  dashboardModel.listarLocalizacao(empresa)
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

function listarMaquinas(req, res) {
  const banco = req.body.bancoServer;
  dashboardModel.listarMaquinas(banco)
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

function listarProcessos(req, res) {
  const { maquinaServer } = req.body;

  dashboardModel.listarProcessos(maquinaServer)
    .then(resultado => {
      if (resultado.length > 0) {
        res.status(200).json(resultado);
      } else {
        res.status(204).send("Nenhum resultado encontrado!");
      }
    })
    .catch(erro => {
      console.log(erro);
      console.log("Houve um erro ao realizar a consulta! Erro: ", erro.sqlMessage);
      res.status(500).json(erro.sqlMessage);
    });
}

function listarMaquinasAg(req, res) {
  const agencia = req.body.agenciaServer;
  const banco = req.body.bancoServer;

  dashboardModel.listarMaquinasAg(agencia, banco)
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

function statusMaquinas(req, res) {
  const agencia = req.body.agenciaServer;
  const banco = req.body.bancoServer;
  const idMaq = req.body.maquinaServer;

  dashboardModel.statusMaquinas(agencia, banco, idMaq)
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

function listarFuncionarios(req, res) {
  const agencia = req.body.agenciaServer;
  const banco = req.body.bancoServer;

  dashboardModel.listarFuncionarios(agencia, banco)
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

function altoConsumoCPU(req, res) {
  const banco = req.body.bancoServer;
  const agencia = req.body.agenciaServer;

  dashboardModel.altoConsumoCPU(banco, agencia)
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

function altoConsumoRAM(req, res) {
  const banco = req.body.bancoServer;
  const agencia = req.body.agenciaServer;

  dashboardModel.altoConsumoRAM(banco, agencia)
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

function altoConsumoDisco(req, res) {
  const banco = req.body.bancoServer;
  const agencia = req.body.agenciaServer;
  
  dashboardModel.altoConsumoDisco(banco, agencia)
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

function altoConsumoCPUFunc(req, res) {
  const banco = req.body.bancoServer;
  const agencia = req.body.agenciaServer;
  const funcionario = req.body.funcionarioServer;

  dashboardModel.altoConsumoCPUFunc(banco, agencia, funcionario)
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

function altoConsumoRAMFunc(req, res) {
  const banco = req.body.bancoServer;
  const agencia = req.body.agenciaServer;
  const funcionario = req.body.funcionarioServer;

  dashboardModel.altoConsumoRAMFunc(banco, agencia, funcionario)
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

function altoConsumoDiscoFunc(req, res) {
  const banco = req.body.bancoServer;
  const agencia = req.body.agenciaServer;
  const funcionario = req.body.funcionarioServer;

  dashboardModel.altoConsumoDiscoFunc(banco, agencia, funcionario)
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

function listarConsumoMaquina(req, res) {
    const funcionario = req.body.funcionarioServer;
    dashboardModel.listarConsumoMaquina(funcionario)
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

function statusMaquinas(req, res) {
  const agencia = req.body.agenciaServer;
  const banco = req.body.bancoServer;
  const idMaq = req.body.maquinaServer;

  dashboardModel.statusMaquinas(agencia, banco, idMaq)
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

function ultimosRegistros(req, res) {
  const banco = req.body.bancoServer;
  const agencia = req.body.agenciaServer;
  const funcionario = req.body.funcionarioServer;

  dashboardModel.ultimosRegistros(banco, agencia, funcionario)
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

function ultimasTarefas(req, res) {
  const banco = req.body.bancoServer;
  const agencia = req.body.agenciaServer;
  const funcionario = req.body.funcionarioServer;

  dashboardModel.ultimasTarefas(banco, agencia, funcionario)
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

function verificarAgilidade(req, res) {
  const banco = req.body.bancoServer;
  const agencia = req.body.agenciaServer;
  const funcionario = req.body.funcionarioServer;

  dashboardModel.verificarAgilidade(banco, agencia, funcionario)
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
module.exports = {
  deletarFuncionario,
  atualizarFuncionario,
  listarFuncionarios,
  listarProcessos,
  listarAgenciasNOC,
  listarMaquinas,
  altoConsumoCPU,
  altoConsumoRAM,
  altoConsumoDisco,
  altoConsumoCPUFunc,
  altoConsumoRAMFunc,
  altoConsumoDiscoFunc,
  listarConsumoMaquina,
  statusMaquinas,
  listarMaquinasAg,
  ultimosRegistros,
  listarLocalizacao,
  ultimasTarefas,
  verificarAgilidade,
}