import React, { useState } from "react";

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

  const issueNotification = () => {
    // Notification API が使用できるか確認
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        console.log("通知の発行");
        new Notification("休憩時間の超過", {
          body: "休憩時間が過ぎました", // ここにメッセージ本文          
        });
      } 
    } else {
      console.log("このデバイスではブラウザ通知がサポートされていません");
    }
  };

  return (
    <div>
      <button onClick={showPermissionRequest}>通知の権限</button>
      <button onClick={showNotification}>通知を表示</button>
      <button onClick={issueNotification}>通知を発行</button>
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
