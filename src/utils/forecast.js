export function calculateProjectedBalance({
  monthlyContribution,
  months,
  monthlyRate,
}) {
  const contribution = Number(monthlyContribution);
  const count = Number(months);
  const rate = Number(monthlyRate) / 100;

  if (
    !Number.isFinite(contribution) ||
    !Number.isFinite(count) ||
    !Number.isFinite(rate) ||
    contribution <= 0 ||
    count <= 0 ||
    rate < 0
  ) {
    return {
      totalContributed: 0,
      finalBalance: 0,
      monthlyInterest: 0,
      averagePerMonth: 0,
    };
  }

  const totalContributed = contribution * count;
  let balance = 0;

  for (let index = 0; index < count; index += 1) {
    balance = (balance + contribution) * (1 + rate);
  }

  return {
    totalContributed,
    finalBalance: Number(balance.toFixed(2)),
    monthlyInterest: Number(((balance - totalContributed) / count).toFixed(2)),
    averagePerMonth: Number((totalContributed / count).toFixed(2)),
  };
}
