import axios from "axios";

export type TGsheetRange = {
  range: string;
  majorDimension: string;
  values: string[][];
};

export default async function readRange(sheetId: string, range: string) {
  const { data } = await axios.get(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}`,
    { params: { key: process.env.GSHEETS_API_KEY } }
  );

  return data as TGsheetRange;
}
