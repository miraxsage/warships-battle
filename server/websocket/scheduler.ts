export class Scheduler {
  private timeoutId: NodeJS.Timeout | null = null;
  private completed: boolean = false;

  constructor(private handler: () => void, private delay: number) {
    this.start();
  }

  start() {
    if (this.completed) {
      console.log("Scheduler already completed");
      return;
    }
    this.timeoutId = setTimeout(() => {
      this.completed = true;
      this.handler();
    }, this.delay);
    console.log("Starting scheduler with delay:", this.delay, this.timeoutId);
  }

  stop() {
    console.log("Stopping sheduler:", this.timeoutId);
    if (!this.completed && this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}
