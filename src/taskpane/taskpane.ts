/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

import { setAPIKey } from "../util/key";

/* global console, document, Excel, Office */

// The initialize function must be run each time a new page is loaded
Office.onReady(() => {
  document.getElementById("sideload-msg").style.display = "none";
  document.getElementById("app-body").style.display = "flex";
  document.getElementById("run").onclick = run;
  document.getElementById("SaveOpenAIApiKey").onclick = saveKey;
});

export async function saveKey() {
  const keyElem = document.getElementById("keyInput") as HTMLInputElement;
  setAPIKey(keyElem.value)
    .then(() => {
      console.log("API key saved successfully.");
    })
    .catch((error) => {
      console.error("Error saving API key:", error);
    });
}

export async function run() {
  try {
    await Excel.run(async (context) => {
      /**
       * Insert your Excel code here
       */
      const range = context.workbook.getSelectedRange();

      // Read the range address
      range.load("address");

      // Update the fill color
      range.format.fill.color = "yellow";

      await context.sync();
      console.log(`The range address was ${range.address}.`);
    });
  } catch (error) {
    console.error(error);
  }
}
