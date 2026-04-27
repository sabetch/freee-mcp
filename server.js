import express from "express";

const app = express();
const PORT = 3000;

// ===== あなたの情報 =====
const CLIENT_ID = "692989273301555";
const CLIENT_SECRET = "KxKioK2qNANS3gnlgWp1brEnhiU5oJHUN832Gj9y6_RWfXdSjaIF_sXUS74eM9Af-RNatUr2PmSLuQgRs_AMbg";
const REDIRECT_URI = "http://localhost:3000/callback";

// 👇 今取得した access_token を入れる
const ACCESS_TOKEN = "fT8PxaIHXh10VqK1t3JPTqdfg-N4TokCIzbgwZE9g_0";

// ===== ログインページ =====
app.get("/", (req, res) => {
  const url = `https://accounts.secure.freee.co.jp/public_api/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;
  res.send(`<a href="${url}">freeeにログイン</a>`);
});

// ===== 認証コールバック =====
app.get("/callback", async (req, res) => {
  const code = req.query.code;

  const response = await fetch("https://accounts.secure.freee.co.jp/public_api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code: code,
      redirect_uri: REDIRECT_URI
    })
  });

  const data = await response.json();

  console.log("トークン:", data);

  res.send("トークン取得！ターミナル見て！");
});

// ===== 会社情報取得（company_id用） =====
app.get("/companies", async (req, res) => {
  const response = await fetch("https://api.freee.co.jp/api/1/companies", {
    headers: {
      "Authorization": `Bearer ${ACCESS_TOKEN}`
    }
  });

  const data = await response.json();
  res.json(data);
});

// ===== 取引取得 =====
app.get("/transactions", async (req, res) => {

  const companyId = "12571028";

  const response = await fetch(
    `https://api.freee.co.jp/api/1/deals?company_id=${companyId}`,
    {
      headers: {
        "Authorization": `Bearer ${ACCESS_TOKEN}`
      }
    }
  );

  const data = await response.json();
  res.json(data);
});

// ===== 起動 =====
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});