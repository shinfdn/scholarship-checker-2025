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
      resultDiv.innerHTML = `落選しています<br /><div style="font-size: 0.9rem; margin-top: 1em; line-height: 1.6;">
        このたびはSTEM女子奨学助成金にご応募いただき、誠にありがとうございました。<br /><br />
        厳正なる抽選の結果、今回は残念ながらご希望に添えず落選となりました。<br />
        応募に際してお寄せいただいた想いやお時間に、心より感謝申し上げます。<br /><br />
        これからのご活躍を心より応援しております。<br /><br />
        今後も、弊財団ではSTEM分野をはじめとした挑戦を続ける皆さまを応援する機会を設けてまいりますので、引き続きご注目いただけますと幸いです。<br /><br />
        また、このたびご応募いただいた皆さまにご参加いただけるオンラインイベントを開催いたします。<br />
        今後の学びや進路のヒントとなる内容をご用意しておりますので、ぜひご参加ください。<br /><br />
        ▼イベントの詳細・お申し込みはこちら<br />
        <strong>STEMガールズトーク！〜進路選択・大学生活のリアル〜</strong><br /><br />
        ・理系に進みたいけど、どの大学・学部を選べばいいかわからない<br />
        ・理系に進んでから苦労したことは？ どう乗り越えたの？<br />
        ・大学生活って実際どんな感じ？<br />
        そんな疑問や不安を、実際にSTEM（理系）分野に進んだ大学生の先輩たちに聞いてみませんか？<br /><br />
        受験や大学生活をリアルに経験してきた先輩と話すことで、あなたらしい進路を考えるヒントがきっと見つかるはずです。<br /><br />
        <strong>日時：</strong>12月14日（日）20:00〜21:30<br />
        <strong>参加方法：</strong>オンライン（Zoom）※お申込み完了後にメールでURLをお知らせします。<br />
        <strong>定員：</strong>先着100名<br /><br />
        <a href='https://share.hsforms.com/1al2G8hX2SIugk8bDv5uVNwr8gla' target='_blank' style='color:#007bff;text-decoration:underline;'>▶ 申込フォームはこちら</a><br /><br />
        その他にも、皆さんの進路選択の参考になる企業オフィスツアー・大学ツアーや、オンライン座談会を開催しています。<br />
        <a href='https://shinfdn.org/gms' target='_blank' style='color:#007bff;text-decoration:underline;'>▶ プログラム一覧はこちら</a><br /><br />
        LINEではいち早く新着ツアーの情報をご案内しています。<br />
        <a href='https://page.line.me/796tihkf' target='_blank' style='color:#007bff;text-decoration:underline;'>▶ LINEでフォローする</a><br /><br />
        X（旧Twitter）アカウント：<a href='https://x.com/shinfoundation' target='_blank' style='color:#007bff;text-decoration:underline;'>https://x.com/shinfoundation</a><br />
        メールニュース登録：<a href='https://shinfdn.org/follow' target='_blank' style='color:#007bff;text-decoration:underline;'>https://shinfdn.org/follow</a><br /><br />
        今後の皆様のご活躍と健やかな成長を心より祈念しております。<br />
        改めまして、この度はSTEM女子奨学助成金にご応募いただきまして、誠にありがとうございました。
      </div>`;
    } else {
      resultDiv.classList.add("unknown");
      resultDiv.innerHTML = "応募データが見当たりません。応募時の自動返信メールをご確認の上、再度申し込み番号とメールアドレスを入力して「照合する」ボタンを押して下さい。<br /><a href='https://shinfdn.org/contact' target='_blank' style='color:#007bff;text-decoration:underline;'>▶ お問い合わせフォームはこちら</a>";
    }
  } catch (error) {
    resultDiv.classList.add("unknown");
    resultDiv.textContent = "データの取得中にエラーが発生しました。時間をおいて再度お試しください。";
    console.error("Fetch error:", error);
  }
});
