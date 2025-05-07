import { sleep } from "./utils";

/**
 * 根据文本内容查找并操作元素
 * @param selector 选择器
 * @param text 要匹配的文本内容
 * @param action 要执行的操作，默认为点击
 * @returns 是否命中
 */
export function actionWithText(
  selector: string,
  text: string,
  action: (element: HTMLElement) => void = (elem) => {
    elem.click();
  }
) {
  const elements = document.querySelectorAll(selector);
  console.log(
    `actionWithText: document.querySelectorAll("${selector}") ${text}`
  );
  let hit = false;
  if (elements) {
    elements.forEach((element) => {
      if (
        element instanceof HTMLElement &&
        element.textContent?.replace(/\s+/g, "") === text
      ) {
        hit = true;
        action(element);
        // 找到后不再继续查找
        return false;
      }
      return true;
    });
  }
  return hit;
}

/**
 * 根据文本内容查找并操作元素
 * @param selector 选择器
 * @param textPattern 要匹配的文本内容
 * @param action 要执行的操作，默认为点击
 * @returns 命中元素数量
 */
export function actionWithTextMatch(
  selector: string,
  textPattern: RegExp,
  action: (element: HTMLElement) => void = (elem) => {
    elem.click();
  }
): number {
  const elements = document.querySelectorAll(selector);
  console.log(
    `actionWithTextMatch: document.querySelectorAll("${selector}") ${textPattern}`
  );
  let hit = 0;
  if (elements) {
    elements.forEach((element) => {
      if (
        element instanceof HTMLElement &&
        element.textContent?.match(textPattern)
      ) {
        action(element);
        hit++;
      }
    });
  }
  return hit;
}

/**
 * 根据文本内容查找并操作元素
 * @param rootElement 根元素
 * @param selector 选择器
 * @param textPattern 要匹配的文本内容
 * @param action 要执行的操作，默认为点击
 */
export function actionWithTextMatchX(
  rootElement: HTMLElement,
  selector: string,
  textPattern: RegExp,
  action: (element: HTMLElement) => void = (elem) => {
    elem.click();
  }
) {
  const elements = rootElement.querySelectorAll(selector);
  console.log(
    `actionWithTextMatchX: rootElement.querySelectorAll("${selector}") ${textPattern}`
  );
  if (elements) {
    elements.forEach((element) => {
      if (
        element instanceof HTMLElement &&
        element.textContent?.match(textPattern)
      ) {
        action(element);
      }
    });
  }
}

/**
 * 获取元素数量
 * @param selector 选择器
 * @param rootElement 根元素
 * @returns 元素数量
 */
export function countElements(
  selector: string,
  rootElement: HTMLElement | null = null
) {
  const elements = rootElement
    ? rootElement.querySelectorAll(selector)
    : document.querySelectorAll(selector);
  return elements?.length;
}

/**
 * 批量操作元素
 * @param selector 选择器
 * @param action 要执行的操作, 返回 true 则停止操作
 * @param filter 过滤条件，默认为所有元素
 */
export async function batchAction(
  selector: string,
  action: (element: HTMLElement) => void | Promise<boolean>,
  filter: (element: HTMLElement) => boolean = () => true
) {
  const elements = document.querySelectorAll(selector);
  console.log(`document.querySelectorAll("${selector}")`, elements);
  for (const element of Array.from(elements)) {
    if (filter(element as HTMLElement)) {
      const result = await action(element as HTMLElement);
      if (result) {
        return true;
      }
    }
  }
}

/**
 * 在根元素下批量操作元素
 * @param rootElement 根元素
 * @param selector 选择器
 * @param action 要执行的操作, 返回 true 则停止操作
 * @param filter 过滤条件，默认为所有元素
 */
export async function batchActionOnRoot(
  rootElement: HTMLElement,
  selector: string,
  action: (element: HTMLElement) => void | Promise<boolean>,
  filter: (element: HTMLElement) => boolean = () => true
) {
  const elements = rootElement.querySelectorAll(selector);
  console.log(`rootElement: `, rootElement);
  console.log(`rootElement.querySelectorAll("${selector}")`, elements);
  for (const element of Array.from(elements)) {
    if (filter(element as HTMLElement)) {
      const result = await action(element as HTMLElement);
      if (result) {
        return true;
      }
    }
  }
}

/**
 * 点击元素
 * @param selector 选择器
 * @returns 是否点击成功
 */
export function clickElement(
  selector: string,
  rootElement: HTMLElement | null = null
): boolean {
  const element = rootElement
    ? rootElement.querySelector(selector)
    : document.querySelector(selector);
  if (element) {
    (element as HTMLElement).click();
    return true;
  }
  return false;
}

/**
 * 获取输入框的值
 * @param selector 选择器
 * @param rootElement 根元素
 * @returns 输入框的值
 */
export function getElementValue(
  selector: string,
  rootElement: HTMLElement | null = null
): string {
  const element = rootElement
    ? rootElement.querySelector(selector)
    : document.querySelector(selector);
  return (element as HTMLInputElement).value;
}

/**
 * 设置输入框的值
 * @param selector 选择器
 * @param value 要设置的值
 * @param rootElement 根元素
 * @returns 是否设置成功
 */
export function setElementValue(
  selector: string,
  value: string,
  rootElement: HTMLElement | null = null
): boolean {
  const element = rootElement
    ? rootElement.querySelector(selector)
    : document.querySelector(selector);
  if (element) {
    (element as HTMLInputElement).value = value;
    triggerEvent(selector, "input", rootElement);
    triggerEvent(selector, "change", rootElement);
    return true;
  }
  return false;
}

/**
 * 获取元素的文本内容
 * @param selector 选择器
 * @param rootElement 根元素
 * @returns 元素的文本内容
 */
export function getElementText(
  selector: string,
  rootElement: HTMLElement | null = null
): string {
  const element = rootElement
    ? rootElement.querySelector(selector)
    : document.querySelector(selector);
  return (element as HTMLElement).textContent ?? "";
}

/**
 * 触发事件
 * @param selector 选择器
 * @param event 事件名称
 * @param rootElement 根元素
 * @returns 是否触发成功
 */
export function triggerEvent(
  selector: string,
  event: string,
  rootElement: HTMLElement | null = null
): boolean {
  const element = rootElement
    ? rootElement.querySelector(selector)
    : document.querySelector(selector);
  if (element) {
    const ev: Event = new Event(event, { bubbles: true });
    (element as HTMLElement).dispatchEvent(ev);
    return true;
  }
  return false;
}

/**
 * 滚动到元素
 * @param element 元素
 * @param scrollContainer 滚动容器
 */
export function scrollToElement(
  element: HTMLElement,
  scrollContainer: HTMLElement
) {
  const center = element.getBoundingClientRect();
  const viewportHeight = scrollContainer.clientHeight;
  const scrollTop =
    center.top +
    scrollContainer.scrollTop -
    viewportHeight / 2 +
    center.height / 2;
  scrollContainer.scrollTop = scrollTop;
}

/**
 * 滚动到容器底部，直到加载完成
 * @param scrollContainer 滚动容器
 */
export async function scrollToBottom(scrollContainer: HTMLElement) {
  const scrollTop = scrollContainer.scrollHeight - scrollContainer.clientHeight;
  scrollContainer.scrollTop = scrollTop;
  while (scrollContainer.scrollTop < scrollTop) {
    scrollContainer.scrollTop = scrollTop;
    await sleep(500);
  }
  console.log("scrollToBottom end");
}

/**
 * 合成事件
 * @param event 事件名称
 * @param bubbles 是否冒泡
 * @param opts 事件选项
 * @returns 事件
 */
export function composeEvent(
  event: string,
  bubbles: boolean = true,
  opts: object = {}
) {
  return new Event(event, { bubbles, ...opts });
}

/**
 * 合成键盘事件
 * @param event 事件名称
 * @param bubbles 是否冒泡
 * @param opts 事件选项
 * @returns 事件
 */
export function composeKeyboardEvent(
  event: string,
  opts: KeyboardEventInit = {}
) {
  return new KeyboardEvent(event, opts);
}

/**
 * 等待元素出现
 * @param selector 选择器
 * @param timeoutMs 超时时间
 * @param root 根元素
 * @returns 元素
 */
export async function waitForElement(
  selector: string,
  timeoutMs: number = 3000,
  root: HTMLElement | null = null
): Promise<HTMLElement | null> {
  const element = root
    ? root.querySelector(selector)
    : document.querySelector(selector);
  if (element) {
    return element as HTMLElement;
  }
  const startTime = Date.now();
  while (Date.now() - startTime < timeoutMs) {
    await sleep(300);
    const element = root
      ? root.querySelector(selector)
      : document.querySelector(selector);
    if (element) {
      return element as HTMLElement;
    }
  }
  throw new Error(`waitForElement: ${selector} timeout`);
}
