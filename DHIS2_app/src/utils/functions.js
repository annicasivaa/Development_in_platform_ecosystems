// Function that merges commodities into a dictionairy with all of the commodities values

export function mergeData(data) {
  const periods = [
    ...new Set(
      data.dataValueSets.dataValues.map((dataValue) => dataValue.period)
    ),
  ];

  return periods.map((period) => {
    const commodities = data.dataSets.dataSetElements.map((dataset) => {
      const endBalanceValue = data.dataValueSets.dataValues.find(
        (dataValue) =>
          dataValue.dataElement === dataset.dataElement.id &&
          dataValue.period === period &&
          dataValue.categoryOptionCombo === "rQLFnNXXIL0"
      );
      const consumptionValue = data.dataValueSets.dataValues.find(
        (dataValue) =>
          dataValue.dataElement === dataset.dataElement.id &&
          dataValue.period === period &&
          dataValue.categoryOptionCombo === "J2Qf1jtZuj8"
      );
      const quantityOrderedValue = data.dataValueSets.dataValues.find(
        (dataValue) =>
          dataValue.dataElement === dataset.dataElement.id &&
          dataValue.period === period &&
          dataValue.categoryOptionCombo === "KPP63zJPkOu"
      );

      return {
        id: dataset.dataElement.id,
        displayName: dataset.dataElement.displayName.replace('Commodities -',''), //removes "Commodities -" from the display name for less visual clutter
        endBalance: endBalanceValue ? endBalanceValue.value : null,
        consumption: consumptionValue ? consumptionValue.value : null,
        quantityToBeOrdered: quantityOrderedValue
          ? quantityOrderedValue.value
          : null,
      };
    });

    return {
      period,
      commodities,
    };
  });
}
