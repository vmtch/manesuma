import React, { useState, useEffect} from "react";

function Popup({ message, onClose }) {
  return (
    <div style={styles.notification}>
      {message}
      <button onClick={onClose} style={styles.button}>
        閉じる
      </button>
    </div>
  );
}

const sleep = waitTime => new Promise( resolve => setTimeout(resolve, waitTime) );

const styles = {
  notification: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    backgroundColor: "#444",
    color: "#fff",
    padding: "10px",
    borderRadius: "5px",
  },
  button: {
    marginLeft: "10px",
    backgroundColor: "#888",
    border: "none",
    color: "#fff",
    cursor: "pointer",
  },
};

function App() {
  const [isVisible, setIsVisible] = useState(false);
  const [isSmartPhoneMode, setIsSmartPhoneMode] = useState(false);
  const [milliseconds, setMilliseconds] = useState(0);
  const [startTime, setStartTime] = useState(null); // スマホモード開始時の時間

  useEffect(() => {
    let interval = null;

    if (isSmartPhoneMode) {
      // スマホモードがオンになった時点の標準時を記録
      const now = Date.now();
      setStartTime(now);

      // インターバルを設定して経過時間を計算
      interval = setInterval(() => {
        const currentTime = Date.now();
        setMilliseconds(currentTime - now); // 現在時刻 - 開始時刻
      }, 1); // 1ミリ秒ごとに更新
    } else {
      // スマホモードがオフになったらタイマーを停止
      clearInterval(interval);
    }

    // コンポーネントのクリーンアップ
    return () => clearInterval(interval);
  }, [isSmartPhoneMode]);

  const showNotification = () => {
    let popupTime = 30000;
    let closeTime = popupTime + 3000;
    setTimeout(() => {
      setIsVisible(true);
    }, popupTime);
    setTimeout(() => {
      setIsVisible(false);
    }, closeTime); // 3秒後に自動で閉じる
  };

  const showPermissionRequest = () => {
    Notification.requestPermission().then((permission) => {
      console.log(permission);
    });
  };

  const issueNotification = async () => {
    // Notification API が使用できるか確認
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        console
        .log("通知の発行");
        await sleep(5000);
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          await registration.showNotification("休憩時間の超過", {body: "休憩時間が過ぎました"});
        }
      } 
    } else {
      console.log("このデバイスではブラウザ通知がサポートされていません");
    }
  };

  const toggleSmartPhoneMode = () => {
    if(isSmartPhoneMode)
      setIsSmartPhoneMode(false);
    else
      setIsSmartPhoneMode(true);
    console.log("isSmartPhoneMode is " + isSmartPhoneMode);
  };

  return (
    <div>
      <button onClick={showPermissionRequest}>通知の権限</button>
      <button onClick={issueNotification}>通知を発行</button>
      <button onClick={toggleSmartPhoneMode}>スマホモード</button>
      <div>
        <h2>スマホモード: {isSmartPhoneMode ? "オン" : "オフ"}</h2>
        <h2>経過時間: {milliseconds}ミリ秒</h2>
      </div>
      {isVisible && (
        <Popup
          message="ここに通知を表示します"
          onClose={() => setIsVisible(false)}
        />
      )}
    </div>
  );
}

export default App;
