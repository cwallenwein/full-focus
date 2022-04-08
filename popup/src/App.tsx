import React, { FC, useState, useEffect } from "react";
import { Card, Switch } from "antd";
import { CloseOutlined, CheckOutlined } from "@ant-design/icons";
import "./App.css";

// TODO: move to extension code, make new popup open when extension icon is clicked
// TODO: initalize state with extension state
// TODO: update extension state

const App: FC = () => {
  const [extensionActive, setExtensionActive] = useState(false);

  useEffect(() => {
    chrome.storage.local.get("active", ({ active }) => {
      setExtensionActive(active);
    });
  }, []);

  const updateState = (active: boolean, _event: Event) => {
    setExtensionActive(active);
    chrome.storage.local.set({ active });
    chrome.tabs.query({ url: "https://www.youtube.com/*" }, function (tabs) {
      tabs.forEach((tab: chrome.tabs.Tab) => {
        updateTab(tab, active);
      });
    });
  };

  const updateTab = (tab: chrome.tabs.Tab, active: boolean) => {
    let stylesheet;
    if (!tab.url || !tab.id) {
      return;
    }
    if (showingHomepage(tab.url) || showingSearchResults(tab.url) || showingYouTubeShortsPage(tab.url)) {
      stylesheet = {
        target: { tabId: tab.id },
        files: ["css/homepage.css"],
      };
    } else if (showingVideoplayer(tab.url)) {
      stylesheet = {
        target: { tabId: tab.id },
        files: ["css/videoplayer.css"],
      };
    } else {
      return;
    }

    if (active) {
      console.log("insert", stylesheet);
      chrome.scripting.insertCSS(stylesheet);
    } else {
      console.log("remove", stylesheet);
      chrome.scripting.removeCSS(stylesheet);
    }
  };

  const toggleAllOptionsCheckbox = (
    <Switch
      checkedChildren={<CheckOutlined />}
      unCheckedChildren={<CloseOutlined />}
      onChange={updateState}
      checked={extensionActive}
    />
  );

  return (
    <>
      <Card
        title="Full Focus"
        extra={toggleAllOptionsCheckbox}
        style={{ width: 250 }}
        actions={[<a href="#">Give Feedback</a>]}
      ></Card>
    </>
  );
};

function showingHomepage(url: string) {
  return url == "https://www.youtube.com/" || url.startsWith("https://www.youtube.com/#");
}

function showingSearchResults(url: string) {
  return url.startsWith("https://www.youtube.com/results");
}

function showingVideoplayer(url: string) {
  return url.startsWith("https://www.youtube.com/watch");
}

function showingYouTubeShortsPage(url: string) {
  return url.startsWith("https://www.youtube.com/shorts/");
}

export default App;
