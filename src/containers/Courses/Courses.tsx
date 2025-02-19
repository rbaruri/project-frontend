import { useQuery, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import CourseCard from "../../components/ui/CourseCard";

const GET_COURSES = gql`
  query GetCourses {
    learning_paths {
      id
      course_name
      total_duration
      total_hours
      hours_per_week
      start_date
      end_date
    }
  }
`;

const CoursesContainer = () => {
  const { loading, error, data } = useQuery(GET_COURSES);
  const navigate = useNavigate();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul className="space-y-4">
      {data.learning_paths.map((course: any) => (
        <CourseCard
          key={course.id}
          course={{
            ...course,
            onClick: () => navigate(`/courses/${course.id}`), // Navigate on click
          }}
        />
      ))}
    </ul>
  );
};

export default CoursesContainer;
