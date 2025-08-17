// Sidepanel 脚本
document.addEventListener('DOMContentLoaded', function () {
  const testButton = document.getElementById('testButton') as HTMLButtonElement;
  const getTabInfoButton = document.getElementById('getTabInfoButton') as HTMLButtonElement;
  const storeDataButton = document.getElementById('storeDataButton') as HTMLButtonElement;
  const getStoredDataButton = document.getElementById('getStoredDataButton') as HTMLButtonElement;
  const sendToContentButton = document.getElementById('sendToContentButton') as HTMLButtonElement;
  const getPageInfoButton = document.getElementById('getPageInfoButton') as HTMLButtonElement;
  const injectScriptButton = document.getElementById('injectScriptButton') as HTMLButtonElement;
  const clearStorageButton = document.getElementById('clearStorageButton') as HTMLButtonElement;
  const statusDiv = document.getElementById('status') as HTMLDivElement;
  const resultDiv = document.getElementById('result') as HTMLDivElement;

  function showStatus(message: string, isSuccess = true): void {
    statusDiv.textContent = message;
    statusDiv.className = `status ${isSuccess ? 'success' : 'error'}`;
    statusDiv.style.display = 'block';

    // 3秒后隐藏状态信息
    setTimeout(() => {
      statusDiv.style.display = 'none';
    }, 3000);
  }

  function showResult(data: any): void {
    resultDiv.textContent = JSON.stringify(data, null, 2);
    resultDiv.style.display = 'block';
  }

  // 通用消息发送函数 - 使用新的消息服务
  async function sendMessage<T>(method: string, params: T): Promise<any> {
    try {
      const response = await chrome.runtime.sendMessage({
        method,
        params,
      });

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      throw error instanceof Error ? error : new Error('Unknown error');
    }
  }

  // 向 content script 发送消息的函数
  async function sendToContent<T>(method: string, params: T): Promise<any> {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
        const activeTab = tabs[0];
        if (!activeTab?.id) {
          reject(new Error('No active tab found'));
          return;
        }

        chrome.tabs.sendMessage(activeTab.id, { method, params }, (response: any) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve(response);
          }
        });
      });
    });
  }

  // 测试消息按钮
  testButton.addEventListener('click', async function () {
    try {
      testButton.disabled = true;
      testButton.textContent = '发送中...';

      const result = await sendMessage('handleTestMessage', {
        message: '来自 Sidepanel 的测试消息',
        timestamp: new Date().toISOString(),
      });

      showStatus('测试消息发送成功！', true);
      showResult(result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      showStatus(`发送失败: ${errorMessage}`, false);
    } finally {
      testButton.disabled = false;
      testButton.textContent = '📤 测试消息';
    }
  });

  // 获取标签页信息按钮
  getTabInfoButton.addEventListener('click', async function () {
    try {
      getTabInfoButton.disabled = true;
      getTabInfoButton.textContent = '获取中...';

      const result = await sendMessage('handleGetTabInfo', {});

      showStatus('标签页信息获取成功！', true);
      showResult(result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      showStatus(`获取失败: ${errorMessage}`, false);
    } finally {
      getTabInfoButton.disabled = false;
      getTabInfoButton.textContent = '📋 获取标签页信息';
    }
  });

  // 存储数据按钮
  storeDataButton.addEventListener('click', async function () {
    try {
      storeDataButton.disabled = true;
      storeDataButton.textContent = '存储中...';

      const testData = {
        message: '这是测试数据',
        timestamp: new Date().toISOString(),
        randomValue: Math.random(),
      };

      const result = await sendMessage('handleStoreData', {
        key: 'testData',
        value: testData,
      });

      showStatus('数据存储成功！', true);
      showResult(result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      showStatus(`存储失败: ${errorMessage}`, false);
    } finally {
      storeDataButton.disabled = false;
      storeDataButton.textContent = '💾 存储数据';
    }
  });

  // 获取存储数据按钮
  getStoredDataButton.addEventListener('click', async function () {
    try {
      getStoredDataButton.disabled = true;
      getStoredDataButton.textContent = '获取中...';

      const result = await sendMessage('handleGetStoredData', {
        key: 'testData',
      });

      showStatus('存储数据获取成功！', true);
      showResult(result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      showStatus(`获取失败: ${errorMessage}`, false);
    } finally {
      getStoredDataButton.disabled = false;
      getStoredDataButton.textContent = '📖 获取存储数据';
    }
  });

  // 向 Content 发送消息按钮
  sendToContentButton.addEventListener('click', async function () {
    try {
      sendToContentButton.disabled = true;
      sendToContentButton.textContent = '发送中...';

      const result = await sendToContent('showNotification', {
        message: '来自 Sidepanel 的消息',
        action: 'showNotification',
        data: { type: 'info' },
      });

      showStatus('消息已发送到 Content！', true);
      showResult(result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      showStatus(`发送失败: ${errorMessage}`, false);
    } finally {
      sendToContentButton.disabled = false;
      sendToContentButton.textContent = '📨 向 Content 发送消息';
    }
  });

  // 获取页面信息按钮
  getPageInfoButton.addEventListener('click', async function () {
    try {
      getPageInfoButton.disabled = true;
      getPageInfoButton.textContent = '获取中...';

      const result = await sendToContent('getPageInfo', {
        includeDOM: true,
        includeMeta: true,
      });

      showStatus('页面信息获取成功！', true);
      showResult(result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      showStatus(`获取失败: ${errorMessage}`, false);
    } finally {
      getPageInfoButton.disabled = false;
      getPageInfoButton.textContent = '🌐 获取页面信息';
    }
  });

  // 注入脚本按钮
  injectScriptButton.addEventListener('click', async function () {
    try {
      injectScriptButton.disabled = true;
      injectScriptButton.textContent = '注入中...';

      const testScript = `
        console.log('这是从 Sidepanel 注入的脚本');
        document.body.style.border = '3px solid #4285f4';
        setTimeout(() => {
          document.body.style.border = '';
        }, 3000);
      `;

      const result = await sendToContent('injectScript', {
        script: testScript,
        type: 'inline',
      });

      showStatus('脚本注入成功！', true);
      showResult(result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      showStatus(`注入失败: ${errorMessage}`, false);
    } finally {
      injectScriptButton.disabled = false;
      injectScriptButton.textContent = '🔧 注入脚本';
    }
  });

  // 清除存储数据按钮
  clearStorageButton.addEventListener('click', async function () {
    try {
      clearStorageButton.disabled = true;
      clearStorageButton.textContent = '清除中...';

      const result = await sendMessage('handleClearStorage', {
        key: 'testData',
      });

      showStatus('存储数据清除成功！', true);
      showResult(result);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      showStatus(`清除失败: ${errorMessage}`, false);
    } finally {
      clearStorageButton.disabled = false;
      clearStorageButton.textContent = '🗑️ 清除存储数据';
    }
  });
});
