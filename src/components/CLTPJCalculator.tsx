import React, { useState, useMemo, useEffect } from 'react';
import { Calculator, DollarSign, TrendingUp, TrendingDown, Wallet, BarChart3, ChevronDown, ChevronUp } from 'lucide-react';

const CLTPJCalculator = () => {
  const [activeTab, setActiveTab] = useState('clt');
  const [expandedDetails, setExpandedDetails] = useState({});
  const [simulacaoRapida, setSimulacaoRapida] = useState(15000);

  const [cltData, setCltData] = useState({
    salarioBruto: 8000,
    vr: 600,
    va: 500,
    planoSaude: 300,
    gympass: 150,
    outrosDescontos: 0,
    pprAnualLiquido: 12000,
    dependentesIR: 0,
    inssValor: 880,
    irrfValor: 900,
    deducaoManual: 0,
    feriasPercentualBruto: 133.33,
    feriasValorBruto: 10666,
    decimoTerceiroBruto: 8000,
    incluirDecimoTerceiro: true
  });

  const [pjData, setPjData] = useState({
    valorMensal: 15000,
    regimeTexto: 'Simples Nacional - 6%',
    custosContabilidade: 300,
    valeAlimentacao: 600,
    feriasValorBruto: 15000,
    pprAnualLiquido: 15000,
    proLabore: 1320,
    inssPercentual: 11,
    inssValor: 145.20,
    irrfValor: 0,
    dasPercentual: 6,
    dasValor: 900,
    convenio: 300,
    outrosCustos: 0,
    provFgts: 640,
    provMultaFgts: 256,
    provInssAdicional: 880,
    provIR: 900,
    provDecimoTerceiro: 1250,
    reservaEmergencia: 500
  });

  // Auto-update 13º salário when salário bruto changes
  useEffect(() => {
    setCltData(prev => ({
      ...prev,
      decimoTerceiroBruto: prev.salarioBruto
    }));
  }, [cltData.salarioBruto]);

  // Auto-update férias PJ when valor mensal changes
  useEffect(() => {
    setPjData(prev => ({
      ...prev,
      feriasValorBruto: prev.valorMensal
    }));
  }, [pjData.valorMensal]);

  // Auto-update INSS PJ when pró-labore changes
  useEffect(() => {
    setPjData(prev => ({
      ...prev,
      inssValor: (prev.proLabore * prev.inssPercentual) / 100
    }));
  }, [pjData.proLabore, pjData.inssPercentual]);

  // Auto-update DAS when valor mensal changes
  useEffect(() => {
    setPjData(prev => ({
      ...prev,
      dasValor: (prev.valorMensal * prev.dasPercentual) / 100
    }));
  }, [pjData.valorMensal, pjData.dasPercentual]);

  const resultados = useMemo(() => {
    // Cálculos CLT
    const totalDescontosCLT = cltData.inssValor + cltData.irrfValor + cltData.planoSaude + cltData.gympass + cltData.outrosDescontos;
    const salarioLiquido = cltData.salarioBruto - totalDescontosCLT;
    const fgtsAnual = cltData.salarioBruto * 12 * 0.08;
    const fgtsMensal = fgtsAnual / 12;
    const multaFGTS = fgtsAnual * 0.4;
    
    const feriasLiquidas = cltData.feriasValorBruto - cltData.inssValor - cltData.irrfValor;
    const decimoTerceiroLiquido = cltData.incluirDecimoTerceiro ? 
      (cltData.decimoTerceiroBruto - cltData.inssValor - cltData.irrfValor) : 0;

    const totalCompensationCLTMensal = salarioLiquido + cltData.vr + cltData.va + 
      (feriasLiquidas / 12) + (decimoTerceiroLiquido / 12) + fgtsMensal + (cltData.pprAnualLiquido / 12);
    const totalCompensationCLTAnual = (salarioLiquido * 12) + (cltData.vr * 12) + (cltData.va * 12) + 
      feriasLiquidas + decimoTerceiroLiquido + fgtsAnual + cltData.pprAnualLiquido;

    const valorDisponivelViverCLT = salarioLiquido + cltData.vr + cltData.va;
    const valorPorDiaCLT = valorDisponivelViverCLT / 30;

    // Cálculos PJ
    const totalImpostosPJ = pjData.inssValor + pjData.irrfValor + pjData.dasValor;
    const totalCustosPJ = totalImpostosPJ + pjData.custosContabilidade + pjData.convenio + pjData.outrosCustos;
    const liquidoPJMensal = pjData.valorMensal - totalCustosPJ;

    const feriasLiquidasPJ = pjData.feriasValorBruto - pjData.inssValor - pjData.irrfValor;
    const totalProvisionamentosPJ = pjData.provFgts + pjData.provMultaFgts + 
      pjData.provInssAdicional + pjData.provIR + pjData.provDecimoTerceiro + pjData.reservaEmergencia;

    const totalCompensationPJMensal = liquidoPJMensal + pjData.valeAlimentacao + 
      (feriasLiquidasPJ / 12) + (pjData.pprAnualLiquido / 12) - (totalProvisionamentosPJ);
    const totalCompensationPJAnual = (liquidoPJMensal * 12) + (pjData.valeAlimentacao * 12) + 
      feriasLiquidasPJ + pjData.pprAnualLiquido - (totalProvisionamentosPJ * 12);

    const valorDisponivelViverPJ = liquidoPJMensal + pjData.valeAlimentacao - totalProvisionamentosPJ;
    const valorPorDiaPJ = valorDisponivelViverPJ / 30;

    const valorMinimoPJ = totalCompensationCLTMensal + totalCustosPJ + totalProvisionamentosPJ - pjData.valeAlimentacao - (feriasLiquidasPJ / 12) - (pjData.pprAnualLiquido / 12);

    return {
      clt: {
        salarioBruto: cltData.salarioBruto,
        salarioLiquido,
        totalDescontos: totalDescontosCLT,
        fgtsMensal,
        fgtsAnual,
        multaFGTS,
        feriasLiquidas,
        decimoTerceiroLiquido,
        totalCompensationMensal: totalCompensationCLTMensal,
        totalCompensationAnual: totalCompensationCLTAnual,
        valorDisponivelViver: valorDisponivelViverCLT,
        valorPorDia: valorPorDiaCLT,
        totalImpostosMensal: totalDescontosCLT,
        totalImpostosAnual: totalDescontosCLT * 12
      },
      pj: {
        brutoMensal: pjData.valorMensal,
        liquidoMensal: liquidoPJMensal,
        feriasLiquidas: feriasLiquidasPJ,
        totalProvisionamentos: totalProvisionamentosPJ,
        totalCompensationMensal: totalCompensationPJMensal,
        totalCompensationAnual: totalCompensationPJAnual,
        valorDisponivelViver: valorDisponivelViverPJ,
        valorPorDia: valorPorDiaPJ,
        totalImpostosMensal: totalImpostosPJ,
        totalImpostosAnual: totalImpostosPJ * 12,
        totalCustosMensal: totalCustosPJ + totalProvisionamentosPJ,
        totalCustosAnual: (totalCustosPJ * 12) + (totalProvisionamentosPJ * 12)
      },
      comparacao: {
        diferencaCompensationMensal: totalCompensationPJMensal - totalCompensationCLTMensal,
        diferencaCompensationAnual: totalCompensationPJAnual - totalCompensationCLTAnual,
        diferencaDisponivelViver: valorDisponivelViverPJ - valorDisponivelViverCLT,
        diferencaPorDia: valorPorDiaPJ - valorPorDiaCLT,
        percentualCompensationMensal: ((totalCompensationPJMensal - totalCompensationCLTMensal) / totalCompensationCLTMensal) * 100,
        percentualCompensationAnual: ((totalCompensationPJAnual - totalCompensationCLTAnual) / totalCompensationCLTAnual) * 100,
        percentualDisponivelViver: ((valorDisponivelViverPJ - valorDisponivelViverCLT) / valorDisponivelViverCLT) * 100,
        percentualPorDia: ((valorPorDiaPJ - valorPorDiaCLT) / valorPorDiaCLT) * 100,
        valorMinimoPJ
      }
    };
  }, [cltData, pjData]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  const toggleDetails = (key) => {
    setExpandedDetails(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const ResultCard = ({ title, value, subtitle, className = "" }) => (
    <div className={`bg-white p-4 rounded-lg shadow-sm ${className}`}>
      <div className="text-sm text-gray-600 mb-1">{title}</div>
      <div className="text-lg font-bold text-gray-800">{formatCurrency(value)}</div>
      {subtitle && <div className="text-xs text-gray-500 mt-1">{subtitle}</div>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
            <Calculator className="w-10 h-10 text-blue-600" />
            Calculadora CLT vs PJ - Análise Completa
          </h1>
          <p className="text-gray-600 text-lg">Análise Detalhada de Total Compensation e Disponibilidade Financeira</p>
        </div>

        <div className="flex flex-wrap justify-center mb-8">
          {[
            { id: 'clt', label: 'CLT', icon: Wallet },
            { id: 'pj', label: 'PJ', icon: DollarSign },
            { id: 'comparativo', label: 'Comparativo', icon: BarChart3 }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-6 py-3 mx-1 mb-2 rounded-lg font-medium transition-all ${
                activeTab === id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-blue-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          ))}
        </div>

        {/* CLT Tab */}
        {activeTab === 'clt' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Dados Básicos CLT */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-blue-800 mb-4">Dados Básicos CLT</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Salário Bruto Mensal</label>
                    <input
                      type="number"
                      value={cltData.salarioBruto}
                      onChange={(e) => setCltData({...cltData, salarioBruto: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Vale Refeição</label>
                      <input
                        type="number"
                        value={cltData.vr}
                        onChange={(e) => setCltData({...cltData, vr: Number(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Vale Alimentação</label>
                      <input
                        type="number"
                        value={cltData.va}
                        onChange={(e) => setCltData({...cltData, va: Number(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">PPR Anual Líquido</label>
                    <input
                      type="number"
                      value={cltData.pprAnualLiquido}
                      onChange={(e) => setCltData({...cltData, pprAnualLiquido: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dependentes IR</label>
                    <input
                      type="number"
                      value={cltData.dependentesIR}
                      onChange={(e) => setCltData({...cltData, dependentesIR: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Descontos CLT */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-blue-800 mb-4">Descontos</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">INSS</label>
                    <input
                      type="number"
                      value={cltData.inssValor}
                      onChange={(e) => setCltData({...cltData, inssValor: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">IRRF</label>
                    <input
                      type="number"
                      value={cltData.irrfValor}
                      onChange={(e) => setCltData({...cltData, irrfValor: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dedução Manual</label>
                    <input
                      type="number"
                      value={cltData.deducaoManual}
                      onChange={(e) => setCltData({...cltData, deducaoManual: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Valor adicional para deduzir"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Plano de Saúde</label>
                    <input
                      type="number"
                      value={cltData.planoSaude}
                      onChange={(e) => setCltData({...cltData, planoSaude: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gympass</label>
                    <input
                      type="number"
                      value={cltData.gympass}
                      onChange={(e) => setCltData({...cltData, gympass: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Outros Descontos</label>
                    <input
                      type="number"
                      value={cltData.outrosDescontos}
                      onChange={(e) => setCltData({...cltData, outrosDescontos: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Provisões CLT */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-blue-800 mb-4">Provisões (Bruto)</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Férias - % do Salário Bruto</label>
                    <input
                      type="number"
                      step="0.01"
                      value={cltData.feriasPercentualBruto}
                      onChange={(e) => {
                        const perc = Number(e.target.value);
                        setCltData({
                          ...cltData, 
                          feriasPercentualBruto: perc,
                          feriasValorBruto: (cltData.salarioBruto * perc) / 100
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="133.33 = salário + 1/3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Férias - Valor Bruto</label>
                    <input
                      type="number"
                      value={cltData.feriasValorBruto}
                      onChange={(e) => setCltData({...cltData, feriasValorBruto: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">13º Salário - Valor Bruto</label>
                    <input
                      type="number"
                      value={cltData.decimoTerceiroBruto}
                      onChange={(e) => setCltData({...cltData, decimoTerceiroBruto: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={cltData.incluirDecimoTerceiro}
                      onChange={(e) => setCltData({...cltData, incluirDecimoTerceiro: e.target.checked})}
                      className="mr-2"
                    />
                    <label className="text-sm font-medium text-gray-700">Incluir 13º Salário</label>
                  </div>
                </div>
              </div>
            </div>

            {/* Resultados CLT */}
            <div className="bg-blue-50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-blue-800 mb-4">Resultados CLT</h2>
              
              <div className="grid md:grid-cols-4 gap-4 mb-6">
                <ResultCard 
                  title="Salário Bruto" 
                  value={resultados.clt.salarioBruto}
                  subtitle="Valor real do mês"
                />
                <ResultCard 
                  title="Salário Líquido" 
                  value={resultados.clt.salarioLiquido}
                  subtitle="Valor real do mês"
                />
                <ResultCard 
                  title="Disponível para Viver" 
                  value={resultados.clt.valorDisponivelViver}
                  subtitle="Salário + Benefícios (30 dias)"
                />
                <ResultCard 
                  title="Valor por Dia" 
                  value={resultados.clt.valorPorDia}
                  subtitle="Base 30 dias"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Total Compensation Mensal */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Total Compensation Mensal</h3>
                    <button
                      onClick={() => toggleDetails('cltCompensationMensal')}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {expandedDetails['cltCompensationMensal'] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                  
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-800">{formatCurrency(resultados.clt.totalCompensationMensal)}</div>
                    <div className="text-sm text-blue-600">Total líquido mensal</div>
                  </div>

                  {expandedDetails['cltCompensationMensal'] && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="font-semibold text-blue-800 mb-3">Composição Mensal (Líquido)</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Salário Bruto:</span>
                          <span className="font-medium">{formatCurrency(resultados.clt.salarioBruto)}</span>
                        </div>
                        <div className="flex justify-between text-red-600">
                          <span>(-) Total Descontos:</span>
                          <span className="font-medium">-{formatCurrency(resultados.clt.totalDescontos)}</span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span>Salário Líquido:</span>
                          <span className="font-medium">{formatCurrency(resultados.clt.salarioLiquido)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Vale Refeição:</span>
                          <span className="font-medium">{formatCurrency(cltData.vr)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Vale Alimentação:</span>
                          <span className="font-medium">{formatCurrency(cltData.va)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Férias (1/12):</span>
                          <span className="font-medium">{formatCurrency(resultados.clt.feriasLiquidas / 12)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>13º Salário (1/12):</span>
                          <span className="font-medium">{formatCurrency(resultados.clt.decimoTerceiroLiquido / 12)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>FGTS (1/12):</span>
                          <span className="font-medium">{formatCurrency(resultados.clt.fgtsMensal)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>PPR (1/12):</span>
                          <span className="font-medium">{formatCurrency(cltData.pprAnualLiquido / 12)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Total Compensation Anual */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Total Compensation Anual</h3>
                    <button
                      onClick={() => toggleDetails('cltCompensationAnual')}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {expandedDetails['cltCompensationAnual'] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                  
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-800">{formatCurrency(resultados.clt.totalCompensationAnual)}</div>
                    <div className="text-sm text-blue-600">Total líquido anual</div>
                  </div>

                  {expandedDetails['cltCompensationAnual'] && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="font-semibold text-blue-800 mb-3">Composição Anual (Líquido)</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Salário Bruto × 12:</span>
                          <span className="font-medium">{formatCurrency(resultados.clt.salarioBruto * 12)}</span>
                        </div>
                        <div className="flex justify-between text-red-600">
                          <span>(-) Total Descontos × 12:</span>
                          <span className="font-medium">-{formatCurrency(resultados.clt.totalDescontos * 12)}</span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span>Salário Líquido × 12:</span>
                          <span className="font-medium">{formatCurrency(resultados.clt.salarioLiquido * 12)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Vale Refeição × 12:</span>
                          <span className="font-medium">{formatCurrency(cltData.vr * 12)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Vale Alimentação × 12:</span>
                          <span className="font-medium">{formatCurrency(cltData.va * 12)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Férias Líquidas:</span>
                          <span className="font-medium">{formatCurrency(resultados.clt.feriasLiquidas)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>13º Salário Líquido:</span>
                          <span className="font-medium">{formatCurrency(resultados.clt.decimoTerceiroLiquido)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>FGTS Anual:</span>
                          <span className="font-medium">{formatCurrency(resultados.clt.fgtsAnual)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>PPR Anual:</span>
                          <span className="font-medium">{formatCurrency(cltData.pprAnualLiquido)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PJ Tab */}
        {activeTab === 'pj' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Remuneração PJ */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-purple-800 mb-4">Remuneração e Benefícios</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Valor Mensal Proposto</label>
                    <input
                      type="number"
                      value={pjData.valorMensal}
                      onChange={(e) => setPjData({...pjData, valorMensal: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Regime Tributário</label>
                    <input
                      type="text"
                      value={pjData.regimeTexto}
                      onChange={(e) => setPjData({...pjData, regimeTexto: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Ex: Simples Nacional - 6%"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vale Alimentação</label>
                    <input
                      type="number"
                      value={pjData.valeAlimentacao}
                      onChange={(e) => setPjData({...pjData, valeAlimentacao: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Férias (Valor Bruto)</label>
                    <input
                      type="number"
                      value={pjData.feriasValorBruto}
                      onChange={(e) => setPjData({...pjData, feriasValorBruto: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">PPR Anual Líquido</label>
                    <input
                      type="number"
                      value={pjData.pprAnualLiquido}
                      onChange={(e) => setPjData({...pjData, pprAnualLiquido: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pró-labore</label>
                    <input
                      type="number"
                      value={pjData.proLabore}
                      onChange={(e) => setPjData({...pjData, proLabore: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Impostos PJ */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-purple-800 mb-4">Impostos e Taxas</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">INSS (%)</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        step="0.01"
                        value={pjData.inssPercentual}
                        onChange={(e) => setPjData({...pjData, inssPercentual: Number(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <input
                        type="number"
                        value={pjData.inssValor}
                        onChange={(e) => setPjData({...pjData, inssValor: Number(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Valor"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">IRRF</label>
                    <input
                      type="number"
                      value={pjData.irrfValor}
                      onChange={(e) => setPjData({...pjData, irrfValor: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Valor fixo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">DAS (%)</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        step="0.01"
                        value={pjData.dasPercentual}
                        onChange={(e) => setPjData({...pjData, dasPercentual: Number(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <input
                        type="number"
                        value={pjData.dasValor}
                        onChange={(e) => setPjData({...pjData, dasValor: Number(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Valor"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Custos e Provisionamentos PJ */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-purple-800 mb-4">Custos e Provisionamentos</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Custo Contabilidade</label>
                    <input
                      type="number"
                      value={pjData.custosContabilidade}
                      onChange={(e) => setPjData({...pjData, custosContabilidade: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Convênio</label>
                    <input
                      type="number"
                      value={pjData.convenio}
                      onChange={(e) => setPjData({...pjData, convenio: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Outros Custos</label>
                    <input
                      type="number"
                      value={pjData.outrosCustos}
                      onChange={(e) => setPjData({...pjData, outrosCustos: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Provisão FGTS</label>
                      <input
                        type="number"
                        value={pjData.provFgts}
                        onChange={(e) => setPjData({...pjData, provFgts: Number(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Provisão Multa FGTS</label>
                      <input
                        type="number"
                        value={pjData.provMultaFgts}
                        onChange={(e) => setPjData({...pjData, provMultaFgts: Number(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Provisão INSS Adicional</label>
                      <input
                        type="number"
                        value={pjData.provInssAdicional}
                        onChange={(e) => setPjData({...pjData, provInssAdicional: Number(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Provisão IR</label>
                      <input
                        type="number"
                        value={pjData.provIR}
                        onChange={(e) => setPjData({...pjData, provIR: Number(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Provisão 13º Salário</label>
                      <input
                        type="number"
                        value={pjData.provDecimoTerceiro}
                        onChange={(e) => setPjData({...pjData, provDecimoTerceiro: Number(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Reserva de Emergência</label>
                      <input
                        type="number"
                        value={pjData.reservaEmergencia}
                        onChange={(e) => setPjData({...pjData, reservaEmergencia: Number(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Resultados PJ */}
            <div className="bg-purple-50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-purple-800 mb-4">Resultados PJ</h2>
              
              <div className="grid md:grid-cols-4 gap-4 mb-6">
                <ResultCard 
                  title="Bruto Mensal" 
                  value={resultados.pj.brutoMensal}
                  subtitle="Valor real do mês"
                />
                <ResultCard 
                  title="Líquido Mensal" 
                  value={resultados.pj.liquidoMensal}
                  subtitle="Valor real do mês"
                />
                <ResultCard 
                  title="Disponível para Viver" 
                  value={resultados.pj.valorDisponivelViver}
                  subtitle="Líquido + Benefícios - Provisionamentos"
                />
                <ResultCard 
                  title="Valor por Dia" 
                  value={resultados.pj.valorPorDia}
                  subtitle="Base 30 dias"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Total Compensation Mensal */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Total Compensation Mensal</h3>
                    <button
                      onClick={() => toggleDetails('pjCompensationMensal')}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {expandedDetails['pjCompensationMensal'] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-800">{formatCurrency(resultados.pj.totalCompensationMensal)}</div>
                    <div className="text-sm text-purple-600">Total líquido mensal</div>
                  </div>

                  {expandedDetails['pjCompensationMensal'] && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="font-semibold text-purple-800 mb-3">Composição Mensal (Líquido)</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Valor Bruto:</span>
                          <span className="font-medium">{formatCurrency(resultados.pj.brutoMensal)}</span>
                        </div>
                        <div className="flex justify-between text-red-600">
                          <span>(-) Impostos e Custos:</span>
                          <span className="font-medium">-{formatCurrency(pjData.inssValor + pjData.irrfValor + pjData.dasValor + pjData.custosContabilidade + pjData.convenio + pjData.outrosCustos)}</span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span>Valor Líquido:</span>
                          <span className="font-medium">{formatCurrency(resultados.pj.liquidoMensal)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Vale Alimentação:</span>
                          <span className="font-medium">{formatCurrency(pjData.valeAlimentacao)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Férias (1/12):</span>
                          <span className="font-medium">{formatCurrency(resultados.pj.feriasLiquidas / 12)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>PPR (1/12):</span>
                          <span className="font-medium">{formatCurrency(pjData.pprAnualLiquido / 12)}</span>
                        </div>
                        <div className="flex justify-between text-red-600">
                          <span>(-) Provisionamentos:</span>
                          <span className="font-medium">-{formatCurrency(resultados.pj.totalProvisionamentos)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Total Compensation Anual */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Total Compensation Anual</h3>
                    <button
                      onClick={() => toggleDetails('pjCompensationAnual')}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {expandedDetails['pjCompensationAnual'] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-800">{formatCurrency(resultados.pj.totalCompensationAnual)}</div>
                    <div className="text-sm text-purple-600">Total líquido anual</div>
                  </div>

                  {expandedDetails['pjCompensationAnual'] && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="font-semibold text-purple-800 mb-3">Composição Anual (Líquido)</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Valor Bruto × 12:</span>
                          <span className="font-medium">{formatCurrency(resultados.pj.brutoMensal * 12)}</span>
                        </div>
                        <div className="flex justify-between text-red-600">
                          <span>(-) Impostos e Custos × 12:</span>
                          <span className="font-medium">-{formatCurrency((pjData.inssValor + pjData.irrfValor + pjData.dasValor + pjData.custosContabilidade + pjData.convenio + pjData.outrosCustos) * 12)}</span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span>Valor Líquido × 12:</span>
                          <span className="font-medium">{formatCurrency(resultados.pj.liquidoMensal * 12)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Vale Alimentação × 12:</span>
                          <span className="font-medium">{formatCurrency(pjData.valeAlimentacao * 12)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Férias Líquidas:</span>
                          <span className="font-medium">{formatCurrency(resultados.pj.feriasLiquidas)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>PPR Anual:</span>
                          <span className="font-medium">{formatCurrency(pjData.pprAnualLiquido)}</span>
                        </div>
                        <div className="flex justify-between text-red-600">
                          <span>(-) Provisionamentos × 12:</span>
                          <span className="font-medium">-{formatCurrency(resultados.pj.totalProvisionamentos * 12)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Comparativo Tab */}
        {activeTab === 'comparativo' && (
          <div className="space-y-6">
            {/* Simulação Rápida */}
            <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-xl p-6 text-white">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                🧮 Simulação Rápida
              </h2>
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium">Teste um valor PJ:</label>
                <input
                  type="number"
                  value={simulacaoRapida}
                  onChange={(e) => setSimulacaoRapida(Number(e.target.value))}
                  className="px-3 py-2 rounded-lg text-gray-800 w-32"
                />
                <button
                  onClick={() => setPjData({...pjData, valorMensal: simulacaoRapida})}
                  className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  Aplicar
                </button>
              </div>
            </div>

            {/* Comparações */}
            <div className="space-y-6">
              {/* Valor Disponível para Viver */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Valor Disponível para Viver (30 dias)</h3>
                    <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                      resultados.comparacao.diferencaDisponivelViver > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {resultados.comparacao.diferencaDisponivelViver > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      {resultados.comparacao.percentualDisponivelViver > 0 ? '+' : ''}{resultados.comparacao.percentualDisponivelViver.toFixed(1)}%
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-sm text-blue-600 mb-1">CLT</div>
                      <div className="text-lg font-bold text-blue-800">{formatCurrency(resultados.clt.valorDisponivelViver)}</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-sm text-purple-600 mb-1">PJ</div>
                      <div className="text-lg font-bold text-purple-800">{formatCurrency(resultados.pj.valorDisponivelViver)}</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Diferença</div>
                      <div className={`text-lg font-bold ${resultados.comparacao.diferencaDisponivelViver > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {resultados.comparacao.diferencaDisponivelViver > 0 ? '+' : ''}{formatCurrency(resultados.comparacao.diferencaDisponivelViver)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Compensation Mensal */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Total Compensation Mensal</h3>
                    <div className="flex items-center gap-2">
                      <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                        resultados.comparacao.diferencaCompensationMensal > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {resultados.comparacao.diferencaCompensationMensal > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {resultados.comparacao.percentualCompensationMensal > 0 ? '+' : ''}{resultados.comparacao.percentualCompensationMensal.toFixed(1)}%
                      </div>
                      <button
                        onClick={() => toggleDetails('compensationMensal')}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        {expandedDetails['compensationMensal'] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-sm text-blue-600 mb-1">CLT</div>
                      <div className="text-lg font-bold text-blue-800">{formatCurrency(resultados.clt.totalCompensationMensal)}</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-sm text-purple-600 mb-1">PJ</div>
                      <div className="text-lg font-bold text-purple-800">{formatCurrency(resultados.pj.totalCompensationMensal)}</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Diferença</div>
                      <div className={`text-lg font-bold ${resultados.comparacao.diferencaCompensationMensal > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {resultados.comparacao.diferencaCompensationMensal > 0 ? '+' : ''}{formatCurrency(resultados.comparacao.diferencaCompensationMensal)}
                      </div>
                    </div>
                  </div>
                </div>

                {expandedDetails['compensationMensal'] && (
                  <div className="border-t bg-gray-50 p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-blue-800 mb-3">Composição CLT Mensal</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Salário Bruto:</span>
                            <span className="font-medium">{formatCurrency(resultados.clt.salarioBruto)}</span>
                          </div>
                          <div className="flex justify-between text-red-600">
                            <span>(-) INSS:</span>
                            <span className="font-medium">-{formatCurrency(cltData.inssValor)}</span>
                          </div>
                          <div className="flex justify-between text-red-600">
                            <span>(-) IRRF:</span>
                            <span className="font-medium">-{formatCurrency(cltData.irrfValor)}</span>
                          </div>
                          <div className="flex justify-between text-red-600">
                            <span>(-) Plano Saúde:</span>
                            <span className="font-medium">-{formatCurrency(cltData.planoSaude)}</span>
                          </div>
                          <div className="flex justify-between text-red-600">
                            <span>(-) Gympass:</span>
                            <span className="font-medium">-{formatCurrency(cltData.gympass)}</span>
                          </div>
                          <div className="flex justify-between text-red-600">
                            <span>(-) Outros Descontos:</span>
                            <span className="font-medium">-{formatCurrency(cltData.outrosDescontos)}</span>
                          </div>
                          <div className="flex justify-between border-t pt-2">
                            <span>Salário Líquido:</span>
                            <span className="font-medium">{formatCurrency(resultados.clt.salarioLiquido)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Vale Refeição:</span>
                            <span className="font-medium">{formatCurrency(cltData.vr)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Vale Alimentação:</span>
                            <span className="font-medium">{formatCurrency(cltData.va)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Férias (1/12):</span>
                            <span className="font-medium">{formatCurrency(resultados.clt.feriasLiquidas / 12)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>13º Salário (1/12):</span>
                            <span className="font-medium">{formatCurrency(resultados.clt.decimoTerceiroLiquido / 12)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>FGTS (1/12):</span>
                            <span className="font-medium">{formatCurrency(resultados.clt.fgtsMensal)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>PPR (1/12):</span>
                            <span className="font-medium">{formatCurrency(cltData.pprAnualLiquido / 12)}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-purple-800 mb-3">Composição PJ Mensal</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Valor Bruto:</span>
                            <span className="font-medium">{formatCurrency(resultados.pj.brutoMensal)}</span>
                          </div>
                          <div className="flex justify-between text-red-600">
                            <span>(-) INSS:</span>
                            <span className="font-medium">-{formatCurrency(pjData.inssValor)}</span>
                          </div>
                          <div className="flex justify-between text-red-600">
                            <span>(-) IRRF:</span>
                            <span className="font-medium">-{formatCurrency(pjData.irrfValor)}</span>
                          </div>
                          <div className="flex justify-between text-red-600">
                            <span>(-) DAS:</span>
                            <span className="font-medium">-{formatCurrency(pjData.dasValor)}</span>
                          </div>
                          <div className="flex justify-between text-red-600">
                            <span>(-) Contabilidade:</span>
                            <span className="font-medium">-{formatCurrency(pjData.custosContabilidade)}</span>
                          </div>
                          <div className="flex justify-between text-red-600">
                            <span>(-) Convênio:</span>
                            <span className="font-medium">-{formatCurrency(pjData.convenio)}</span>
                          </div>
                          <div className="flex justify-between text-red-600">
                            <span>(-) Outros Custos:</span>
                            <span className="font-medium">-{formatCurrency(pjData.outrosCustos)}</span>
                          </div>
                          <div className="flex justify-between border-t pt-2">
                            <span>Valor Líquido:</span>
                            <span className="font-medium">{formatCurrency(resultados.pj.liquidoMensal)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Vale Alimentação:</span>
                            <span className="font-medium">{formatCurrency(pjData.valeAlimentacao)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Férias (1/12):</span>
                            <span className="font-medium">{formatCurrency(resultados.pj.feriasLiquidas / 12)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>PPR (1/12):</span>
                            <span className="font-medium">{formatCurrency(pjData.pprAnualLiquido / 12)}</span>
                          </div>
                          <div className="flex justify-between text-red-600">
                            <span>(-) Prov. FGTS:</span>
                            <span className="font-medium">-{formatCurrency(pjData.provFgts)}</span>
                          </div>
                          <div className="flex justify-between text-red-600">
                            <span>(-) Prov. Multa FGTS:</span>
                            <span className="font-medium">-{formatCurrency(pjData.provMultaFgts)}</span>
                          </div>
                          <div className="flex justify-between text-red-600">
                            <span>(-) Prov. INSS Adic.:</span>
                            <span className="font-medium">-{formatCurrency(pjData.provInssAdicional)}</span>
                          </div>
                          <div className="flex justify-between text-red-600">
                            <span>(-) Prov. IR:</span>
                            <span className="font-medium">-{formatCurrency(pjData.provIR)}</span>
                          </div>
                          <div className="flex justify-between text-red-600">
                            <span>(-) Prov. 13º:</span>
                            <span className="font-medium">-{formatCurrency(pjData.provDecimoTerceiro)}</span>
                          </div>
                          <div className="flex justify-between text-red-600">
                            <span>(-) Reserva Emerg.:</span>
                            <span className="font-medium">-{formatCurrency(pjData.reservaEmergencia)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Total Compensation Anual */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Total Compensation Anual</h3>
                    <div className="flex items-center gap-2">
                      <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                        resultados.comparacao.diferencaCompensationAnual > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {resultados.comparacao.diferencaCompensationAnual > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {resultados.comparacao.percentualCompensationAnual > 0 ? '+' : ''}{resultados.comparacao.percentualCompensationAnual.toFixed(1)}%
                      </div>
                      <button
                        onClick={() => toggleDetails('compensationAnual')}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        {expandedDetails['compensationAnual'] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-sm text-blue-600 mb-1">CLT</div>
                      <div className="text-lg font-bold text-blue-800">{formatCurrency(resultados.clt.totalCompensationAnual)}</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-sm text-purple-600 mb-1">PJ</div>
                      <div className="text-lg font-bold text-purple-800">{formatCurrency(resultados.pj.totalCompensationAnual)}</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Diferença</div>
                      <div className={`text-lg font-bold ${resultados.comparacao.diferencaCompensationAnual > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {resultados.comparacao.diferencaCompensationAnual > 0 ? '+' : ''}{formatCurrency(resultados.comparacao.diferencaCompensationAnual)}
                      </div>
                    </div>
                  </div>
                </div>

                {expandedDetails['compensationAnual'] && (
                  <div className="border-t bg-gray-50 p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-blue-800 mb-3">Composição CLT Anual</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Salário Bruto × 12:</span>
                            <span className="font-medium">{formatCurrency(resultados.clt.salarioBruto * 12)}</span>
                          </div>
                          <div className="flex justify-between text-red-600">
                            <span>(-) Total Descontos × 12:</span>
                            <span className="font-medium">-{formatCurrency(resultados.clt.totalDescontos * 12)}</span>
                          </div>
                          <div className="flex justify-between border-t pt-2">
                            <span>Salário Líquido × 12:</span>
                            <span className="font-medium">{formatCurrency(resultados.clt.salarioLiquido * 12)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Vale Refeição × 12:</span>
                            <span className="font-medium">{formatCurrency(cltData.vr * 12)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Vale Alimentação × 12:</span>
                            <span className="font-medium">{formatCurrency(cltData.va * 12)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Férias Líquidas:</span>
                            <span className="font-medium">{formatCurrency(resultados.clt.feriasLiquidas)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>13º Salário Líquido:</span>
                            <span className="font-medium">{formatCurrency(resultados.clt.decimoTerceiroLiquido)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>FGTS Anual:</span>
                            <span className="font-medium">{formatCurrency(resultados.clt.fgtsAnual)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>PPR Anual:</span>
                            <span className="font-medium">{formatCurrency(cltData.pprAnualLiquido)}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-purple-800 mb-3">Composição PJ Anual</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Valor Bruto × 12:</span>
                            <span className="font-medium">{formatCurrency(resultados.pj.brutoMensal * 12)}</span>
                          </div>
                          <div className="flex justify-between text-red-600">
                            <span>(-) Impostos e Custos × 12:</span>
                            <span className="font-medium">-{formatCurrency((pjData.inssValor + pjData.irrfValor + pjData.dasValor + pjData.custosContabilidade + pjData.convenio + pjData.outrosCustos) * 12)}</span>
                          </div>
                          <div className="flex justify-between border-t pt-2">
                            <span>Valor Líquido × 12:</span>
                            <span className="font-medium">{formatCurrency(resultados.pj.liquidoMensal * 12)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Vale Alimentação × 12:</span>
                            <span className="font-medium">{formatCurrency(pjData.valeAlimentacao * 12)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Férias Líquidas:</span>
                            <span className="font-medium">{formatCurrency(resultados.pj.feriasLiquidas)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>PPR Anual:</span>
                            <span className="font-medium">{formatCurrency(pjData.pprAnualLiquido)}</span>
                          </div>
                          <div className="flex justify-between text-red-600">
                            <span>(-) Provisionamentos × 12:</span>
                            <span className="font-medium">-{formatCurrency(resultados.pj.totalProvisionamentos * 12)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Total de Custos */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Total de Custos Anuais</h3>
                    <div className="flex items-center gap-2">
                      <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                        (resultados.pj.totalCustosAnual - resultados.clt.totalImpostosAnual) > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {(resultados.pj.totalCustosAnual - resultados.clt.totalImpostosAnual) > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {((resultados.pj.totalCustosAnual - resultados.clt.totalImpostosAnual) / resultados.clt.totalImpostosAnual * 100).toFixed(1)}%
                      </div>
                      <button
                        onClick={() => toggleDetails('custosAnual')}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        {expandedDetails['custosAnual'] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-sm text-blue-600 mb-1">CLT</div>
                      <div className="text-lg font-bold text-blue-800">{formatCurrency(resultados.clt.totalImpostosAnual)}</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-sm text-purple-600 mb-1">PJ</div>
                      <div className="text-lg font-bold text-purple-800">{formatCurrency(resultados.pj.totalCustosAnual)}</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Diferença</div>
                      <div className={`text-lg font-bold ${(resultados.pj.totalCustosAnual - resultados.clt.totalImpostosAnual) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {(resultados.pj.totalCustosAnual - resultados.clt.totalImpostosAnual) > 0 ? '+' : ''}{formatCurrency(resultados.pj.totalCustosAnual - resultados.clt.totalImpostosAnual)}
                      </div>
                    </div>
                  </div>
                </div>

                {expandedDetails['custosAnual'] && (
                  <div className="border-t bg-gray-50 p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-blue-800 mb-3">Custos CLT Anual</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>INSS × 12:</span>
                            <span className="font-medium">{formatCurrency(cltData.inssValor * 12)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>IRRF × 12:</span>
                            <span className="font-medium">{formatCurrency(cltData.irrfValor * 12)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Plano Saúde × 12:</span>
                            <span className="font-medium">{formatCurrency(cltData.planoSaude * 12)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Gympass × 12:</span>
                            <span className="font-medium">{formatCurrency(cltData.gympass * 12)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Outros Descontos × 12:</span>
                            <span className="font-medium">{formatCurrency(cltData.outrosDescontos * 12)}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-purple-800 mb-3">Custos PJ Anual</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>INSS × 12:</span>
                            <span className="font-medium">{formatCurrency(pjData.inssValor * 12)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>IRRF × 12:</span>
                            <span className="font-medium">{formatCurrency(pjData.irrfValor * 12)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>DAS × 12:</span>
                            <span className="font-medium">{formatCurrency(pjData.dasValor * 12)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Contabilidade × 12:</span>
                            <span className="font-medium">{formatCurrency(pjData.custosContabilidade * 12)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Convênio × 12:</span>
                            <span className="font-medium">{formatCurrency(pjData.convenio * 12)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Outros Custos × 12:</span>
                            <span className="font-medium">{formatCurrency(pjData.outrosCustos * 12)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Prov. FGTS × 12:</span>
                            <span className="font-medium">{formatCurrency(pjData.provFgts * 12)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Prov. Multa FGTS × 12:</span>
                            <span className="font-medium">{formatCurrency(pjData.provMultaFgts * 12)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Prov. INSS Adic. × 12:</span>
                            <span className="font-medium">{formatCurrency(pjData.provInssAdicional * 12)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Prov. IR × 12:</span>
                            <span className="font-medium">{formatCurrency(pjData.provIR * 12)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Prov. 13º × 12:</span>
                            <span className="font-medium">{formatCurrency(pjData.provDecimoTerceiro * 12)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Reserva Emerg. × 12:</span>
                            <span className="font-medium">{formatCurrency(pjData.reservaEmergencia * 12)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Resumo Executivo */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-6 text-center">🎯 Resumo Executivo da Análise</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold border-b border-white/30 pb-2">📊 Total Compensation</h3>
                  <div>
                    <p className="text-sm opacity-90">Mensal:</p>
                    <p className={`text-lg font-bold ${resultados.comparacao.diferencaCompensationMensal > 0 ? 'text-green-300' : 'text-red-300'}`}>
                      PJ {resultados.comparacao.diferencaCompensationMensal > 0 ? 'paga' : 'perde'} {formatCurrency(Math.abs(resultados.comparacao.diferencaCompensationMensal))}/mês
                    </p>
                    <p className="text-xs opacity-75">({Math.abs(resultados.comparacao.percentualCompensationMensal).toFixed(1)}% {resultados.comparacao.diferencaCompensationMensal > 0 ? 'mais' : 'menos'})</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-90">Anual:</p>
                    <p className={`text-lg font-bold ${resultados.comparacao.diferencaCompensationAnual > 0 ? 'text-green-300' : 'text-red-300'}`}>
                      PJ {resultados.comparacao.diferencaCompensationAnual > 0 ? 'paga' : 'perde'} {formatCurrency(Math.abs(resultados.comparacao.diferencaCompensationAnual))}/ano
                    </p>
                    <p className="text-xs opacity-75">({Math.abs(resultados.comparacao.percentualCompensationAnual).toFixed(1)}% {resultados.comparacao.diferencaCompensationAnual > 0 ? 'mais' : 'menos'})</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold border-b border-white/30 pb-2">💰 Dinheiro Real na Conta</h3>
                  <div>
                    <p className="text-sm opacity-90">Disponível Mensal:</p>
                    <p className={`text-lg font-bold ${resultados.comparacao.diferencaDisponivelViver > 0 ? 'text-green-300' : 'text-red-300'}`}>
                      PJ tem {formatCurrency(Math.abs(resultados.comparacao.diferencaDisponivelViver))} {resultados.comparacao.diferencaDisponivelViver > 0 ? 'a mais' : 'a menos'}
                    </p>
                    <p className="text-xs opacity-75">({Math.abs(resultados.comparacao.percentualDisponivelViver).toFixed(1)}% {resultados.comparacao.diferencaDisponivelViver > 0 ? 'mais' : 'menos'})</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-90">Por Dia (30 dias):</p>
                    <p className={`text-lg font-bold ${resultados.comparacao.diferencaPorDia > 0 ? 'text-green-300' : 'text-red-300'}`}>
                      {resultados.comparacao.diferencaPorDia > 0 ? '+' : ''}{formatCurrency(resultados.comparacao.diferencaPorDia)}/dia
                    </p>
                    <p className="text-xs opacity-75">({Math.abs(resultados.comparacao.percentualPorDia).toFixed(1)}% {resultados.comparacao.diferencaPorDia > 0 ? 'mais' : 'menos'})</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/30">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="text-center">
                    <h4 className="text-lg font-semibold mb-2">💡 Recomendação</h4>
                    <p className="text-lg font-bold">
                      {resultados.comparacao.diferencaCompensationAnual > 0 && resultados.comparacao.diferencaDisponivelViver > 0 
                        ? "✅ PJ é vantajoso em ambas as perspectivas!"
                        : resultados.comparacao.diferencaCompensationAnual < 0 && resultados.comparacao.diferencaDisponivelViver < 0
                        ? "❌ CLT é melhor em ambas as perspectivas."
                        : "⚖️ Análise mista - considere suas prioridades."}
                    </p>
                  </div>
                  <div className="text-center">
                    <h4 className="text-lg font-semibold mb-2">📈 Valor Mínimo PJ</h4>
                    <p className="text-sm opacity-90">Para equivalência:</p>
                    <p className="text-xl font-bold text-yellow-300">{formatCurrency(resultados.comparacao.valorMinimoPJ)}/mês</p>
                    <p className="text-xs opacity-75">
                      Ganho mensal: {resultados.comparacao.percentualCompensationMensal.toFixed(1)}% | 
                      Ganho anual: {resultados.comparacao.percentualCompensationAnual.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CLTPJCalculator;
