import type { MessageRequest, MessageResponse } from './types';

// Sidepanel 脚本
document.addEventListener('DOMContentLoaded', function () {
  const testButton = document.getElementById('testButton') as HTMLButtonElement;
  const getTabInfoButton = document.getElementById('getTabInfoButton') as HTMLButtonElement;
  const storeDataButton = document.getElementById('storeDataButton') as HTMLButtonElement;
  const getStoredDataButton = document.getElementById('getStoredDataButton') as HTMLButtonElement;
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

  // 通用消息发送函数
  async function sendMessage<T>(method: string, params: T): Promise<any> {
    const request: MessageRequest<T> = {
      method,
      params,
    };

    const response = (await chrome.runtime.sendMessage(request)) as MessageResponse;

    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.error);
    }
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
      testButton.textContent = '测试消息';
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
      getTabInfoButton.textContent = '获取标签页信息';
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
      storeDataButton.textContent = '存储数据';
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
      getStoredDataButton.textContent = '获取存储数据';
    }
  });
});
