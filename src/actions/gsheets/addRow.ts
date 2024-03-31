import axios from "axios";

export default async function addRow(sheetId: string, values: string[]) {
  try {
    const { data } = await axios.post(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1!A1:C6:append`,
      {
        range: "Sheet1!A1:C6",
        majorDimension: "ROWS",
        values: [values],
      },
      {
        headers: {
          Authorization:
            "Bearer ya29.a0Ad52N3-Hx0nz7QR-Z0UrEpJAHmPt2Hy2-E2PpVHxL-Zgql19wyjLNaZmLaWp7_Hw7z7plu2MLYTMwl1RdzfcDTewncXJQnIw-M5_DhzsGYpgRqyD8sWeOalMdpfsWDHFcHVHOc4PuunU3vH24t4u8MOY093GNeYT9PkaCgYKAW8SARESFQHGX2MivPm2HYbP-o_i5DWOzTObMQ0170",
        },
        params: {
          valueInputOption: "RAW",
        },
      }
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
