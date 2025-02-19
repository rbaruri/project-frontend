import { useQuery, gql } from "@apollo/client";
import { useParams } from "react-router-dom";

const GET_COURSE_DETAILS = gql`
  query GetCourseDetails($id: uuid!) {
    learning_paths_by_pk(id: $id) {
      course_name
      modules {
        id
        title
        description
        duration
      }
    }
  }
`;

const CourseDetails = () => {
  const { id } = useParams<{ id: string }>(); // Get course ID from URL
  const { loading, error, data } = useQuery(GET_COURSE_DETAILS, {
    variables: { id },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">{data.learning_paths_by_pk.course_name}</h2>
        <ul className="space-y-4">
          {data.learning_paths_by_pk.modules.map((module: any) => (
            <li key={module.id} className="p-4 border rounded-lg shadow">
              <h3 className="text-lg font-semibold">{module.title}</h3>
              <p>{module.description}</p>
              <p>Duration: {module.duration} hours</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default CourseDetails;
