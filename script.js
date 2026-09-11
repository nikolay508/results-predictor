const calculatorInputs = {
  revenue: document.querySelector("#revenue-target"),
  averageOrderValue: document.querySelector("#average-order-value"),
  leadResponseRate: document.querySelector("#lead-response-rate"),
  prospectResponseRate: document.querySelector("#prospect-response-rate"),
};

const resultElements = {
  clients: document.querySelector("#clients-result"),
  leads: document.querySelector("#leads-result"),
  prospects: document.querySelector("#prospects-result"),
  summaryClients: document.querySelector("#summary-clients"),
  summaryLeads: document.querySelector("#summary-leads"),
  summaryProspects: document.querySelector("#summary-prospects"),
};

const outputElements = {
  revenue: document.querySelector("#revenue-target-output"),
  averageOrderValue: document.querySelector("#average-order-value-output"),
  leadResponseRate: document.querySelector("#lead-response-rate-output"),
  prospectResponseRate: document.querySelector("#prospect-response-rate-output"),
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

function updateCalculator() {
  const values = {
    revenue: readPositiveNumber(calculatorInputs.revenue),
    averageOrderValue: readPositiveNumber(calculatorInputs.averageOrderValue),
    leadResponseRate: readPositiveNumber(calculatorInputs.leadResponseRate),
    prospectResponseRate: readPositiveNumber(calculatorInputs.prospectResponseRate),
  };
  const results = calculateCampaign(values);

  outputElements.revenue.textContent = currencyFormatter.format(values.revenue);
  outputElements.averageOrderValue.textContent = currencyFormatter.format(values.averageOrderValue);
  outputElements.leadResponseRate.textContent = `${numberFormatter.format(values.leadResponseRate)}%`;
  outputElements.prospectResponseRate.textContent = `${numberFormatter.format(values.prospectResponseRate)}%`;

  resultElements.clients.textContent = numberFormatter.format(results.clients);
  resultElements.leads.textContent = numberFormatter.format(results.leads);
  resultElements.prospects.textContent = numberFormatter.format(results.prospects);
  resultElements.summaryClients.textContent = numberFormatter.format(results.clients);
  resultElements.summaryLeads.textContent = numberFormatter.format(results.leads);
  resultElements.summaryProspects.textContent = numberFormatter.format(results.prospects);
}

Object.values(calculatorInputs).forEach((input) => input.addEventListener("input", updateCalculator));
updateCalculator();

window.calculateCampaign = calculateCampaign;