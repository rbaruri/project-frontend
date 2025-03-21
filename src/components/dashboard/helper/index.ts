import { Course, Module } from "@/components/courses/Courses/types";

export interface ProgressStatus {
  status: "ahead" | "on_track" | "behind";
  daysOffset: number;
  completedModules: number;
  expectedModules: number;
}

export const isInProgress = (course: Course): boolean => {
  if (!course.modules || course.modules.length === 0) return false;

  // First check if all modules are completed - if so, return false
  const allModulesCompleted = course.modules.every(
    (m: Module) => m.status === "completed"
  );
  if (allModulesCompleted) return false;

  const hasInProgressModules = course.modules.some(
    (m: Module) => m.status === "in_progress"
  );
  const completedCount = course.modules.filter(
    (m: Module) => m.status === "completed"
  ).length;
  const notStartedCount = course.modules.filter(
    (m: Module) => m.status === "not_started"
  ).length;
  const totalModules = course.modules.length;

  // Include courses that:
  // 1. Have modules in progress OR
  // 2. Have some completed modules but not all OR
  // 3. Have all modules not started (newly uploaded courses)
  return (
    hasInProgressModules ||
    (completedCount > 0 && completedCount < totalModules) ||
    notStartedCount === totalModules
  );
};

export const calculateOverallProgress = (courses: Course[]): number => {
  if (!courses || courses.length === 0) return 0;

  const totalProgress = courses.reduce((acc: number, course: Course) => {
    const completedModules = course.modules.filter(
      (module: Module) => module.status === "completed"
    ).length;
    const totalModules = course.modules.length;
    return acc + (completedModules / totalModules) * 100;
  }, 0);

  return Math.round(totalProgress / courses.length);
};

export const getCompletedCoursesCount = (courses: Course[]): number => {
  if (!courses) return 0;
  return courses.filter((course) =>
    course.modules.every((module: Module) => module.status === "completed")
  ).length;
};

export const getCoursesInProgressCount = (courses: Course[]): number => {
  if (!courses) return 0;
  return courses.filter((course) => isInProgress(course)).length;
};

export const calculateProgressStatus = (course: Course): ProgressStatus => {
  if (!course.modules || course.modules.length === 0) {
    return {
      status: "on_track",
      daysOffset: 0,
      completedModules: 0,
      expectedModules: 0,
    };
  }

  const today = new Date();
  const startDate = new Date(course.start_date);
  const endDate = new Date(course.end_date);

  // If the course hasn't started yet, return on track
  if (today < startDate) {
    return {
      status: "on_track",
      daysOffset: 0,
      completedModules: 0,
      expectedModules: 0,
    };
  }

  const totalDays = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const daysPassed = Math.ceil(
    (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Simple ratio calculation
  // If 15 days = 3 modules
  // Then X days = 1 module completed
  // X = (15 * 1) / 3 = 5 days per module
  const daysPerModule = totalDays / course.modules.length;

  // Count completed modules
  const completedModules = course.modules.filter(
    (module: Module) => module.status === "completed"
  ).length;

  // Calculate when the current number of completed modules should have been done
  const expectedCompletionDay = daysPerModule * completedModules;

  // Calculate expected modules at this point in time
  const expectedModules = Math.floor(
    (daysPassed / totalDays) * course.modules.length
  );

  // For courses that just started (less than a week)
  if (daysPassed <= 7) {
    // If we have any completed modules, we're ahead
    if (completedModules > 0) {
      return {
        status: "ahead",
        daysOffset: Math.ceil(daysPassed),
        completedModules,
        expectedModules: 0,
      };
    }
    // Otherwise we're on track since it just started
    return {
      status: "on_track",
      daysOffset: 0,
      completedModules: 0,
      expectedModules: 0,
    };
  }

  // For courses running longer than a week
  let status: "ahead" | "on_track" | "behind";

  // If we've completed more than expected, we're ahead
  if (completedModules > expectedModules) {
    status = "ahead";
  }
  // If we're behind the expected completion day for our current progress, we're behind
  else if (daysPassed > expectedCompletionDay) {
    status = "behind";
  }
  // Otherwise we're on track
  else {
    status = "on_track";
  }

  return {
    status,
    daysOffset: Math.abs(Math.ceil(expectedCompletionDay - daysPassed)),
    completedModules,
    expectedModules,
  };
};

export const getProgressStatusColor = (
  status: ProgressStatus["status"]
): string => {
  switch (status) {
    case "ahead":
      return "text-green-600";
    case "behind":
      return "text-red-600";
    case "on_track":
    default:
      return "text-blue-600";
  }
};

export const getProgressStatusText = (status: ProgressStatus): string => {
  const { status: progressStatus } = status;
  switch (progressStatus) {
    case "ahead":
      return "ahead of schedule 😁";
    case "behind":
      return "behind schedule 😔";
    case "on_track":
    default:
      return "on track 😊";
  }
};
