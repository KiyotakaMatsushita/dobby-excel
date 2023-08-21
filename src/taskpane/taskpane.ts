/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

import { setAPIKey } from "../util/key";

/* global console, document, Office */

// The initialize function must be run each time a new page is loaded
Office.onReady(() => {
  document.getElementById("sideload-msg")!.style.display = "none";
  document.getElementById("app-body")!.style.display = "flex";
  document.getElementById("SaveOpenAIApiKey")!.onclick = saveKey;
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
