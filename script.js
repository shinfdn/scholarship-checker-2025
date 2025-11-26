document.getElementById("checkForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const entryId = document.getElementById("entryId").value.trim();
  const email = document.getElementById("email").value.trim();
  const resultDiv = document.getElementById("result");
  resultDiv.className = "result";
  resultDiv.textContent = "照合中...";

  if (!/^\d{8,20}$/.test(entryId)) {
    resultDiv.classList.add("unknown");
    resultDiv.textContent = "申し込み番号の形式が正しくありません。";
    return;
  }

  if (!email.includes("@") || email.length < 5) {
    resultDiv.classList.add("unknown");
    resultDiv.textContent = "メールアドレスの形式が正しくありません。";
    return;
  }

  const idSegment = entryId.slice(-7, -2);
  const emailStart = email.slice(0, 3);
  const atIndex = email.indexOf("@");
  const domainInitial = email[atIndex + 1] || "x";
  const searchKey = `${idSegment}_${emailStart}${domainInitial}`;

  try {
    const [winnersRes, losersRes] = await Promise.all([
      fetch("winners.json"),
      fetch("losers.json")
    ]);
    const [winners, losers] = await Promise.all([
      winnersRes.json(),
      losersRes.json()
    ]);

    const winnerKeys = new Set(winners.map(item => item.key));
    const loserKeys = new Set(losers.map(item => item.key));

    if (winnerKeys.has(searchKey)) {
      resultDiv.classList.add("success");
      resultDiv.innerHTML = "当選している可能性があります。<br />お問い合わせフォームから、財団あてにお問い合わせ下さい。<br /><a href='https://shinfdn.org/contact' target='_blank' style='color:#007bff;text-decoration:underline;'>▶ お問い合わせフォームはこちら</a>";
    } else if (loserKeys.has(searchKey)) {
      resultDiv.classList.add("failure");
      resultDiv.textContent = "落選しています";
    } else {
      resultDiv.classList.add("unknown");
      resultDiv.textContent = "応募データが見当たりません　応募時の自動返信メールをご確認の上、再度申し込み番号とメールアドレスを入力して「照合する」ボタンを押して下さい";
    }
  } catch (error) {
    resultDiv.classList.add("unknown");
    resultDiv.textContent = "データの取得中にエラーが発生しました。時間をおいて再度お試しください。";
    console.error("Fetch error:", error);
  }
});
