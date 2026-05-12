export const TASK_EVENTS = {
  CREATED: 'ledger:task:created',
  UPDATED: 'ledger:task:updated',
  DELETED: 'ledger:task:deleted',
  REFRESH: 'ledger:task:refresh',
} as const;

export const QUIZ_EVENTS = {
  COMPLETED: 'ledger:quiz:completed',
} as const;

export function emitTaskEvent(event: string, data?: unknown) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(event, { detail: data }));
  }
}

export function emitQuizEvent(event: string, data?: unknown) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(event, { detail: data }));
  }
}