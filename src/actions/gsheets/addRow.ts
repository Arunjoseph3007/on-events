import axios from "axios";
import { TAction } from "../../types/Action";

const addRow: TAction<string[]> = async (node, values) => {
  try {
    const { data: accessData } = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        refresh_token: node.credential?.accessToken,
        client_id: process.env.GSHEET_OAUTH_CLIENT_ID,
        client_secret: process.env.GSHEET_OAUTH_CLIENT_SECRET,
        grant_type: "refresh_token",
      }
    );

    const { data } = await axios.post(
      `https://sheets.googleapis.com/v4/spreadsheets/${node.resourceId}/values/Sheet1!A1:C6:append`,
      {
        range: "Sheet1!A1:C6",
        majorDimension: "ROWS",
        values: [values],
      },
      {
        headers: {
          Authorization: "Bearer " + accessData.access_token,
        },
        params: {
          valueInputOption: "RAW",
        },
      }
    );

    return data;
  } catch (error) {
    console.log((error as any).response);
  }
};

export default addRow;
