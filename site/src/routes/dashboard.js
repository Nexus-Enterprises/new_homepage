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

router.post("/altoConsumoRAM", function (req, res) {
  dashboardController.altoConsumoRAM(req, res);
});

router.post("/altoConsumoCPUFunc", function (req, res) {
  dashboardController.altoConsumoCPUFunc(req, res);
});

router.post("/altoConsumoRAMFunc", function (req, res) {
  dashboardController.altoConsumoRAMFunc(req, res);
});

router.post("/altoConsumoDiscoFunc", function (req, res) {
  dashboardController.altoConsumoDiscoFunc(req, res);
});

router.post("/listarConsumoMaquina", function (req, res) {
  dashboardController.listarConsumoMaquina(req, res);
});

router.post("/ultimosRegistros", function (req, res) {
  dashboardController.ultimosRegistros(req, res);
});

router.post("/cadastrar", function (req, res) {
  dashboardController.cadastrar(req, res);
})

module.exports = router;