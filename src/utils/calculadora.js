/**
 * Lógica da calculadora solar
 * Baseado no valor da conta e consumo mensal (kWh)
 */
function calcularSolar(valorConta, consumoMensal, tipoImovel = 'residencial') {
  const valorKwh = 0.85; // valor médio kWh - pode ajustar
  const horasSol = 5; // média diária de horas de sol
  const diasMes = 30;

  // Se não informou consumo, estima a partir da conta (conta / valor_kwh)
  const consumo = consumoMensal || Math.round(valorConta / valorKwh);

  // Potência necessária: consumo / (horas_sol * dias)
  const potenciaSugerida = Math.ceil((consumo * 1000) / (horasSol * diasMes));

  // Arredonda para módulos típicos (330W, 400W, etc)
  const moduloPadrao = 400;
  const potenciaFinal = Math.ceil(potenciaSugerida / moduloPadrao) * moduloPadrao;
  const potenciaKw = potenciaFinal / 1000;

  // Economia mensal estimada (redução ~85% na conta)
  const economiaMensal = valorConta * 0.85;
  const economiaAnual = economiaMensal * 12;

  return {
    consumo_estimado: consumo,
    potencia_sugerida: potenciaKw,
    economia_estimada: Math.round(economiaMensal * 100) / 100,
    economia_anual: Math.round(economiaAnual * 100) / 100,
    modulo_qtd: Math.ceil(potenciaFinal / moduloPadrao)
  };
}

module.exports = { calcularSolar };
