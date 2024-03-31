import axios from "axios";

export default async function addRow(sheetId: string, values: string[]) {
  try {
    const { data } = await axios.post(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1!A1:C6:append`,
      {
        range: "Sheet1!A1:C6",
        majorDimension: "ROW",
        values: [values],
      },
      { params: { key: process.env.GSHEETS_API_KEY } }
    );

    console.log(data);
  } catch (error) {
    console.log((error as any).response);
  }
}

addRow("1UO3NlLd8_VD11sA5ZJWsXwFZztpppOLENtYLHGMysWY", [
  "i",
  "am",
  "happy",
  "that",
  "it",
  "worked",
]);
