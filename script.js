document.getElementById("checkForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const entryId = document.getElementById("entryId").value.trim();
  const email = document.getElementById("email").value.trim();
  const resultDiv = document.getElementById("result");
  resultDiv.className = "result";
  resultDiv.textContent = "照合中...";

  // 入力バリデーション（数字8〜20桁）
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

  // 照合キーの生成（下7〜3桁 + _ + メール先頭3文字 + @の次の1文字）
  const idSegment = entryId.slice(-7, -2); // 下7桁から3桁目まで
  const emailStart = email.slice(0, 3);
  const atIndex = email.indexOf("@");
  const domainInitial = email[atIndex + 1] || "x";
  const searchKey = `${idSegment}_${emailStart}${domainInitial}`;

  try {
    const [winnersRes, losersRes] = await Promise.all([