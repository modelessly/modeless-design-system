export type Waiter = () => void;

class MotionBudget {
  private active = 0;
  private queue: Waiter[] = [];

  constructor(private max: number) {}

  acquire(onGranted: Waiter): boolean {
    if (this.active < this.max) {
      this.active += 1;
      return true;
    }
    this.queue.push(onGranted);
    return false;
  }

  release(): void {
    this.active = Math.max(0, this.active - 1);
    const next = this.queue.shift();
    if (next) {
      this.active += 1;
      next();
    }
  }

  cancelRequest(onGranted: Waiter): void {
    const index = this.queue.indexOf(onGranted);
    if (index >= 0) this.queue.splice(index, 1);
  }
}

export const motionBudget = new MotionBudget(2);
