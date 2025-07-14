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
    console.log("Starting scheduler with delay:", this.delay);
    this.timeoutId = setTimeout(() => {
      this.completed = true;
      this.handler();
    }, this.delay);
  }

  stop() {
    if (!this.completed && this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}
