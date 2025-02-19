import React from "react";

interface CourseProps {
  course: {
    id: string;
    course_name: string;
    total_duration: number;
    total_hours: number;
    hours_per_week: number;
    start_date: string;
    end_date: string;
    onClick: () => void;
  };
}

const CourseCard: React.FC<CourseProps> = ({ course }) => {
  return (
    <li
      className="p-4 border rounded-lg shadow cursor-pointer hover:bg-gray-100 transition"
      onClick={course.onClick}
    >
      <h3 className="text-lg font-semibold">{course.course_name}</h3>
      <p>Total Duration: {course.total_duration} weeks</p>
      <p>Total Hours: {course.total_hours} hours</p>
      <p>Hours per Week: {course.hours_per_week} hours</p>
      <p>Start Date: {new Date(course.start_date).toLocaleDateString()}</p>
      <p>End Date: {new Date(course.end_date).toLocaleDateString()}</p>
    </li>
  );
};

export default CourseCard;
