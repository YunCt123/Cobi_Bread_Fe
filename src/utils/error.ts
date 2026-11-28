export function getApiErrorMessage(
  err: unknown,
  fallback = 'Đã xảy ra lỗi, vui lòng thử lại'
): string {
  if (typeof err === 'object' && err !== null && 'response' in err) {
    const resp = (
      err as {
        response?: {
          data?: {
            message?: string | string[];
          };
        };
      }
    ).response;
    const msg = resp?.data?.message;
    if (Array.isArray(msg) && msg.length > 0) {
      return msg.join(', ');
    }
    if (typeof msg === 'string' && msg.trim().length > 0) {
      return msg;
    }
  }
  if (err instanceof Error && err.message) {
    return err.message;
  }
  return fallback;
}
