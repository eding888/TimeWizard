enum DayOfWeek {
  Sun,
  Mon,
  Tue,
  Wed,
  Thu,
  Fri,
  Sat,
}

enum Priority {
  FIXED,
  HIGH,
  NORMAL,
  FLEXIBLE,
  OPTIONAL
}

class Quota {
  private targetMins: number;
  private targetDays: DayOfWeek[];

  constructor(targetMins: number, targetDays: DayOfWeek[]) {
    this.targetMins = targetMins;
    this.targetDays = targetDays;
  }

  public getTargetDays = () => {
    return this.targetDays;
  }
}

class Task {
    private startMinutes: number;
    private endMinutes: number;
    private priority: Priority;
    private quota: Quota | null;

    constructor(startMinutes: number, endMinutes: number, priority: Priority, quota: Quota | null = null) {
        if ((startMinutes < 0 || startMinutes >= 1440) || (endMinutes < 0 || endMinutes >= 1440)) {
            throw new Error("Invalid time value");
        }
        this.startMinutes = Math.round(startMinutes / 5) * 5;
        this.endMinutes = Math.round(endMinutes / 5) * 5;
        this.priority = priority;
        this.quota = quota;
    }
     public getStartTimeMinutes = () => {
        return this.startMinutes;
    }

     public getEndTimeMinutes = () => {
        return this.endMinutes;
    }

    public getStartAndEndTimeMinutes = () => {
        return [this.startMinutes, this.endMinutes];
    }

    public getDurationMinutes = () => {
        return (this.endMinutes -  this.startMinutes);
    }

    public getPriority = () => {
        return this.priority;
    }
    public getQuota = () => {
        return this.quota;
    }

    public setEndTime = ( minutes: number) => {
        if (minutes < 0 || minutes >= 1440) {
            throw new Error("Invalid time value");
        }
        this.endMinutes = minutes;
    }

    public setStartTime = (minutes: number) => {
        if (minutes < 0 || minutes >= 1440) {
            throw new Error("Invalid time value");
        }
        this.startMinutes = minutes;
    }
}


class Day {
    private tasks: Task[]
    private dayOfWeek: DayOfWeek;
    private checkTimeOverlap = (tasks: Task[]) => {
        tasks.sort((a: Task, b: Task) => a.getStartTimeMinutes() - b.getStartTimeMinutes());

        let startTime = tasks[0].getStartTimeMinutes();
        let largestEndTime = tasks[0].getEndTimeMinutes();

        for(let i = 0; i < tasks.length; i++){
            const task = tasks[i];
            const currentStartTime = task.getStartTimeMinutes();
            const currentEndTime = task.getEndTimeMinutes();
            if(currentStartTime > startTime && currentStartTime < largestEndTime){
                return true;
            }
            startTime = currentStartTime;
            if(currentEndTime > largestEndTime){
                largestEndTime = currentEndTime;
            }
        }

        return false;
    }

    constructor(tasks: Task[], dayOfWeek: DayOfWeek) {
        tasks.forEach((task) => {
            if(task.getQuota() !== null){
                if(!task.getQuota()?.getTargetDays().includes(dayOfWeek)){
                  throw new Error("Invalid day of week task");
                }
            }
        })
        if(this.checkTimeOverlap(tasks)){
            throw new Error("Time overlaps in tasks");
        }
        tasks.sort((a, b) => (a.getStartTimeMinutes() - b.getEndTimeMinutes()))
        this.tasks = tasks;
        this.dayOfWeek = dayOfWeek;
    }

    private findTaskAtTime = (minutes: number) => {
        const task = this.tasks.find((task) => (task.getStartTimeMinutes() < minutes && task.getEndTimeMinutes() > minutes));
        if(!task){
            throw new Error(`Task not found at ${minutes}`);
        }
        return task;
    }

    private getTasksAfterTaskUntilFixed = (task: Task) => {
        const index = this.tasks.indexOf(task);
        const afterArr = this.tasks.slice(index + 1);
        const fixedIndex = afterArr.findIndex((task) => task.getPriority() === Priority.FIXED);
        return fixedIndex !== -1 ? afterArr.slice(0, fixedIndex) : afterArr;
    }

    private increaseTaskTimes = (tasks: Task[], timeIncrease: number) => {

    }

    public endTaskEarly = (minutes: number) => {
        const task = this.findTaskAtTime(minutes);
        const gainedTime = task.getEndTimeMinutes() - minutes;
        task.setEndTime(minutes);
        const affectedTasks = this.getTasksAfterTaskUntilFixed(task);
    }

    public startTaskLate = (minutes: number) => {
        const task = this.findTaskAtTime(minutes);
        task.setStartTime(minutes);
        return task;
    }

}

const tasks = [
    new Task(0, 120, Priority.NORMAL),
    new Task(130, 300, Priority.NORMAL),
    new Task(330, 350, Priority.FIXED),
    new Task(360, 370, Priority.NORMAL),
    new Task(390, 400, Priority.NORMAL),
]

const monday = new Day(tasks, DayOfWeek.Mon);
console.log(monday.endTaskEarly(80))
console.log(monday)


// To learn more about the language, click above in "Examples" or "What's New".
// Otherwise, get started by removing these comments and the world is your playground.
