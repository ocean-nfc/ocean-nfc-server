const express = require("express");

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Ocean NFC system");
});

/**
 * GET /get-client-id
 * Params:
 *  - cardId: string - the card ID
 */
app.get("/get-client-id", async (req, res) => {
  const cardId = req.query.cardId;
  if (!cardId) {
    res.status(500).json({
      error: true,
      message: "cardId must be supplied."
    })
  }

  res.json({
    error: false,
    message: "",
    cardId: req.query.cardId,
    clientId: await getClientIDFromCardID(req.query.cardId),
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


function getClientIDFromCardID(cardID) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("someId");
    }, 2000);
  });
}