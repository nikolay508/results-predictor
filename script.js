const calculatorInputs = {
  revenue: document.querySelector("#revenue-target"),
  averageOrderValue: document.querySelector("#average-order-value"),
  leadResponseRate: document.querySelector("#lead-response-rate"),
  prospectResponseRate: document.querySelector("#prospect-response-rate"),
  customerChurnRate: document.querySelector("#customer-churn-rate"),
  variableCost: document.querySelector("#variable-cost"),
  fixedCosts: document.querySelector("#fixed-costs"),
  startingCost: document.querySelector("#starting-cost"),
  periods: document.querySelector("#period-count"),
};

const resultElements = {
  clients: document.querySelector("#clients-result"),
  leads: document.querySelector("#leads-result"),
  prospects: document.querySelector("#prospects-result"),
  summaryClients: document.querySelector("#summary-clients"),
  summaryLeads: document.querySelector("#summary-leads"),
  summaryProspects: document.querySelector("#summary-prospects"),
  summaryRevenue: document.querySelector("#summary-revenue"),
  summaryExpenses: document.querySelector("#summary-expenses"),
  summaryProfit: document.querySelector("#summary-profit"),
  summaryRetention: document.querySelector("#summary-retention"),
  summaryRoi: document.querySelector("#summary-roi"),
};

const outputElements = {
  revenue: document.querySelector("#revenue-target-output"),
  averageOrderValue: document.querySelector("#average-order-value-output"),
  leadResponseRate: document.querySelector("#lead-response-rate-output"),
  prospectResponseRate: document.querySelector("#prospect-response-rate-output"),
  customerChurnRate: document.querySelector("#customer-churn-rate-output"),
  variableCost: document.querySelector("#variable-cost-output"),
  fixedCosts: document.querySelector("#fixed-costs-output"),
  startingCost: document.querySelector("#starting-cost-output"),
};

const numberFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });
const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

function readPositiveNumber(input) {
  const value = Number(input.value);
  return Number.isFinite(value) && value > 0 ? value : 0;
}

function calculateCampaign({ revenue, averageOrderValue, leadResponseRate, prospectResponseRate }) {
  const clients = averageOrderValue > 0 ? revenue / averageOrderValue : 0;
  const leads = leadResponseRate > 0 ? clients * 100 / leadResponseRate : 0;
  const prospects = prospectResponseRate > 0 ? leads * 100 / prospectResponseRate : 0;

  return { clients, leads, prospects };
}

function calculateExpenses({ clients, revenue, customerChurnRate, variableCost, fixedCosts, startingCost, periods }) {
  const churnMultiplier = Math.pow(1 - customerChurnRate / 100, periods);
  const projectedCustomers = clients * churnMultiplier;
  const expenses = startingCost + fixedCosts + projectedCustomers * variableCost;
  const profit = revenue * churnMultiplier - expenses;
  const roi = expenses > 0 ? profit / expenses * 100 : 0;

  return { projectedCustomers, expenses, profit, roi, retention: periods * churnMultiplier };
}

function updateCalculator() {
  const values = {
    revenue: readPositiveNumber(calculatorInputs.revenue),
    averageOrderValue: readPositiveNumber(calculatorInputs.averageOrderValue),
    leadResponseRate: readPositiveNumber(calculatorInputs.leadResponseRate),
    prospectResponseRate: readPositiveNumber(calculatorInputs.prospectResponseRate),
    customerChurnRate: readPositiveNumber(calculatorInputs.customerChurnRate),
    variableCost: readPositiveNumber(calculatorInputs.variableCost),
    fixedCosts: readPositiveNumber(calculatorInputs.fixedCosts),
    startingCost: readPositiveNumber(calculatorInputs.startingCost),
    periods: Number(calculatorInputs.periods.value) || 0,
  };
  const results = calculateCampaign(values);
  const expenses = calculateExpenses({ ...values, clients: results.clients });

  outputElements.revenue.textContent = currencyFormatter.format(values.revenue);
  outputElements.averageOrderValue.textContent = currencyFormatter.format(values.averageOrderValue);
  outputElements.leadResponseRate.textContent = `${numberFormatter.format(values.leadResponseRate)}%`;
  outputElements.prospectResponseRate.textContent = `${numberFormatter.format(values.prospectResponseRate)}%`;
  outputElements.customerChurnRate.textContent = `${numberFormatter.format(values.customerChurnRate)}%`;
  outputElements.variableCost.textContent = currencyFormatter.format(values.variableCost);
  outputElements.fixedCosts.textContent = currencyFormatter.format(values.fixedCosts);
  outputElements.startingCost.textContent = currencyFormatter.format(values.startingCost);

  resultElements.clients.textContent = numberFormatter.format(results.clients);
  resultElements.leads.textContent = numberFormatter.format(results.leads);
  resultElements.prospects.textContent = numberFormatter.format(results.prospects);
  resultElements.summaryClients.textContent = numberFormatter.format(expenses.projectedCustomers);
  resultElements.summaryLeads.textContent = numberFormatter.format(results.leads);
  resultElements.summaryProspects.textContent = numberFormatter.format(results.prospects);
  resultElements.summaryRevenue.textContent = currencyFormatter.format(values.revenue * Math.pow(1 - values.customerChurnRate / 100, values.periods));
  resultElements.summaryExpenses.textContent = currencyFormatter.format(expenses.expenses);
  resultElements.summaryProfit.textContent = currencyFormatter.format(expenses.profit);
  resultElements.summaryRetention.textContent = `${numberFormatter.format(expenses.retention)} weeks`;
  resultElements.summaryRoi.textContent = `${numberFormatter.format(expenses.roi)}%`;
}

Object.values(calculatorInputs).forEach((input) => input.addEventListener("input", updateCalculator));
updateCalculator();

window.calculateCampaign = calculateCampaign;
window.calculateExpenses = calculateExpenses;