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
  const [isConcentrate, setIsConcentrate] = useState(false);
  const [milliseconds, setMilliseconds] = useState(0);
  const [isNotificationSent, setIsNotificationSent] = useState(false);
  const [breakTime, setBreakTime] = useState(0); 

  useEffect(() => {
    let interval = null;

    if (isSmartPhoneMode) {
      // スマホモードがオンになった時点の標準時を記録
      const startTime = Date.now();
      // インターバルを設定して経過時間を計算
      interval = setInterval(() => {
        const currentTime = Date.now();
        setMilliseconds(milliseconds + currentTime - startTime); // 現在時刻 - 開始時刻
      }, 100); // 100ミリ秒ごとに更新
    } else {
      // スマホモードがオフになったらタイマーを停止
      clearInterval(interval);
    }

    // コンポーネントのクリーンアップ
    return () => clearInterval(interval);
  }, [isSmartPhoneMode]);

  useEffect(() => {
    if(!isConcentrate){
      setMilliseconds(0);
      setIsNotificationSent(false);
    }
  }, [isConcentrate]);

  useEffect(() => {
    if(milliseconds > breakTime && !isNotificationSent){
      issueNotification();
      setIsNotificationSent(true);
    }
  }, [milliseconds]);

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
        console.log("通知の発行");
        // await sleep(5000);
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
    if (!isConcentrate) {
      return;
    }
    if(isSmartPhoneMode)
      setIsSmartPhoneMode(false);
    else
      setIsSmartPhoneMode(true);
  };

  const toggleConcentrate = () => {
    if(isConcentrate)
      setIsConcentrate(false);
    else
      setIsConcentrate(true);
      setIsSmartPhoneMode(false);
  };

  const handleBreakTimeChange = (e) => {
    const time = parseInt(e.target.value, 10);
    setBreakTime(time * 1000); // 秒をミリ秒に変換
  };

  return (
    <div>
      <button onClick={showPermissionRequest}>通知の権限</button>
      <button onClick={issueNotification}>通知を発行</button>
      <button onClick={toggleSmartPhoneMode}>スマホモード</button>
      <button onClick={toggleConcentrate}>集中モード</button>
      <div>
        <h2>集中モード: {isConcentrate ? "オン" : "オフ"}</h2>
      </div>
      <div>
        <h2>スマホモード: {isSmartPhoneMode ? "オン" : "オフ"}</h2>
        <h2>経過時間: {milliseconds}ミリ秒</h2>
      </div>
      <div>
        <label>休憩時間 (秒): </label>
        <input
          type="number"
          onChange={handleBreakTimeChange}
          placeholder="休憩時間を入力"
        />
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
