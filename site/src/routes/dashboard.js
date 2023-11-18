var express = require("express");
var router = express.Router();

var dashboardController = require("../controllers/dashboardController");

router.post("/listarAgenciasNOC", function (req, res) {
  dashboardController.listarAgenciasNOC(req, res);
});

router.post("/statusMaquinas", function (req, res) {
  dashboardController.statusMaquinas(req, res);
});

router.post("/listarMaquinas", function (req, res) {
  dashboardController.listarMaquinas(req, res);
});

router.post("/listarMaquinasAg", function (req, res) {
  dashboardController.listarMaquinasAg(req, res);
});

router.post("/altoConsumoCPU", function (req, res) {
  dashboardController.altoConsumoCPU(req, res);
});

router.post("/listarProcessos", function (req, res) {
  dashboardController.listarProcessos(req, res);
});

router.post("/altoConsumoRAM", function (req, res) {
  dashboardController.altoConsumoRAM(req, res);
});

router.post("/listarLocalizacao", function (req, res) {
  dashboardController.listarLocalizacao(req, res);
});

router.post("/cadastrar", function (req, res) {
  dashboardController.cadastrar(req, res);
})

module.exports = router;