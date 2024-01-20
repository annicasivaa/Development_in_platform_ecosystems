const current_period = new Date().toISOString().substring(0, 7).replace(/-/g, '')

export const fetch_commodities = {
  dataSets: {
    resource: "dataSets/ULowA8V3ucd",
    params: {
      fields: [
        "name",
        "id",
        "dataSetElements[dataElement[id, displayName, categoryOptionCombos[name,id,value]]]",
      ],
    },
  },
  dataValueSets: {
    resource: "/dataValueSets",
    params: {
      orgUnit: "Jiymtq0A01x",
      period: current_period,
      dataSet: "ULowA8V3ucd",
    },
  },
};

export const dispense_post_request = {
  dataSet: "ULowA8V3ucd",
  resource: "dataValueSets",
  type: "create",
  data: ({ id, quantity, period, consumption }) => ({
    orgUnit: "Jiymtq0A01x",
    period: period,
    dataValues: [
      {
        dataElement: id,
        categoryOptionCombo: "rQLFnNXXIL0", //category for endBalance
        value: quantity,
      },
      {
        dataElement: id,
        categoryOptionCombo: "J2Qf1jtZuj8", //category for consumption
        value: consumption,
      },
    ],
  }),
};

export const restock_post_request = {
  dataSet: "ULowA8V3ucd",
  resource: "dataValueSets",
  type: "create",
  data: ({ id, quantity, period }) => ({
    orgUnit: "Jiymtq0A01x",
    period: period,
    dataValues: [
      {
        dataElement: id,
        categoryOptionCombo: "rQLFnNXXIL0", //category for endBalance
        value: quantity,
      },
    ],
  }),
};
