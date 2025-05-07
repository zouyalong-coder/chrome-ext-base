/**
 * 通用工具函数
 */

/**
 * 延迟执行
 * @param ms 延迟的毫秒数
 */
export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
